import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Plus
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { GoalsProgress } from '../components/dashboard/GoalsProgress';
import { Button } from '../components/ui/Button';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export const DashboardPage: React.FC = () => {
  const { stats } = useData();
  const { user } = useAuth();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das suas finanças hoje
          </p>
        </div>
        <Button
          onClick={() => setShowAddTransaction(true)}
          className="mt-4 sm:mt-0"
        >
          <Plus size={18} className="mr-2" />
          Nova Transação
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Stats Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Saldo Total"
            value={formatCurrency(stats.totalBalance)}
            change={stats.totalBalance > 0 ? "+12.5% este mês" : undefined}
            changeType={stats.totalBalance > 0 ? "positive" : "neutral"}
            icon={Wallet}
            iconColor="bg-blue-500"
          />
          
          <StatsCard
            title="Receitas do Mês"
            value={formatCurrency(stats.monthlyIncome)}
            change="+8.2% vs mês anterior"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-green-500"
          />
          
          <StatsCard
            title="Gastos do Mês"
            value={formatCurrency(stats.monthlyExpenses)}
            change="-3.1% vs mês anterior"
            changeType="positive"
            icon={TrendingDown}
            iconColor="bg-red-500"
          />
          
          <StatsCard
            title="Taxa de Economia"
            value={`${stats.savingsRate.toFixed(1)}%`}
            change={stats.savingsRate > 20 ? "Meta alcançada!" : "Abaixo da meta"}
            changeType={stats.savingsRate > 20 ? "positive" : "negative"}
            icon={PiggyBank}
            iconColor="bg-purple-500"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={item}>
            <IncomeExpenseChart />
          </motion.div>
          <motion.div variants={item}>
            <ExpenseChart />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={item}>
            <RecentTransactions />
          </motion.div>
          <motion.div variants={item}>
            <GoalsProgress />
          </motion.div>
        </div>
      </motion.div>

      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
    </div>
  );
};