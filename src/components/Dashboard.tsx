import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Building2
} from 'lucide-react';
import { mockProducts, generateMockTransactions, mockBranches } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const transactions = generateMockTransactions(100);
  const todayTransactions = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  );

  // Calculate metrics
  const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = todayTransactions.length;
  const avgTransaction = totalTransactions > 0 ? todaySales / totalTransactions : 0;
  const lowStockProducts = mockProducts.filter(p => p.stock <= p.minStock);

  const recentTransactions = transactions.slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening at your {user?.role === 'admin' ? 'business' : 'branch'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Sales"
          value={`$${todaySales.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
          change="+12.5%"
        />
        <StatCard
          title="Transactions"
          value={totalTransactions.toString()}
          icon={ShoppingCart}
          color="bg-blue-500"
          change="+8.2%"
        />
        <StatCard
          title="Avg. Transaction"
          value={`$${avgTransaction.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-purple-500"
          change="+3.8%"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length.toString()}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock size={20} className="mr-2" />
              Recent Transactions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.receiptNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${transaction.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 capitalize">{transaction.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-orange-500" />
              Low Stock Alert
            </h2>
          </div>
          <div className="p-6">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-orange-600 font-medium">
                        {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {product.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>

      {/* Branch Overview for Admin */}
      {user?.role === 'admin' && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building2 size={20} className="mr-2" />
              Branch Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBranches.map((branch) => {
                const branchTransactions = transactions.filter(t => t.branchId === branch.id);
                const branchSales = branchTransactions.reduce((sum, t) => sum + t.total, 0);
                
                return (
                  <div key={branch.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{branch.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Today's Sales:</span>
                      <span className="font-semibold text-gray-900">${branchSales.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};