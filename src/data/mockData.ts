import { User, Branch, Product, Transaction, Customer } from '../types';
import { Table } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@pos.com',
    name: 'System Administrator',
    role: 'admin',
    branchId: 'all',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@pos.com',
    name: 'Branch Manager',
    role: 'manager',
    branchId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'cashier@pos.com',
    name: 'John Cashier',
    role: 'cashier',
    branchId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Main Branch',
    address: '123 Main St, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'main@pos.com',
    isActive: true,
    settings: {
      taxRate: 8.5,
      currency: 'USD',
      timezone: 'America/New_York',
      printReceipts: true,
      acceptCash: true,
      acceptCard: true,
    },
  },
  {
    id: '2',
    name: 'West Side Branch',
    address: '456 West Ave, City, State 12345',
    phone: '+1 (555) 987-6543',
    email: 'west@pos.com',
    isActive: true,
    settings: {
      taxRate: 8.5,
      currency: 'USD',
      timezone: 'America/New_York',
      printReceipts: true,
      acceptCash: true,
      acceptCard: true,
    },
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'COFFEE-001',
    name: 'Premium Coffee Blend',
    description: 'Rich, aromatic coffee blend perfect for morning pickup',
    category: 'Drinks',
    price: 4.99,
    cost: 2.00,
    stock: 150,
    minStock: 20,
    maxStock: 500,
    unit: 'cup',
    barcode: '1234567890123',
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    sku: 'CROISSANT-001',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French croissant baked fresh daily',
    category: 'Food',
    price: 3.50,
    cost: 1.25,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    unit: 'piece',
    barcode: '2345678901234',
    imageUrl: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    sku: 'SANDWICH-001',
    name: 'Club Sandwich',
    description: 'Classic club sandwich with turkey, bacon, lettuce, and tomato',
    category: 'Food',
    price: 12.99,
    cost: 5.50,
    stock: 25,
    minStock: 5,
    maxStock: 50,
    unit: 'piece',
    barcode: '3456789012345',
    imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    sku: 'JUICE-001',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, 100% natural',
    category: 'Drinks',
    price: 3.99,
    cost: 1.50,
    stock: 8,
    minStock: 10,
    maxStock: 100,
    unit: 'glass',
    barcode: '4567890123456',
    imageUrl: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '5',
    sku: 'SHISHA-001',
    name: 'Apple Mint Shisha',
    description: 'Premium apple mint flavored shisha tobacco',
    category: 'Shisha',
    price: 25.00,
    cost: 8.00,
    stock: 30,
    minStock: 5,
    maxStock: 100,
    unit: 'bowl',
    barcode: '5678901234567',
    imageUrl: 'https://images.pexels.com/photos/6249525/pexels-photo-6249525.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '6',
    sku: 'DESSERT-001',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with cream frosting',
    category: 'Desserts',
    price: 8.99,
    cost: 3.50,
    stock: 12,
    minStock: 3,
    maxStock: 30,
    unit: 'slice',
    barcode: '6789012345678',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '7',
    sku: 'APPETIZER-001',
    name: 'Chicken Wings',
    description: 'Spicy buffalo chicken wings with ranch dip',
    category: 'Appetizers',
    price: 14.99,
    cost: 6.00,
    stock: 20,
    minStock: 5,
    maxStock: 50,
    unit: 'plate',
    barcode: '7890123456789',
    imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    sku: 'DRINK-002',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemonade with mint',
    category: 'Drinks',
    price: 4.50,
    cost: 1.20,
    stock: 25,
    minStock: 8,
    maxStock: 80,
    unit: 'glass',
    barcode: '8901234567890',
    imageUrl: 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-0001',
    loyaltyPoints: 150,
    totalSpent: 450.75,
    visitCount: 15,
    lastVisit: '2024-01-14T15:30:00Z',
    createdAt: '2023-11-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 123-0002',
    loyaltyPoints: 85,
    totalSpent: 275.50,
    visitCount: 8,
    lastVisit: '2024-01-13T12:15:00Z',
    createdAt: '2023-12-15T00:00:00Z',
  },
];

