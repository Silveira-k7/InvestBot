import cron from 'node-cron';

export class NotificationService {
  constructor(whatsappService, aiService, dbService) {
    this.whatsappService = whatsappService;
    this.aiService = aiService;
    this.dbService = dbService;
    this.scheduledJobs = [];
  }

  // Inicializar todos os cron jobs
  initialize() {
    console.log('📢 Inicializando sistema de notificações inteligentes...');

    // Relatórios diários às 9h
    this.scheduleDailyReports();

    // Relatórios semanais aos domingos às 20h
    this.scheduleWeeklyReports();

    // Alertas de gastos (verificação a cada hora)
    this.scheduleSpendingAlerts();

    // Lembretes de metas (verificação diária às 18h)
    this.scheduleGoalReminders();

    // Análise mensal (primeiro dia do mês às 10h)
    this.scheduleMonthlyAnalysis();

    // Heartbeat de saúde do sistema (a cada 30 minutos)
    this.scheduleHealthCheck();

    console.log('✅ Sistema de notificações inicializado com sucesso!');
  }

  // Relatórios diários automáticos
  scheduleDailyReports() {
    const job = cron.schedule('0 9 * * *', async () => {
      console.log('📊 Enviando relatórios diários...');
      try {
        const users = await this.dbService.getAllActiveUsers();
        
        for (const user of users) {
          if (!user.phone) continue;

          const report = await this.aiService.generateDailyReport(user, this.dbService);
          if (report) {
            await this.whatsappService.sendMessage(user.phone, report);
            console.log(`✅ Relatório diário enviado para ${user.name}`);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao enviar relatórios diários:', error);
      }
    });

    this.scheduledJobs.push({ name: 'daily-reports', job });
    console.log('✅ Relatórios diários agendados (9h)');
  }

  // Relatórios semanais automáticos
  scheduleWeeklyReports() {
    const job = cron.schedule('0 20 * * 0', async () => {
      console.log('📊 Enviando relatórios semanais...');
      try {
        const users = await this.dbService.getAllActiveUsers();
        
        for (const user of users) {
          if (!user.phone) continue;

          const report = await this.aiService.generateWeeklyReport(user, this.dbService);
          if (report) {
            await this.whatsappService.sendMessage(user.phone, report);
            console.log(`✅ Relatório semanal enviado para ${user.name}`);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao enviar relatórios semanais:', error);
      }
    });

    this.scheduledJobs.push({ name: 'weekly-reports', job });
    console.log('✅ Relatórios semanais agendados (Domingos 20h)');
  }

  // Alertas inteligentes de gastos (verificação a cada hora)
  scheduleSpendingAlerts() {
    const job = cron.schedule('0 * * * *', async () => {
      console.log('🔍 Verificando alertas de gastos...');
      try {
        const users = await this.dbService.getAllActiveUsers();
        
        for (const user of users) {
          if (!user.phone) continue;

          // Verificar gastos do dia
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const todayTransactions = await this.dbService.getTransactionsByPeriod(
            user.id,
            today,
            tomorrow
          );

          const todayExpenses = todayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          // Alerta se gastos do dia > R$ 500
          if (todayExpenses > 500) {
            const avgExpense = await this.dbService.getAverageExpense(user.id);
            
            if (todayExpenses > avgExpense * 3) {
              const message = `⚠️ *Alerta de Gastos*\n\n` +
                `Você já gastou R$ ${todayExpenses.toFixed(2)} hoje!\n` +
                `Isso é ${(todayExpenses / avgExpense).toFixed(1)}x sua média diária.\n\n` +
                `💡 *Dica:* Revise seus gastos antes de fazer novas compras.\n\n` +
                `🤖 *InvestBot - Cuidando das suas finanças 24h!*`;

              await this.whatsappService.sendMessage(user.phone, message);
              console.log(`⚠️ Alerta de gastos enviado para ${user.name}`);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar alertas:', error);
      }
    });

    this.scheduledJobs.push({ name: 'spending-alerts', job });
    console.log('✅ Alertas de gastos agendados (a cada hora)');
  }

  // Lembretes de metas (diariamente às 18h)
  scheduleGoalReminders() {
    const job = cron.schedule('0 18 * * *', async () => {
      console.log('🎯 Verificando progresso de metas...');
      try {
        const users = await this.dbService.getAllActiveUsers();
        
        for (const user of users) {
          if (!user.phone) continue;

          const goals = await this.dbService.getUserGoals(user.id);
          const activeGoals = goals.filter(g => g.status === 'active');

          for (const goal of activeGoals) {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            
            // Alertar em marcos importantes: 25%, 50%, 75%, 90%
            const milestones = [25, 50, 75, 90];
            const roundedProgress = Math.floor(progress / 5) * 5; // Arredondar para múltiplo de 5

            if (milestones.includes(roundedProgress)) {
              let message = `🎯 *Atualização de Meta*\n\n`;
              message += `*${goal.title}*\n`;
              message += `Progresso: ${progress.toFixed(1)}%\n`;
              message += `Atual: R$ ${goal.currentAmount.toFixed(2)}\n`;
              message += `Meta: R$ ${goal.targetAmount.toFixed(2)}\n`;
              message += `Faltam: R$ ${(goal.targetAmount - goal.currentAmount).toFixed(2)}\n\n`;

              if (progress >= 90) {
                message += `🏆 *Quase lá!* Você está muito perto!\n`;
              } else if (progress >= 75) {
                message += `💪 *Ótimo trabalho!* Continue firme!\n`;
              } else if (progress >= 50) {
                message += `📈 *No caminho certo!* Você já passou da metade!\n`;
              } else {
                message += `🚀 *Começou bem!* Continue assim!\n`;
              }

              message += `\n🤖 *InvestBot - Seu parceiro nas metas!*`;

              await this.whatsappService.sendMessage(user.phone, message);
              console.log(`🎯 Lembrete de meta enviado para ${user.name}`);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar metas:', error);
      }
    });

    this.scheduledJobs.push({ name: 'goal-reminders', job });
    console.log('✅ Lembretes de metas agendados (18h)');
  }

  // Análise mensal completa (primeiro dia do mês às 10h)
  scheduleMonthlyAnalysis() {
    const job = cron.schedule('0 10 1 * *', async () => {
      console.log('📊 Gerando análises mensais...');
      try {
        const users = await this.dbService.getAllActiveUsers();
        
        for (const user of users) {
          if (!user.phone) continue;

          // Análise do mês anterior
          const now = new Date();
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

          const transactions = await this.dbService.getTransactionsByPeriod(
            user.id,
            lastMonthStart,
            lastMonthEnd
          );

          if (transactions.length === 0) continue;

          const expenses = transactions.filter(t => t.type === 'expense');
          const income = transactions.filter(t => t.type === 'income');
          
          const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
          const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
          const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

          // Categorias com maior gasto
          const categoryTotals = {};
          expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
          });

          const topCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

          let message = `📊 *Análise Completa do Mês Anterior*\n\n`;
          message += `*${lastMonthStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}*\n\n`;
          message += `💰 *Resumo Financeiro:*\n`;
          message += `📈 Receitas: R$ ${totalIncome.toFixed(2)}\n`;
          message += `📉 Gastos: R$ ${totalExpenses.toFixed(2)}\n`;
          message += `💾 Saldo: R$ ${(totalIncome - totalExpenses).toFixed(2)}\n`;
          message += `📊 Taxa de Economia: ${savingsRate.toFixed(1)}%\n\n`;

          message += `🏆 *Top 3 Categorias de Gastos:*\n`;
          topCategories.forEach(([category, amount], index) => {
            message += `${index + 1}. ${category}: R$ ${amount.toFixed(2)}\n`;
          });

          message += `\n`;
          if (savingsRate >= 20) {
            message += `✅ *Parabéns!* Você está economizando bem!\n`;
          } else if (savingsRate >= 10) {
            message += `⚠️ *Atenção!* Tente aumentar sua economia para 20%.\n`;
          } else {
            message += `🚨 *Cuidado!* Sua economia está abaixo do ideal.\n`;
          }

          message += `\n🤖 *InvestBot - Seu assistente financeiro 24h!*`;

          await this.whatsappService.sendMessage(user.phone, message);
          console.log(`📊 Análise mensal enviada para ${user.name}`);
        }
      } catch (error) {
        console.error('❌ Erro ao gerar análises mensais:', error);
      }
    });

    this.scheduledJobs.push({ name: 'monthly-analysis', job });
    console.log('✅ Análises mensais agendadas (dia 1 às 10h)');
  }

  // Health check do sistema (a cada 30 minutos)
  scheduleHealthCheck() {
    const job = cron.schedule('*/30 * * * *', async () => {
      const stats = this.whatsappService.getStats();
      
      if (!stats.isReady) {
        console.log('⚠️ WhatsApp não está conectado. Tentando reconectar...');
        try {
          await this.whatsappService.initialize();
        } catch (error) {
          console.error('❌ Falha na reconexão:', error);
        }
      } else {
        console.log(`✅ Health Check: Sistema operacional (${stats.activeSessions} sessões ativas)`);
      }
    });

    this.scheduledJobs.push({ name: 'health-check', job });
    console.log('✅ Health check agendado (a cada 30 min)');
  }

  // Notificação manual para um usuário
  async sendNotification(userId, message) {
    try {
      const user = await this.dbService.getUserById(userId);
      if (!user || !user.phone) {
        throw new Error('Usuário não encontrado ou sem telefone cadastrado');
      }

      await this.whatsappService.sendMessage(user.phone, message);
      return { success: true, message: 'Notificação enviada' };
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  // Broadcast para todos os usuários
  async sendBroadcast(message) {
    try {
      const users = await this.dbService.getAllActiveUsers();
      let sent = 0;
      let failed = 0;

      for (const user of users) {
        if (!user.phone) continue;

        try {
          await this.whatsappService.sendMessage(user.phone, message);
          sent++;
          // Aguardar 2 segundos entre mensagens para não ser bloqueado
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Erro ao enviar para ${user.name}:`, error);
          failed++;
        }
      }

      return { success: true, sent, failed };
    } catch (error) {
      console.error('Erro no broadcast:', error);
      return { success: false, error: error.message };
    }
  }

  // Parar todos os cron jobs
  stopAll() {
    this.scheduledJobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`🛑 ${name} parado`);
    });
    this.scheduledJobs = [];
  }

  // Obter status de todos os jobs
  getStatus() {
    return this.scheduledJobs.map(({ name }) => ({
      name,
      active: true
    }));
  }
}

export default NotificationService;
