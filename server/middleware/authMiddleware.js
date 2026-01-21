import jwt from 'jsonwebtoken';
import { DatabaseService } from '../services/databaseService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'investbot-secret-key-change-in-production';

// Gerar token JWT para usuário
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '30d' } // Token válido por 30 dias
  );
}

// Verificar token JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware de autenticação para rotas da API
export async function authenticateRequest(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Verificar se usuário ainda existe
    const dbService = new DatabaseService();
    await dbService.initialize();
    const user = await dbService.getUserById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
}

// Autenticação para WhatsApp (por telefone)
export async function authenticateWhatsApp(phoneNumber) {
  const dbService = new DatabaseService();
  await dbService.initialize();
  
  const user = await dbService.getUserByPhone(phoneNumber);
  
  if (!user || !user.isActive) {
    return null;
  }

  // Gerar token para o usuário do WhatsApp
  const token = generateToken(user);
  
  return {
    user,
    token
  };
}

// Criar ou autenticar usuário do WhatsApp
export async function getOrCreateWhatsAppUser(phoneNumber, userData = {}) {
  const dbService = new DatabaseService();
  await dbService.initialize();
  
  let user = await dbService.getUserByPhone(phoneNumber);
  
  if (!user) {
    // Criar novo usuário
    user = await dbService.createUser({
      phone: phoneNumber,
      name: userData.name || 'Usuário WhatsApp',
      email: userData.email || `whatsapp_${phoneNumber}@investbot.app`,
      source: 'whatsapp',
      isActive: true
    });
  }
  
  const token = generateToken(user);
  
  return {
    user,
    token,
    isNewUser: !user
  };
}
