import OpenAI from 'openai';

export class AIService {
  constructor() {
    this.openai = null;
    
    // Inicializar OpenAI se a chave estiver disponível
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
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
}