import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Pause,
  Edit,
  Trash2,
  DollarSign,
  Minus,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showUpdateAmount, setShowUpdateAmount] = useState<string | null>(null);
  const [updateAmountValue, setUpdateAmountValue] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'savings' as 'savings' | 'expense-limit' | 'investment' | 'other'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={20} />;
      case 'paused': return <Pause className="text-yellow-500" size={20} />;
      default: return <Clock className="text-blue-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return <DollarSign className="text-green-500" size={16} />;
      case 'expense-limit': return <TrendingUp className="text-red-500" size={16} />;
      case 'investment': return <Target className="text-blue-500" size={16} />;
      default: return <Target className="text-gray-500" size={16} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: new Date(formData.deadline),
      category: formData.category,
      status: 'active' as const
    };

    if (editingGoal) {
      updateGoal(editingGoal, goalData);
      setEditingGoal(null);
    } else {
      addGoal(goalData);
    }

    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      deadline: '',
      category: 'savings'
    });
    setShowAddGoal(false);
  };

  const handleEdit = (goal: any) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      deadline: format(new Date(goal.deadline), 'yyyy-MM-dd'),
      category: goal.category
    });
    setEditingGoal(goal.id);
    setShowAddGoal(true);
  };

  const handleStatusChange = (goalId: string, newStatus: string) => {
    updateGoal(goalId, { status: newStatus });
  };

  const handleUpdateAmount = (goalId: string, operation: 'add' | 'subtract') => {
    const amount = parseFloat(updateAmountValue);
    if (!amount || amount <= 0) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    let newAmount = goal.currentAmount;
    
    if (operation === 'add') {
      newAmount += amount;
    } else {
      newAmount = Math.max(0, newAmount - amount);
    }

    // Se for meta de limite de gastos, adicionar significa gastar mais
    if (goal.category === 'expense-limit') {
      if (operation === 'add') {
        newAmount = goal.currentAmount + amount;
      } else {
        newAmount = Math.max(0, goal.currentAmount - amount);
      }
    }

    updateGoal(goalId, { currentAmount: newAmount });
    setUpdateAmountValue('');
    setShowUpdateAmount(null);
  };

  const openUpdateAmount = (goalId: string) => {
    setShowUpdateAmount(goalId);
    setUpdateAmountValue('');
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const pausedGoals = goals.filter(g => g.status === 'paused');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Metas Financeiras</h1>
          <p className="text-gray-600">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus size={18} className="mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Metas</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <Target className="text-blue-500" size={24} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ativas</p>
              <p className="text-2xl font-bold text-blue-600">{activeGoals.length}</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pausadas</p>
              <p className="text-2xl font-bold text-yellow-600">{pausedGoals.length}</p>
            </div>
            <Pause className="text-yellow-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
          const isOverdue = new Date(goal.deadline) < new Date() && goal.status === 'active';
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(goal.category)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                      {getStatusIcon(goal.status)}
                      <span className="ml-1 capitalize">{goal.status === 'active' ? 'Ativa' : goal.status === 'completed' ? 'Concluída' : 'Pausada'}</span>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        goal.status === 'completed' ? 'bg-green-500' :
                        progress > 75 ? 'bg-blue-500' :
                        progress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                      <Calendar size={14} className="mr-1" />
                      {format(new Date(goal.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                      {isOverdue && ' (Vencida)'}
                    </span>
                  </div>

                  {/* Update Amount Section */}
                  {goal.status === 'active' && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {goal.category === 'expense-limit' ? 'Registrar Gasto' : 'Atualizar Valor'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUpdateAmount(goal.id)}
                        >
                          <DollarSign size={14} className="mr-1" />
                          Atualizar
                        </Button>
                      </div>

                      {showUpdateAmount === goal.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <Input
                            type="number"
                            placeholder="Valor"
                            value={updateAmountValue}
                            onChange={(e) => setUpdateAmountValue(e.target.value)}
                            step="0.01"
                            min="0"
                          />
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateAmount(goal.id, 'add')}
                              className="flex-1"
                            >
                              <PlusCircle size={14} className="mr-1" />
                              {goal.category === 'expense-limit' ? 'Gastar' : 'Adicionar'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateAmount(goal.id, 'subtract')}
                              className="flex-1"
                            >
                              <MinusCircle size={14} className="mr-1" />
                              {goal.category === 'expense-limit' ? 'Remover' : 'Retirar'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowUpdateAmount(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {goal.status === 'active' && showUpdateAmount !== goal.id && (
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(goal.id, 'paused')}
                        className="flex-1"
                      >
                        <Pause size={14} className="mr-1" />
                        Pausar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(goal.id, 'completed')}
                        className="flex-1"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Concluir
                      </Button>
                    </div>
                  )}

                  {goal.status === 'paused' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(goal.id, 'active')}
                      className="w-full"
                    >
                      <Clock size={14} className="mr-1" />
                      Reativar
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="p-12 text-center">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta criada</h3>
          <p className="text-gray-600 mb-6">
            Comece definindo suas metas financeiras para acompanhar seu progresso
          </p>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus size={18} className="mr-2" />
            Criar Primeira Meta
          </Button>
        </Card>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={showAddGoal}
        onClose={() => {
          setShowAddGoal(false);
          setEditingGoal(null);
          setFormData({
            title: '',
            description: '',
            targetAmount: '',
            deadline: '',
            category: 'savings'
          });
        }}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Título da Meta"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Reserva de Emergência"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Descreva sua meta..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Valor Alvo"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              placeholder="0,00"
              step="0.01"
              min="0"
              required
            />

            <Input
              type="date"
              label="Data Limite"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="savings">Poupança</option>
              <option value="expense-limit">Limite de Gastos</option>
              <option value="investment">Investimento</option>
              <option value="other">Outros</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddGoal(false);
                setEditingGoal(null);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingGoal ? 'Atualizar' : 'Criar'} Meta
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};