import { ref, set, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase';
import { Sale, Product, CashRegister, CashTransaction } from './types';
import { logAuditEvent } from './auth-service';

// ============================================================================
// GESTIÓN DE PRODUCTOS (CATÁLOGO)
// ============================================================================

export async function createProduct(businessId: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProduct: Product = {
      ...product,
      id: productId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/products/${productId}`), newProduct);
    return { success: true, productId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProduct(businessId: string, productId: string): Promise<Product | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/products/${productId}`));
    return snapshot.exists() ? (snapshot.val() as Product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductByBarcode(businessId: string, barcode: string): Promise<Product | null> {
  try {
    const snapshot = await get(
      query(
        ref(database, `businesses/${businessId}/products`),
        orderByChild('barcode'),
        equalTo(barcode)
      )
    );

    if (!snapshot.exists()) return null;
    const products = Object.values(snapshot.val()) as Product[];
    return products[0] || null;
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return null;
  }
}

export async function getProductBySku(businessId: string, sku: string): Promise<Product | null> {
  try {
    const snapshot = await get(
      query(
        ref(database, `businesses/${businessId}/products`),
        orderByChild('sku'),
        equalTo(sku)
      )
    );

    if (!snapshot.exists()) return null;
    const products = Object.values(snapshot.val()) as Product[];
    return products[0] || null;
  } catch (error) {
    console.error('Error fetching product by SKU:', error);
    return null;
  }
}

export async function getAllProducts(businessId: string): Promise<Product[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/products`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Product[];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

export async function updateProduct(businessId: string, productId: string, updates: Partial<Product>) {
  try {
    await update(ref(database, `businesses/${businessId}/products/${productId}`), {
      ...updates,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductStock(
  businessId: string,
  productId: string,
  quantityChange: number
) {
  try {
    const product = await getProduct(businessId, productId);
    if (!product) throw new Error('Product not found');

    const newQuantity = Math.max(0, product.quantity + quantityChange);
    await update(ref(database, `businesses/${businessId}/products/${productId}`), {
      quantity: newQuantity,
      updatedAt: Date.now(),
    });

    return { success: true, newQuantity };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// PROCESAMIENTO DE VENTAS
// ============================================================================

export async function createSale(businessId: string, sale: Omit<Sale, 'id' | 'issuedAt'>) {
  try {
    const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSale: Sale = {
      ...sale,
      id: saleId,
      issuedAt: Date.now(),
    };

    // Actualizar stock de productos
    for (const item of sale.items) {
      await updateProductStock(businessId, item.productId, -item.quantity);
    }

    await set(ref(database, `businesses/${businessId}/sales/${saleId}`), newSale);

    // Log de auditoría
    await logAuditEvent(businessId, sale.cashier, 'SALE_CREATED', 'POS', saleId, { total: sale.total });

    return { success: true, saleId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSale(businessId: string, saleId: string): Promise<Sale | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/sales/${saleId}`));
    return snapshot.exists() ? (snapshot.val() as Sale) : null;
  } catch (error) {
    console.error('Error fetching sale:', error);
    return null;
  }
}

export async function getAllSales(businessId: string): Promise<Sale[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/sales`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Sale[];
  } catch (error) {
    console.error('Error fetching all sales:', error);
    return [];
  }
}

export async function getSalesByDateRange(
  businessId: string,
  startDate: number,
  endDate: number
): Promise<Sale[]> {
  try {
    const allSales = await getAllSales(businessId);
    return allSales.filter(sale => sale.issuedAt >= startDate && sale.issuedAt <= endDate);
  } catch (error) {
    console.error('Error fetching sales by date range:', error);
    return [];
  }
}

export async function cancelSale(businessId: string, saleId: string) {
  try {
    const sale = await getSale(businessId, saleId);
    if (!sale) throw new Error('Sale not found');

    // Devolver stock de productos
    for (const item of sale.items) {
      await updateProductStock(businessId, item.productId, item.quantity);
    }

    await update(ref(database, `businesses/${businessId}/sales/${saleId}`), {
      status: 'cancelled',
      updatedAt: Date.now(),
    });

    await logAuditEvent(businessId, 'SYSTEM', 'SALE_CANCELLED', 'POS', saleId);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GESTIÓN DE CAJA (CASH REGISTER)
// ============================================================================

export async function openCashRegister(
  businessId: string,
  registerName: string,
  cashierName: string,
  openingBalance: number
) {
  try {
    const registerId = `register_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cashRegister: CashRegister = {
      id: registerId,
      businessId,
      name: registerName,
      cashier: cashierName,
      openingBalance,
      expectedCash: openingBalance,
      actualCash: 0,
      difference: 0,
      status: 'open',
      openedAt: Date.now(),
      transactions: [],
    };

    await set(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`), cashRegister);
    await logAuditEvent(businessId, cashierName, 'CASH_REGISTER_OPENED', 'CASH', registerId);

    return { success: true, registerId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCashTransaction(
  businessId: string,
  registerId: string,
  transaction: Omit<CashTransaction, 'id' | 'timestamp'>
) {
  try {
    const transactionId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: CashTransaction = {
      ...transaction,
      id: transactionId,
      timestamp: Date.now(),
    };

    const register = await get(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`));
    const registerData = register.val() as CashRegister;

    const newExpectedCash = registerData.expectedCash + 
      (transaction.type === 'addition' ? transaction.amount : -transaction.amount);

    await update(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`), {
      expectedCash: newExpectedCash,
      transactions: [...registerData.transactions, newTransaction],
    });

    return { success: true, transactionId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function closeCashRegister(
  businessId: string,
  registerId: string,
  actualCash: number,
  notes?: string
) {
  try {
    const register = await get(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`));
    const registerData = register.val() as CashRegister;

    const difference = actualCash - registerData.expectedCash;

    await update(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`), {
      actualCash,
      difference,
      status: 'closed',
      closedAt: Date.now(),
    });

    await logAuditEvent(
      businessId,
      registerData.cashier,
      'CASH_REGISTER_CLOSED',
      'CASH',
      registerId,
      { difference, actualCash, expectedCash: registerData.expectedCash }
    );

    return { success: true, difference };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCashRegister(businessId: string, registerId: string): Promise<CashRegister | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/cashRegisters/${registerId}`));
    return snapshot.exists() ? (snapshot.val() as CashRegister) : null;
  } catch (error) {
    console.error('Error fetching cash register:', error);
    return null;
  }
}

// ============================================================================
// UTILIDADES DE CÁLCULO
// ============================================================================

export function calculateTotals(items: any[], taxRate: number = 0) {
  const subtotal = items.reduce((sum, item) => {
    const discount = item.discount || 0;
    const discountPercent = item.discountPercent || 0;
    const itemPrice = item.price - discount - (item.price * discountPercent / 100);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

export function generateInvoiceNumber(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}
