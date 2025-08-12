import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Brain,
  MessageSquare,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Inteligência Artificial',
      description: 'Análises automáticas e insights personalizados para suas finanças'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp 24h',
      description: 'Bot inteligente disponível 24 horas por dia via WhatsApp'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Visualize todas suas finanças em gráficos e relatórios detalhados'
    },
    {
      icon: Target,
      title: 'Metas Inteligentes',
      description: 'Defina e acompanhe suas metas financeiras com alertas automáticos'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de nível bancário'
    },
    {
      icon: Zap,
      title: 'Automação',
      description: 'Categorização automática e relatórios enviados por WhatsApp'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Empresária',
      content: 'O InvestBot mudou completamente minha relação com o dinheiro. Agora tenho controle total!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Freelancer',
      content: 'Usar pelo WhatsApp é incrível! Registro meus gastos na hora, onde quer que eu esteja.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Estudante',
      content: 'A IA me ajuda a economizar e me dá dicas personalizadas. Recomendo muito!',
      rating: 5
    }
  ];

  const stats = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: '500K+', label: 'Transações Processadas' },
    { number: '98%', label: 'Satisfação' },
    { number: '24/7', label: 'Disponibilidade' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InvestBot</h1>
                <p className="text-xs text-gray-500">Assistente Financeiro IA</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Recursos
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Depoimentos
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Preços
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Transforme suas
                <span className="text-blue-600"> finanças</span> com
                <span className="text-purple-600"> Inteligência Artificial</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Controle completo das suas finanças com dashboard inteligente, 
                WhatsApp Bot 24h e insights personalizados por IA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Smartphone size={20} className="mr-2" />
                    Começar pelo WhatsApp
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <BarChart3 size={20} className="mr-2" />
                    Ver Dashboard
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  Grátis para começar
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  Disponível 24h
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">WhatsApp Bot</h3>
                    <p className="text-sm text-gray-500">Online agora</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Gastei 50 reais com supermercado</p>
                  </div>
                  <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm">✅ Gasto registrado! Categoria: Alimentação<br/>💰 Saldo atual: R$ 1.450,00</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Qual meu saldo?</p>
                  </div>
                  <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm">💰 Saldo: R$ 1.450,00<br/>📊 Este mês: +R$ 3.000 | -R$ 1.550</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para controlar suas finanças
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma completa com inteligência artificial, WhatsApp Bot e dashboard avançado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600">
              Simples, rápido e inteligente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta em menos de 2 minutos e conecte seu WhatsApp
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Use pelo WhatsApp</h3>
              <p className="text-gray-600">
                Registre gastos e receitas conversando naturalmente com o bot
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Receba Insights</h3>
              <p className="text-gray-600">
                A IA analisa seus dados e te dá dicas personalizadas para economizar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600">
              Mais de 10.000 pessoas já transformaram suas finanças
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de pessoas que já estão no controle do seu dinheiro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <MessageSquare size={20} className="mr-2" />
                Começar pelo WhatsApp
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                <BarChart3 size={20} className="mr-2" />
                Ver Dashboard Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">InvestBot</h3>
                  <p className="text-sm text-gray-400">Assistente Financeiro IA</p>
                </div>
              </div>
              <p className="text-gray-400">
                Transforme sua relação com o dinheiro usando inteligência artificial.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InvestBot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};