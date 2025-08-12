import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Printer
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useData } from '../../contexts/DataContext';

export const StatementsPage: React.FC = () => {
  const { transactions, getTransactionsByPeriod } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getPeriodTransactions = () => {
    const now = new Date();
    let startDate: Date, endDate: Date;

    switch (selectedPeriod) {
      case 'current-month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'last-3-months':
        startDate = startOfMonth(subMonths(now, 2));
        endDate = endOfMonth(now);
        break;
      case 'last-6-months':
        startDate = startOfMonth(subMonths(now, 5));
        endDate = endOfMonth(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    return getTransactionsByPeriod(startDate, endDate);
  };

  const periodTransactions = getPeriodTransactions();
  
  const filteredTransactions = periodTransactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Generate monthly statements
  const generateMonthlyStatements = () => {
    const statements = [];
    for (let i = 0; i < 12; i++) {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthTransactions = getTransactionsByPeriod(monthStart, monthEnd);
      
      if (monthTransactions.length > 0) {
        const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        statements.push({
          id: format(month, 'yyyy-MM'),
          period: format(month, 'MMMM yyyy', { locale: ptBR }),
          startDate: monthStart,
          endDate: monthEnd,
          transactions: monthTransactions,
          totalIncome: income,
          totalExpenses: expenses,
          netBalance: income - expenses,
          transactionCount: monthTransactions.length
        });
      }
    }
    return statements;
  };

  const monthlyStatements = generateMonthlyStatements();

  const exportStatement = (statement: any) => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor'];
    const csvData = [
      headers.join(','),
      ...statement.transactions.map((t: any) => [
        format(new Date(t.date), 'dd/MM/yyyy'),
        t.type === 'income' ? 'Receita' : 'Despesa',
        `"${t.description}"`,
        t.category,
        t.amount.toFixed(2).replace('.', ',')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extrato-${statement.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printStatement = (statement: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Extrato Financeiro - ${statement.period}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .summary { display: flex; justify-content: space-around; margin-bottom: 30px; background: #f5f5f5; padding: 20px; }
              .summary-item { text-align: center; }
              .summary-item h3 { margin: 0; color: #333; }
              .summary-item p { margin: 5px 0; font-size: 18px; font-weight: bold; }
              .income { color: #10B981; }
              .expense { color: #EF4444; }
              .balance { color: ${statement.netBalance >= 0 ? '#10B981' : '#EF4444'}; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .text-right { text-align: right; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Extrato Financeiro</h1>
              <h2>${statement.period}</h2>
              <p>Período: ${format(statement.startDate, 'dd/MM/yyyy')} - ${format(statement.endDate, 'dd/MM/yyyy')}</p>
            </div>
            
            <div class="summary">
              <div class="summary-item">
                <h3>Total de Receitas</h3>
                <p class="income">${formatCurrency(statement.totalIncome)}</p>
              </div>
              <div class="summary-item">
                <h3>Total de Despesas</h3>
                <p class="expense">${formatCurrency(statement.totalExpenses)}</p>
              </div>
              <div class="summary-item">
                <h3>Saldo Líquido</h3>
                <p class="balance">${formatCurrency(statement.netBalance)}</p>
              </div>
            </div>

            <h2>Transações Detalhadas (${statement.transactionCount} transações)</h2>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${statement.transactions.map((t: any) => `
                  <tr>
                    <td>${format(new Date(t.date), 'dd/MM/yyyy')}</td>
                    <td>${t.type === 'income' ? 'Receita' : 'Despesa'}</td>
                    <td>${t.description}</td>
                    <td>${t.category}</td>
                    <td class="text-right ${t.type === 'income' ? 'income' : 'expense'}">${formatCurrency(t.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Extrato gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
              <p>InvestBot - Seu assistente financeiro inteligente</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const viewStatement = (statement: any) => {
    setSelectedStatement(statement);
    setShowStatementModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Extratos Financeiros</h1>
          <p className="text-gray-600">
            Visualize e exporte seus extratos mensais
          </p>
        </div>
      </div>

      {/* Monthly Statements */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Extratos Mensais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyStatements.map((statement) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText size={20} className="text-blue-600" />
                  <h4 className="font-medium text-gray-900">{statement.period}</h4>
                </div>
                <span className="text-xs text-gray-500">
                  {statement.transactionCount} transações
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="text-green-600 font-medium">
                    {formatCurrency(statement.totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="text-red-600 font-medium">
                    {formatCurrency(statement.totalExpenses)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span className="text-gray-900">Saldo:</span>
                  <span className={statement.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(statement.netBalance)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewStatement(statement)}
                  className="flex-1"
                >
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printStatement(statement)}
                  className="flex-1"
                >
                  <Printer size={14} className="mr-1" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportStatement(statement)}
                  className="flex-1"
                >
                  <Download size={14} className="mr-1" />
                  CSV
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {monthlyStatements.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum extrato disponível</p>
            <p className="text-sm text-gray-400 mt-2">
              Comece registrando suas transações para gerar extratos
            </p>
          </div>
        )}
      </Card>

      {/* Current Period Filter */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Visualizar Período Específico</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current-month">Mês Atual</option>
              <option value="last-month">Mês Passado</option>
              <option value="last-3-months">Últimos 3 Meses</option>
              <option value="last-6-months">Últimos 6 Meses</option>
            </select>
          </div>

          <Input
            type="text"
            label="Buscar"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => exportStatement({
                id: 'current-period',
                period: 'Período Selecionado',
                transactions: filteredTransactions,
                totalIncome,
                totalExpenses,
                netBalance
              })}
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Receitas</p>
                <p className="text-xl font-bold text-green-800">{formatCurrency(totalIncome)}</p>
              </div>
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Despesas</p>
                <p className="text-xl font-bold text-red-800">{formatCurrency(totalExpenses)}</p>
              </div>
              <ArrowDownLeft className="text-red-600" size={24} />
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${netBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>Saldo Líquido</p>
                <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {formatCurrency(netBalance)}
                </p>
              </div>
              <div className={`p-1 rounded ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netBalance >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.slice(0, 10).map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {format(new Date(transaction.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{transaction.category}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Mostrando 10 de {filteredTransactions.length} transações
            </p>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma transação encontrada para o período selecionado</p>
          </div>
        )}
      </Card>

      {/* Statement Detail Modal */}
      {selectedStatement && (
        <Modal
          isOpen={showStatementModal}
          onClose={() => {
            setShowStatementModal(false);
            setSelectedStatement(null);
          }}
          title={`Extrato - ${selectedStatement.period}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">Receitas</p>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(selectedStatement.totalIncome)}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">Despesas</p>
                <p className="text-lg font-bold text-red-800">
                  {formatCurrency(selectedStatement.totalExpenses)}
                </p>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                selectedStatement.netBalance >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm ${
                  selectedStatement.netBalance >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  Saldo Líquido
                </p>
                <p className={`text-lg font-bold ${
                  selectedStatement.netBalance >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  {formatCurrency(selectedStatement.netBalance)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => printStatement(selectedStatement)}
                className="flex-1"
              >
                <Printer size={16} className="mr-2" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={() => exportStatement(selectedStatement)}
                className="flex-1"
              >
                <Download size={16} className="mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Transactions */}
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedStatement.transactions.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {format(new Date(transaction.date), 'dd/MM')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{transaction.category}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};