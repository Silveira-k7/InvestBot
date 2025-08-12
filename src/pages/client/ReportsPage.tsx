import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

export const ReportsPage: React.FC = () => {
  const { transactions, getTransactionsByPeriod } = useData();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'custom'>('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getReportData = () => {
    let startDate: Date, endDate: Date;
    
    switch (reportType) {
      case 'yearly':
        startDate = startOfYear(new Date());
        endDate = endOfYear(new Date());
        break;
      case 'custom':
        startDate = new Date(dateRange.start);
        endDate = new Date(dateRange.end);
        break;
      default:
        startDate = new Date(dateRange.start);
        endDate = new Date(dateRange.end);
    }

    return getTransactionsByPeriod(startDate, endDate);
  };

  const reportTransactions = getReportData();
  const totalIncome = reportTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = reportTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Category breakdown
  const categoryData = reportTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / totalExpenses) * 100).toFixed(1)
  }));

  // Monthly trend data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(new Date(), i);
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthTransactions = getTransactionsByPeriod(monthStart, monthEnd);
    
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    monthlyData.push({
      month: format(month, 'MMM/yy', { locale: ptBR }),
      receitas: income,
      gastos: expenses,
      saldo: income - expenses
    });
  }

  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor'];
    const csvData = [
      headers.join(','),
      ...reportTransactions.map(t => [
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
    link.setAttribute('download', `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Simple PDF export using window.print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório Financeiro - ${format(new Date(), 'dd/MM/yyyy')}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
              .summary-item { text-align: center; }
              .summary-item h3 { margin: 0; color: #333; }
              .summary-item p { margin: 5px 0; font-size: 18px; font-weight: bold; }
              .income { color: #10B981; }
              .expense { color: #EF4444; }
              .balance { color: ${netBalance >= 0 ? '#10B981' : '#EF4444'}; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .text-right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório Financeiro</h1>
              <p>Período: ${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}</p>
            </div>
            
            <div class="summary">
              <div class="summary-item">
                <h3>Total de Receitas</h3>
                <p class="income">${formatCurrency(totalIncome)}</p>
              </div>
              <div class="summary-item">
                <h3>Total de Despesas</h3>
                <p class="expense">${formatCurrency(totalExpenses)}</p>
              </div>
              <div class="summary-item">
                <h3>Saldo Líquido</h3>
                <p class="balance">${formatCurrency(netBalance)}</p>
              </div>
            </div>

            <h2>Transações Detalhadas</h2>
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
                ${reportTransactions.map(t => `
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
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Relatórios Financeiros</h1>
          <p className="text-gray-600">
            Análise detalhada das suas finanças
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={exportToCSV}>
            <Download size={18} className="mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download size={18} className="mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">Mensal</option>
              <option value="yearly">Anual</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {reportType === 'custom' && (
            <>
              <Input
                type="date"
                label="Data Inicial"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <Input
                type="date"
                label="Data Final"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </>
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown size={24} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo Líquido</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netBalance)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign size={24} className={netBalance >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendência Mensal</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="receitas" stroke="#10B981" name="Receitas" strokeWidth={2} />
                <Line type="monotone" dataKey="gastos" stroke="#EF4444" name="Gastos" strokeWidth={2} />
                <Line type="monotone" dataKey="saldo" stroke="#3B82F6" name="Saldo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gastos por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Transactions Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transações Detalhadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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

        {reportTransactions.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhuma transação encontrada para o período selecionado</p>
          </div>
        )}
      </Card>
    </div>
  );
};