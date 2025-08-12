import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InvestBot Admin</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Painel Administrativo</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
              <Activity size={14} className="text-green-600" />
              <span className="text-xs font-medium text-green-700">Sistema Online</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-red-600" />
                </div>
                <span className="text-sm font-medium">Admin</span>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={16} />
                    <span className="text-sm">Configurações</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sair</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-2">
              <button className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell size={18} />
                <span>Notificações</span>
              </button>
              <button className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings size={18} />
                <span>Configurações</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};