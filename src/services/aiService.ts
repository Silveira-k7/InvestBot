import OpenAI from 'openai';
import { Transaction, Goal, User } from '../types';

// Mock OpenAI service for demo purposes
// In production, you would use actual OpenAI API key
class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    // Initialize OpenAI only if API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Only for demo - use backend in production
      });
    }
  }

  // Analyze spending patterns and provide insights
  async analyzeSpendingPatterns(transactions: Transaction[]): Promise<{
    insights: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    categories: { category: string; trend: 'increasing' | 'decreasing' | 'stable'; percentage: number }[];
  }> {
    // Mock analysis for demo - in production this would use actual AI
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category spending
    const categorySpending = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categorySpending).map(([category, amount]) => ({
      category,
      trend: Math.random() > 0.5 ? 'increasing' : 'decreasing' as 'increasing' | 'decreasing',
      percentage: (amount / totalExpenses) * 100
    }));

    const insights = [
      `Você gastou R$ ${totalExpenses.toFixed(2)} no total este mês`,
      `Sua maior categoria de gastos é ${categories[0]?.category || 'Alimentação'} (${categories[0]?.percentage.toFixed(1) || '35'}%)`,
      `Identificamos ${categories.filter(c => c.trend === 'increasing').length} categorias com gastos crescentes`,
      'Seus gastos com lazer aumentaram 15% comparado ao mês anterior'
    ];

    const recommendations = [
      'Considere definir um limite mensal para gastos com delivery e restaurantes',
      'Seus gastos com transporte estão acima da média - avalie opções de transporte público',
      'Crie uma reserva de emergência equivalente a 6 meses de gastos essenciais',
      'Automatize suas economias transferindo 20% da renda para poupança no início do mês'
    ];

    const riskLevel = totalExpenses > 3000 ? 'high' : totalExpenses > 1500 ? 'medium' : 'low';

    return {
      insights,
      recommendations,
      riskLevel,
      categories
    };
  }

  // Categorize transaction automatically
  async categorizeTransaction(description: string, amount: number): Promise<string> {
    const description_lower = description.toLowerCase();
    
    // Simple rule-based categorization (in production, use ML model)
    if (description_lower.includes('supermercado') || description_lower.includes('mercado') || 
        description_lower.includes('padaria') || description_lower.includes('açougue')) {
      return 'Alimentação';
    }
    
    if (description_lower.includes('uber') || description_lower.includes('taxi') || 
        description_lower.includes('combustível') || description_lower.includes('gasolina')) {
      return 'Transporte';
    }
    
    if (description_lower.includes('aluguel') || description_lower.includes('condomínio') || 
        description_lower.includes('energia') || description_lower.includes('água')) {
      return 'Moradia';
    }
    
    if (description_lower.includes('farmácia') || description_lower.includes('médico') || 
        description_lower.includes('hospital') || description_lower.includes('plano')) {
      return 'Saúde';
    }
    
    if (description_lower.includes('cinema') || description_lower.includes('restaurante') || 
        description_lower.includes('bar') || description_lower.includes('festa')) {
      return 'Lazer';
    }
    
    if (description_lower.includes('salário') || description_lower.includes('freelancer') || 
        description_lower.includes('renda')) {
      return 'Salário';
    }

    return 'Outros';
  }

  // Generate personalized financial advice
  async generateFinancialAdvice(user: User, transactions: Transaction[], goals: Goal[]): Promise<{
    advice: string;
    priority: 'high' | 'medium' | 'low';
    actionItems: string[];
  }> {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    let advice = '';
    let priority: 'high' | 'medium' | 'low' = 'low';
    let actionItems: string[] = [];

    if (savingsRate < 10) {
      advice = `Olá ${user.name}! Sua taxa de economia está em ${savingsRate.toFixed(1)}%, que está abaixo do recomendado (20%). É importante aumentar suas economias para garantir segurança financeira.`;
      priority = 'high';
      actionItems = [
        'Revise seus gastos mensais e identifique onde pode cortar',
        'Defina uma meta de economia de pelo menos 20% da renda',
        'Considere fontes de renda extra',
        'Automatize transferências para poupança'
      ];
    } else if (savingsRate < 20) {
      advice = `Parabéns ${user.name}! Você está economizando ${savingsRate.toFixed(1)}% da sua renda. Está no caminho certo, mas ainda pode melhorar para atingir a meta ideal de 20%.`;
      priority = 'medium';
      actionItems = [
        'Tente aumentar sua taxa de economia para 20%',
        'Revise gastos supérfluos mensalmente',
        'Considere investimentos de baixo risco'
      ];
    } else {
      advice = `Excelente trabalho ${user.name}! Sua taxa de economia de ${savingsRate.toFixed(1)}% está acima da média. Continue assim e considere diversificar seus investimentos.`;
      priority = 'low';
      actionItems = [
        'Mantenha a disciplina financeira atual',
        'Explore opções de investimento para fazer seu dinheiro render mais',
        'Considere aumentar suas metas de economia'
      ];
    }

    return { advice, priority, actionItems };
  }

  // Predict future expenses based on patterns
  async predictFutureExpenses(transactions: Transaction[]): Promise<{
    nextMonthPrediction: number;
    categoryPredictions: { category: string; predicted: number; confidence: number }[];
    trends: { category: string; trend: 'up' | 'down' | 'stable'; change: number }[];
  }> {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Simple prediction based on current month (in production, use time series analysis)
    const nextMonthPrediction = totalExpenses * 1.05; // 5% increase assumption
    
    const categorySpending = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryPredictions = Object.entries(categorySpending).map(([category, amount]) => ({
      category,
      predicted: amount * (0.95 + Math.random() * 0.1), // Random variation
      confidence: 0.7 + Math.random() * 0.3 // Random confidence between 70-100%
    }));

    const trends = Object.keys(categorySpending).map(category => ({
      category,
      trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' as 'up' | 'down' | 'stable',
      change: (Math.random() - 0.5) * 20 // Random change between -10% and +10%
    }));

    return {
      nextMonthPrediction,
      categoryPredictions,
      trends
    };
  }

  // Generate smart alerts based on spending behavior
  async generateSmartAlerts(transactions: Transaction[], goals: Goal[]): Promise<{
    alerts: {
      id: string;
      type: 'warning' | 'info' | 'success' | 'danger';
      title: string;
      message: string;
      priority: number;
      actionRequired: boolean;
    }[];
  }> {
    const alerts = [];
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Check for unusual spending
    const avgDailySpending = totalExpenses / 30;
    const recentTransactions = expenseTransactions.slice(-5);
    const recentHighSpending = recentTransactions.filter(t => t.amount > avgDailySpending * 2);

    if (recentHighSpending.length > 0) {
      alerts.push({
        id: '1',
        type: 'warning',
        title: 'Gasto Alto Detectado',
        message: `Detectamos gastos acima da média nos últimos dias. Revise suas transações recentes.`,
        priority: 8,
        actionRequired: true
      });
    }

    // Check goal progress
    const activeGoals = goals.filter(g => g.status === 'active');
    activeGoals.forEach((goal, index) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      
      if (goal.category === 'expense-limit' && progress > 80) {
        alerts.push({
          id: `goal-${index}`,
          type: 'danger',
          title: 'Meta de Limite Quase Atingida',
          message: `Você já gastou ${progress.toFixed(1)}% do limite da meta "${goal.title}". Cuidado!`,
          priority: 9,
          actionRequired: true
        });
      } else if (goal.category === 'savings' && progress > 75) {
        alerts.push({
          id: `goal-${index}`,
          type: 'success',
          title: 'Meta de Economia Quase Alcançada',
          message: `Parabéns! Você já atingiu ${progress.toFixed(1)}% da meta "${goal.title}".`,
          priority: 5,
          actionRequired: false
        });
      }
    });

    // Positive reinforcement
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    if (incomeTransactions.length > expenseTransactions.length) {
      alerts.push({
        id: 'positive',
        type: 'success',
        title: 'Ótimo Controle Financeiro',
        message: 'Você tem mais receitas que despesas registradas. Continue assim!',
        priority: 3,
        actionRequired: false
      });
    }

    return { alerts: alerts.sort((a, b) => b.priority - a.priority) };
  }
}

export const aiService = new AIService();