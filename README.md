# 🤖 InvestBot - Assistente Financeiro com IA e WhatsApp

Um sistema completo de gestão financeira pessoal que integra **Dashboard Web** e **Chatbot WhatsApp com Inteligência Artificial** disponível **24 horas por dia**.

## 🚀 Funcionalidades

### 📊 Dashboard Web
- ✅ Painel completo com estatísticas financeiras
- ✅ Gráficos interativos (receitas vs gastos, gastos por categoria)
- ✅ Histórico completo de transações
- ✅ Sistema de metas financeiras
- ✅ **Insights com IA** - análises inteligentes e recomendações
- ✅ Categorização automática de transações
- ✅ Previsões de gastos futuros
- ✅ Alertas inteligentes
- ✅ **Relatórios completos** com exportação PDF/CSV
- ✅ **Extratos mensais** detalhados
- ✅ **Gestão de metas** com progresso visual
- ✅ **Importação de dados** via CSV

### 📱 WhatsApp Bot com IA (24h Online)
- ✅ **Disponível 24 horas por dia, 7 dias por semana**
- ✅ **Sistema de reconexão automática**
- ✅ **Cadastro via WhatsApp**: "Quero me cadastrar"
- ✅ **Registro de gastos**: "Gastei 150 reais com supermercado"
- ✅ **Registro de receitas**: "Recebi 1000 reais de salário"
- ✅ **Consulta de saldo**: "Qual meu saldo?"
- ✅ **Relatórios automáticos**: "Me manda meu extrato"
- ✅ **Conselhos financeiros**: "Como posso economizar?"
- ✅ **Categorização automática** com IA
- ✅ **Alertas proativos** sobre gastos altos
- ✅ **Relatórios automáticos** (diários às 9h e semanais aos domingos 20h)
- ✅ **Monitoramento de saúde** do sistema
- ✅ **Heartbeat** para manter conexão ativa

### 🧠 Inteligência Artificial
- ✅ Análise de padrões de gastos
- ✅ Categorização automática de transações
- ✅ Previsões de gastos futuros
- ✅ Recomendações personalizadas
- ✅ Alertas inteligentes
- ✅ Processamento de linguagem natural
- ✅ Conselhos financeiros contextualizados

### 📈 Relatórios e Extratos
- ✅ **Relatórios financeiros** com gráficos avançados
- ✅ **Exportação PDF/CSV** de relatórios
- ✅ **Extratos mensais** automáticos
- ✅ **Análise de tendências** por categoria
- ✅ **Comparativos mensais** e anuais
- ✅ **Impressão de extratos** formatados

### 🎯 Gestão de Metas
- ✅ **Criação de metas** personalizadas
- ✅ **Acompanhamento visual** do progresso
- ✅ **Metas de economia** e limites de gastos
- ✅ **Alertas de progresso** automáticos
- ✅ **Status de metas** (ativa, pausada, concluída)

## 🛠️ Tecnologias

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Recharts** para gráficos
- **Lucide React** para ícones

### Backend
- **Node.js** + Express
- **WhatsApp Web.js** para integração WhatsApp
- **OpenAI API** para IA (opcional)
- **Puppeteer** para automação
- **Node-cron** para tarefas agendadas

### Banco de Dados
- Sistema de arquivos JSON (demo)
- Preparado para PostgreSQL/MySQL

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Executar Frontend e Backend Juntos
```bash
npm run start:dev
```

### 4. Ou Executar Separadamente

#### Frontend
```bash
npm run dev
```

#### Backend (WhatsApp Bot 24h)
```bash
npm run server
```

### 5. Configurar WhatsApp
1. Acesse `http://localhost:5173/whatsapp`
2. Escaneie o QR Code com seu WhatsApp
3. O bot estará ativo e funcionando 24h!

## 📱 Como Usar o WhatsApp Bot

### Cadastro
```
Usuário: "Quero me cadastrar"
Bot: Coleta nome, email e telefone
```

### Registrar Gastos
```
Usuário: "Gastei 50 reais com supermercado"
Bot: ✅ Gasto registrado! Categoria: Alimentação
     Saldo atual: R$ 1.450,00
```

### Registrar Receitas
```
Usuário: "Recebi 1000 reais de salário"
Bot: ✅ Receita registrada! Categoria: Salário
     Saldo atual: R$ 2.450,00
```

### Consultar Saldo
```
Usuário: "Qual meu saldo?"
Bot: 💰 Saldo Atual: R$ 2.450,00
     📊 Este mês:
     📈 Receitas: R$ 3.000,00
     📉 Gastos: R$ 550,00
```

### Pedir Relatórios
```
Usuário: "Me manda meu extrato"
Bot: 📊 Relatório Financeiro
     [Relatório detalhado com transações]
```

### Conselhos Financeiros
```
Usuário: "Como posso economizar?"
Bot: 🧠 Conselho Personalizado
     [Análise + dicas baseadas no perfil]
```

### Comandos de Sistema (Admin)
```
Admin: "/status"
Bot: 🤖 InvestBot Status:
     ✅ Online 24h
     📊 Usuários ativos: X
     ⏰ Uptime: Xs
```

