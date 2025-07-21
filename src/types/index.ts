export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  branchId: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  settings: BranchSettings;
}

export interface BranchSettings {
  taxRate: number;
  currency: string;
  timezone: string;
  printReceipts: boolean;
  acceptCash: boolean;
  acceptCard: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  branchId?: string; // null for all branches
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  branchId: string;
  cashierId: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'mixed';
  paymentAmount: number;
  changeAmount: number;
  status: 'completed' | 'voided' | 'returned';
  timestamp: string;
  receiptNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  branchId: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer';
  quantity: number;
  reason?: string;
  userId: string;
  timestamp: string;
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  salesByHour: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
  paymentMethods: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
}

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  branchId: string;
  section?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  tableId?: string;
  branchId: string;
  cashierId: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  notes?: string;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'mobile' | 'mixed';
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}