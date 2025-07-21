import React, { useState } from 'react';
import { generateMockTransactions, mockProducts, mockBranches } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  FileText,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');

  const transactions = generateMockTransactions(200);
  
  // Filter transactions based on date range
  const now = new Date();
  const getFilteredTransactions = () => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateRange) {
      case 'today':
        return transactions.filter(t => new Date(t.timestamp) >= today);
      case 'week':
        return transactions.filter(t => new Date(t.timestamp) >= thisWeek);
      case 'month':
        return transactions.filter(t => new Date(t.timestamp) >= thisMonth);
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate metrics
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Sales by payment method
  const paymentMethods = filteredTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  // Top products
  const productSales = filteredTransactions.flatMap(t => t.items).reduce((acc, item) => {
    const productId = item.product.id;
    if (!acc[productId]) {
      acc[productId] = {
        product: item.product,
        quantity: 0,
        revenue: 0,
      };
    }
    acc[productId].quantity += item.quantity;
    acc[productId].revenue += item.subtotal;
    return acc;
  }, {} as Record<string, { product: any; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Sales by hour (for today)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = filteredTransactions.filter(t => {
      const transactionHour = new Date(t.timestamp).getHours();
      return transactionHour === hour;
    });
    return {
      hour,
      sales: hourTransactions.reduce((sum, t) => sum + t.total, 0),
      transactions: hourTransactions.length,
    };
  });

  const maxHourlySales = Math.max(...hourlyData.map(d => d.sales));

  const ReportCard: React.FC<{
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Track performance and gain insights into your business</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 size={20} className="text-gray-500" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customer">Customer Report</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <FileText size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <ReportCard
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
          change="+12.5%"
        />
        <ReportCard
          title="Transactions"
          value={totalTransactions.toString()}
          icon={ShoppingCart}
          color="bg-blue-500"
          change="+8.2%"
        />
        <ReportCard
          title="Avg. Transaction"
          value={`$${avgTransaction.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-purple-500"
          change="+3.8%"
        />
        <ReportCard
          title="Active Products"
          value={mockProducts.length.toString()}
          icon={Package}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Hour Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Hour</h3>
          <div className="space-y-2">
            {hourlyData
              .filter(d => d.sales > 0)
              .slice(0, 12)
              .map((data) => (
                <div key={data.hour} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">
                    {data.hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{
                          width: `${maxHourlySales > 0 ? (data.sales / maxHourlySales) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 text-right">
                    ${data.sales.toFixed(0)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {Object.entries(paymentMethods).map(([method, amount]) => {
              const percentage = totalSales > 0 ? (amount / totalSales) * 100 : 0;
              return (
                <div key={method}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {method}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Qty Sold</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.slice(0, 8).map((item, index) => (
                  <tr key={item.product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-8 h-8 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.product.name}</div>
                          <div className="text-sm text-gray-500">{item.product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-900">${item.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {totalSales > 0 ? ((item.revenue / totalSales) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};