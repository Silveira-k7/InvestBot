# 🚀 Guia de Instalação - InvestBot

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** (vem com o Node.js)
- **Git** (opcional, para clonar o repositório)

## 📦 Passo 1: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso instalará todas as dependências necessárias:
- Frontend: React, Tailwind CSS, Framer Motion, etc.
- Backend: Express, WhatsApp Web.js, OpenAI, etc.
- Novas: jsonwebtoken, bcryptjs

## ⚙️ Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copiar template
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Porta do servidor
PORT=3001

# Chave secreta para JWT (gere uma senha forte)
JWT_SECRET=sua-chave-secreta-muito-forte-aqui

# API Key da OpenAI (opcional, mas recomendado)
OPENAI_API_KEY=sk-...

# Número do WhatsApp do administrador
ADMIN_WHATSAPP=5511999999999

# Ambiente
NODE_ENV=development
```

### Como obter a OpenAI API Key:
1. Acesse https://platform.openai.com/
2. Crie uma conta ou faça login
3. Vá em "API Keys"
4. Clique em "Create new secret key"
5. Copie a chave e cole no .env

**Nota:** O sistema funciona sem a API Key da OpenAI, mas as análises de IA serão baseadas em regras ao invés de usar GPT.

## 🚀 Passo 3: Executar o Sistema

### Opção 1: Desenvolvimento (Recomendado para testar)

Executa Frontend + Backend simultaneamente:

```bash
npm run start:dev
```

Isso abrirá:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

### Opção 2: Apenas Backend/WhatsApp Bot

```bash
npm run server
```

ou

```bash
npm run start:bot
```

### Opção 3: Apenas Frontend

```bash
npm run dev
```

## 📱 Passo 4: Conectar o WhatsApp

### 4.1. Iniciar o Bot

Se você executou `npm run start:dev` ou `npm run server`, o bot já está rodando.

### 4.2. Ver o QR Code

Existem duas maneiras:

**Opção A: No Terminal**
- O QR Code aparecerá no console
- Use um leitor de QR Code no seu celular

**Opção B: No Navegador (Melhor opção)**
1. Acesse http://localhost:5173/whatsapp
2. Você verá a página com o QR Code
3. Abra o WhatsApp no celular
4. Vá em **Configurações > Aparelhos Conectados**
5. Toque em **"Conectar um aparelho"**
6. Escaneie o QR Code mostrado na tela

### 4.3. Confirmação

Quando conectado, você verá no console:

```
✅ WhatsApp Client está pronto e funcionando 24h!
```

## 👤 Passo 5: Criar Primeira Conta

### Via WhatsApp:

1. Envie uma mensagem para o número conectado:
   ```
   Oi
   ```
   ou
   ```
   Quero me cadastrar
   ```

2. Siga as instruções do bot:
   - Informe seu nome
   - Informe seu email
   - Pronto! ✅

### Via Dashboard Web:

1. Acesse http://localhost:5173
2. Clique em "Criar Conta"
3. Preencha os dados:
   - Nome
   - Email
   - Senha
   - Telefone (opcional)
4. Clique em "Registrar"

## 🎯 Passo 6: Testar Funcionalidades

### Testar via WhatsApp:

```
# Registrar gasto
"Gastei 50 reais com supermercado"

# Registrar receita
"Recebi 3000 de salário"

# Consultar saldo
"Qual meu saldo?"

# Análise inteligente
"Analise meus gastos"

# Previsão
"Previsão próximo mês"

# Sugestões
"Me dá dicas"
```

### Testar via Web:

1. Faça login no dashboard
2. Adicione algumas transações
3. Veja os gráficos atualizarem
4. Crie metas financeiras
5. Veja os insights da IA

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Desenvolvimento (Frontend + Backend)
npm run start:dev

# Apenas Backend
npm run server

# Apenas Frontend
npm run dev

# Build para produção
npm run build

# Verificar erros (lint)
npm run lint
```

## 📂 Estrutura do Projeto

```
InvestBot/
├── server/                    # Backend
│   ├── index.js              # Servidor principal
│   ├── routes/               # Rotas da API
│   │   ├── auth.js          # Autenticação
│   │   ├── webhook.js       # Webhooks
│   │   └── whatsapp.js      # WhatsApp
│   ├── services/             # Serviços
│   │   ├── aiService.js     # IA e análises
│   │   ├── databaseService.js
│   │   ├── whatsappService.js
│   │   └── notificationService.js
│   └── middleware/           # Middlewares
│       └── authMiddleware.js
├── src/                      # Frontend
│   ├── components/          # Componentes React
│   ├── pages/               # Páginas
│   ├── services/            # Serviços frontend
│   └── contexts/            # Contextos React
├── data/                     # Dados (criado automaticamente)
└── whatsapp-session/        # Sessão WhatsApp (criado automaticamente)
```

## ❓ Problemas Comuns

### 1. Erro "Cannot find module"

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. QR Code não aparece

**Solução:**
- Verifique se a porta 3001 não está em uso
- Reinicie o servidor: `Ctrl+C` e `npm run server`
- Limpe a pasta `whatsapp-session`:
  ```bash
  rm -rf whatsapp-session
  ```

### 3. "WhatsApp desconectado"

**Solução:**
- O sistema tenta reconectar automaticamente
- Se persistir, reinicie o servidor
- Escaneie o QR Code novamente

### 4. "Token inválido" na API

**Solução:**
- Verifique se o JWT_SECRET está definido no .env
- Faça login novamente para obter novo token
- Certifique-se de enviar o token no header:
  ```
  Authorization: Bearer <seu-token>
  ```

### 5. Porta já em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <número-do-pid> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### 6. Dependências não instaladas

**Solução:**
```bash
# Instalar dependências específicas
npm install jsonwebtoken bcryptjs
```

## 🔐 Segurança

### Produção:

1. **Mude o JWT_SECRET:**
   ```bash
   # Gerar senha forte
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use HTTPS**
3. **Configure CORS apropriadamente**
4. **Use variáveis de ambiente seguras**
5. **Ative rate limiting**

## 📊 Monitoramento

### Verificar Status do Sistema:

```bash
# Health check
curl http://localhost:3001/health

# Status detalhado
curl http://localhost:3001/status
```

### Logs:

O sistema exibe logs detalhados no console:
- ✅ Sucessos em verde
- ⚠️ Avisos em amarelo
- ❌ Erros em vermelho

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no console
2. Consulte a documentação:
   - `COMANDOS_IA.md` - Comandos disponíveis
   - `MELHORIAS.md` - Detalhes das funcionalidades
3. Verifique as issues no GitHub
4. Entre em contato com o suporte

## ✅ Checklist de Instalação

- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Servidor iniciado (`npm run start:dev`)
- [ ] WhatsApp conectado (QR Code escaneado)
- [ ] Conta criada (via WhatsApp ou Web)
- [ ] Primeira transação registrada
- [ ] Dashboard funcionando

## 🎉 Pronto!

Seu InvestBot está instalado e funcionando!

**Próximos passos:**
1. Explore todos os comandos do WhatsApp
2. Configure suas metas financeiras
3. Registre suas transações diárias
4. Receba análises e sugestões da IA
5. Acompanhe seu progresso no dashboard

---

**InvestBot** - Seu assistente financeiro inteligente 24h! 🚀