export const mockTables: Table[] = [
  {
    id: '1',
    number: 1,
    name: 'Table 1',
    capacity: 4,
    status: 'available',
    branchId: '1',
    section: 'Main Dining',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    number: 2,
    name: 'Table 2',
    capacity: 2,
    status: 'occupied',
    currentOrderId: 'order-001',
    branchId: '1',
    section: 'Main Dining',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    number: 3,
    name: 'Table 3',
    capacity: 6,
    status: 'reserved',
    branchId: '1',
    section: 'Main Dining',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    number: 4,
    name: 'Table 4',
    capacity: 4,
    status: 'available',
    branchId: '1',
    section: 'Terrace',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    number: 5,
    name: 'Table 5',
    capacity: 8,
    status: 'cleaning',
    branchId: '1',
    section: 'Private Room',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    number: 6,
    name: 'Table 6',
    capacity: 2,
    status: 'available',
    branchId: '1',
    section: 'Bar Area',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Generate mock transactions
export const generateMockTransactions = (count: number = 50): Transaction[] => {
  const transactions: Transaction[] = [];
  const paymentMethods: ('cash' | 'card' | 'mobile' | 'mixed')[] = ['cash', 'card', 'mobile', 'mixed'];
  
  for (let i = 0; i < count; i++) {
    const items = mockProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map(product => {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const discount = Math.random() > 0.8 ? Math.random() * 2 : 0;
        const unitPrice = product.price;
        const subtotal = (unitPrice * quantity) - discount;
        
        return {
          product,
          quantity,
          unitPrice,
          discount,
          subtotal,
        };
      });
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = items.reduce((sum, item) => sum + item.discount, 0);
    const tax = subtotal * 0.085; // 8.5% tax
    const total = subtotal + tax;
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    const transaction: Transaction = {
      id: `txn-${String(i + 1).padStart(6, '0')}`,
      branchId: mockBranches[Math.floor(Math.random() * mockBranches.length)].id,
      cashierId: mockUsers.filter(u => u.role === 'cashier' || u.role === 'manager')[0].id,
      customerId: Math.random() > 0.6 ? mockCustomers[Math.floor(Math.random() * mockCustomers.length)].id : undefined,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      paymentAmount: total + (paymentMethod === 'cash' ? Math.random() * 10 : 0),
      changeAmount: paymentMethod === 'cash' ? Math.max(0, Math.random() * 10) : 0,
      status: Math.random() > 0.05 ? 'completed' : 'voided',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      receiptNumber: `R-${String(i + 1).padStart(8, '0')}`,
    };
    
    transactions.push(transaction);
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock orders
export const generateMockOrders = (count: number = 20): Order[] => {
  const orders: Order[] = [];
  const statuses: Order['status'][] = ['pending', 'preparing', 'ready', 'served', 'completed'];
  const orderTypes: Order['orderType'][] = ['dine-in', 'takeaway', 'delivery'];
  
  for (let i = 0; i < count; i++) {
    const items = mockProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 1)
      .map(product => {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const discount = Math.random() > 0.9 ? Math.random() * 2 : 0;
        const unitPrice = product.price;
        const subtotal = (unitPrice * quantity) - discount;
        
        return {
          product,
          quantity,
          unitPrice,
          discount,
          subtotal,
        };
      });
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = items.reduce((sum, item) => sum + item.discount, 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const order: Order = {
      id: `order-${String(i + 1).padStart(6, '0')}`,
      tableId: orderType === 'dine-in' ? mockTables[Math.floor(Math.random() * mockTables.length)].id : undefined,
      branchId: mockBranches[Math.floor(Math.random() * mockBranches.length)].id,
      cashierId: mockUsers.filter(u => u.role === 'cashier' || u.role === 'manager')[0].id,
      customerId: Math.random() > 0.7 ? mockCustomers[Math.floor(Math.random() * mockCustomers.length)].id : undefined,
      items,
      subtotal,
      discount,
      tax,
      total,
      status,
      orderType,
      paymentStatus: status === 'completed' ? 'paid' : 'unpaid',
      paymentMethod: status === 'completed' ? (['cash', 'card', 'mobile'] as const)[Math.floor(Math.random() * 3)] : undefined,
      orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
      notes: Math.random() > 0.7 ? 'Special instructions for this order' : undefined,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    orders.push(order);
  }
  
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}