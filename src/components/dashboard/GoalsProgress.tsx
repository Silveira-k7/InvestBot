import React from 'react';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const GoalsProgress: React.FC = () => {
  const { goals } = useData();
  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progresso das Metas</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-6">
        {activeGoals.map((goal) => {
          const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
          const isExpenseLimit = goal.category === 'expense-limit';
          
          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(goal.deadline), 'dd MMM yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {isExpenseLimit && progress > 80 && (
                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <TrendingUp size={14} />
                  <span className="text-sm">Atenção: Próximo do limite!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeGoals.length === 0 && (
        <div className="text-center py-8">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma meta ativa</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Criar primeira meta
          </button>
        </div>
      )}
    </Card>
  );
};