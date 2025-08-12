import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aiService } from '../services/aiService';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { 
  AIInsight, 
  SmartAlert, 
  SpendingAnalysis, 
  FinancialAdvice, 
  ExpensePrediction 
} from '../types';

interface AIContextType {
  insights: AIInsight[];
  alerts: SmartAlert[];
  spendingAnalysis: SpendingAnalysis | null;
  financialAdvice: FinancialAdvice | null;
  expensePrediction: ExpensePrediction | null;
  isAnalyzing: boolean;
  refreshAnalysis: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  categorizeTransaction: (description: string, amount: number) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { transactions, goals } = useData();
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [spendingAnalysis, setSpendingAnalysis] = useState<SpendingAnalysis | null>(null);
  const [financialAdvice, setFinancialAdvice] = useState<FinancialAdvice | null>(null);
  const [expensePrediction, setExpensePrediction] = useState<ExpensePrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const refreshAnalysis = async () => {
    if (!user || transactions.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Run all AI analyses in parallel
      const [
        spendingAnalysisResult,
        financialAdviceResult,
        expensePredictionResult,
        smartAlertsResult
      ] = await Promise.all([
        aiService.analyzeSpendingPatterns(transactions),
        aiService.generateFinancialAdvice(user, transactions, goals),
        aiService.predictFutureExpenses(transactions),
        aiService.generateSmartAlerts(transactions, goals)
      ]);

      setSpendingAnalysis(spendingAnalysisResult);
      setFinancialAdvice(financialAdviceResult);
      setExpensePrediction(expensePredictionResult);
      
      // Convert alerts to SmartAlert format
      const formattedAlerts: SmartAlert[] = smartAlertsResult.alerts.map(alert => ({
        ...alert,
        dismissed: false,
        createdAt: new Date()
      }));
      setAlerts(formattedAlerts);

      // Generate insights from analysis
      const newInsights: AIInsight[] = [
        {
          id: 'spending-analysis',
          type: 'insight',
          title: 'Análise de Gastos',
          description: spendingAnalysisResult.insights[0] || 'Análise de gastos concluída',
          priority: spendingAnalysisResult.riskLevel === 'high' ? 'high' : 'medium',
          category: 'spending',
          actionRequired: spendingAnalysisResult.riskLevel === 'high',
          createdAt: new Date()
        },
        {
          id: 'financial-advice',
          type: 'recommendation',
          title: 'Conselho Financeiro',
          description: financialAdviceResult.advice,
          priority: financialAdviceResult.priority,
          category: 'advice',
          actionRequired: financialAdviceResult.priority === 'high',
          createdAt: new Date()
        },
        {
          id: 'expense-prediction',
          type: 'prediction',
          title: 'Previsão de Gastos',
          description: `Previsão para próximo mês: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(expensePredictionResult.nextMonthPrediction)}`,
          priority: 'medium',
          category: 'prediction',
          actionRequired: false,
          createdAt: new Date()
        }
      ];

      setInsights(newInsights);
    } catch (error) {
      console.error('Error during AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const categorizeTransaction = async (description: string, amount: number): Promise<string> => {
    try {
      return await aiService.categorizeTransaction(description, amount);
    } catch (error) {
      console.error('Error categorizing transaction:', error);
      return 'Outros';
    }
  };

  // Refresh analysis when transactions or goals change
  useEffect(() => {
    if (user && transactions.length > 0) {
      refreshAnalysis();
    }
  }, [user, transactions.length, goals.length]);

  return (
    <AIContext.Provider value={{
      insights,
      alerts: alerts.filter(alert => !alert.dismissed),
      spendingAnalysis,
      financialAdvice,
      expensePrediction,
      isAnalyzing,
      refreshAnalysis,
      dismissAlert,
      categorizeTransaction
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};