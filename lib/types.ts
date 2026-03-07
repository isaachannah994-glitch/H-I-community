// ============================================================================
// TIPOS GENERALES DEL SISTEMA H&I POS
// ============================================================================

export type UserRole = 'master_admin' | 'business_owner' | 'manager' | 'cashier' | 'inventory_staff' | 'accountant';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  businessId?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  lastLogin?: number;
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  type: 'bodega' | 'ferreteria' | 'restaurante' | 'zapateria' | 'tienda_ropa' | 'repuestos_motos' | 'otros';
  ownerEmail: string;
  ownerUid: string;
  logo?: string;
  address?: string;
  phone?: string;
  taxId?: string;
  isActive: boolean;
  subscriptionType: 'free' | 'pro' | 'enterprise';
  createdAt: number;
  settings?: BusinessSettings;
}

export interface BusinessSettings {
  currency: string;
  timezone: string;
  taxRate: number;
  invoicePrefix: string;
  receiptFormat: 'thermal' | 'standard';
  language: 'es' | 'en';
  acceptsMultipleCurrency: boolean;
}

// ============================================================================
// MÓDULO: PUNTO DE VENTA (POS)
// ============================================================================

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  maxStock?: number;
  unit: 'unidad' | 'caja' | 'kilo' | 'litro' | 'metro' | 'gramo' | 'ml';
  images?: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  expiryDate?: number;
  batchNumber?: string;
  supplier?: string;
  taxable: boolean;
  taxRate?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
  discountPercent?: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  businessId: string;
  invoiceNumber: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'check' | 'transfer' | 'mixed';
  paymentCurrency: 'local' | 'usd' | 'eur' | 'mixed';
  exchangeRate?: number;
  cashier: string;
  terminal?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  issuedAt: number;
  dueAt?: number;
  isPrinted: boolean;
  isElectronic: boolean;
}

export interface CashRegister {
  id: string;
  businessId: string;
  name: string;
  cashier: string;
  openingBalance: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  status: 'open' | 'closed';
  openedAt: number;
  closedAt?: number;
  transactions: CashTransaction[];
}

export interface CashTransaction {
  id: string;
  type: 'sale' | 'expense' | 'removal' | 'addition';
  amount: number;
  description: string;
  timestamp: number;
  reference?: string;
}

// ============================================================================
// MÓDULO: GESTIÓN DE INVENTARIO (WMS)
// ============================================================================

export interface Warehouse {
  id: string;
  businessId: string;
  name: string;
  address?: string;
  isMain: boolean;
  createdAt: number;
}

export interface InventoryMovement {
  id: string;
  businessId: string;
  productId: string;
  warehouseId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment' | 'return';
  quantity: number;
  reference?: string;
  notes?: string;
  timestamp: number;
}

export interface StockAlert {
  id: string;
  businessId: string;
  productId: string;
  type: 'low' | 'high' | 'expired';
  message: string;
  isResolved: boolean;
  createdAt: number;
}

// ============================================================================
// MÓDULO: GESTIÓN DE COMPRAS Y PROVEEDORES
// ============================================================================

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms: number; // días
  rating?: number;
  isActive: boolean;
  createdAt: number;
}

export interface PurchaseOrder {
  id: string;
  businessId: string;
  supplierId: string;
  orderNumber: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'received' | 'partially_received' | 'cancelled';
  expectedDelivery?: number;
  receivedAt?: number;
  notes?: string;
  createdAt: number;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

export interface AccountsPayable {
  id: string;
  businessId: string;
  supplierId: string;
  purchaseOrderId: string;
  amount: number;
  paidAmount: number;
  dueDate: number;
  status: 'pending' | 'partial' | 'paid';
  notes?: string;
  createdAt: number;
}

// ============================================================================
// MÓDULO: CRM Y PROGRAMA DE LEALTAD
// ============================================================================

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  birthday?: number;
  loyaltyPoints: number;
  totalSpent: number;
  totalTransactions: number;
  segment: 'vip' | 'recurring' | 'occasional' | 'inactive';
  notes?: string;
  isActive: boolean;
  createdAt: number;
}

export interface LoyaltyTransaction {
  id: string;
  businessId: string;
  customerId: string;
  type: 'earn' | 'redeem' | 'bonus' | 'expiry';
  points: number;
  relatedSaleId?: string;
  description?: string;
  timestamp: number;
}

