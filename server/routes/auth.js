import express from 'express';
import { DatabaseService } from '../services/databaseService.js';
import { generateToken } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registro de novo usuário (Web)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const dbService = new DatabaseService();
    await dbService.initialize();

    // Verificar se email já existe
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await dbService.createUser({
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      source: 'web',
      isActive: true
    });

    // Gerar token
    const token = generateToken(user);

    // Não retornar a senha
    delete user.password;

    res.status(201).json({
      user,
      token,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Login de usuário (Web)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const dbService = new DatabaseService();
    await dbService.initialize();

    // Buscar usuário
    const user = await dbService.getUserByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken(user);

    // Não retornar a senha
    delete user.password;

    res.json({
      user,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
});

// Vincular WhatsApp a conta existente
router.post('/link-whatsapp', async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const dbService = new DatabaseService();
    await dbService.initialize();

    // Buscar usuário
    const user = await dbService.getUserByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se o telefone já está vinculado a outra conta
    const phoneUser = await dbService.getUserByPhone(phone);
    if (phoneUser && phoneUser.id !== user.id) {
      return res.status(400).json({ error: 'Este telefone já está vinculado a outra conta' });
    }

    // Atualizar telefone do usuário
    await dbService.updateUser(user.id, { phone });

    res.json({
      message: 'WhatsApp vinculado com sucesso',
      user: { ...user, phone }
    });

  } catch (error) {
    console.error('Erro ao vincular WhatsApp:', error);
    res.status(500).json({ error: 'Erro ao vincular WhatsApp' });
  }
});

// Obter informações do usuário autenticado
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const { verifyToken } = await import('../middleware/authMiddleware.js');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const dbService = new DatabaseService();
    await dbService.initialize();
    const user = await dbService.getUserById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    delete user.password;
    res.json({ user });

  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter dados do usuário' });
  }
});

export default router;