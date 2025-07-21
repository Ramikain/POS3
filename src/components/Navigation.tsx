import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Grid3X3,
  Monitor,
} from 'lucide-react';

interface NavigationProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'manager', 'cashier'] },
    { id: 'pos', icon: ShoppingCart, label: 'Point of Sale', roles: ['manager', 'cashier'] },
    { id: 'orders', icon: Monitor, label: 'Order Monitor', roles: ['admin', 'manager', 'cashier'] },
    { id: 'tables', icon: Grid3X3, label: 'Tables', roles: ['admin', 'manager'] },
    { id: 'products', icon: Package, label: 'Products', roles: ['admin', 'manager'] },
    { id: 'customers', icon: Users, label: 'Customers', roles: ['admin', 'manager', 'cashier'] },
    { id: 'branches', icon: Building2, label: 'Branches', roles: ['admin'] },
    { id: 'reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
    { id: 'settings', icon: Settings, label: 'Settings', roles: ['admin', 'manager'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleItemClick = (itemId: string) => {
    if (onViewChange) {
      onViewChange(itemId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        bg-white shadow-lg border-r border-gray-200 z-40
        fixed lg:static inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">POS System</h1>
            {user && (
              <div className="mt-4 flex items-center space-x-3">
                <UserCircle size={32} className="text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};