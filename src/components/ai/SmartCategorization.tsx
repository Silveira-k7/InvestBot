import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAI } from '../../contexts/AIContext';

interface SmartCategorizationProps {
  description: string;
  amount: number;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export const SmartCategorization: React.FC<SmartCategorizationProps> = ({
  description,
  amount,
  currentCategory,
  onCategoryChange
}) => {
  const { categorizeTransaction } = useAI();
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      const suggested = await categorizeTransaction(description, amount);
      if (suggested !== currentCategory) {
        setSuggestedCategory(suggested);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error('Error getting category suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestedCategory) {
      onCategoryChange(suggestedCategory);
      setShowSuggestion(false);
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setSuggestedCategory(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Categoria Inteligente</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGetSuggestion}
          isLoading={isLoading}
          className="text-purple-600 hover:text-purple-700"
        >
          <Sparkles size={14} className="mr-1" />
          Sugerir
        </Button>
      </div>

      {showSuggestion && suggestedCategory && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">
                Sugestão da IA: <span className="font-bold">{suggestedCategory}</span>
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Baseado na descrição "{description}"
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAcceptSuggestion}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Aceitar sugestão"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleRejectSuggestion}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Rejeitar sugestão"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};