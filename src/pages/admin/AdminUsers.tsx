import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Activity,
  Ban,
  CheckCircle,
  Eye
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock users data
  const users = [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '+55 11 99999-1111',
      status: 'active',
      createdAt: '2024-01-15',
      lastActivity: '2024-01-20',
      transactions: 45,
      balance: 2500.00
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '+55 11 99999-2222',
      status: 'active',
      createdAt: '2024-01-10',
      lastActivity: '2024-01-19',
      transactions: 32,
      balance: 1800.00
    },
    {
      id: '3',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '+55 11 99999-3333',
      status: 'inactive',
      createdAt: '2024-01-05',
      lastActivity: '2024-01-15',
      transactions: 12,
      balance: 500.00
    },
    {
      id: '4',
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      phone: '+55 11 99999-4444',
      status: 'active',
      createdAt: '2024-01-20',
      lastActivity: '2024-01-20',
      transactions: 8,
      balance: 3200.00
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const stats = [
    { label: 'Total de Usuários', value: users.length, icon: Users },
    { label: 'Usuários Ativos', value: users.filter(u => u.status === 'active').length, icon: CheckCircle },
    { label: 'Novos este mês', value: 12, icon: UserPlus },
    { label: 'Taxa de Retenção', value: '85%', icon: Activity }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
        <Button>
          <UserPlus size={18} className="mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon size={24} className="text-blue-600" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={20} />}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'primary' : 'outline'}
              onClick={() => setFilterStatus('active')}
              size="sm"
            >
              Ativos
            </Button>
            <Button
              variant={filterStatus === 'inactive' ? 'primary' : 'outline'}
              onClick={() => setFilterStatus('inactive')}
              size="sm"
            >
              Inativos
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financeiro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        Criado: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Activity size={14} className="mr-2 text-gray-400" />
                        Último acesso: {new Date(user.lastActivity).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(user.balance)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.transactions} transações
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye size={14} className="mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};