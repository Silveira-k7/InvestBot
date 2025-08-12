import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp } from 'lucide-react';
import { AIInsightsPanel } from '../../components/ai/AIInsightsPanel';
import { ExpensePredictionChart } from '../../components/ai/ExpensePredictionChart';

export const AIInsightsPage: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Brain size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insights com IA</h1>
            <p className="text-gray-600">
              Análises inteligentes e recomendações personalizadas para suas finanças
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Sparkles size={20} className="text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Análise Inteligente</h3>
                <p className="text-sm text-gray-600">Padrões de gastos e insights automáticos</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp size={20} className="text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Previsões</h3>
                <p className="text-sm text-gray-600">Projeções de gastos futuros</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Brain size={20} className="text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Recomendações</h3>
                <p className="text-sm text-gray-600">Conselhos personalizados</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* AI Insights Panel */}
        <motion.div variants={item} className="lg:col-span-2">
          <AIInsightsPanel />
        </motion.div>

        {/* Expense Prediction Chart */}
        <motion.div variants={item} className="lg:col-span-1">
          <ExpensePredictionChart />
        </motion.div>
      </motion.div>
    </div>
  );
};