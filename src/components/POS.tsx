import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CartItem, Product, Customer, Table, Order } from '../types';
import { mockProducts, mockCustomers, mockTables } from '../data/mockData';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard,
  DollarSign,
  Smartphone,
  Receipt,
  X,
  ArrowLeft,
  Coffee,
  Utensils,
  Wine,
  Cake,
  Cigarette,
  ChefHat,
  Grid3X3,
  Send,
  Clock,
} from 'lucide-react';

export const POS: React.FC = () => {
  const { user } = useAuth();
  const [products] = useState(mockProducts);
  const [tables] = useState(mockTables);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [currentView, setCurrentView] = useState<'categories' | 'products' | 'tables'>('categories');

  // Get unique categories with icons
  const categoryIcons: Record<string, React.ElementType> = {
    'Food': Utensils,
    'Drinks': Coffee,
    'Shisha': Cigarette,
    'Desserts': Cake,
    'Appetizers': ChefHat,
  };

  const categories = Array.from(new Set(products.map(p => p.category))).map(category => ({
    name: category,
    icon: categoryIcons[category] || Grid3X3,
    count: products.filter(p => p.category === category && p.isActive).length,
    color: getCategoryColor(category),
  }));

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-500',
      'Drinks': 'bg-blue-500',
      'Shisha': 'bg-purple-500',
      'Desserts': 'bg-pink-500',
      'Appetizers': 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  }

  // Filter products by selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId
        ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity - item.discount }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSelectedTable(null);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = cart.reduce((sum, item) => sum + item.discount, 0);
  const tax = subtotal * 0.085; // 8.5% tax
  const total = subtotal + tax;

  // Order processing
  const processOrder = (paymentMethod?: 'cash' | 'card' | 'mobile') => {
    const order: Order = {
      id: `order-${Date.now()}`,
      branchId: user?.branchId || '1',
      cashierId: user?.id || '1',
      customerId: selectedCustomer?.id,
      tableId: selectedTable?.id,
      items: cart,
      subtotal,
      discount,
      tax,
      total,
      status: orderType === 'dine-in' ? 'pending' : 'completed',
      orderType,
      paymentStatus: orderType === 'dine-in' ? 'unpaid' : 'paid',
      paymentMethod: orderType === 'dine-in' ? undefined : paymentMethod,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLastOrder(order);
    setShowReceipt(true);
    clearCart();
    setCurrentView('categories');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('products');
  };

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setCurrentView('categories');
    setSearchTerm('');
  };

  const handleTableSelect = (table: Table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setOrderType('dine-in');
      setCurrentView('categories');
    }
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'cleaning': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'categories' && (
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentView === 'categories' && 'Select Category'}
                  {currentView === 'products' && selectedCategory}
                  {currentView === 'tables' && 'Select Table'}
                </h1>
                {selectedTable && (
                  <p className="text-sm text-gray-600">
                    Order for {selectedTable.name} • {orderType}
                  </p>
                )}
              </div>
            </div>
            
            {/* Order Type Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('tables')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'tables' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Tables
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['dine-in', 'takeaway', 'delivery'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      orderType === type
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories View */}
        {currentView === 'categories' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className="bg-white rounded-xl p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} items</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tables View */}
        {currentView === 'tables' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Reserved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cleaning</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => handleTableSelect(table)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    getTableStatusColor(table.status)
                  } ${
                    table.status === 'available' 
                      ? 'hover:shadow-md hover:scale-105' 
                      : 'opacity-60 cursor-not-allowed'
                  } ${
                    selectedTable?.id === table.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{table.number}</div>
                    <div className="text-sm font-medium mb-1">{table.name}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      {table.capacity} seats • {table.section}
                    </div>
                    <div className="text-xs font-medium capitalize">
                      {table.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products View */}
        {currentView === 'products' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingCart size={20} className="mr-2" />
            Order ({cart.length})
          </h2>
          {selectedTable && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedTable.name} • {orderType}
            </p>
          )}
        </div>

        {/* Customer & Table Selection */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center space-x-2">
            <User size={16} className="text-gray-500" />
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = mockCustomers.find(c => c.id === e.target.value);
                setSelectedCustomer(customer || null);
              }}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">No Customer</option>
              {mockCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          
          {orderType === 'dine-in' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Table:</span>
              <span className="text-sm font-medium">
                {selectedTable ? selectedTable.name : 'No table selected'}
              </span>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Your order is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8.5%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            {orderType === 'dine-in' ? (
              <div className="space-y-2">
                <button
                  onClick={() => processOrder()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Order to Kitchen
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Order will be sent to kitchen. Payment will be processed when customer is ready to leave.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => processOrder('cash')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <DollarSign size={18} className="mr-2" />
                  Pay Cash
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => processOrder('card')}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <CreditCard size={16} className="mr-1" />
                    Card
                  </button>
                  <button
                    onClick={() => processOrder('mobile')}
                    className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Smartphone size={16} className="mr-1" />
                    Mobile
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={clearCart}
              className="w-full mt-2 text-red-600 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear Order
            </button>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {lastOrder.orderType === 'dine-in' ? 'Order Sent to Kitchen' : 'Order Complete'}
                </h3>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Receipt */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <h4 className="font-bold">Restaurant POS</h4>
                  <p className="text-sm text-gray-600">Order #{lastOrder.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(lastOrder.createdAt).toLocaleString()}
                  </p>
                  {lastOrder.tableId && (
                    <p className="text-sm text-gray-600">
                      Table: {tables.find(t => t.id === lastOrder.tableId)?.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 capitalize">
                    Order Type: {lastOrder.orderType}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Status: {lastOrder.status.charAt(0).toUpperCase() + lastOrder.status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {lastOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {lastOrder.items.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${lastOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${lastOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${lastOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Receipt size={16} className="mr-2" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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