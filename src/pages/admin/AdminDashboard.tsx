import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  DollarSign,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminDashboard: React.FC = () => {
  // Mock data for admin dashboard
  const stats = [
    {
      title: 'Usuários Ativos',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Mensagens WhatsApp',
      value: '45,678',
      change: '+8%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: 'Transações Processadas',
      value: '89,012',
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Uptime do Sistema',
      value: '99.9%',
      change: 'Estável',
      changeType: 'neutral' as const,
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Fev', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Abr', users: 1000 },
    { month: 'Mai', users: 1200 },
    { month: 'Jun', users: 1234 }
  ];

  const messageData = [
    { day: 'Seg', messages: 1200 },
    { day: 'Ter', messages: 1800 },
    { day: 'Qua', messages: 1600 },
    { day: 'Qui', messages: 2100 },
    { day: 'Sex', messages: 2400 },
    { day: 'Sáb', messages: 1900 },
    { day: 'Dom', messages: 1500 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_signup',
      message: 'Novo usuário cadastrado: Maria Silva',
      time: '2 min atrás',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'whatsapp_message',
      message: 'Bot processou 150 mensagens na última hora',
      time: '5 min atrás',
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'system_alert',
      message: 'Sistema de backup executado com sucesso',
      time: '10 min atrás',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'transaction',
      message: '1,234 transações processadas hoje',
      time: '15 min atrás',
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  const systemHealth = [
    { service: 'API Principal', status: 'online', uptime: '99.9%' },
    { service: 'WhatsApp Bot', status: 'online', uptime: '99.8%' },
    { service: 'Banco de Dados', status: 'online', uptime: '100%' },
    { service: 'Sistema de IA', status: 'online', uptime: '99.7%' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">
          Visão geral do sistema InvestBot e estatísticas em tempo real
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crescimento de Usuários</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Messages Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mensagens WhatsApp (7 dias)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <activity.icon size={16} className={activity.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Saúde do Sistema</h3>
          <div className="space-y-4">
            {systemHealth.map((service) => (
              <div key={service.service} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{service.service}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    service.status === 'online' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {service.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                  <p className="text-xs text-gray-500">{service.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};