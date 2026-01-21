import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { WhatsAppService } from './services/whatsappService.js';
import { AIService } from './services/aiService.js';
import { DatabaseService } from './services/databaseService.js';
import NotificationService from './services/notificationService.js';
import { webhookRoutes } from './routes/webhook.js';
import { whatsappRoutes } from './routes/whatsapp.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Services
const whatsappService = new WhatsAppService();
const aiService = new AIService();
const dbService = new DatabaseService();
let notificationService = null;

// Função para inicializar serviços
async function initializeServices() {
  try {
    console.log('🚀 Inicializando InvestBot...');
    
    // Inicializar banco de dados
    await dbService.initialize();
    console.log('✅ Database Service inicializado');
    
    // Inicializar WhatsApp
    await whatsappService.initialize();
    console.log('✅ WhatsApp Service inicializado');
    
    // Manter bot ativo 24h
    await whatsappService.keepAlive();
    console.log('✅ Sistema de manutenção 24h ativado');
    
    // Inicializar sistema de notificações inteligentes
    notificationService = new NotificationService(whatsappService, aiService, dbService);
    notificationService.initialize();
    console.log('✅ Notification Service inicializado');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar serviços:', error);
    
    // Tentar novamente em 10 segundos
    setTimeout(initializeServices, 10000);
  }
}

// Routes
app.use('/webhook', webhookRoutes(whatsappService, aiService, dbService));
app.use('/api/whatsapp', whatsappRoutes(whatsappService, dbService));
app.use('/api/auth', authRoutes);

// Health check melhorado
app.get('/health', (req, res) => {
  const stats = whatsappService.getStats();
  res.json({ 
    status: 'ok',
    service: 'InvestBot WhatsApp 24h',
    whatsapp: {
      isReady: stats.isReady,
      activeSessions: stats.activeSessions,
      reconnectAttempts: stats.reconnectAttempts
    },
    uptime: stats.uptime,
    timestamp: new Date().toISOString()
  });
});

// Status detalhado do sistema
app.get('/status', (req, res) => {
  const stats = whatsappService.getStats();
  res.json({
    system: {
      name: 'InvestBot',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    },
    whatsapp: {
      isReady: stats.isReady,
      activeSessions: stats.activeSessions,
      reconnectAttempts: stats.reconnectAttempts,
      maxReconnectAttempts: 5
    },
    database: {
      status: 'connected'
    }
  });
});

// Cron jobs para relatórios automáticos
cron.schedule('0 9 * * *', async () => {
  console.log('📊 Enviando resumos matinais...');
  try {
    await whatsappService.sendDailyReports(dbService, aiService);
    console.log('✅ Resumos matinais enviados');
  } catch (error) {
    console.error('❌ Erro ao enviar resumos matinais:', error);
  }
});

cron.schedule('0 20 * * 0', async () => {
  console.log('📊 Enviando resumos semanais...');
  try {
    await whatsappService.sendWeeklyReports(dbService, aiService);
    console.log('✅ Resumos semanais enviados');
  } catch (error) {
    console.error('❌ Erro ao enviar resumos semanais:', error);
  }
});

// Cron job para verificar saúde do sistema
cron.schedule('*/5 * * * *', async () => {
  const stats = whatsappService.getStats();
  if (!stats.isReady) {
    console.log('⚠️ WhatsApp offline - sistema tentará reconectar automaticamente');
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, encerrando graciosamente...');
  await whatsappService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, encerrando graciosamente...');
  await whatsappService.disconnect();
  process.exit(0);
});

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor InvestBot rodando na porta ${PORT}`);
  console.log(`📱 WhatsApp Bot 24h inicializando...`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  
  // Inicializar serviços
  await initializeServices();
});

// Log de inicialização
console.log(`
🤖 ===============================================
   INVESTBOT - ASSISTENTE FINANCEIRO 24H
===============================================
📱 WhatsApp Bot: Sempre Online
🧠 IA Integrada: Análises Inteligentes  
📊 Dashboard Web: Controle Total
⏰ Disponibilidade: 24 horas por dia
===============================================
`);