import axios from 'axios';
import { db } from './firebase';
import { ref, push, set, update, get } from 'firebase/database';
import {
  PAYMENT_PROVIDERS,
  TWOCHECKOUT_CONFIG,
  PAYU_CONFIG,
  MERCADO_PAGO_CONFIG,
  CUSTOM_PAYMENT_CONFIG,
  PAYMENT_FEES,
  TRANSACTION_STATUS,
  type PaymentProvider,
  type TransactionStatus,
} from './payment-config';

export interface PaymentTransaction {
  id: string;
  businessId: string;
  saleId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: TransactionStatus;
  reference: string;
  externalId?: string;
  fee: number;
  netAmount: number;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// ==================== SERVICIO 2CHECKOUT ====================
export const twoCheckoutService = {
  async initializePayment(
    businessId: string,
    saleId: string,
    amount: number,
    currency: string,
    customerEmail: string,
    customerName: string
  ) {
    if (!TWOCHECKOUT_CONFIG.ENABLED) {
      throw new Error('2Checkout no está habilitado');
    }

    try {
      const response = await axios.post(
        `${TWOCHECKOUT_CONFIG.API_URL}/payments`,
        {
          merchantAccNo: TWOCHECKOUT_CONFIG.ACCOUNT_NUMBER,
          amount: amount * 100, // En centavos
          currency: currency.toUpperCase(),
          billingAddr: {
            email: customerEmail,
            name: customerName,
          },
          merchantOrderId: saleId,
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback/2checkout`,
          directReturn: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Merchant-Account': TWOCHECKOUT_ACCOUNT_NUMBER,
          },
        }
      );

      // Guardar transacción pendiente
      const transaction: PaymentTransaction = {
        id: push(ref(db, 'transactions')).key || '',
        businessId,
        saleId,
        amount,
        currency,
        provider: PAYMENT_PROVIDERS.TWO_CHECKOUT,
        status: TRANSACTION_STATUS.PENDING,
        reference: response.data.reference || saleId,
        externalId: response.data.transactionId,
        fee: (amount * PAYMENT_FEES['2checkout']) / 100,
        netAmount: amount - (amount * PAYMENT_FEES['2checkout']) / 100,
        metadata: response.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(ref(db, `transactions/${transaction.id}`), transaction);

      return {
        transactionId: transaction.id,
        redirectUrl: response.data.paymentUrl,
        status: 'pending',
      };
    } catch (error: any) {
      console.error('[2Checkout] Error:', error.message);
      throw new Error(`Error procesando pago 2Checkout: ${error.message}`);
    }
  },

  async validateCallback(data: any): Promise<boolean> {
    // Validar firma de 2Checkout
    const signature = data.signature;
    // Implementar validación de firma según documentación 2Checkout
    return true;
  },

  async confirmPayment(transactionId: string, referenceId: string) {
    try {
      const transactionRef = ref(db, `transactions/${transactionId}`);
      const snapshot = await get(transactionRef);

      if (!snapshot.exists()) {
        throw new Error('Transacción no encontrada');
      }

      const transaction = snapshot.val();

      // Actualizar a estado COMPLETED
      await update(transactionRef, {
        status: TRANSACTION_STATUS.COMPLETED,
        externalId: referenceId,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        transactionId,
        status: TRANSACTION_STATUS.COMPLETED,
      };
    } catch (error: any) {
      console.error('[2Checkout] Confirm error:', error);
      throw error;
    }
  },
};

// ==================== SERVICIO PAYU ====================
export const payUService = {
  async initializePayment(
    businessId: string,
    saleId: string,
    amount: number,
    currency: string,
    customerEmail: string,
    customerName: string,
    customerPhone: string
  ) {
    if (!PAYU_CONFIG.ENABLED) {
      throw new Error('PayU no está habilitado');
    }

    try {
      // Generar firma
      const signature = generatePayUSignature(
        PAYU_CONFIG.ACCOUNT_ID,
        saleId,
        amount,
        currency
      );

      const response = await axios.post(
        `${PAYU_CONFIG.API_URL}`,
        {
          language: 'es',
          command: 'SUBMIT_TRANSACTION',
          merchant: {
            apiKey: PAYU_CONFIG.API_KEY,
            apiLogin: PAYU_CONFIG.API_LOGIN,
          },
          transaction: {
            order: {
              accountId: PAYU_CONFIG.ACCOUNT_ID,
              referenceCode: saleId,
              description: `Venta ${saleId}`,
              language: 'es',
              signature: signature,
              notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payu`,
              additionalValues: {
                TX_VALUE: {
                  value: amount,
                  currency: currency.toUpperCase(),
                },
              },
              buyer: {
                merchantBuyerId: customerEmail,
                fullName: customerName,
                emailAddress: customerEmail,
                contactPhone: customerPhone,
              },
            },
            payer: {
              fullName: customerName,
              emailAddress: customerEmail,
              contactPhone: customerPhone,
            },
            type: 'AUTHORIZATION_AND_CAPTURE',
            paymentMethod: 'CREDIT_CARD',
            paymentCountry: 'CO', // Colombia
            deviceSessionId: '', // Cargar con token del dispositivo
            ipAddress: '', // Capturar IP del cliente
            userAgent: '', // Capturar user agent
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const transaction: PaymentTransaction = {
        id: push(ref(db, 'transactions')).key || '',
        businessId,
        saleId,
        amount,
        currency,
        provider: PAYMENT_PROVIDERS.PAYU,
        status: TRANSACTION_STATUS.PROCESSING,
        reference: saleId,
        externalId: response.data.transactionResponse?.transactionId,
        fee: (amount * PAYMENT_FEES.payu) / 100,
        netAmount: amount - (amount * PAYMENT_FEES.payu) / 100,
        metadata: response.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(ref(db, `transactions/${transaction.id}`), transaction);

      return {
        transactionId: transaction.id,
        paymentUrl: response.data.transactionResponse?.processUrl,
        status: response.data.transactionResponse?.state,
      };
    } catch (error: any) {
      console.error('[PayU] Error:', error.message);
      throw new Error(`Error procesando pago PayU: ${error.message}`);
    }
  },

  async handleWebhook(webhookData: any) {
    try {
      const { reference_sale, state, transaction_id } = webhookData;

      const status =
        state === '4' ? TRANSACTION_STATUS.COMPLETED :
        state === '6' ? TRANSACTION_STATUS.CANCELLED :
        state === '5' ? TRANSACTION_STATUS.FAILED :
        TRANSACTION_STATUS.PROCESSING;

      // Actualizar transacción en la BD
      const transactionsRef = ref(db, 'transactions');
      const snapshot = await get(transactionsRef);

      if (snapshot.exists()) {
        const transactions = snapshot.val();
        for (const [key, tx] of Object.entries(transactions)) {
          if ((tx as any).saleId === reference_sale) {
            await update(ref(db, `transactions/${key}`), {
              status,
              externalId: transaction_id,
              updatedAt: Date.now(),
            });
            return true;
          }
        }
      }
    } catch (error: any) {
      console.error('[PayU] Webhook error:', error);
      throw error;
    }
  },
};

// ==================== SERVICIO MERCADO PAGO ====================
export const mercadoPagoService = {
  async initializePayment(
    businessId: string,
    saleId: string,
    amount: number,
    currency: string,
    customerEmail: string,
    customerName: string
  ) {
    if (!MERCADO_PAGO_CONFIG.ENABLED) {
      throw new Error('Mercado Pago no está habilitado');
    }

    try {
      const response = await axios.post(
        `${MERCADO_PAGO_CONFIG.API_URL}/checkout/preferences`,
        {
          payer: {
            email: customerEmail,
            name: customerName,
          },
          items: [
            {
              title: `Venta ${saleId}`,
              quantity: 1,
              currency_id: currency === 'ARS' ? 'ARS' : 'COP',
              unit_price: amount,
            },
          ],
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback/mercadopago?status=success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback/mercadopago?status=failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback/mercadopago?status=pending`,
          },
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
          external_reference: saleId,
          auto_return: 'approved',
        },
        {
          headers: {
            Authorization: `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const transaction: PaymentTransaction = {
        id: push(ref(db, 'transactions')).key || '',
        businessId,
        saleId,
        amount,
        currency,
        provider: PAYMENT_PROVIDERS.MERCADO_PAGO,
        status: TRANSACTION_STATUS.PENDING,
        reference: saleId,
        externalId: response.data.id,
        fee: (amount * PAYMENT_FEES.mercadopago) / 100,
        netAmount: amount - (amount * PAYMENT_FEES.mercadopago) / 100,
        metadata: response.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(ref(db, `transactions/${transaction.id}`), transaction);

      return {
        transactionId: transaction.id,
        checkoutUrl: response.data.init_point,
        preferenceId: response.data.id,
        status: 'pending',
      };
    } catch (error: any) {
      console.error('[Mercado Pago] Error:', error.message);
      throw new Error(`Error procesando pago Mercado Pago: ${error.message}`);
    }
  },

  async handleWebhook(webhookData: any) {
    try {
      const { data, action } = webhookData;

      if (action === 'payment.created' || action === 'payment.updated') {
        const paymentId = data.id;

        // Obtener detalles del pago
        const response = await axios.get(
          `${MERCADO_PAGO_CONFIG.API_URL}/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`,
            },
          }
        );

        const paymentData = response.data;
        const saleId = paymentData.external_reference;

        const status =
          paymentData.status === 'approved' ? TRANSACTION_STATUS.COMPLETED :
          paymentData.status === 'rejected' ? TRANSACTION_STATUS.FAILED :
          paymentData.status === 'cancelled' ? TRANSACTION_STATUS.CANCELLED :
          TRANSACTION_STATUS.PROCESSING;

        // Actualizar transacción en BD
        const transactionsRef = ref(db, 'transactions');
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
          const transactions = snapshot.val();
          for (const [key, tx] of Object.entries(transactions)) {
            if ((tx as any).saleId === saleId) {
              await update(ref(db, `transactions/${key}`), {
                status,
                externalId: paymentId,
                updatedAt: Date.now(),
              });
              return true;
            }
          }
        }
      }
    } catch (error: any) {
      console.error('[Mercado Pago] Webhook error:', error);
      throw error;
    }
  },
};

// ==================== SERVICIO PAGO PERSONALIZADO (OPCIÓN 1) ====================
export const customPaymentService = {
  async initializePayment(
    businessId: string,
    saleId: string,
    amount: number,
    currency: string,
    customData: Record<string, any>
  ) {
    if (!CUSTOM_PAYMENT_CONFIG.ENABLED) {
      throw new Error('Pago personalizado no está habilitado');
    }

    try {
      // El usuario implementará la lógica específica aquí
      // Este es un template que el usuario puede personalizar

      const response = await axios.post(
        `${CUSTOM_PAYMENT_CONFIG.API_ENDPOINT}/initialize`,
        {
          merchantId: businessId,
          orderId: saleId,
          amount,
          currency,
          ...customData,
        },
        {
          headers: {
            'X-API-Key': CUSTOM_PAYMENT_CONFIG.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const transaction: PaymentTransaction = {
        id: push(ref(db, 'transactions')).key || '',
        businessId,
        saleId,
        amount,
        currency,
        provider: PAYMENT_PROVIDERS.CUSTOM,
        status: TRANSACTION_STATUS.PENDING,
        reference: saleId,
        externalId: response.data.transactionId,
        fee: 0, // El usuario define sus propias comisiones
        netAmount: amount,
        metadata: response.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(ref(db, `transactions/${transaction.id}`), transaction);

      return {
        transactionId: transaction.id,
        data: response.data,
        status: 'pending',
      };
    } catch (error: any) {
      console.error('[Custom Payment] Error:', error.message);
      throw new Error(`Error procesando pago personalizado: ${error.message}`);
    }
  },

  async handleWebhook(webhookData: any) {
    // El usuario implementará la validación de webhook personalizada
    console.log('[Custom Payment] Webhook recibido:', webhookData);
    // Implementar validación y actualización de transacción según el servicio personalizado
    return true;
  },
};

// ==================== SERVICIOS GENÉRICOS ====================
export const getTransactionStatus = async (transactionId: string) => {
  try {
    const snapshot = await get(ref(db, `transactions/${transactionId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    throw new Error('Transacción no encontrada');
  } catch (error) {
    console.error('Error obteniendo transacción:', error);
    throw error;
  }
};

export const recordLocalPayment = async (
  businessId: string,
  saleId: string,
  amount: number,
  method: 'cash' | 'transfer' | 'check',
  currency: string = 'COP'
) => {
  const transaction: PaymentTransaction = {
    id: push(ref(db, 'transactions')).key || '',
    businessId,
    saleId,
    amount,
    currency,
    provider: method,
    status: TRANSACTION_STATUS.COMPLETED,
    reference: saleId,
    fee: 0,
    netAmount: amount,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await set(ref(db, `transactions/${transaction.id}`), transaction);
  return transaction;
};

export const refundTransaction = async (transactionId: string, reason: string) => {
  try {
    const snapshot = await get(ref(db, `transactions/${transactionId}`));
    if (!snapshot.exists()) {
      throw new Error('Transacción no encontrada');
    }

    const transaction = snapshot.val();

    // Procesar reembolso según el proveedor
    switch (transaction.provider) {
      case PAYMENT_PROVIDERS.TWO_CHECKOUT:
        // Implementar lógica de reembolso 2Checkout
        break;
      case PAYMENT_PROVIDERS.PAYU:
        // Implementar lógica de reembolso PayU
        break;
      case PAYMENT_PROVIDERS.MERCADO_PAGO:
        // Implementar lógica de reembolso Mercado Pago
        break;
      case PAYMENT_PROVIDERS.CUSTOM:
        // El usuario implementará la lógica personalizada
        break;
    }

    await update(ref(db, `transactions/${transactionId}`), {
      status: TRANSACTION_STATUS.REFUNDED,
      metadata: {
        ...transaction.metadata,
        refundReason: reason,
      },
      updatedAt: Date.now(),
    });

    return { success: true, transactionId };
  } catch (error) {
    console.error('Error reembolsando transacción:', error);
    throw error;
  }
};

// ==================== UTILIDADES ====================
function generatePayUSignature(
  accountId: string,
  referenceCode: string,
  amount: number,
  currency: string
): string {
  // Implementar hash MD5 según documentación PayU
  // Este es un placeholder - implementar con crypto correcto
  return '';
}

export const getAvailablePaymentMethods = (businessType: string): PaymentProvider[] => {
  // Retornar métodos disponibles según tipo de negocio
  // Implementar según necesidad específica
  return ['cash', 'transfer'] as PaymentProvider[];
};
