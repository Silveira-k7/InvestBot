import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  MessageSquare,
  Activity,
  Calendar,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AdminAnalytics: React.FC = () => {
  // Mock analytics data
  const userGrowthData = [
    { month: 'Jan', users: 100, transactions: 450 },
    { month: 'Fev', users: 180, transactions: 820 },
    { month: 'Mar', users: 320, transactions: 1200 },
    { month: 'Abr', users: 450, transactions: 1800 },
    { month: 'Mai', users: 680, transactions: 2400 },
    { month: 'Jun', users: 890, transactions: 3200 },
    { month: 'Jul', users: 1234, transactions: 4500 }
  ];

  const categoryData = [
    { name: 'Alimentação', value: 35, color: '#3B82F6' },
    { name: 'Transporte', value: 20, color: '#10B981' },
    { name: 'Moradia', value: 25, color: '#F59E0B' },
    { name: 'Lazer', value: 12, color: '#EF4444' },
    { name: 'Outros', value: 8, color: '#8B5CF6' }
  ];

  const whatsappData = [
    { day: 'Seg', messages: 1200, users: 89 },
    { day: 'Ter', messages: 1800, users: 95 },
    { day: 'Qua', messages: 1600, users: 87 },
    { day: 'Qui', messages: 2100, users: 102 },
    { day: 'Sex', messages: 2400, users: 115 },
    { day: 'Sáb', messages: 1900, users: 98 },
    { day: 'Dom', messages: 1500, users: 78 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Fev', revenue: 18900 },
    { month: 'Mar', revenue: 25600 },
    { month: 'Abr', revenue: 32100 },
    { month: 'Mai', revenue: 41200 },
    { month: 'Jun', revenue: 48900 }
  ];

  const kpis = [
    {
      title: 'Usuários Ativos',
      value: '1,234',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Transações/Mês',
      value: '4,567',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Mensagens WhatsApp',
      value: '12,890',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Taxa de Retenção',
      value: '85.4%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Relatórios</h1>
          <p className="text-gray-600">
            Análise detalhada de performance e métricas do sistema
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Calendar size={18} className="mr-2" />
            Período
          </Button>
          <Button>
            <Download size={18} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className={`text-sm mt-1 ${
                    kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <kpi.icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crescimento de Usuários</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Usuários" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Transaction Volume */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Volume de Transações</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* WhatsApp Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividade WhatsApp (7 dias)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={whatsappData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#8B5CF6" name="Mensagens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Receita Mensal</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resumo Mensal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Novos Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mensagens
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Receita
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userGrowthData.slice(-6).map((data, index) => (
                <motion.tr
                  key={data.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.transactions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.transactions * 2.8).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(revenueData[index]?.revenue || 0)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};