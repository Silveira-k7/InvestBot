import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../contexts/DataContext';

export const RecentTransactions: React.FC = () => {
  const { transactions } = useData();
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' 
                  ? <ArrowUpRight size={16} />
                  : <ArrowDownLeft size={16} />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(transaction.date), 'dd MMM', { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {recentTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma transação encontrada</p>
        </div>
      )}
    </Card>
  );
};