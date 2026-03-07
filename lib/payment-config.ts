// Configuración de Proveedores de Pago Locales
// Opción 1: Personalizada (Implementada por usuario)
// Opción 2: 2Checkout
// Opción 3: PayU
// Opción 4: Mercado Pago

export const PAYMENT_PROVIDERS = {
  CUSTOM: 'custom', // Opción 1 - Implementar por usuario
  TWO_CHECKOUT: '2checkout', // Opción 2
  PAYU: 'payu', // Opción 3
  MERCADO_PAGO: 'mercadopago', // Opción 4
  CASH: 'cash', // Efectivo
  TRANSFER: 'transfer', // Transferencia
  CHECK: 'check', // Cheque
} as const;

export type PaymentProvider = typeof PAYMENT_PROVIDERS[keyof typeof PAYMENT_PROVIDERS];

// Configuración 2Checkout
export const TWOCHECKOUT_CONFIG = {
  ENABLED: false, // Cambiar a true cuando esté listo
  PUBLIC_KEY: process.env.NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY || '',
  ACCOUNT_NUMBER: process.env.NEXT_PUBLIC_2CHECKOUT_ACCOUNT || '',
  API_URL: 'https://secure.2checkout.com/api/v1',
  WEBHOOK_SECRET: process.env.TWOCHECKOUT_WEBHOOK_SECRET || '',
};

// Configuración PayU
export const PAYU_CONFIG = {
  ENABLED: false, // Cambiar a true cuando esté listo
  MERCHANT_ID: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || '',
  ACCOUNT_ID: process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID || '',
  API_KEY: process.env.PAYU_API_KEY || '',
  API_LOGIN: process.env.PAYU_API_LOGIN || '',
  API_URL: 'https://api.payulatam.com/payments-api/4.0/service.cgi',
  TEST_MODE: process.env.NODE_ENV === 'development',
  WEBHOOK_SECRET: process.env.PAYU_WEBHOOK_SECRET || '',
};

// Configuración Mercado Pago
export const MERCADO_PAGO_CONFIG = {
  ENABLED: false, // Cambiar a true cuando esté listo
  PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '',
  ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  API_URL: 'https://api.mercadopago.com',
  WEBHOOK_URL: process.env.MERCADO_PAGO_WEBHOOK_URL || '',
  NOTIFICATION_URL: process.env.MERCADO_PAGO_NOTIFICATION_URL || '',
};

// Configuración Opción 1 - Personalizada (Implementar por usuario)
export const CUSTOM_PAYMENT_CONFIG = {
  ENABLED: false, // El usuario la activará
  API_ENDPOINT: process.env.NEXT_PUBLIC_CUSTOM_PAYMENT_API || '',
  API_KEY: process.env.CUSTOM_PAYMENT_API_KEY || '',
  WEBHOOK_SECRET: process.env.CUSTOM_PAYMENT_WEBHOOK_SECRET || '',
  // Agregar más configuraciones según sea necesario
};

// Métodos de pago disponibles por negocio
export const PAYMENT_METHODS_BY_BUSINESS_TYPE = {
  bodega: ['cash', 'transfer', 'check', 'mercadopago', 'payu'],
  ferreteria: ['cash', 'transfer', 'check', 'mercadopago', 'payu', '2checkout'],
  restaurante: ['cash', 'transfer', 'mercadopago', 'payu'],
  zapateria: ['cash', 'transfer', 'mercadopago', 'payu', '2checkout'],
  ropa: ['cash', 'transfer', 'mercadopago', 'payu', '2checkout'],
  motos: ['cash', 'transfer', 'check', 'payu', 'mercadopago'],
};

// Configuración de comisiones por método de pago (en porcentaje)
export const PAYMENT_FEES = {
  cash: 0,
  transfer: 0,
  check: 0,
  '2checkout': 2.9,
  payu: 2.95,
  mercadopago: 2.99,
  custom: 0, // El usuario define sus propias comisiones
};

// Descripción de métodos de pago
export const PAYMENT_METHOD_LABELS: Record<PaymentProvider, string> = {
  custom: 'Pago Personalizado',
  '2checkout': '2Checkout',
  payu: 'PayU',
  mercadopago: 'Mercado Pago',
  cash: 'Efectivo',
  transfer: 'Transferencia Bancaria',
  check: 'Cheque',
};

// Estados de transacción
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
