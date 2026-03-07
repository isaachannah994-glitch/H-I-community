import { ref, set, get, update, push } from 'firebase/database';
import { database } from './firebase';
import {
  Warehouse,
  InventoryMovement,
  StockAlert,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  AccountsPayable,
  Product,
} from './types';
import { logAuditEvent } from './auth-service';

// ============================================================================
// GESTIÓN DE ALMACENES (WMS)
// ============================================================================

export async function createWarehouse(businessId: string, warehouse: Omit<Warehouse, 'id'>) {
  try {
    const warehouseId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: warehouseId,
    };

    await set(ref(database, `businesses/${businessId}/warehouses/${warehouseId}`), newWarehouse);
    return { success: true, warehouseId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWarehouse(businessId: string, warehouseId: string): Promise<Warehouse | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/warehouses/${warehouseId}`));
    return snapshot.exists() ? (snapshot.val() as Warehouse) : null;
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return null;
  }
}

export async function getAllWarehouses(businessId: string): Promise<Warehouse[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/warehouses`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Warehouse[];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
}

// ============================================================================
// MOVIMIENTOS DE INVENTARIO
// ============================================================================

export async function recordInventoryMovement(
  businessId: string,
  movement: Omit<InventoryMovement, 'id'>
) {
  try {
    const movementId = `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMovement: InventoryMovement = {
      ...movement,
      id: movementId,
    };

    await set(
      ref(database, `businesses/${businessId}/inventoryMovements/${movementId}`),
      newMovement
    );

    // Actualizar producto
    const product = await get(ref(database, `businesses/${businessId}/products/${movement.productId}`));
    if (product.exists()) {
      const productData = product.val() as Product;
      const quantity = movement.type === 'out' || movement.type === 'removal' 
        ? productData.quantity - movement.quantity
        : productData.quantity + movement.quantity;

      await update(ref(database, `businesses/${businessId}/products/${movement.productId}`), {
        quantity: Math.max(0, quantity),
      });
    }

    // Verificar alertas de stock
    await checkStockAlert(businessId, movement.productId);

    await logAuditEvent(
      businessId,
      'SYSTEM',
      'INVENTORY_MOVEMENT',
      'INVENTORY',
      movement.productId,
      { movement }
    );

    return { success: true, movementId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInventoryMovements(businessId: string): Promise<InventoryMovement[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/inventoryMovements`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as InventoryMovement[];
  } catch (error) {
    console.error('Error fetching inventory movements:', error);
    return [];
  }
}

// ============================================================================
// ALERTAS DE STOCK
// ============================================================================

export async function checkStockAlert(businessId: string, productId: string) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/products/${productId}`));
    if (!snapshot.exists()) return;

    const product = snapshot.val() as Product;

    // Alertas automáticas
    let alertType: 'low' | 'high' | 'expired' | null = null;
    let message = '';

    if (product.quantity <= product.minStock) {
      alertType = 'low';
      message = `Stock bajo: ${product.name} (${product.quantity} unidades)`;
    }

    if (product.maxStock && product.quantity >= product.maxStock) {
      alertType = 'high';
      message = `Stock alto: ${product.name} (${product.quantity} unidades)`;
    }

    if (product.expiryDate && product.expiryDate <= Date.now()) {
      alertType = 'expired';
      message = `Producto expirado: ${product.name}`;
    }

    if (alertType) {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const alert: StockAlert = {
        id: alertId,
        businessId,
        productId,
        type: alertType,
        message,
        isResolved: false,
        createdAt: Date.now(),
      };

      await set(ref(database, `businesses/${businessId}/stockAlerts/${alertId}`), alert);
    }
  } catch (error) {
    console.error('Error checking stock alert:', error);
  }
}

export async function getStockAlerts(businessId: string): Promise<StockAlert[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/stockAlerts`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as StockAlert[];
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    return [];
  }
}

