import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';

export class WhatsAppService {
  constructor() {
    this.client = null;
    this.isClientReady = false;
    this.qrCode = null;
    this.sessions = new Map(); // Para gerenciar sessões de usuários
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 segundos
    this.isInitializing = false;
    this.startTime = Date.now();
  }

  async initialize() {
    if (this.isInitializing) {
      console.log('⏳ WhatsApp já está sendo inicializado...');
      return;
    }

    this.isInitializing = true;
    console.log('🔄 Inicializando WhatsApp Client...');
    
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'investbot-client',
          dataPath: './whatsapp-session'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        },
        webVersionCache: {
          type: 'remote',
          remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
      });

      this.setupEventListeners();
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp:', error);
      this.isInitializing = false;
      await this.handleReconnect();
    }
  }

  setupEventListeners() {
    // QR Code para autenticação
    this.client.on('qr', async (qr) => {
      console.log('📱 QR Code gerado para WhatsApp');
      try {
        this.qrCode = await qrcode.toDataURL(qr);
        console.log('✅ QR Code disponível para escaneamento');
        console.log('🌐 Acesse http://localhost:5173/whatsapp para ver o QR Code');
      } catch (error) {
        console.error('❌ Erro ao gerar QR Code:', error);
      }
    });

    // Cliente pronto
    this.client.on('ready', () => {
      console.log('✅ WhatsApp Client está pronto e funcionando 24h!');
      this.isClientReady = true;
      this.qrCode = null;
      this.reconnectAttempts = 0;
      this.isInitializing = false;
      
      // Enviar mensagem de status para admin (opcional)
      this.sendSystemNotification('🤖 InvestBot WhatsApp está online e funcionando 24h!');
    });

    // Autenticação bem-sucedida
    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp autenticado com sucesso');
    });

    // Falha na autenticação
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Falha na autenticação WhatsApp:', msg);
      this.isInitializing = false;
      setTimeout(() => this.handleReconnect(), this.reconnectDelay);
    });

    // Desconectado
    this.client.on('disconnected', (reason) => {
      console.log('📱 WhatsApp desconectado:', reason);
      this.isClientReady = false;
      this.isInitializing = false;
      
      // Tentar reconectar automaticamente
      setTimeout(() => this.handleReconnect(), this.reconnectDelay);
    });

    // Erro de loading
    this.client.on('loading_screen', (percent, message) => {
      console.log(`⏳ Carregando WhatsApp: ${percent}% - ${message}`);
    });

    // Manipulador de mensagens
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    // Manipulador de erros gerais
    this.client.on('error', (error) => {
      console.error('❌ Erro no WhatsApp Client:', error);
    });
  }

  async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de tentativas de reconexão atingido');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    try {
      if (this.client) {
        await this.client.destroy();
      }
      
      // Aguardar antes de tentar reconectar
      await new Promise(resolve => setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts));
      
      await this.initialize();
    } catch (error) {
      console.error('❌ Erro na reconexão:', error);
      setTimeout(() => this.handleReconnect(), this.reconnectDelay * 2);
    }
  }

  async sendSystemNotification(message) {
    // Número do administrador (configure aqui)
    const adminNumber = process.env.ADMIN_WHATSAPP || '5511999999999';
    
    try {
      if (this.isClientReady) {
        await this.sendMessage(adminNumber, message);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar notificação do sistema:', error);
    }
  }

  async handleMessage(message) {
    try {
      // Ignorar mensagens de grupos e próprias mensagens
      if (message.from.includes('@g.us') || message.fromMe) return;

      const phoneNumber = message.from.replace('@c.us', '');
      const messageText = message.body.toLowerCase().trim();
      
      console.log(`📨 Mensagem recebida de ${phoneNumber}: ${messageText}`);

      // Verificar se é comando de sistema
      if (messageText === '/status' && phoneNumber === process.env.ADMIN_WHATSAPP?.replace('+', '')) {
        await this.sendMessage(phoneNumber, `🤖 InvestBot Status:\n✅ Online 24h\n📊 Usuários ativos: ${this.sessions.size}\n⏰ Uptime: ${Math.floor((Date.now() - this.startTime) / 1000)}s`);
        return;
      }

      // Processar mensagem com IA
      const response = await this.processMessageWithAI(phoneNumber, messageText, message);
      
      if (response) {
        await this.sendMessage(phoneNumber, response);
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
      
      try {
        await this.sendMessage(message.from.replace('@c.us', ''), 
          '🤖 Desculpe, ocorreu um erro temporário. Tente novamente em alguns instantes.\n\nSe o problema persistir, entre em contato com o suporte.');
      } catch (sendError) {
        console.error('❌ Erro ao enviar mensagem de erro:', sendError);
      }
    }
  }

  async processMessageWithAI(phoneNumber, messageText, originalMessage) {
    // Importar serviços aqui para evitar dependência circular
    const { AIService } = await import('./aiService.js');
    const { DatabaseService } = await import('./databaseService.js');
    
    const aiService = new AIService();
    const dbService = new DatabaseService();
    await dbService.initialize();

    // Verificar se é um novo usuário
    let user = await dbService.getUserByPhone(phoneNumber);
    
    // Comandos de cadastro
    if (!user && (messageText.includes('cadastr') || messageText.includes('registr') || messageText.includes('começar') || messageText.includes('oi') || messageText.includes('olá'))) {
      return await this.handleRegistration(phoneNumber, messageText, dbService);
    }

    if (!user) {
      return `👋 Olá! Eu sou o *InvestBot*, seu assistente financeiro pessoal disponível 24h!

🤖 *Estou sempre aqui para te ajudar com:*
• Controle de gastos e receitas
• Relatórios financeiros
• Conselhos personalizados
• Alertas inteligentes

Para começar, me envie:
*"Quero me cadastrar"*

💡 *Dica:* Funciono 24 horas por dia, 7 dias por semana! 🚀`;
    }

    // Processar comandos financeiros
    return await this.processFinancialCommand(user, messageText, aiService, dbService);
  }

  async handleRegistration(phoneNumber, messageText, dbService) {
    const session = this.sessions.get(phoneNumber) || { step: 'start' };

    switch (session.step) {
      case 'start':
        this.sessions.set(phoneNumber, { step: 'name' });
        return `🎉 Ótimo! Vamos fazer seu cadastro no InvestBot.

Sou seu assistente financeiro pessoal e estarei disponível *24 horas por dia* para te ajudar!

Qual é o seu *nome completo*?`;

      case 'name':
        session.name = messageText;
        session.step = 'email';
        this.sessions.set(phoneNumber, session);
        return `📧 Perfeito, ${session.name}!

Agora me informe seu *e-mail*:`;

      case 'email':
        if (!this.isValidEmail(messageText)) {
          return '❌ E-mail inválido. Por favor, digite um e-mail válido:';
        }
        
        session.email = messageText;
        session.step = 'complete';
        
        // Criar usuário no banco
        const user = await dbService.createUser({
          name: session.name,
          email: session.email,
          phone: phoneNumber
        });

        this.sessions.delete(phoneNumber);

        return `✅ *Cadastro concluído com sucesso!*

🎯 *Agora você pode usar o InvestBot 24h:*

💰 *Registrar gastos:*
• "Gastei 50 reais com supermercado"
• "Paguei 1200 de aluguel"

📈 *Registrar ganhos:*
• "Recebi 3000 reais de salário"
• "Ganhei 500 de freelancer"

📊 *Consultas:*
• "Qual meu saldo?"
• "Me manda meu extrato"
• "Como posso economizar?"

🌐 *Dashboard Web:* https://investbot.app

🤖 *Estou sempre aqui, 24h por dia!*
Como posso te ajudar agora? 🚀`;

      default:
        this.sessions.delete(phoneNumber);
        return 'Vamos recomeçar o cadastro. Digite *"Quero me cadastrar"*';
    }
  }

  async processFinancialCommand(user, messageText, aiService, dbService) {
    // Detectar tipo de comando usando IA
    const commandType = await aiService.classifyMessage(messageText);

    switch (commandType) {
      case 'expense':
        return await this.handleExpense(user, messageText, aiService, dbService);
      
      case 'income':
        return await this.handleIncome(user, messageText, aiService, dbService);
      
      case 'balance':
        return await this.handleBalanceQuery(user, dbService);
      
      case 'report':
        return await this.handleReportRequest(user, messageText, dbService);
      
      case 'advice':
        return await this.handleAdviceRequest(user, aiService, dbService);
      
      case 'goal':
        return await this.handleGoalCommand(user, messageText, dbService);
      
      case 'analysis':
        return await this.handleAnalysisRequest(user, aiService, dbService);
      
      case 'prediction':
        return await this.handlePredictionRequest(user, aiService, dbService);
      
      case 'suggestions':
        return await this.handleSuggestionsRequest(user, aiService, dbService);
      
      case 'comparison':
        return await this.handleComparisonRequest(user, messageText, aiService, dbService);
      
      default:
        return await this.handleGeneralQuery(user, messageText, aiService, dbService);
    }
  }

  async handleExpense(user, messageText, aiService, dbService) {
    try {
      // Extrair valor e descrição usando IA
      const expenseData = await aiService.extractExpenseData(messageText);
      
      if (!expenseData.amount) {
        return `❌ Não consegui identificar o valor do gasto.

💡 *Exemplos corretos:*
• "Gastei 50 reais com supermercado"
• "Paguei 1200 de aluguel"
• "Comprei 25 reais de combustível"

Tente novamente! 😊`;
      }

      // Categorizar automaticamente
      const category = await aiService.categorizeTransaction(expenseData.description, expenseData.amount);

      // Salvar no banco
      const transaction = await dbService.createTransaction({
        userId: user.id,
        type: 'expense',
        amount: expenseData.amount,
        description: expenseData.description,
        category: category,
        date: new Date()
      });

      // Calcular novo saldo
      const balance = await dbService.getUserBalance(user.id);

      // Verificar alertas
      const alerts = await aiService.checkSpendingAlerts(user, transaction, dbService);
      let alertMessage = '';
      
      if (alerts.length > 0) {
        alertMessage = `\n\n⚠️ *Alerta:* ${alerts[0].message}`;
      }

      return `✅ *Gasto registrado com sucesso!*

💰 *Valor:* R$ ${expenseData.amount.toFixed(2)}
📝 *Descrição:* ${expenseData.description}
🏷️ *Categoria:* ${category}
💳 *Saldo atual:* R$ ${balance.toFixed(2)}${alertMessage}

🤖 *Estou sempre aqui para te ajudar! 24h/dia* 🚀`;

    } catch (error) {
      console.error('Erro ao processar gasto:', error);
      return '❌ Erro ao registrar gasto. Tente novamente em alguns instantes.';
    }
  }

  async handleIncome(user, messageText, aiService, dbService) {
    try {
      const incomeData = await aiService.extractIncomeData(messageText);
      
      if (!incomeData.amount) {
        return `❌ Não consegui identificar o valor da receita.

💡 *Exemplos corretos:*
• "Recebi 3000 reais de salário"
• "Ganhei 500 de freelancer"
• "Receita de 1000 reais"

Tente novamente! 😊`;
      }

      const category = await aiService.categorizeTransaction(incomeData.description, incomeData.amount, 'income');

      const transaction = await dbService.createTransaction({
        userId: user.id,
        type: 'income',
        amount: incomeData.amount,
        description: incomeData.description,
        category: category,
        date: new Date()
      });

      const balance = await dbService.getUserBalance(user.id);

      return `✅ *Receita registrada com sucesso!*

💰 *Valor:* R$ ${incomeData.amount.toFixed(2)}
📝 *Descrição:* ${incomeData.description}
🏷️ *Categoria:* ${category}
💳 *Saldo atual:* R$ ${balance.toFixed(2)}

🎉 *Parabéns pela entrada!* Continue assim! 📈

🤖 *Sempre aqui para te ajudar! 24h/dia* 🚀`;

    } catch (error) {
      console.error('Erro ao processar receita:', error);
      return '❌ Erro ao registrar receita. Tente novamente em alguns instantes.';
    }
  }

  async handleBalanceQuery(user, dbService) {
    try {
      const balance = await dbService.getUserBalance(user.id);
      const monthlyStats = await dbService.getMonthlyStats(user.id);
      
      const savingsRate = monthlyStats.income > 0 ? 
        ((monthlyStats.income - monthlyStats.expenses) / monthlyStats.income) * 100 : 0;

      return `💰 *Seu Saldo Financeiro*

💳 *Saldo Total:* R$ ${balance.toFixed(2)}

📊 *Este mês:*
📈 Receitas: R$ ${monthlyStats.income.toFixed(2)}
📉 Gastos: R$ ${monthlyStats.expenses.toFixed(2)}
💾 Economia: R$ ${(monthlyStats.income - monthlyStats.expenses).toFixed(2)}
📊 Taxa de economia: ${savingsRate.toFixed(1)}%

🌐 *Dashboard completo:* https://investbot.app

🤖 *Sempre disponível para você! 24h/dia* 🚀`;

    } catch (error) {
      console.error('Erro ao consultar saldo:', error);
      return '❌ Erro ao consultar saldo. Tente novamente em alguns instantes.';
    }
  }

  async handleReportRequest(user, messageText, dbService) {
    try {
      // Determinar período do relatório
      const period = this.extractPeriodFromMessage(messageText);
      const transactions = await dbService.getTransactionsByPeriod(user.id, period.start, period.end);
      
      if (transactions.length === 0) {
        return `📊 *Relatório Financeiro*

Nenhuma transação encontrada para o período solicitado.

💡 *Dica:* Comece registrando seus gastos e receitas!

🤖 *Estou sempre aqui! 24h/dia* 🚀`;
      }

      // Gerar relatório em texto
      let report = `📊 *Relatório Financeiro Detalhado*\n`;
      report += `📅 *Período:* ${period.start.toLocaleDateString('pt-BR')} a ${period.end.toLocaleDateString('pt-BR')}\n\n`;

      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      report += `💰 *Resumo Geral:*\n`;
      report += `📈 Total Receitas: R$ ${income.toFixed(2)}\n`;
      report += `📉 Total Gastos: R$ ${expenses.toFixed(2)}\n`;
      report += `💾 Saldo Período: R$ ${(income - expenses).toFixed(2)}\n\n`;

      // Top 5 transações
      report += `🔝 *Maiores Transações:*\n`;
      const topTransactions = transactions
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      topTransactions.forEach((t, i) => {
        const icon = t.type === 'income' ? '📈' : '📉';
        report += `${i + 1}. ${icon} R$ ${t.amount.toFixed(2)} - ${t.description}\n`;
      });

      report += `\n🌐 *Relatório completo:* https://investbot.app/reports`;
      report += `\n\n🤖 *Sempre disponível! 24h/dia* 🚀`;

      return report;

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return '❌ Erro ao gerar relatório. Tente novamente em alguns instantes.';
    }
  }

  async handleAdviceRequest(user, aiService, dbService) {
    try {
      const transactions = await dbService.getUserTransactions(user.id);
      const goals = await dbService.getUserGoals(user.id);
      
      const advice = await aiService.generatePersonalizedAdvice(user, transactions, goals);
      
      return `🧠 *Conselho Financeiro Personalizado*

${advice.message}

💡 *Dicas Personalizadas:*
${advice.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

📊 *Análises detalhadas:* https://investbot.app/ai-insights

🤖 *Seu consultor financeiro 24h!* 💪`;

    } catch (error) {
      console.error('Erro ao gerar conselho:', error);
      return '❌ Erro ao gerar conselho. Tente novamente em alguns instantes.';
    }
  }

  async handleGoalCommand(user, messageText, dbService) {
    return `🎯 *Metas Financeiras*

Em breve você poderá gerenciar suas metas diretamente pelo WhatsApp!

Por enquanto, acesse: https://investbot.app/goals

🤖 *Sempre evoluindo para você! 24h/dia* 🚀`;
  }

  async handleGeneralQuery(user, messageText, aiService, dbService) {
    try {
      // Usar IA para responder perguntas gerais sobre finanças
      const response = await aiService.generateGeneralResponse(messageText, user);
      
      return `🤖 ${response}

💡 *Comandos que entendo 24h:*
• "Gastei X reais com Y"
• "Recebi X reais de Y"  
• "Qual meu saldo?"
• "Me manda meu extrato"
• "Como posso economizar?"

🌐 *Dashboard:* https://investbot.app

🚀 *Sempre aqui para você!*`;

    } catch (error) {
      console.error('Erro ao processar consulta geral:', error);
      return `🤖 Desculpe, não entendi sua mensagem.

💡 *Comandos que entendo 24h:*
• "Gastei 50 reais com supermercado"
• "Recebi 1000 reais de salário"
• "Qual meu saldo?"
• "Me manda meu extrato"
• "Como posso economizar?"

🚀 *Sempre disponível para te ajudar!*`;
    }
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isClientReady) {
      console.error('❌ WhatsApp client não está pronto');
      return false;
    }

    try {
      const chatId = `${phoneNumber}@c.us`;
      await this.client.sendMessage(chatId, message);
      console.log(`✅ Mensagem enviada para ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      return false;
    }
  }

  async sendDailyReports(dbService, aiService) {
    try {
      const users = await dbService.getAllActiveUsers();
      
      for (const user of users) {
        const dailyReport = await aiService.generateDailyReport(user, dbService);
        if (dailyReport) {
          await this.sendMessage(user.phone, dailyReport);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar relatórios diários:', error);
    }
  }

  async sendWeeklyReports(dbService, aiService) {
    try {
      const users = await dbService.getAllActiveUsers();
      
      for (const user of users) {
        const weeklyReport = await aiService.generateWeeklyReport(user, dbService);
        if (weeklyReport) {
          await this.sendMessage(user.phone, weeklyReport);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar relatórios semanais:', error);
    }
  }

  // Método para manter o bot ativo 24h
  async keepAlive() {
    setInterval(async () => {
      if (!this.isClientReady && !this.isInitializing) {
        console.log('🔄 Bot offline, tentando reconectar...');
        await this.handleReconnect();
      }
    }, 30000); // Verificar a cada 30 segundos

    // Heartbeat para manter conexão ativa
    setInterval(async () => {
      if (this.isClientReady) {
        try {
          await this.client.getState();
        } catch (error) {
          console.error('❌ Erro no heartbeat:', error);
          this.isClientReady = false;
        }
      }
    }, 60000); // Heartbeat a cada 1 minuto
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  extractPeriodFromMessage(message) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Por padrão, retorna o mês atual
    // Aqui você pode implementar lógica mais sofisticada para detectar períodos específicos
    return {
      start: startOfMonth,
      end: endOfMonth
    };
  }

  isReady() {
    return this.isClientReady;
  }

  getQRCode() {
    return this.qrCode;
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isClientReady = false;
    }
  }

  // Método para obter estatísticas do bot
  getStats() {
    return {
      isReady: this.isClientReady,
      activeSessions: this.sessions.size,
      reconnectAttempts: this.reconnectAttempts,
      uptime: Math.floor((Date.now() - this.startTime) / 1000)
    };
  }

  // Novo: Handler para análise de padrões
  async handleAnalysisRequest(user, aiService, dbService) {
    try {
      const analysis = await aiService.analyzeSpendingPatterns(user, dbService);
      
      if (!analysis.hasEnoughData) {
        return `📊 *Análise de Padrões*\n\n${analysis.message}\n\n🤖 Continue registrando suas transações!`;
      }

      return analysis.message;
    } catch (error) {
      console.error('Erro ao processar análise:', error);
      return '❌ Erro ao gerar análise. Tente novamente.';
    }
  }

  // Novo: Handler para previsões
  async handlePredictionRequest(user, aiService, dbService) {
    try {
      const prediction = await aiService.predictFutureExpenses(user, dbService);
      
      if (!prediction.hasEnoughData) {
        return `🔮 *Previsão de Gastos*\n\n${prediction.message}\n\n💡 Continue usando o InvestBot para previsões mais precisas!`;
      }

      return prediction.message;
    } catch (error) {
      console.error('Erro ao processar previsão:', error);
      return '❌ Erro ao gerar previsão. Tente novamente.';
    }
  }

  // Novo: Handler para sugestões personalizadas
  async handleSuggestionsRequest(user, aiService, dbService) {
    try {
      const suggestions = await aiService.generateSmartSuggestions(user, dbService);
      
      if (suggestions.length === 0) {
        return `💡 *Sugestões Personalizadas*\n\nParece que você está gerenciando bem suas finanças! Continue assim! 🎉\n\n🤖 *InvestBot - Sempre com você! 24h/dia*`;
      }

      let message = `💡 *Sugestões Personalizadas para ${user.name.split(' ')[0]}*\n\n`;
      suggestions.forEach((suggestion, index) => {
        message += `${index + 1}. ${suggestion.message}\n\n`;
      });

      message += '🤖 *InvestBot - Seu assistente financeiro inteligente! 24h/dia*';
      return message;
    } catch (error) {
      console.error('Erro ao processar sugestões:', error);
      return '❌ Erro ao gerar sugestões. Tente novamente.';
    }
  }

  // Novo: Handler para comparação entre períodos
  async handleComparisonRequest(user, messageText, aiService, dbService) {
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const currentMonth = await dbService.getTransactionsByPeriod(user.id, currentMonthStart, currentMonthEnd);
      const lastMonth = await dbService.getTransactionsByPeriod(user.id, lastMonthStart, lastMonthEnd);

      const currentExpenses = currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const lastExpenses = lastMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      const currentIncome = currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const lastIncome = lastMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

      const expenseDiff = currentExpenses - lastExpenses;
      const incomeDiff = currentIncome - lastIncome;
      const expensePercent = lastExpenses > 0 ? ((expenseDiff / lastExpenses) * 100) : 0;
      const incomePercent = lastIncome > 0 ? ((incomeDiff / lastIncome) * 100) : 0;

      let message = `📊 *Comparação: Mês Atual vs Mês Passado*\n\n`;
      
      message += `💸 *Gastos:*\n`;
      message += `• Mês atual: R$ ${currentExpenses.toFixed(2)}\n`;
      message += `• Mês passado: R$ ${lastExpenses.toFixed(2)}\n`;
      if (expenseDiff > 0) {
        message += `📈 Aumento de R$ ${expenseDiff.toFixed(2)} (${expensePercent.toFixed(1)}%)\n\n`;
      } else if (expenseDiff < 0) {
        message += `📉 Redução de R$ ${Math.abs(expenseDiff).toFixed(2)} (${Math.abs(expensePercent).toFixed(1)}%) ✅\n\n`;
      } else {
        message += `➡️ Mesmos gastos\n\n`;
      }

      message += `💰 *Receitas:*\n`;
      message += `• Mês atual: R$ ${currentIncome.toFixed(2)}\n`;
      message += `• Mês passado: R$ ${lastIncome.toFixed(2)}\n`;
      if (incomeDiff > 0) {
        message += `📈 Aumento de R$ ${incomeDiff.toFixed(2)} (${incomePercent.toFixed(1)}%) ✅\n`;
      } else if (incomeDiff < 0) {
        message += `📉 Redução de R$ ${Math.abs(incomeDiff).toFixed(2)} (${Math.abs(incomePercent).toFixed(1)}%)\n`;
      } else {
        message += `➡️ Mesma receita\n`;
      }

      message += `\n🤖 *InvestBot - Sempre aqui! 24h/dia*`;
      return message;

    } catch (error) {
      console.error('Erro ao processar comparação:', error);
      return '❌ Erro ao gerar comparação. Tente novamente.';
    }
  }
}

export { WhatsAppService };