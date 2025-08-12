import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Database, 
  MessageSquare, 
  Shield,
  Bell,
  Mail,
  Server,
  Key,
  Globe,
  Smartphone,
  Bot
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // System Settings
    systemName: 'InvestBot',
    systemVersion: '1.0.0',
    maintenanceMode: false,
    
    // WhatsApp Settings
    whatsappEnabled: true,
    whatsappAutoReconnect: true,
    whatsappMaxReconnectAttempts: 5,
    whatsappSessionTimeout: 30,
    
    // AI Settings
    openaiApiKey: '',
    aiEnabled: true,
    aiResponseDelay: 2,
    
    // Notification Settings
    emailNotifications: true,
    adminEmail: 'admin@investbot.com',
    systemAlerts: true,
    
    // Database Settings
    backupEnabled: true,
    backupFrequency: 'daily',
    dataRetentionDays: 365,
    
    // Security Settings
    jwtSecret: '',
    sessionTimeout: 24,
    maxLoginAttempts: 5
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Configurações salvas com sucesso!');
    setIsSaving(false);
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Sistema</h1>
          <p className="text-gray-600">
            Gerencie todas as configurações do InvestBot
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save size={18} className="mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Server size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações do Sistema</h3>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Nome do Sistema"
              value={settings.systemName}
              onChange={(e) => handleInputChange('systemName', e.target.value)}
            />
            
            <Input
              label="Versão"
              value={settings.systemVersion}
              onChange={(e) => handleInputChange('systemVersion', e.target.value)}
              disabled
            />
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Modo Manutenção</label>
                <p className="text-xs text-gray-500">Desabilita acesso de usuários</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* WhatsApp Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações WhatsApp</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">WhatsApp Habilitado</label>
                <p className="text-xs text-gray-500">Ativar/desativar bot WhatsApp</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsappEnabled}
                  onChange={(e) => handleInputChange('whatsappEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Reconexão Automática</label>
                <p className="text-xs text-gray-500">Reconectar automaticamente se desconectar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsappAutoReconnect}
                  onChange={(e) => handleInputChange('whatsappAutoReconnect', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <Input
              type="number"
              label="Máximo de Tentativas de Reconexão"
              value={settings.whatsappMaxReconnectAttempts}
              onChange={(e) => handleInputChange('whatsappMaxReconnectAttempts', parseInt(e.target.value))}
            />
            
            <Input
              type="number"
              label="Timeout de Sessão (minutos)"
              value={settings.whatsappSessionTimeout}
              onChange={(e) => handleInputChange('whatsappSessionTimeout', parseInt(e.target.value))}
            />
          </div>
        </Card>

        {/* AI Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bot size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações de IA</h3>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              label="OpenAI API Key"
              value={settings.openaiApiKey}
              onChange={(e) => handleInputChange('openaiApiKey', e.target.value)}
              placeholder="sk-..."
            />
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">IA Habilitada</label>
                <p className="text-xs text-gray-500">Usar IA para análises e insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiEnabled}
                  onChange={(e) => handleInputChange('aiEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <Input
              type="number"
              label="Delay de Resposta IA (segundos)"
              value={settings.aiResponseDelay}
              onChange={(e) => handleInputChange('aiResponseDelay', parseInt(e.target.value))}
            />
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell size={20} className="text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificação</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Notificações por Email</label>
                <p className="text-xs text-gray-500">Receber alertas por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
            
            <Input
              type="email"
              label="Email do Administrador"
              value={settings.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              leftIcon={<Mail size={20} />}
            />
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Alertas do Sistema</label>
                <p className="text-xs text-gray-500">Alertas de erro e manutenção</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.systemAlerts}
                  onChange={(e) => handleInputChange('systemAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Database Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database size={20} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações do Banco de Dados</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Backup Automático</label>
                <p className="text-xs text-gray-500">Fazer backup automático dos dados</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.backupEnabled}
                  onChange={(e) => handleInputChange('backupEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência de Backup
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <Input
              type="number"
              label="Retenção de Dados (dias)"
              value={settings.dataRetentionDays}
              onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value))}
            />
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield size={20} className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações de Segurança</h3>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              label="JWT Secret"
              value={settings.jwtSecret}
              onChange={(e) => handleInputChange('jwtSecret', e.target.value)}
              leftIcon={<Key size={20} />}
              placeholder="Chave secreta para tokens JWT"
            />
            
            <Input
              type="number"
              label="Timeout de Sessão (horas)"
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            />
            
            <Input
              type="number"
              label="Máximo de Tentativas de Login"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
            />
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving} size="lg">
          <Save size={18} className="mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
};