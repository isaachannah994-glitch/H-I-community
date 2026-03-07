import { ref, set, get, update } from 'firebase/database';
import { database } from './firebase';
import { OnlineStore, OnlineOrder, OnlineOrderItem, Delivery } from './types';
import { logAuditEvent } from './auth-service';

// ============================================================================
// TIENDA EN LÍNEA
// ============================================================================

export async function createOnlineStore(businessId: string, store: Omit<OnlineStore, 'id' | 'createdAt'>) {
  try {
    const storeId = `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newStore: OnlineStore = {
      ...store,
      id: storeId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/onlineStores/${storeId}`), newStore);
    return { success: true, storeId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOnlineStore(businessId: string, storeId: string): Promise<OnlineStore | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/onlineStores/${storeId}`));
    return snapshot.exists() ? (snapshot.val() as OnlineStore) : null;
  } catch (error) {
    console.error('Error fetching online store:', error);
    return null;
  }
}

export async function getAllOnlineStores(businessId: string): Promise<OnlineStore[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/onlineStores`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as OnlineStore[];
  } catch (error) {
    console.error('Error fetching online stores:', error);
    return [];
  }
}

export async function updateOnlineStore(businessId: string, storeId: string, updates: Partial<OnlineStore>) {
  try {
    await update(ref(database, `businesses/${businessId}/onlineStores/${storeId}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ÓRDENES EN LÍNEA
// ============================================================================

export async function createOnlineOrder(businessId: string, order: Omit<OnlineOrder, 'id' | 'createdAt'>) {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newOrder: OnlineOrder = {
      ...order,
      id: orderId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}/onlineOrders/${orderId}`), newOrder);

    await logAuditEvent(businessId, 'SYSTEM', 'ONLINE_ORDER_CREATED', 'ECOMMERCE', orderId, {
      total: order.total,
    });

    return { success: true, orderId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOnlineOrder(businessId: string, orderId: string): Promise<OnlineOrder | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/onlineOrders/${orderId}`));
    return snapshot.exists() ? (snapshot.val() as OnlineOrder) : null;
  } catch (error) {
    console.error('Error fetching online order:', error);
    return null;
  }
}

export async function getAllOnlineOrders(businessId: string): Promise<OnlineOrder[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/onlineOrders`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as OnlineOrder[];
  } catch (error) {
    console.error('Error fetching online orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  businessId: string,
  orderId: string,
  fulfillmentStatus: string,
  paymentStatus?: string
) {
  try {
    const updates: any = { fulfillmentStatus };
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    await update(ref(database, `businesses/${businessId}/onlineOrders/${orderId}`), updates);

    await logAuditEvent(businessId, 'SYSTEM', 'ORDER_STATUS_UPDATED', 'ECOMMERCE', orderId, {
      fulfillmentStatus,
      paymentStatus,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// SISTEMA DE ENTREGA (DELIVERY MANAGEMENT)
// ============================================================================

export async function createDelivery(businessId: string, delivery: Omit<Delivery, 'id'>) {
  try {
    const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newDelivery: Delivery = {
      ...delivery,
      id: deliveryId,
    };

    await set(ref(database, `businesses/${businessId}/deliveries/${deliveryId}`), newDelivery);

    await logAuditEvent(businessId, 'SYSTEM', 'DELIVERY_CREATED', 'DELIVERY', deliveryId);

    return { success: true, deliveryId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDelivery(businessId: string, deliveryId: string): Promise<Delivery | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/deliveries/${deliveryId}`));
    return snapshot.exists() ? (snapshot.val() as Delivery) : null;
  } catch (error) {
    console.error('Error fetching delivery:', error);
    return null;
  }
}

export async function getAllDeliveries(businessId: string): Promise<Delivery[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/deliveries`));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as Delivery[];
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return [];
  }
}

export async function updateDeliveryStatus(
  businessId: string,
  deliveryId: string,
  status: string,
  coordinates?: { lat: number; lng: number }
) {
  try {
    const updates: any = { status };
    if (coordinates) updates.coordinates = coordinates;

    await update(ref(database, `businesses/${businessId}/deliveries/${deliveryId}`), updates);

    if (status === 'delivered') {
      await update(ref(database, `businesses/${businessId}/deliveries/${deliveryId}`), {
        actualDelivery: Date.now(),
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignDeliveryDriver(
  businessId: string,
  deliveryId: string,
  driverId: string
) {
  try {
    await update(ref(database, `businesses/${businessId}/deliveries/${deliveryId}`), {
      driver: driverId,
      status: 'picked',
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// OPCIONES DE RETIRO EN TIENDA (PICK-UP)
// ============================================================================

export async function createPickupOrder(
  businessId: string,
  orderId: string,
  pickupTime: number,
  pickupLocation?: string
) {
  try {
    await update(ref(database, `businesses/${businessId}/onlineOrders/${orderId}`), {
      shippingMethod: 'pickup',
      shippingAddress: pickupLocation || 'Tienda Principal',
    });

    const pickupId = `pickup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await set(ref(database, `businesses/${businessId}/pickupOrders/${pickupId}`), {
      orderId,
      pickupTime,
      status: 'pending',
      createdAt: Date.now(),
    });

    return { success: true, pickupId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markPickupAsReady(businessId: string, pickupId: string) {
  try {
    await update(ref(database, `businesses/${businessId}/pickupOrders/${pickupId}`), {
      status: 'ready',
      readyAt: Date.now(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completePickup(businessId: string, pickupId: string) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/pickupOrders/${pickupId}`));
    if (!snapshot.exists()) throw new Error('Pickup not found');

    const pickup = snapshot.val();
    await update(ref(database, `businesses/${businessId}/pickupOrders/${pickupId}`), {
      status: 'completed',
      completedAt: Date.now(),
    });

    await updateOrderStatus(businessId, pickup.orderId, 'delivered');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// SUSCRIPCIONES DE COMPRA RECURRENTE
// ============================================================================

export async function createSubscription(
  businessId: string,
  customerId: string,
  items: OnlineOrderItem[],
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  startDate: number
) {
  try {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await set(ref(database, `businesses/${businessId}/subscriptions/${subscriptionId}`), {
      customerId,
      items,
      frequency,
      startDate,
      isActive: true,
      createdAt: Date.now(),
    });

    await logAuditEvent(
      businessId,
      customerId,
      'SUBSCRIPTION_CREATED',
      'ECOMMERCE',
      subscriptionId
    );

    return { success: true, subscriptionId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSubscriptions(businessId: string, customerId?: string): Promise<any[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/subscriptions`));
    if (!snapshot.exists()) return [];

    const subscriptions = Object.values(snapshot.val()) as any[];
    return customerId ? subscriptions.filter(s => s.customerId === customerId) : subscriptions;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

export async function cancelSubscription(businessId: string, subscriptionId: string) {
  try {
    await update(ref(database, `businesses/${businessId}/subscriptions/${subscriptionId}`), {
      isActive: false,
      cancelledAt: Date.now(),
    });

    await logAuditEvent(
      businessId,
      'SYSTEM',
      'SUBSCRIPTION_CANCELLED',
      'ECOMMERCE',
      subscriptionId
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// RECUPERACIÓN DE CARRITOS ABANDONADOS
// ============================================================================

export async function trackAbandonedCart(
  businessId: string,
  customerId: string,
  items: OnlineOrderItem[],
  total: number
) {
  try {
    const cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await set(ref(database, `businesses/${businessId}/abandonedCarts/${cartId}`), {
      customerId,
      items,
      total,
      recoveryAttempts: 0,
      lastAttempt: null,
      createdAt: Date.now(),
    });

    return { success: true, cartId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAbandonedCarts(businessId: string): Promise<any[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/abandonedCarts`));
    if (!snapshot.exists()) return [];

    const carts = Object.values(snapshot.val()) as any[];
    return carts.filter(
      c => Date.now() - c.createdAt > 3600000 && c.recoveryAttempts < 3
    );
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return [];
  }
}

export async function recordRecoveryAttempt(businessId: string, cartId: string) {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/abandonedCarts/${cartId}`));
    if (!snapshot.exists()) throw new Error('Cart not found');

    const cart = snapshot.val();
    await update(ref(database, `businesses/${businessId}/abandonedCarts/${cartId}`), {
      recoveryAttempts: cart.recoveryAttempts + 1,
      lastAttempt: Date.now(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