export interface Coupon {
  id: string;
  businessId: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  minPurchase?: number;
  validFrom: number;
  validUntil: number;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  businessId: string;
  cardNumber: string;
  balance: number;
  initialBalance: number;
  customerId?: string;
  isActive: boolean;
  createdAt: number;
  expiryDate?: number;
}

// ============================================================================
// MÓDULO: E-COMMERCE Y OMNICANAL
// ============================================================================

export interface OnlineStore {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  logo?: string;
  domain?: string;
  isActive: boolean;
  theme: string;
  createdAt: number;
}

export interface OnlineOrder {
  id: string;
  businessId: string;
  storeId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OnlineOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: 'pickup' | 'delivery' | 'courier';
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: number;
}

export interface OnlineOrderItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Delivery {
  id: string;
  businessId: string;
  orderId: string;
  driver?: string;
  route?: string;
  status: 'pending' | 'picked' | 'in_transit' | 'delivered' | 'failed';
  estimatedDelivery?: number;
  actualDelivery?: number;
  coordinates?: { lat: number; lng: number };
}

// ============================================================================
// MÓDULO: FINANZAS Y CONTABILIDAD
// ============================================================================

export interface OperatingExpense {
  id: string;
  businessId: string;
  category: string;
  description: string;
  amount: number;
  date: number;
  paymentMethod: string;
  notes?: string;
  receipt?: string;
}

export interface AccountsReceivable {
  id: string;
  businessId: string;
  customerId: string;
  amount: number;
  paidAmount: number;
  dueDate: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  notes?: string;
  createdAt: number;
}

export interface BankReconciliation {
  id: string;
  businessId: string;
  accountNumber: string;
  statementDate: number;
  systemBalance: number;
  bankBalance: number;
  difference: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  reconciliationItems: BankReconciliationItem[];
}

export interface BankReconciliationItem {
  transactionId: string;
  amount: number;
  date: number;
  description: string;
  status: 'matched' | 'pending' | 'unmatched';
}

// ============================================================================
// MÓDULO: REPORTES Y ANALYTICS
// ============================================================================

export interface SalesReport {
  id: string;
  businessId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: number;
  endDate: number;
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalTransactions: number;
  averageTicket: number;
  topProducts: Array<{ productId: string; quantity: number; revenue: number }>;
  topCategories: Array<{ category: string; revenue: number }>;
}

export interface ProductReport {
  id: string;
  businessId: string;
  productId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: number;
  endDate: number;
  unitsSold: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  stockMovement: number;
}

export interface FinancialReport {
  id: string;
  businessId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  date: number;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  cashFlow: number;
}

// ============================================================================
// MÓDULO: GESTIÓN DE PERSONAL (HR)
// ============================================================================

export interface Employee {
  id: string;
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  position: string;
  role: UserRole;
  salary?: number;
  hireDate: number;
  endDate?: number;
  isActive: boolean;
  documents?: EmployeeDocument[];
  createdAt: number;
}

export interface EmployeeDocument {
  id: string;
  type: string; // 'contract', 'id', 'certification', etc.
  url: string;
  uploadedAt: number;
}

export interface AttendanceRecord {
  id: string;
  businessId: string;
  employeeId: string;
  date: number;
  checkIn?: number;
  checkOut?: number;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  notes?: string;
}

export interface EmployeeShift {
  id: string;
  businessId: string;
  employeeId: string;
  date: number;
  startTime: number;
  endTime: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'swapped';
}

export interface EmployeeCommission {
  id: string;
  businessId: string;
  employeeId: string;
  period: number;
  baseSalary: number;
  commissionAmount: number;
  deductions: number;
  totalPayment: number;
  status: 'pending' | 'paid';
}

// ============================================================================
// MÓDULO: INTEGRACIONES Y CONFIGURACIÓN
// ============================================================================

export interface SystemAuditLog {
  id: string;
  businessId: string;
  userId: string;
  action: string;
  module: string;
  targetId?: string;
  changes?: Record<string, any>;
  timestamp: number;
  ipAddress?: string;
}

export interface ApiKey {
  id: string;
  businessId: string;
  name: string;
  key: string;
  lastUsed?: number;
  isActive: boolean;
  permissions: string[];
  createdAt: number;
}
