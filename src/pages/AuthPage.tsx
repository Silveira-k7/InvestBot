import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, TrendingUp, Shield, Smartphone } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: TrendingUp,
      title: 'Controle Financeiro',
      description: 'Monitore seus gastos e ganhos em tempo real'
    },
    {
      icon: Smartphone,
      title: 'WhatsApp Integrado',
      description: 'Gerencie suas finanças direto pelo WhatsApp'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia avançada'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InvestBot</h1>
              <p className="text-gray-600">Seu assistente financeiro inteligente</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transforme sua relação com o dinheiro
          </h2>
          
          <p className="text-xl text-gray-600 mb-12">
            Controle suas finanças com inteligência artificial, receba insights personalizados 
            e tome decisões financeiras mais inteligentes.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 lg:flex-none lg:w-96 xl:w-[480px] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm 
                key="login"
                onToggleMode={() => setIsLogin(false)} 
              />
            ) : (
              <RegisterForm 
                key="register"
                onToggleMode={() => setIsLogin(true)} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};