export async function resolveStockAlert(businessId: string, alertId: string) {
  try {
    await update(ref(database, `businesses/${businessId}/stockAlerts/${alertId}`), {
      isResolved: true,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GESTIÓN DE PROVEEDORES
// ============================================================================

export async function createSupplier(businessId: string, supplier: Omit<Supplier, 'id'>) {
  try {
    const supplierId = `sup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSupplier: Supplier = {
      ...supplier,
      id: supplierId,
    };

    await set(ref(database, `businesses/${businessId}/suppliers/${supplierId}`), newSupplier);
    return { success: true, supplierId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSupplier(businessId: string, supplierId: string): Promise<Supplier | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/suppliers/${supplierId}`));
    return snapshot.exists() ? (snapshot.val() as Supplier) : null;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return null;
  }
}

export async function getAllSuppliers(businessId: string): Promise<Supplier[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/suppliers`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Supplier[];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
}

export async function updateSupplier(businessId: string, supplierId: string, updates: Partial<Supplier>) {
  try {
    await update(ref(database, `businesses/${businessId}/suppliers/${supplierId}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ÓRDENES DE COMPRA
// ============================================================================

export async function createPurchaseOrder(
  businessId: string,
  order: Omit<PurchaseOrder, 'id' | 'createdAt'>
) {
  try {
    const orderId = `po_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newOrder: PurchaseOrder = {
      ...order,
      id: orderId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/purchaseOrders/${orderId}`), newOrder);

    await logAuditEvent(businessId, 'SYSTEM', 'PURCHASE_ORDER_CREATED', 'PURCHASES', orderId, {
      total: order.total,
    });

    return { success: true, orderId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPurchaseOrder(businessId: string, orderId: string): Promise<PurchaseOrder | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/purchaseOrders/${orderId}`));
    return snapshot.exists() ? (snapshot.val() as PurchaseOrder) : null;
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    return null;
  }
}

export async function getAllPurchaseOrders(businessId: string): Promise<PurchaseOrder[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/purchaseOrders`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as PurchaseOrder[];
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
}

export async function receivePurchaseOrder(
  businessId: string,
  orderId: string,
  receivedQuantities: { [productId: string]: number }
) {
  try {
    const order = await getPurchaseOrder(businessId, orderId);
    if (!order) throw new Error('Purchase order not found');

    let partiallyReceived = false;

    for (const item of order.items) {
      const received = receivedQuantities[item.productId] || 0;
      if (received > 0 && received !== item.quantity) {
        partiallyReceived = true;
      }

      if (received > 0) {
        await recordInventoryMovement(businessId, {
          productId: item.productId,
          warehouseId: '', // Almacén principal
          type: 'in',
          quantity: received,
          reference: orderId,
          notes: `Recepción de PO ${orderId}`,
          timestamp: Date.now(),
        });
      }
    }

    await update(ref(database, `businesses/${businessId}/purchaseOrders/${orderId}`), {
      status: partiallyReceived ? 'partially_received' : 'received',
      receivedAt: Date.now(),
    });

    return { success: true, partiallyReceived };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CUENTAS POR PAGAR
// ============================================================================

export async function createAccountsPayable(
  businessId: string,
  accountPayable: Omit<AccountsPayable, 'id' | 'createdAt'>
) {
  try {
    const apId = `ap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAP: AccountsPayable = {
      ...accountPayable,
      id: apId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/accountsPayable/${apId}`), newAP);
    return { success: true, apId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccountsPayable(businessId: string): Promise<AccountsPayable[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/accountsPayable`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as AccountsPayable[];
  } catch (error) {
    console.error('Error fetching accounts payable:', error);
    return [];
  }
}

export async function recordPayment(
  businessId: string,
  apId: string,
  amount: number
) {
  try {
    const ap = await get(ref(database, `businesses/${businessId}/accountsPayable/${apId}`));
    if (!ap.exists()) throw new Error('Account payable not found');

    const apData = ap.val() as AccountsPayable;
    const newPaidAmount = apData.paidAmount + amount;
    const status = newPaidAmount >= apData.amount ? 'paid' : 'partial';

    await update(ref(database, `businesses/${businessId}/accountsPayable/${apId}`), {
      paidAmount: newPaidAmount,
      status,
    });

    return { success: true, status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
