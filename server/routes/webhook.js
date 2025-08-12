export function webhookRoutes(whatsappService, aiService, dbService) {
  const router = require('express').Router();

  // Webhook para receber mensagens do WhatsApp
  router.post('/whatsapp', async (req, res) => {
    try {
      const { from, body, timestamp } = req.body;
      
      console.log(`📨 Webhook recebido de ${from}: ${body}`);
      
      // Processar mensagem
      await whatsappService.handleMessage({
        from: from + '@c.us',
        body: body,
        timestamp: timestamp,
        fromMe: false
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Webhook para status de entrega
  router.post('/whatsapp/status', async (req, res) => {
    try {
      const { messageId, status, timestamp } = req.body;
      
      console.log(`📋 Status da mensagem ${messageId}: ${status}`);
      
      // Aqui você pode salvar o status da mensagem no banco
      // await dbService.updateMessageStatus(messageId, status);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro no webhook de status:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  return router;
}