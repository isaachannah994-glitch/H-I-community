import { ref, set, get, update } from 'firebase/database';
import { database } from './firebase';
import {
  Customer,
  LoyaltyTransaction,
  Coupon,
  GiftCard,
  OperatingExpense,
  AccountsReceivable,
  BankReconciliation,
  BankReconciliationItem,
} from './types';
import { logAuditEvent } from './auth-service';

// ============================================================================
// GESTIÓN DE CLIENTES (CRM)
// ============================================================================

export async function createCustomer(businessId: string, customer: Omit<Customer, 'id' | 'createdAt'>) {
  try {
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCustomer: Customer = {
      ...customer,
      id: customerId,
      createdAt: Date.now(),
      loyaltyPoints: 0,
      totalSpent: 0,
      totalTransactions: 0,
      segment: 'occasional',
    };

    await set(ref(database, `businesses/${businessId}/customers/${customerId}`), newCustomer);
    return { success: true, customerId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCustomer(businessId: string, customerId: string): Promise<Customer | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/customers/${customerId}`));
    return snapshot.exists() ? (snapshot.val() as Customer) : null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function getAllCustomers(businessId: string): Promise<Customer[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/customers`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Customer[];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function updateCustomer(businessId: string, customerId: string, updates: Partial<Customer>) {
  try {
    await update(ref(database, `businesses/${businessId}/customers/${customerId}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addLoyaltyPoints(
  businessId: string,
  customerId: string,
  points: number,
  relatedSaleId?: string
) {
  try {
    const customer = await getCustomer(businessId, customerId);
    if (!customer) throw new Error('Customer not found');

    const newPoints = customer.loyaltyPoints + points;
    
    // Crear transacción
    const transactionId = `lyt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction: LoyaltyTransaction = {
      id: transactionId,
      businessId,
      customerId,
      type: 'earn',
      points,
      relatedSaleId,
      timestamp: Date.now(),
    };

    await set(
      ref(database, `businesses/${businessId}/loyaltyTransactions/${transactionId}`),
      transaction
    );

    // Actualizar segmento del cliente
    let segment = 'occasional';
    if (customer.totalSpent > 1000) segment = 'vip';
    else if (customer.totalTransactions > 10) segment = 'recurring';

    await update(ref(database, `businesses/${businessId}/customers/${customerId}`), {
      loyaltyPoints: newPoints,
      segment,
    });

    return { success: true, newPoints };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function redeemLoyaltyPoints(
  businessId: string,
  customerId: string,
  points: number
) {
  try {
    const customer = await getCustomer(businessId, customerId);
    if (!customer) throw new Error('Customer not found');
    if (customer.loyaltyPoints < points) throw new Error('Insufficient loyalty points');

    const newPoints = customer.loyaltyPoints - points;
    
    const transactionId = `lyt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction: LoyaltyTransaction = {
      id: transactionId,
      businessId,
      customerId,
      type: 'redeem',
      points,
      timestamp: Date.now(),
    };

    await set(
      ref(database, `businesses/${businessId}/loyaltyTransactions/${transactionId}`),
      transaction
    );

    await update(ref(database, `businesses/${businessId}/customers/${customerId}`), {
      loyaltyPoints: newPoints,
    });

    return { success: true, newPoints };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CUPONES Y DESCUENTOS
// ============================================================================

export async function createCoupon(businessId: string, coupon: Omit<Coupon, 'id' | 'usedCount'>) {
  try {
    const couponId = `coup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCoupon: Coupon = {
      ...coupon,
      id: couponId,
      usedCount: 0,
    };

    await set(ref(database, `businesses/${businessId}/coupons/${couponId}`), newCoupon);
    return { success: true, couponId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function validateCoupon(businessId: string, code: string, purchaseAmount: number) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/coupons`));
    if (!snapshot.exists()) return { valid: false, error: 'Coupon not found' };

    const coupons = Object.values(snapshot.val()) as Coupon[];
    const coupon = coupons.find(c => c.code === code && c.isActive);

    if (!coupon) return { valid: false, error: 'Coupon not found or inactive' };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { valid: false, error: 'Coupon limit reached' };
    if (coupon.minPurchase && purchaseAmount < coupon.minPurchase) return { valid: false, error: 'Minimum purchase not met' };
    if (coupon.validFrom > Date.now() || coupon.validUntil < Date.now()) return { valid: false, error: 'Coupon expired' };

    const discount = coupon.discountType === 'percentage'
      ? purchaseAmount * (coupon.discountValue / 100)
      : coupon.discountValue;

    return { valid: true, coupon, discount };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, error: 'Error validating coupon' };
  }
}

export async function useCoupon(businessId: string, couponId: string) {
  try {
    const coupon = await get(ref(database, `businesses/${businessId}/coupons/${couponId}`));
    if (!coupon.exists()) throw new Error('Coupon not found');

    const couponData = coupon.val() as Coupon;
    await update(ref(database, `businesses/${businessId}/coupons/${couponId}`), {
      usedCount: couponData.usedCount + 1,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// TARJETAS DE REGALO
// ============================================================================

export async function createGiftCard(businessId: string, balance: number) {
  try {
    const cardId = `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cardNumber = `GC-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
    
    const giftCard: GiftCard = {
      id: cardId,
      businessId,
      cardNumber,
      balance,
      initialBalance: balance,
      isActive: true,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/giftCards/${cardId}`), giftCard);
    return { success: true, cardId, cardNumber };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function useGiftCard(businessId: string, cardNumber: string, amount: number) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/giftCards`));
    if (!snapshot.exists()) throw new Error('Gift card not found');

    const giftCards = Object.values(snapshot.val()) as GiftCard[];
    const giftCard = giftCards.find(gc => gc.cardNumber === cardNumber && gc.isActive);

    if (!giftCard) throw new Error('Gift card not found or inactive');
    if (giftCard.balance < amount) throw new Error('Insufficient balance');

    const newBalance = giftCard.balance - amount;
    await update(ref(database, `businesses/${businessId}/giftCards/${giftCard.id}`), {
      balance: newBalance,
      isActive: newBalance > 0,
    });

    return { success: true, newBalance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GASTOS OPERATIVOS
// ============================================================================

export async function recordExpense(businessId: string, expense: Omit<OperatingExpense, 'id'>) {
  try {
    const expenseId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newExpense: OperatingExpense = {
      ...expense,
      id: expenseId,
    };

    await set(ref(database, `businesses/${businessId}/expenses/${expenseId}`), newExpense);
    await logAuditEvent(businessId, 'SYSTEM', 'EXPENSE_RECORDED', 'FINANCE', expenseId);

    return { success: true, expenseId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExpenses(businessId: string): Promise<OperatingExpense[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/expenses`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as OperatingExpense[];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

// ============================================================================
// CUENTAS POR COBRAR
// ============================================================================

export async function createAccountsReceivable(
  businessId: string,
  accountReceivable: Omit<AccountsReceivable, 'id' | 'createdAt'>
) {
  try {
    const arId = `ar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAR: AccountsReceivable = {
      ...accountReceivable,
      id: arId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/accountsReceivable/${arId}`), newAR);
    return { success: true, arId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccountsReceivable(businessId: string): Promise<AccountsReceivable[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/accountsReceivable`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as AccountsReceivable[];
  } catch (error) {
    console.error('Error fetching accounts receivable:', error);
    return [];
  }
}

export async function recordPaymentReceived(
  businessId: string,
  arId: string,
  amount: number
) {
  try {
    const ar = await get(ref(database, `businesses/${businessId}/accountsReceivable/${arId}`));
    if (!ar.exists()) throw new Error('Account receivable not found');

    const arData = ar.val() as AccountsReceivable;
    const newPaidAmount = arData.paidAmount + amount;
    const status = newPaidAmount >= arData.amount ? 'paid' : 'partial';

    await update(ref(database, `businesses/${businessId}/accountsReceivable/${arId}`), {
      paidAmount: newPaidAmount,
      status,
    });

    return { success: true, status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CONCILIACIÓN BANCARIA
// ============================================================================

export async function createBankReconciliation(
  businessId: string,
  reconciliation: Omit<BankReconciliation, 'id'>
) {
  try {
    const reconciliationId = `br_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReconciliation: BankReconciliation = {
      ...reconciliation,
      id: reconciliationId,
    };

    await set(
      ref(database, `businesses/${businessId}/bankReconciliations/${reconciliationId}`),
      newReconciliation
    );

    return { success: true, reconciliationId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBankReconciliations(businessId: string): Promise<BankReconciliation[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/bankReconciliations`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as BankReconciliation[];
  } catch (error) {
    console.error('Error fetching bank reconciliations:', error);
    return [];
  }
}
