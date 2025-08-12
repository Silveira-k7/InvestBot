import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { useAI } from '../../contexts/AIContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const ExpensePredictionChart: React.FC = () => {
  const { expensePrediction } = useAI();

  if (!expensePrediction) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Previsão de Gastos</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Dados insuficientes para previsão</p>
        </div>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const chartData = expensePrediction.categoryPredictions.map(pred => ({
    category: pred.category,
    predicted: pred.predicted,
    confidence: pred.confidence * 100
  }));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-red-500" />;
      case 'down': return <TrendingDown size={16} className="text-green-500" />;
      default: return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600 bg-red-50';
      case 'down': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Previsão de Gastos com IA</h3>
      
      {/* Next Month Prediction */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Previsão para Próximo Mês</h4>
        <p className="text-2xl font-bold text-blue-800">
          {formatCurrency(expensePrediction.nextMonthPrediction)}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Baseado nos seus padrões de gastos atuais
        </p>
      </div>

      {/* Category Predictions Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Previsão por Categoria</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Previsão']}
                labelFormatter={(label) => `Categoria: ${label}`}
              />
              <Bar dataKey="predicted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trends */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Tendências por Categoria</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {expensePrediction.trends.map((trend) => (
            <div
              key={trend.category}
              className={`p-3 rounded-lg border ${getTrendColor(trend.trend)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{trend.category}</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(trend.trend)}
                  <span className="text-sm font-medium">
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Levels */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Nível de Confiança das Previsões</h4>
        <div className="space-y-2">
          {expensePrediction.categoryPredictions.map((pred) => (
            <div key={pred.category} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{pred.category}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pred.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-10">
                  {(pred.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};