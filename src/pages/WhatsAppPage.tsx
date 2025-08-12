import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Send, 
  QrCode, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Phone,
  Calendar,
  BarChart3,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface WhatsAppStatus {
  isReady: boolean;
  qrCode: string | null;
}

interface WhatsAppUser {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export const WhatsAppPage: React.FC = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({ isReady: false, qrCode: null });
  const [users, setUsers] = useState<WhatsAppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendMessage, setSendMessage] = useState({ phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const API_BASE = 'http://localhost:3001/api/whatsapp';

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setServerStatus('online');
        setConnectionError(null);
        await checkStatus();
        await loadUsers();
      } else {
        setServerStatus('offline');
        setConnectionError('Servidor não está respondendo');
      }
    } catch (error) {
      setServerStatus('offline');
      setConnectionError('Não foi possível conectar ao servidor. Certifique-se de que o servidor está rodando na porta 3001.');
      console.error('Erro ao verificar servidor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    if (serverStatus === 'offline') return;
    
    try {
      const response = await fetch(`${API_BASE}/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setConnectionError(null);
      } else {
        throw new Error('Falha na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setConnectionError('Erro ao verificar status do WhatsApp');
    }
  };

  const loadUsers = async () => {
    if (serverStatus === 'offline') return;
    
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendMessage.phone || !sendMessage.message || serverStatus === 'offline') return;

    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendMessage),
      });

      if (response.ok) {
        setSendMessage({ phone: '', message: '' });
        alert('Mensagem enviada com sucesso!');
      } else {
        throw new Error('Falha ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  };

  const sendReportToUser = async (userId: string) => {
    if (serverStatus === 'offline') return;
    
    try {
      const response = await fetch(`${API_BASE}/send-report/${userId}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Relatório enviado com sucesso!');
      } else {
        throw new Error('Falha ao enviar relatório');
      }
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      alert('Erro ao enviar relatório');
    }
  };

  const startWhatsAppBot = async () => {
    try {
      setIsLoading(true);
      // Tentar inicializar o bot
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        await checkStatus();
        setConnectionError(null);
      }
    } catch (error) {
      setConnectionError('Erro ao inicializar bot. Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-green-500 rounded-xl">
            <MessageSquare size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Bot 24h</h1>
            <p className="text-gray-600">
              Assistente financeiro inteligente via WhatsApp
            </p>
          </div>
        </div>
      </motion.div>

      {/* Server Status Alert */}
      {serverStatus === 'offline' && (
        <Card className="p-6 mb-8 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <WifiOff size={24} className="text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Servidor Offline</h3>
              <p className="text-red-700 text-sm mt-1">
                {connectionError || 'O servidor do WhatsApp Bot não está rodando.'}
              </p>
              <div className="mt-3">
                <p className="text-sm text-red-600 mb-2">Para iniciar o servidor:</p>
                <code className="bg-red-100 px-2 py-1 rounded text-sm">npm run server</code>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={checkServerStatus}
              isLoading={isLoading}
            >
              <RefreshCw size={16} className="mr-2" />
              Verificar
            </Button>
          </div>
        </Card>
      )}

      {serverStatus === 'online' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status do WhatsApp */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Status da Conexão</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Wifi size={16} className="text-green-500" />
                  <span className="text-sm text-green-600">Servidor Online</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkStatus}
                  isLoading={isLoading}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {status.isReady ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <XCircle size={20} className="text-red-500" />
                )}
                <span className={`font-medium ${
                  status.isReady ? 'text-green-700' : 'text-red-700'
                }`}>
                  {status.isReady ? 'WhatsApp Conectado ✅' : 'WhatsApp Desconectado ❌'}
                </span>
              </div>

              {!status.isReady && !status.qrCode && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle size={20} className="text-blue-600" />
                    <span className="font-medium text-blue-900">Inicializando WhatsApp Bot...</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    O bot está sendo inicializado. Aguarde alguns segundos para o QR Code aparecer.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startWhatsAppBot}
                    isLoading={isLoading}
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}

              {!status.isReady && status.qrCode && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <QrCode size={20} className="text-blue-600" />
                    <span className="font-medium text-gray-900">
                      Escaneie o QR Code com seu WhatsApp
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <img 
                      src={status.qrCode} 
                      alt="QR Code WhatsApp" 
                      className="mx-auto max-w-xs"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium mb-2">📱 Como conectar:</p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Abra o WhatsApp no seu celular</li>
                      <li>2. Toque em Menu (⋮) → Dispositivos conectados</li>
                      <li>3. Toque em "Conectar dispositivo"</li>
                      <li>4. Escaneie este QR Code</li>
                    </ol>
                  </div>
                </div>
              )}

              {status.isReady && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🎉 Bot Ativo 24h!</h4>
                  <p className="text-sm text-green-700 mb-3">
                    O assistente financeiro está funcionando e pronto para receber mensagens.
                  </p>
                  <div className="text-xs text-green-600">
                    <p>✅ Reconexão automática ativa</p>
                    <p>✅ Monitoramento 24/7</p>
                    <p>✅ Relatórios automáticos</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Enviar Mensagem Manual */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Enviar Mensagem</h3>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input
                type="tel"
                label="Número do WhatsApp"
                placeholder="5511999999999"
                value={sendMessage.phone}
                onChange={(e) => setSendMessage(prev => ({ ...prev, phone: e.target.value }))}
                leftIcon={<Phone size={20} />}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={sendMessage.message}
                  onChange={(e) => setSendMessage(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Digite sua mensagem..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSending}
                disabled={!status.isReady}
                className="w-full"
              >
                <Send size={16} className="mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </Card>

          {/* Usuários Conectados */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Usuários Conectados ({users.length})
                </h3>
              </div>
              <Button variant="outline" size="sm" onClick={loadUsers}>
                <RefreshCw size={16} className="mr-2" />
                Atualizar
              </Button>
            </div>

            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Telefone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cadastrado em
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-gray-600">+{user.phone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-gray-600">
                            <Calendar size={14} className="mr-2" />
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendReportToUser(user.id)}
                            disabled={!status.isReady}
                          >
                            <BarChart3 size={14} className="mr-2" />
                            Enviar Relatório
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Nenhum usuário conectado ainda</p>
                <p className="text-sm text-gray-400">
                  Os usuários aparecerão aqui após se cadastrarem via WhatsApp
                </p>
              </div>
            )}
          </Card>

          {/* Instruções */}
          <Card className="p-6 lg:col-span-2 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              📱 Como usar o WhatsApp Bot
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-3">Para Usuários:</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• "Quero me cadastrar" → Inicia cadastro</li>
                  <li>• "Gastei 50 reais com supermercado"</li>
                  <li>• "Recebi 1000 reais de salário"</li>
                  <li>• "Qual meu saldo?"</li>
                  <li>• "Me manda meu extrato"</li>
                  <li>• "Como posso economizar?"</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-3">Recursos Automáticos:</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Categorização automática de gastos</li>
                  <li>• Alertas de gastos altos</li>
                  <li>• Relatórios diários (9h)</li>
                  <li>• Resumos semanais (domingos 20h)</li>
                  <li>• Conselhos financeiros personalizados</li>
                  <li>• Análise de padrões de gastos</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Instruções de Instalação */}
      {serverStatus === 'offline' && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">
            🚀 Como iniciar o WhatsApp Bot
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">1. Abra um novo terminal:</h4>
              <code className="block bg-yellow-100 p-3 rounded text-sm">
                npm run server
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">2. Ou rode frontend e backend juntos:</h4>
              <code className="block bg-yellow-100 p-3 rounded text-sm">
                npm run start:dev
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">3. Aguarde a inicialização:</h4>
              <p className="text-sm text-yellow-700">
                O servidor irá inicializar na porta 3001 e o QR Code aparecerá automaticamente.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};