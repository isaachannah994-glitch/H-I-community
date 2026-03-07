import { z } from 'zod';

// ============================================================================
// VALIDADORES DE AUTENTICACIÓN
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ============================================================================
// VALIDADORES DE NEGOCIO
// ============================================================================

export const businessSchema = z.object({
  name: z.string().min(2, 'Nombre del negocio requerido'),
  type: z.enum(['bodega', 'ferreteria', 'restaurante', 'zapateria', 'tienda_ropa', 'repuestos_motos', 'otros']),
  address: z.string().optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  currency: z.string().default('USD'),
  timezone: z.string().default('UTC'),
});

// ============================================================================
// VALIDADORES DE PRODUCTOS
// ============================================================================

export const productSchema = z.object({
  name: z.string().min(2, 'Nombre del producto requerido'),
  sku: z.string().min(2, 'SKU requerido'),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Categoría requerida'),
  price: z.number().positive('Precio debe ser positivo'),
  costPrice: z.number().positive('Precio de costo debe ser positivo'),
  quantity: z.number().nonnegative('Cantidad no puede ser negativa'),
  minStock: z.number().nonnegative('Stock mínimo no puede ser negativo'),
  unit: z.enum(['unidad', 'caja', 'kilo', 'litro', 'metro', 'gramo', 'ml']),
  taxable: z.boolean().default(true),
  taxRate: z.number().optional(),
});

export const productBulkUploadSchema = z.array(productSchema);

// ============================================================================
// VALIDADORES DE VENTA
// ============================================================================

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'ID de producto requerido'),
  quantity: z.number().positive('Cantidad debe ser mayor que 0'),
  discount: z.number().optional(),
  discountPercent: z.number().optional(),
});

export const saleSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Carrito vacío'),
  paymentMethod: z.enum(['cash', 'card', 'check', 'transfer', 'mixed']),
  paymentCurrency: z.enum(['local', 'usd', 'eur', 'mixed']),
  exchangeRate: z.number().optional(),
  customerId: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// VALIDADORES DE CAJA
// ============================================================================

export const cashRegisterSchema = z.object({
  name: z.string().min(1, 'Nombre de caja requerido'),
  openingBalance: z.number().nonnegative('Saldo inicial no puede ser negativo'),
});

export const cashTransactionSchema = z.object({
  type: z.enum(['sale', 'expense', 'removal', 'addition']),
  amount: z.number().positive('Monto debe ser positivo'),
  description: z.string().min(1, 'Descripción requerida'),
  reference: z.string().optional(),
});

// ============================================================================
// VALIDADORES DE CLIENTE
// ============================================================================

export const customerSchema = z.object({
  name: z.string().min(2, 'Nombre del cliente requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthday: z.number().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// VALIDADORES DE PROVEEDOR
// ============================================================================

export const supplierSchema = z.object({
  name: z.string().min(2, 'Nombre del proveedor requerido'),
  contactName: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentTerms: z.number().nonnegative('Términos de pago no pueden ser negativos'),
});

// ============================================================================
// VALIDADORES DE ORDEN DE COMPRA
// ============================================================================

export const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, 'ID de producto requerido'),
  quantity: z.number().positive('Cantidad debe ser mayor que 0'),
  unitPrice: z.number().positive('Precio unitario debe ser positivo'),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Proveedor requerido'),
  items: z.array(purchaseOrderItemSchema).min(1, 'Agregar al menos un artículo'),
  expectedDelivery: z.number().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// VALIDADORES DE EMPLEADO
// ============================================================================

export const employeeSchema = z.object({
  name: z.string().min(2, 'Nombre del empleado requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().min(1, 'Posición requerida'),
  role: z.enum(['manager', 'cashier', 'inventory_staff', 'accountant']),
  salary: z.number().optional(),
  hireDate: z.number().min(1, 'Fecha de contratación requerida'),
});

// ============================================================================
// VALIDADORES DE CUPÓN
// ============================================================================

export const couponSchema = z.object({
  code: z.string().min(2, 'Código requerido'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive('Descuento debe ser positivo'),
  maxUses: z.number().optional(),
  minPurchase: z.number().optional(),
  validFrom: z.number(),
  validUntil: z.number(),
}).refine(data => data.validFrom < data.validUntil, {
  message: 'Fecha de inicio debe ser anterior a la de fin',
  path: ['validUntil'],
});

// ============================================================================
// VALIDADORES DE GASTOS
// ============================================================================

export const expenseSchema = z.object({
  category: z.string().min(1, 'Categoría requerida'),
  description: z.string().min(1, 'Descripción requerida'),
  amount: z.number().positive('Monto debe ser positivo'),
  paymentMethod: z.string().min(1, 'Método de pago requerido'),
  notes: z.string().optional(),
});

// ============================================================================
// VALIDADORES DE ALMACÉN
// ============================================================================

export const warehouseSchema = z.object({
  name: z.string().min(2, 'Nombre del almacén requerido'),
  address: z.string().optional(),
  isMain: z.boolean().default(false),
});

// ============================================================================
// VALIDADORES DE TIENDA EN LÍNEA
// ============================================================================

export const onlineStoreSchema = z.object({
  name: z.string().min(2, 'Nombre de tienda requerido'),
  description: z.string().optional(),
  theme: z.string().default('default'),
});

export const onlineOrderSchema = z.object({
  storeId: z.string().min(1, 'Tienda requerida'),
  customerName: z.string().min(2, 'Nombre requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(1, 'Teléfono requerido'),
  items: z.array(cartItemSchema).min(1, 'Agregar al menos un artículo'),
  shippingMethod: z.enum(['pickup', 'delivery', 'courier']),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// VALIDADORES GENERALES
// ============================================================================

export const dateRangeSchema = z.object({
  startDate: z.number(),
  endDate: z.number(),
}).refine(data => data.startDate <= data.endDate, {
  message: 'Fecha de inicio debe ser anterior o igual a la de fin',
  path: ['endDate'],
});

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().default(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type SaleInput = z.infer<typeof saleSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
