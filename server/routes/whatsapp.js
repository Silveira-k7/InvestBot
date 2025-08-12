import express from 'express';

export function whatsappRoutes(whatsappService, dbService) {
  const router = express.Router();

  // Status do WhatsApp
  router.get('/status', (req, res) => {
    try {
      const stats = whatsappService.getStats();
      res.json({
        isReady: stats.isReady,
        qrCode: whatsappService.getQRCode()
      });
    } catch (error) {
      console.error('Erro ao obter status:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        isReady: false,
        qrCode: null
      });
    }
  });

  // Enviar mensagem manual
  router.post('/send', async (req, res) => {
    try {
      const { phone, message } = req.body;
      
      if (!phone || !message) {
        return res.status(400).json({ error: 'Phone e message são obrigatórios' });
      }
      
      const success = await whatsappService.sendMessage(phone, message);
      
      if (success) {
        res.json({ success: true, message: 'Mensagem enviada com sucesso' });
      } else {
        res.status(500).json({ error: 'Falha ao enviar mensagem' });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Listar usuários conectados
  router.get('/users', async (req, res) => {
    try {
      const users = await dbService.getAllActiveUsers();
      res.json(users.map(user => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt
      })));
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Enviar relatório para usuário específico
  router.post('/send-report/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await dbService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      const { AIService } = await import('../services/aiService.js');
      const aiService = new AIService();
      
      const report = await aiService.generateWeeklyReport(user, dbService);
      
      if (report) {
        const success = await whatsappService.sendMessage(user.phone, report);
        res.json({ success, message: success ? 'Relatório enviado' : 'Falha ao enviar' });
      } else {
        res.status(400).json({ error: 'Não foi possível gerar relatório' });
      }
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  return router;
}