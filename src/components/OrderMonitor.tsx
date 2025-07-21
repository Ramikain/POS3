import React, { useState, useEffect } from 'react';
import { Order, Table } from '../types';
import { generateMockOrders, mockTables } from '../data/mockData';
import {
  Clock,
  ChefHat,
  CheckCircle,
  Utensils,
  X,
  Eye,
  AlertCircle,
  Timer,
  MapPin,
  User,
  Phone,
  Car,
  Home,
} from 'lucide-react';

export const OrderMonitor: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'served'>('all');

  useEffect(() => {
    // Initialize with mock orders
    setOrders(generateMockOrders(15));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          // Randomly update order status
          if (Math.random() > 0.95 && order.status !== 'completed' && order.status !== 'cancelled') {
            const statusFlow = ['pending', 'preparing', 'ready', 'served', 'completed'];
            const currentIndex = statusFlow.indexOf(order.status);
            if (currentIndex < statusFlow.length - 1) {
              return {
                ...order,
                status: statusFlow[currentIndex + 1] as Order['status'],
                updatedAt: new Date().toISOString(),
              };
            }
          }
          return order;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return order.status !== 'completed' && order.status !== 'cancelled';
    return order.status === filter;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'served': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'preparing': return <ChefHat size={16} />;
      case 'ready': return <CheckCircle size={16} />;
      case 'served': return <Utensils size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getOrderTypeIcon = (orderType: Order['orderType']) => {
    switch (orderType) {
      case 'dine-in': return <Utensils size={16} className="text-blue-600" />;
      case 'takeaway': return <Car size={16} className="text-green-600" />;
      case 'delivery': return <Home size={16} className="text-purple-600" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const getTimeSinceOrder = (createdAt: string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const table = order.tableId ? mockTables.find(t => t.id === order.tableId) : null;
    const timeSince = getTimeSinceOrder(order.createdAt);
    const isUrgent = new Date().getTime() - new Date(order.createdAt).getTime() > 20 * 60 * 1000; // 20+ minutes

    return (
      <div className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all ${
        isUrgent && order.status === 'pending' ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">#{order.orderNumber}</span>
            {getOrderTypeIcon(order.orderType)}
            {isUrgent && order.status === 'pending' && (
              <AlertCircle size={16} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{timeSince}</span>
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {table && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{table.name} ({table.section})</span>
            </div>
          )}
          
          <div className="text-sm">
            <span className="font-medium">{order.items.length} items</span>
            <span className="text-gray-500 ml-2">${order.total.toFixed(2)}</span>
          </div>

          <div className="text-xs text-gray-500">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index}>
                {item.quantity}x {item.product.name}
              </div>
            ))}
            {order.items.length > 2 && (
              <div>+{order.items.length - 2} more items</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            <span className="flex items-center space-x-1">
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </span>
          </span>

          <div className="flex space-x-1">
            {order.status === 'pending' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Start
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'served')}
                className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
              >
                Served
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Monitor</h1>
        <p className="text-gray-600">Real-time order tracking and kitchen management</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{statusCounts.pending}</p>
            </div>
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Preparing</p>
              <p className="text-2xl font-bold text-blue-900">{statusCounts.preparing}</p>
            </div>
            <ChefHat size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Ready</p>
              <p className="text-2xl font-bold text-green-900">{statusCounts.ready}</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Served</p>
              <p className="text-2xl font-bold text-purple-900">{statusCounts.served}</p>
            </div>
            <Utensils size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'All Active' },
          { key: 'pending', label: 'Pending' },
          { key: 'preparing', label: 'Preparing' },
          { key: 'ready', label: 'Ready' },
          { key: 'served', label: 'Served' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders to display</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Order #{selectedOrder.orderNumber}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order Type:</span>
                    <p className="font-medium capitalize">{selectedOrder.orderType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">{getTimeSinceOrder(selectedOrder.createdAt)}</p>
                  </div>
                  {selectedOrder.tableId && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Table:</span>
                      <p className="font-medium">
                        {mockTables.find(t => t.id === selectedOrder.tableId)?.name}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Payment: {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <span className="text-gray-600 text-sm">Notes:</span>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-2">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'preparing');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'ready');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark Ready
                  </button>
                )}
                {selectedOrder.status === 'ready' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'served');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Mark Served
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};