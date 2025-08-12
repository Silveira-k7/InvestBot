import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  RefreshCw,
  X
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAI } from '../../contexts/AIContext';

export const AIInsightsPanel: React.FC = () => {
  const { 
    insights, 
    alerts, 
    spendingAnalysis, 
    financialAdvice, 
    isAnalyzing, 
    refreshAnalysis,
    dismissAlert 
  } = useAI();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'insight': return Brain;
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertTriangle;
      case 'prediction': return TrendingUp;
      default: return Brain;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-red-200 bg-red-50 text-red-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'success': return 'border-green-200 bg-green-50 text-green-800';
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Insights com IA</h2>
            <p className="text-gray-600">Análises inteligentes das suas finanças</p>
          </div>
        </div>
        <Button
          onClick={refreshAnalysis}
          variant="outline"
          size="sm"
          isLoading={isAnalyzing}
        >
          <RefreshCw size={16} className="mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-2 text-amber-600" />
            Alertas Inteligentes
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} relative`}
              >
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-black hover:bg-opacity-10 rounded"
                >
                  <X size={14} />
                </button>
                <h4 className="font-medium mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
                {alert.actionRequired && (
                  <div className="mt-2">
                    <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                      Ação Necessária
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Financial Advice */}
      {financialAdvice && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb size={20} className="mr-2 text-yellow-600" />
            Conselho Financeiro Personalizado
          </h3>
          <div className={`p-4 rounded-lg border ${getPriorityColor(financialAdvice.priority)}`}>
            <p className="text-gray-800 mb-4">{financialAdvice.advice}</p>
            {financialAdvice.actionItems.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ações Recomendadas:</h4>
                <ul className="space-y-1">
                  {financialAdvice.actionItems.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <Target size={12} className="mr-2 mt-1 text-gray-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Spending Analysis */}
      {spendingAnalysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-blue-600" />
            Análise de Gastos
          </h3>
          
          {/* Risk Level */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Nível de Risco</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                spendingAnalysis.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                spendingAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {spendingAnalysis.riskLevel === 'high' ? 'Alto' :
                 spendingAnalysis.riskLevel === 'medium' ? 'Médio' : 'Baixo'}
              </span>
            </div>
          </div>

          {/* Insights */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Insights:</h4>
            <ul className="space-y-2">
              {spendingAnalysis.insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <Brain size={12} className="mr-2 mt-1 text-purple-500 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recomendações:</h4>
            <ul className="space-y-2">
              {spendingAnalysis.recommendations.slice(0, 3).map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <Lightbulb size={12} className="mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Recentes</h3>
          <div className="space-y-4">
            {insights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent size={20} className="text-gray-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700">{insight.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {insight.category} • {insight.createdAt.toLocaleDateString('pt-BR')}
                        </span>
                        {insight.actionRequired && (
                          <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                            Ação Necessária
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-600">Analisando seus dados financeiros...</span>
          </div>
        </Card>
      )}
    </div>
  );
};