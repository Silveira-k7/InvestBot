import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  constructor() {
    this.gemini = null;

    // Inicializar Gemini se a chave estiver disponível
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const model = process.env.GEMINI_MODEL || 'gemini-pro';
      const genAI = new GoogleGenerativeAI(apiKey);
      this.gemini = genAI.getGenerativeModel({ model });
    }
  }

  async classifyMessage(message) {
    // Classificação baseada em regras melhorada para bot 24h
    const msg = message.toLowerCase();
    
    // Comandos de gastos
    if (msg.includes('gastei') || msg.includes('paguei') || msg.includes('comprei') || 
        msg.includes('despesa') || msg.includes('gasto') || msg.includes('saiu') ||
        msg.includes('débito') || msg.includes('conta') || msg.includes('fatura')) {
      return 'expense';
    }
    
    // Comandos de receitas
    if (msg.includes('recebi') || msg.includes('ganhei') || msg.includes('salário') || 
        msg.includes('renda') || msg.includes('receita') || msg.includes('entrou') ||
        msg.includes('crédito') || msg.includes('pagamento') || msg.includes('freelancer')) {
      return 'income';
    }
    
    // Consultas de saldo
    if (msg.includes('saldo') || msg.includes('quanto tenho') || msg.includes('balanço') ||
        msg.includes('dinheiro') || msg.includes('total') || msg.includes('patrimônio')) {
      return 'balance';
    }
    
    // Relatórios
    if (msg.includes('extrato') || msg.includes('relatório') || msg.includes('resumo') ||
        msg.includes('histórico') || msg.includes('transações') || msg.includes('movimentação')) {
      return 'report';
    }
    
    // Conselhos financeiros
    if (msg.includes('conselho') || msg.includes('dica') || msg.includes('como economizar') || 
        msg.includes('ajuda financeira') || msg.includes('orientação') || msg.includes('sugestão')) {
      return 'advice';
    }
    
    // Metas
    if (msg.includes('meta') || msg.includes('objetivo') || msg.includes('planejamento') ||
        msg.includes('poupança') || msg.includes('economia')) {
      return 'goal';
    }

    // Análise de padrões (novo)
    if (msg.includes('análise') || msg.includes('analise') || msg.includes('padrão') ||
        msg.includes('padrões') || msg.includes('comportamento') || msg.includes('tendência')) {
      return 'analysis';
    }

    // Previsões (novo)
    if (msg.includes('previsão') || msg.includes('previsao') || msg.includes('prever') ||
        msg.includes('próximo mês') || msg.includes('futuro') || msg.includes('estimativa')) {
      return 'prediction';
    }

    // Sugestões personalizadas (novo)
    if (msg.includes('me ajuda') || msg.includes('como melhorar') || msg.includes('sugestão') ||
        msg.includes('sugestao') || msg.includes('recomenda') || msg.includes('o que fazer')) {
      return 'suggestions';
    }

    // Comparação entre períodos (novo)
    if (msg.includes('comparar') || msg.includes('comparação') || msg.includes('diferença') ||
        msg.includes('versus') || msg.includes('vs') || msg.includes('mês passado')) {
      return 'comparison';
    }
    
    return 'general';
  }

  async extractExpenseData(message) {
    // Regex melhorada para extrair valores monetários
    const valueRegex = /(\d+(?:[.,]\d{1,2})?)\s*(?:reais?|r\$|R\$|real|mil)?/i;
    const match = message.match(valueRegex);
    
    let amount = 0;
    if (match) {
      let value = match[1].replace(',', '.');
      amount = parseFloat(value);
      
      // Verificar se é em milhares
      if (message.toLowerCase().includes('mil')) {
        amount *= 1000;
      }
    }

    // Extrair descrição melhorada
    let description = message
      .replace(/gastei|paguei|comprei|despesa|gasto|saiu|débito/gi, '')
      .replace(valueRegex, '')
      .replace(/reais?|r\$|real|mil|com|de|para|no|na/gi, '')
      .trim();

    if (!description || description.length < 3) {
      description = 'Gasto não especificado';
    }

    return { amount, description };
  }

  async extractIncomeData(message) {
    const valueRegex = /(\d+(?:[.,]\d{1,2})?)\s*(?:reais?|r\$|R\$|real|mil)?/i;
    const match = message.match(valueRegex);
    
    let amount = 0;
    if (match) {
      let value = match[1].replace(',', '.');
      amount = parseFloat(value);
      
      if (message.toLowerCase().includes('mil')) {
        amount *= 1000;
      }
    }

    let description = message
      .replace(/recebi|ganhei|salário|renda|receita|entrou|crédito/gi, '')
      .replace(valueRegex, '')
      .replace(/reais?|r\$|real|mil|de|do|da|por/gi, '')
      .trim();

    if (!description || description.length < 3) {
      description = 'Receita não especificada';
    }

    return { amount, description };
  }

  async categorizeTransaction(description, amount, type = 'expense') {
    const desc = description.toLowerCase();
    
    if (type === 'income') {
      if (desc.includes('salário') || desc.includes('salario')) return 'Salário';
      if (desc.includes('freelancer') || desc.includes('freela') || desc.includes('trabalho extra')) return 'Freelancer';
      if (desc.includes('investimento') || desc.includes('dividendo') || desc.includes('juros')) return 'Investimentos';
      if (desc.includes('venda') || desc.includes('vendeu')) return 'Vendas';
      if (desc.includes('aluguel') && type === 'income') return 'Aluguel Recebido';
      return 'Renda Extra';
    }

    // Categorização de despesas melhorada
    if (desc.includes('supermercado') || desc.includes('mercado') || 
        desc.includes('padaria') || desc.includes('açougue') || 
        desc.includes('comida') || desc.includes('alimento') ||
        desc.includes('delivery') || desc.includes('ifood') ||
        desc.includes('restaurante') || desc.includes('lanche')) {
      return 'Alimentação';
    }
    
    if (desc.includes('uber') || desc.includes('taxi') || 
        desc.includes('combustível') || desc.includes('gasolina') || 
        desc.includes('ônibus') || desc.includes('metro') ||
        desc.includes('transporte') || desc.includes('passagem')) {
      return 'Transporte';
    }
    
    if (desc.includes('aluguel') || desc.includes('condomínio') || 
        desc.includes('energia') || desc.includes('água') || 
        desc.includes('internet') || desc.includes('casa') ||
        desc.includes('luz') || desc.includes('gás')) {
      return 'Moradia';
    }
    
    if (desc.includes('farmácia') || desc.includes('médico') || 
        desc.includes('hospital') || desc.includes('plano') || 
        desc.includes('remédio') || desc.includes('consulta')) {
      return 'Saúde';
    }
    
    if (desc.includes('cinema') || desc.includes('bar') || 
        desc.includes('festa') || desc.includes('lazer') || 
        desc.includes('diversão') || desc.includes('show') ||
        desc.includes('viagem') || desc.includes('passeio')) {
      return 'Lazer';
    }
    
    if (desc.includes('roupa') || desc.includes('sapato') || 
        desc.includes('shopping') || desc.includes('loja') ||
        desc.includes('compras') || desc.includes('presente')) {
      return 'Compras';
    }

    if (desc.includes('curso') || desc.includes('livro') || 
        desc.includes('educação') || desc.includes('escola') ||
        desc.includes('faculdade') || desc.includes('estudo')) {
      return 'Educação';
    }
    
    return 'Outros';
  }

  async checkSpendingAlerts(user, transaction, dbService) {
    const alerts = [];
    
    try {
      // Verificar se o gasto é muito alto comparado à média
      const avgExpense = await dbService.getAverageExpense(user.id);
      if (avgExpense > 0 && transaction.amount > avgExpense * 2.5) {
        alerts.push({
          type: 'high_expense',
          message: `Este gasto é ${Math.round(transaction.amount / avgExpense)}x maior que sua média usual de R$ ${avgExpense.toFixed(2)}.`
        });
      }

      // Verificar gastos altos em valor absoluto
      if (transaction.amount > 500) {
        alerts.push({
          type: 'high_value',
          message: `Gasto alto detectado! Verifique se está dentro do seu planejamento.`
        });
      }

      // Verificar metas de limite de gastos
      const goals = await dbService.getUserGoals(user.id);
      const expenseGoals = goals.filter(g => g.category === 'expense-limit' && g.status === 'active');
      
      for (const goal of expenseGoals) {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        if (progress > 80) {
          alerts.push({
            type: 'goal_limit',
            message: `Você já gastou ${progress.toFixed(1)}% da meta "${goal.title}".`
          });
        }
      }

    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }

    return alerts;
  }

  async generatePersonalizedAdvice(user, transactions, goals) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    let message = '';
    let tips = [];

    if (savingsRate < 10) {
      message = `${user.name.split(' ')[0]}, sua taxa de economia está em ${savingsRate.toFixed(1)}%, que está abaixo do ideal. Vamos trabalhar juntos para melhorar isso!`;
      tips = [
        '💡 Tente economizar pelo menos 20% da sua renda',
        '🍕 Revise seus gastos com delivery e restaurantes',
        '📊 Crie um orçamento mensal detalhado',
        '🏦 Automatize transferências para poupança',
        '📱 Use o InvestBot para acompanhar gastos diários'
      ];
    } else if (savingsRate < 20) {
      message = `Parabéns ${user.name.split(' ')[0]}! Você está economizando ${savingsRate.toFixed(1)}% da renda. Está no caminho certo!`;
      tips = [
        '🎯 Tente chegar aos 20% de economia',
        '👀 Mantenha o controle dos gastos supérfluos',
        '💰 Considere investimentos de baixo risco',
        '📈 Aumente gradualmente sua taxa de economia'
      ];
    } else {
      message = `Excelente trabalho ${user.name.split(' ')[0]}! Sua taxa de economia de ${savingsRate.toFixed(1)}% está acima da média!`;
      tips = [
        '🏆 Continue com a disciplina atual',
        '📈 Explore opções de investimento',
        '🎯 Considere aumentar suas metas',
        '💎 Diversifique seus investimentos'
      ];
    }

    return { message, tips };
  }

  async generateDailyReport(user, dbService) {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const transactions = await dbService.getTransactionsByPeriod(user.id, yesterday, today);
      
      if (transactions.length === 0) return null;

      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

      return `🌅 *Bom dia, ${user.name.split(' ')[0]}!*

📊 *Resumo de ontem:*
📈 Receitas: R$ ${income.toFixed(2)}
📉 Gastos: R$ ${expenses.toFixed(2)}
💾 Saldo do dia: R$ ${(income - expenses).toFixed(2)}

💡 Continue controlando suas finanças! 💪

🤖 *InvestBot - Sempre com você! 24h/dia* 🚀`;

    } catch (error) {
      console.error('Erro ao gerar relatório diário:', error);
      return null;
    }
  }

  async generateWeeklyReport(user, dbService) {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const transactions = await dbService.getTransactionsByPeriod(user.id, weekAgo, today);
      
      if (transactions.length === 0) return null;

      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const balance = await dbService.getUserBalance(user.id);

      return `📊 *Resumo Semanal - ${user.name.split(' ')[0]}*

💰 *Esta semana:*
📈 Total Receitas: R$ ${income.toFixed(2)}
📉 Total Gastos: R$ ${expenses.toFixed(2)}
💾 Resultado: R$ ${(income - expenses).toFixed(2)}

💳 *Saldo atual:* R$ ${balance.toFixed(2)}

🎯 Continue assim! Suas finanças estão sob controle! 📈

🤖 *InvestBot - Seu parceiro financeiro 24h!* 🚀`;

    } catch (error) {
      console.error('Erro ao gerar relatório semanal:', error);
      return null;
    }
  }

  async generateGeneralResponse(message, user) {
    // Respostas baseadas em regras para perguntas comuns
    const msg = message.toLowerCase();
    
    if (msg.includes('como economizar') || msg.includes('economizar dinheiro')) {
      return `💡 *Dicas para economizar:*
      
1. 📝 Anote todos os gastos (como você já faz!)
2. 🎯 Defina metas mensais de economia
3. 🛒 Faça lista de compras e siga ela
4. 🍕 Reduza delivery e cozinhe mais em casa
5. 💡 Revise assinaturas e serviços não utilizados
6. 🚗 Use transporte público quando possível

🤖 *Sempre aqui para te ajudar! 24h/dia*`;
    }
    
    if (msg.includes('investir') || msg.includes('investimento')) {
      return `💰 *Para começar a investir:*
      
1. 💰 Tenha uma reserva de emergência primeiro
2. 📚 Estude sobre investimentos básicos
3. 🏦 Comece com renda fixa (CDB, Tesouro)
4. 📈 Diversifique gradualmente
5. 🎯 Invista regularmente, mesmo valores pequenos

🤖 *Sempre disponível para orientar! 24h/dia*`;
    }
    
    if (msg.includes('orçamento') || msg.includes('planejamento')) {
      return `📊 *Para fazer um bom orçamento:*
      
1. 📊 Liste todas suas receitas
2. 📝 Anote todos os gastos fixos
3. 🎯 Defina limites para gastos variáveis
4. 💾 Reserve 20% para poupança
5. 📱 Use o InvestBot para acompanhar tudo!

🤖 *Seu assistente financeiro 24h!*`;
    }

    if (msg.includes('ajuda') || msg.includes('help') || msg.includes('comandos')) {
      return `🤖 *Como posso te ajudar 24h:*

💰 *Registrar:*
• "Gastei 50 reais com supermercado"
• "Recebi 3000 reais de salário"

📊 *Consultar:*
• "Qual meu saldo?"
• "Me manda meu extrato"

💡 *Orientar:*
• "Como posso economizar?"
• "Dicas de investimento"

🚀 *Sempre disponível para você!*`;
    }
    
    return `Entendi sua pergunta! Para te ajudar melhor, você pode:
    
• Registrar gastos e receitas
• Consultar seu saldo
• Pedir relatórios
• Solicitar conselhos específicos
    
O que gostaria de fazer agora?

🤖 *Estou sempre aqui! 24h/dia* 🚀`;
  }

  // Análise de padrões de gastos inteligente
  async analyzeSpendingPatterns(user, dbService) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const transactions = await dbService.getTransactionsByPeriod(user.id, thirtyDaysAgo, new Date());
      
      if (transactions.length < 5) {
        return {
          hasEnoughData: false,
          message: 'Continue registrando suas transações para que eu possa fazer análises mais precisas!'
        };
      }

      const expenses = transactions.filter(t => t.type === 'expense');
      const income = transactions.filter(t => t.type === 'income');
      
      // Agrupar por categoria
      const categoryTotals = {};
      expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      });

      // Categoria com maior gasto
      const topCategory = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)[0];

      // Análise semanal
      const weeklyTrend = this.calculateWeeklyTrend(expenses);

      // Total de gastos e receitas
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

      return {
        hasEnoughData: true,
        totalExpenses,
        totalIncome,
        savingsRate,
        topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
        weeklyTrend,
        categoryBreakdown: categoryTotals,
        message: this.generateSpendingInsight(savingsRate, topCategory, weeklyTrend)
      };

    } catch (error) {
      console.error('Erro ao analisar padrões:', error);
      return { hasEnoughData: false, message: 'Erro ao analisar dados.' };
    }
  }

  calculateWeeklyTrend(expenses) {
    const weeks = [[], [], [], []]; // 4 semanas
    const now = Date.now();
    
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date).getTime();
      const daysAgo = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(daysAgo / 7);
      
      if (weekIndex < 4) {
        weeks[weekIndex].push(expense.amount);
      }
    });

    const weeklyAverages = weeks.map(week => 
      week.length > 0 ? week.reduce((a, b) => a + b, 0) / week.length : 0
    );

    // Comparar semana atual com média das outras
    const currentWeekAvg = weeklyAverages[0];
    const otherWeeksAvg = weeklyAverages.slice(1).reduce((a, b) => a + b, 0) / 3;

    if (currentWeekAvg > otherWeeksAvg * 1.2) return 'increasing';
    if (currentWeekAvg < otherWeeksAvg * 0.8) return 'decreasing';
    return 'stable';
  }

  generateSpendingInsight(savingsRate, topCategory, trend) {
    let insight = '📊 *Análise dos seus gastos (últimos 30 dias):*\n\n';

    // Análise da taxa de economia
    if (savingsRate >= 30) {
      insight += '🏆 *Excelente!* Você está economizando mais de 30% da renda!\n';
    } else if (savingsRate >= 20) {
      insight += '✅ *Muito bem!* Sua taxa de economia está saudável!\n';
    } else if (savingsRate >= 10) {
      insight += '⚠️ *Atenção!* Tente economizar mais, meta ideal é 20%.\n';
    } else if (savingsRate > 0) {
      insight += '🚨 *Alerta!* Sua taxa de economia está baixa, revise seus gastos.\n';
    } else {
      insight += '❌ *Crítico!* Você está gastando mais do que ganha!\n';
    }

    // Análise da categoria principal
    if (topCategory) {
      insight += `\n💳 *Maior categoria de gastos:* ${topCategory[0]}\n`;
      insight += `💰 Total: R$ ${topCategory[1].toFixed(2)}\n`;
    }

    // Análise de tendência
    if (trend === 'increasing') {
      insight += '\n📈 *Tendência:* Seus gastos estão aumentando nas últimas semanas.\n';
      insight += '💡 *Dica:* Revise seus gastos e tente reduzir despesas desnecessárias.\n';
    } else if (trend === 'decreasing') {
      insight += '\n📉 *Tendência:* Parabéns! Seus gastos estão diminuindo!\n';
      insight += '🎯 *Dica:* Continue assim e considere investir a economia.\n';
    } else {
      insight += '\n📊 *Tendência:* Seus gastos estão estáveis.\n';
      insight += '💡 *Dica:* Tente reduzir gradualmente os gastos supérfluos.\n';
    }

    return insight;
  }

  // Previsão de gastos futuros baseado em histórico
  async predictFutureExpenses(user, dbService) {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const transactions = await dbService.getTransactionsByPeriod(user.id, ninetyDaysAgo, new Date());
      const expenses = transactions.filter(t => t.type === 'expense');

      if (expenses.length < 10) {
        return {
          hasEnoughData: false,
          message: 'Preciso de mais dados para fazer previsões precisas.'
        };
      }

      // Calcular média mensal
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const averageMonthly = (totalExpenses / 90) * 30;

      // Identificar gastos fixos (que se repetem)
      const categoryFrequency = {};
      expenses.forEach(expense => {
        if (!categoryFrequency[expense.category]) {
          categoryFrequency[expense.category] = { count: 0, total: 0 };
        }
        categoryFrequency[expense.category].count++;
        categoryFrequency[expense.category].total += expense.amount;
      });

      const fixedExpenses = Object.entries(categoryFrequency)
        .filter(([, data]) => data.count >= 2) // Pelo menos 2 vezes em 90 dias
        .map(([category, data]) => ({
          category,
          estimatedMonthly: (data.total / 90) * 30
        }));

      return {
        hasEnoughData: true,
        averageMonthly,
        fixedExpenses,
        message: this.generatePredictionMessage(averageMonthly, fixedExpenses)
      };

    } catch (error) {
      console.error('Erro ao prever gastos:', error);
      return { hasEnoughData: false, message: 'Erro ao fazer previsões.' };
    }
  }

  generatePredictionMessage(average, fixedExpenses) {
    let message = '🔮 *Previsão de Gastos para o Próximo Mês:*\n\n';
    message += `📊 *Média mensal:* R$ ${average.toFixed(2)}\n\n`;
    
    if (fixedExpenses.length > 0) {
      message += '*Gastos fixos identificados:*\n';
      fixedExpenses.slice(0, 5).forEach(expense => {
        message += `• ${expense.category}: ~R$ ${expense.estimatedMonthly.toFixed(2)}\n`;
      });
    }

    message += '\n💡 *Dica:* Use essas previsões para planejar melhor seu mês!';
    return message;
  }

  // Detecção de gastos incomuns
  async detectAnomalies(user, transaction, dbService) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const pastTransactions = await dbService.getTransactionsByPeriod(user.id, thirtyDaysAgo, new Date());
      const similarTransactions = pastTransactions.filter(t => 
        t.type === transaction.type && t.category === transaction.category
      );

      if (similarTransactions.length < 3) return null;

      const amounts = similarTransactions.map(t => t.amount);
      const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - average, 2), 0) / amounts.length);

      // Detectar anomalia (> 2 desvios padrão)
      if (Math.abs(transaction.amount - average) > 2 * stdDev) {
        return {
          isAnomaly: true,
          type: transaction.amount > average ? 'unusually_high' : 'unusually_low',
          average,
          difference: transaction.amount - average,
          message: `🔍 *Alerta de Anomalia:* Este gasto de R$ ${transaction.amount.toFixed(2)} em ${transaction.category} é ${transaction.amount > average ? 'significativamente maior' : 'significativamente menor'} que sua média de R$ ${average.toFixed(2)}.`
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao detectar anomalias:', error);
      return null;
    }
  }

  // Sugestões personalizadas baseadas em comportamento
  async generateSmartSuggestions(user, dbService) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const transactions = await dbService.getTransactionsByPeriod(user.id, thirtyDaysAgo, new Date());
      const suggestions = [];

      // Analisar gastos por categoria
      const categoryTotals = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

      // Sugestão 1: Categorias com alto gasto
      const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a);

      if (sortedCategories[0] && sortedCategories[0][1] > 1000) {
        suggestions.push({
          type: 'reduce_spending',
          category: sortedCategories[0][0],
          amount: sortedCategories[0][1],
          message: `💡 Você gastou R$ ${sortedCategories[0][1].toFixed(2)} com ${sortedCategories[0][0]} este mês. Que tal reduzir 10%? Economizaria R$ ${(sortedCategories[0][1] * 0.1).toFixed(2)}!`
        });
      }

      // Sugestão 2: Frequência de gastos pequenos
      const smallExpenses = transactions.filter(t => t.type === 'expense' && t.amount < 50);
      if (smallExpenses.length > 15) {
        const total = smallExpenses.reduce((sum, t) => sum + t.amount, 0);
        suggestions.push({
          type: 'small_expenses',
          count: smallExpenses.length,
          total,
          message: `🔍 Você fez ${smallExpenses.length} pequenos gastos este mês, totalizando R$ ${total.toFixed(2)}. Revisar esses gastos pode gerar economia!`
        });
      }

      // Sugestão 3: Meta de economia
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const currentSavings = totalIncome - totalExpenses;
      const idealSavings = totalIncome * 0.2;

      if (currentSavings < idealSavings && totalIncome > 0) {
        suggestions.push({
          type: 'increase_savings',
          current: currentSavings,
          ideal: idealSavings,
          difference: idealSavings - currentSavings,
          message: `🎯 Para atingir a meta de 20% de economia, você precisa economizar mais R$ ${(idealSavings - currentSavings).toFixed(2)} este mês.`
        });
      }

      return suggestions;

    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [];
    }
  }
}

export { AIService };