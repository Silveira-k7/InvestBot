import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Activity,
  Database,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'WhatsApp Bot', href: '/admin/whatsapp', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-lg">
            <Shield size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-700">Modo Administrador</span>
          </div>
        </div>

        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Sistema</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Uptime:</span>
              <span>99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Versão:</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};