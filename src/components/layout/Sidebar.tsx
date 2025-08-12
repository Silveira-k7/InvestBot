import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  Target, 
  BarChart3, 
  FileText,
  MessageSquare,
  Brain
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: ArrowUpDown },
  { name: 'Insights IA', href: '/ai-insights', icon: Brain },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Extratos', href: '/statements', icon: FileText },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
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
      </nav>
    </aside>
  );
};