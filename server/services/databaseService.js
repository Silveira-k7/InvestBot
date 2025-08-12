import fs from 'fs';
import path from 'path';

// Simulação de banco de dados em arquivo JSON para demo
// Em produção, usar PostgreSQL, MySQL ou MongoDB
export class DatabaseService {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
    this.usersFile = path.join(this.dataPath, 'users.json');
    this.transactionsFile = path.join(this.dataPath, 'transactions.json');
    this.goalsFile = path.join(this.dataPath, 'goals.json');
    
    this.users = [];
    this.transactions = [];
    this.goals = [];
  }

  async initialize() {
    // Criar diretório de dados se não existir
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }

    // Carregar dados existentes
    await this.loadData();
    console.log('✅ Database Service inicializado');
  }

  async loadData() {
    try {
      if (fs.existsSync(this.usersFile)) {
        this.users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
      }
      
      if (fs.existsSync(this.transactionsFile)) {
        this.transactions = JSON.parse(fs.readFileSync(this.transactionsFile, 'utf8'));
      }
      
      if (fs.existsSync(this.goalsFile)) {
        this.goals = JSON.parse(fs.readFileSync(this.goalsFile, 'utf8'));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  async saveData() {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
      fs.writeFileSync(this.transactionsFile, JSON.stringify(this.transactions, null, 2));
      fs.writeFileSync(this.goalsFile, JSON.stringify(this.goals, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  // User methods
  async getUserByPhone(phone) {
    return this.users.find(user => user.phone === phone);
  }

  async getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  async createUser(userData) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    this.users.push(user);
    await this.saveData();
    return user;
  }

  async getAllActiveUsers() {
    return this.users.filter(user => user.isActive);
  }

  // Transaction methods
  async createTransaction(transactionData) {
    const transaction = {
      id: Date.now().toString(),
      ...transactionData,
      date: transactionData.date.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.transactions.push(transaction);
    await this.saveData();
    return transaction;
  }

  async getUserTransactions(userId) {
    return this.transactions
      .filter(t => t.userId === userId)
      .map(t => ({ ...t, date: new Date(t.date) }))
      .sort((a, b) => b.date - a.date);
  }

  async getTransactionsByPeriod(userId, startDate, endDate) {
    return this.transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.userId === userId && 
               transactionDate >= startDate && 
               transactionDate <= endDate;
      })
      .map(t => ({ ...t, date: new Date(t.date) }));
  }

  async getUserBalance(userId) {
    const userTransactions = await this.getUserTransactions(userId);
    return userTransactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  }

  async getMonthlyStats(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthlyTransactions = await this.getTransactionsByPeriod(userId, startOfMonth, endOfMonth);
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses };
  }

  async getAverageExpense(userId) {
    const userTransactions = await this.getUserTransactions(userId);
    const expenses = userTransactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return 0;
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    return totalExpenses / expenses.length;
  }

  // Goal methods
  async getUserGoals(userId) {
    return this.goals
      .filter(g => g.userId === userId)
      .map(g => ({ ...g, deadline: new Date(g.deadline) }));
  }

  async createGoal(goalData) {
    const goal = {
      id: Date.now().toString(),
      ...goalData,
      deadline: goalData.deadline.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.goals.push(goal);
    await this.saveData();
    return goal;
  }

  async updateGoal(goalId, updates) {
    const goalIndex = this.goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
      await this.saveData();
      return this.goals[goalIndex];
    }
    return null;
  }
}