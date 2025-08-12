import React, { useState } from 'react';
import { Plus, Minus, Download } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SmartCategorization } from '../ai/SmartCategorization';
import { useData } from '../../contexts/DataContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INCOME_CATEGORIES = [
  'Salário',
  'Freelancer',
  'Investimentos',
  'Renda Extra',
  'Vendas',
  'Outros'
];

const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Contas',
  'Outros'
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { addTransaction } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date)
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const importFromCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          // Expected format: Date,Type,Description,Category,Amount
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 5) {
              const [dateStr, typeStr, desc, cat, amountStr] = values;
              
              if (dateStr && typeStr && desc && cat && amountStr) {
                addTransaction({
                  type: typeStr.toLowerCase().includes('receita') || typeStr.toLowerCase().includes('income') ? 'income' : 'expense',
                  amount: parseFloat(amountStr.replace(',', '.')),
                  description: desc.replace(/"/g, ''),
                  category: cat,
                  date: new Date(dateStr.split('/').reverse().join('-'))
                });
              }
            }
          }
          
          alert(`${lines.length - 1} transações importadas com sucesso!`);
          onClose();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Import Option */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={importFromCSV}
          >
            <Download size={16} className="mr-2" />
            Importar CSV
          </Button>
        </div>

        {/* Type Selection */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={type === 'income' ? 'primary' : 'outline'}
            onClick={() => setType('income')}
            className="flex-1"
          >
            <Plus size={16} className="mr-2" />
            Receita
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'primary' : 'outline'}
            onClick={() => setType('expense')}
            className="flex-1"
          >
            <Minus size={16} className="mr-2" />
            Despesa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            step="0.01"
            min="0"
            required
          />

          <Input
            type="date"
            label="Data"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <Input
          type="text"
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Supermercado, Salário, etc."
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Smart Categorization */}
        {description && amount && type === 'expense' && (
          <SmartCategorization
            description={description}
            amount={parseFloat(amount) || 0}
            currentCategory={category}
            onCategoryChange={setCategory}
          />
        )}

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};