## 🤖 Recursos de IA

### Categorização Automática
- Analisa descrição da transação
- Sugere categoria apropriada
- Aprende com padrões do usuário

### Análise de Padrões
- Identifica gastos incomuns
- Detecta tendências de consumo
- Calcula médias e variações

### Alertas Inteligentes
- Gastos acima da média
- Proximidade de limites de metas
- Oportunidades de economia

### Previsões
- Gastos futuros por categoria
- Projeções de saldo
- Análise de tendências

## 📊 Dashboard Features

### Estatísticas em Tempo Real
- Saldo total
- Receitas do mês
- Gastos do mês
- Taxa de economia

### Gráficos Interativos
- Receitas vs Gastos (6 meses)
- Gastos por Categoria (Pizza)
- Evolução temporal

### Insights com IA
- Análises automáticas
- Recomendações personalizadas
- Previsões de gastos
- Alertas proativos

### Relatórios Avançados
- **Exportação PDF/CSV** completa
- **Gráficos de tendência** mensais
- **Análise por categoria** detalhada
- **Comparativos** de períodos

### Extratos Detalhados
- **Extratos mensais** automáticos
- **Visualização** e impressão
- **Busca e filtros** avançados
- **Exportação** em múltiplos formatos

### Gestão de Metas
- **Criação** de metas personalizadas
- **Progresso visual** em tempo real
- **Alertas** de proximidade
- **Histórico** de metas concluídas

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
OPENAI_API_KEY=sua_chave_openai (opcional)
ADMIN_WHATSAPP=5511999999999 (para notificações)
PORT=3001
NODE_ENV=development
```

### Personalização
- Modifique categorias em `aiService.js`
- Ajuste horários de relatórios em `server/index.js`
- Customize mensagens do bot em `whatsappService.js`

## 🚀 Deploy

### Frontend (Vercel)
```bash
npm run build
# Deploy para Vercel
```

### Backend (Railway/Render)
```bash
# Configure as variáveis de ambiente
# Deploy do servidor Node.js
```

## 📈 Recursos do Bot 24h

### Sistema de Reconexão Automática
- ✅ Detecta desconexões automaticamente
- ✅ Tenta reconectar até 5 vezes
- ✅ Delay progressivo entre tentativas
- ✅ Logs detalhados de status

### Monitoramento de Saúde
- ✅ Verificação de status a cada 30 segundos
- ✅ Heartbeat a cada 1 minuto
- ✅ Endpoint `/health` para monitoramento
- ✅ Endpoint `/status` para estatísticas detalhadas

### Relatórios Automáticos
- ✅ Resumos diários às 9h da manhã
- ✅ Relatórios semanais aos domingos às 20h
- ✅ Verificação de saúde a cada 5 minutos

### Graceful Shutdown
- ✅ Encerramento seguro com SIGTERM/SIGINT
- ✅ Limpeza de recursos
- ✅ Tratamento de erros não capturados

## 📈 Próximas Funcionalidades

- [ ] App Mobile (React Native)
- [ ] Integração bancária (Open Finance)
- [ ] Módulo de investimentos
- [ ] Telegram Bot
- [ ] Dashboard administrativo
- [ ] Multi-idiomas
- [ ] Backup automático de dados
- [ ] Métricas avançadas de uso
- [ ] Integração com bancos digitais
- [ ] Análise de crédito pessoal

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@investbot.com
- 💬 WhatsApp: +55 11 99999-9999
- 🐛 Issues: [GitHub Issues](https://github.com/investbot/issues)

## 🔍 Monitoramento

### Health Check
```bash
curl http://localhost:3001/health
```

### Status Detalhado
```bash
curl http://localhost:3001/status
```

## 📋 Instalação do Bot WhatsApp

### Pré-requisitos
- Node.js 18+ instalado
- Chrome/Chromium instalado
- WhatsApp instalado no celular

### Passo a Passo

1. **Clone e instale dependências:**
```bash
git clone <repo>
cd investbot
npm install
```

2. **Configure o ambiente:**
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. **Inicie o servidor:**
```bash
npm run server
```

4. **Configure o WhatsApp:**
- Acesse: `http://localhost:3001/health`
- Vá para: `http://localhost:5173/whatsapp`
- Escaneie o QR Code
- Aguarde confirmação de conexão

5. **Teste o bot:**
- Envie "oi" para o número conectado
- O bot deve responder automaticamente

### Solução de Problemas

**Bot não conecta:**
- Verifique se o Chrome está instalado
- Limpe cache: `rm -rf whatsapp-session`
- Reinicie o servidor

**QR Code não aparece:**
- Aguarde até 30 segundos
- Atualize a página
- Verifique logs do servidor

**Bot fica offline:**
- Sistema reconecta automaticamente
- Verifique conexão com internet
- Monitore logs em tempo real

### Monitoramento 24h

O bot possui sistema completo de monitoramento:

- **Auto-reconexão** quando offline
- **Health checks** automáticos
- **Logs detalhados** de todas operações
- **Alertas** para administrador
- **Estatísticas** de uso em tempo real

---

**InvestBot** - Seu assistente financeiro inteligente disponível 24 horas por dia! 🚀💰🤖