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
  WifiOff,
  Activity,
  Bot,
  Settings
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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

export const AdminWhatsApp: React.FC = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({ isReady: false, qrCode: null });
  const [users, setUsers] = useState<WhatsAppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendMessage, setSendMessage] = useState({ phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [botStats, setBotStats] = useState({
    totalMessages: 1234,
    activeUsers: 89,
    messagesLastHour: 45,
    uptime: '99.8%'
  });

  const API_BASE = 'http://localhost:3001/api/whatsapp';

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
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
      setConnectionError('Não foi possível conectar ao servidor WhatsApp');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendMessage),
      });

      if (response.ok) {
        setSendMessage({ phone: '', message: '' });
        alert('Mensagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  };

  const sendBroadcast = async () => {
    if (serverStatus === 'offline') return;
    
    const message = prompt('Digite a mensagem para enviar para todos os usuários:');
    if (!message) return;

    try {
      for (const user of users) {
        await fetch(`${API_BASE}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: user.phone, message }),
        });
      }
      alert(`Mensagem enviada para ${users.length} usuários!`);
    } catch (error) {
      console.error('Erro ao enviar broadcast:', error);
      alert('Erro ao enviar mensagens');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Bot - Administração</h1>
          <p className="text-gray-600">
            Gerencie o bot WhatsApp e monitore atividades
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={sendBroadcast} disabled={!status.isReady}>
            <Send size={18} className="mr-2" />
            Broadcast
          </Button>
          <Button variant="outline" onClick={checkServerStatus} isLoading={isLoading}>
            <RefreshCw size={18} className="mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Server Status Alert */}
      {serverStatus === 'offline' && (
        <Card className="p-6 mb-8 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <WifiOff size={24} className="text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Servidor WhatsApp Offline</h3>
              <p className="text-red-700 text-sm mt-1">
                {connectionError || 'O servidor do WhatsApp Bot não está rodando.'}
              </p>
              <div className="mt-3">
                <p className="text-sm text-red-600 mb-2">Para iniciar o servidor:</p>
                <code className="bg-red-100 px-2 py-1 rounded text-sm">npm run server</code>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Mensagens</p>
              <p className="text-2xl font-bold text-gray-900">{botStats.totalMessages.toLocaleString()}</p>
            </div>
            <MessageSquare size={24} className="text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{botStats.activeUsers}</p>
            </div>
            <Users size={24} className="text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mensagens/Hora</p>
              <p className="text-2xl font-bold text-gray-900">{botStats.messagesLastHour}</p>
            </div>
            <Activity size={24} className="text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{botStats.uptime}</p>
            </div>
            <CheckCircle size={24} className="text-orange-600" />
          </div>
        </Card>
      </div>

      {serverStatus === 'online' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bot Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Status do Bot</h3>
              <div className="flex items-center space-x-2">
                <Wifi size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Servidor Online</span>
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

              {!status.isReady && status.qrCode && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <QrCode size={20} className="text-blue-600" />
                    <span className="font-medium text-gray-900">QR Code para Conexão</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <img 
                      src={status.qrCode} 
                      alt="QR Code WhatsApp" 
                      className="mx-auto max-w-xs"
                    />
                  </div>
                </div>
              )}

              {status.isReady && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🤖 Bot Operacional</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✅ Recebendo mensagens</p>
                    <p>✅ Processando comandos</p>
                    <p>✅ Enviando respostas automáticas</p>
                    <p>✅ Sistema de reconexão ativo</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Send Message */}
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

          {/* Connected Users */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Usuários Conectados ({users.length})
              </h3>
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
                            onClick={() => setSendMessage(prev => ({ ...prev, phone: user.phone }))}
                            disabled={!status.isReady}
                          >
                            <Send size={14} className="mr-2" />
                            Mensagem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Nenhum usuário conectado ainda</p>
                <p className="text-sm text-gray-400">
                  Os usuários aparecerão aqui após se cadastrarem via WhatsApp
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};