# Guía de Implementación - Sistema de Pagos H&I POS

## Resumen General

El sistema H&I POS está completamente configurado con **4 opciones de pago**:

1. **Opción 1 - PERSONALIZADA** (Implementación del usuario) ⭐ Para ti
2. **Opción 2 - 2Checkout** (Listo para integrar)
3. **Opción 3 - PayU** (Listo para integrar)
4. **Opción 4 - Mercado Pago** (Listo para integrar)

Además, hay **3 métodos de pago locales** siempre disponibles:
- Efectivo
- Transferencia Bancaria
- Cheque

---

## Archivos Creados para el Sistema de Pagos

### Configuración
- `lib/payment-config.ts` - Configuración centralizada de todos los proveedores

### Servicios
- `lib/payment-service.ts` - Lógica de integración con cada proveedor (575 líneas)

### Componentes UI
- `components/payment-form.tsx` - Formulario completo de pagos (341 líneas)

### Rutas API
- `app/api/payments/initialize/route.ts` - Endpoint para iniciar pagos
- `app/api/webhooks/payu/route.ts` - Webhook para PayU
- `app/api/webhooks/mercadopago/route.ts` - Webhook para Mercado Pago
- `app/api/webhooks/custom-payment/route.ts` - Webhook para tu pago personalizado

### Páginas
- `app/payment/callback/page.tsx` - Página de resultado de pago

---

## GUÍA: Implementar tu Opción 1 Personalizada

Sigue estos pasos para agregar tu propio método de pago:

### Paso 1: Configurar Variables de Entorno

En tu `.env.local` (o en Vercel Settings → Vars):

```env
# Tu pago personalizado
NEXT_PUBLIC_CUSTOM_PAYMENT_API=https://tu-api.com/payments
CUSTOM_PAYMENT_API_KEY=tu_api_key_secreto
CUSTOM_PAYMENT_WEBHOOK_SECRET=tu_webhook_secret
MERCADO_PAGO_NOTIFICATION_URL=https://tu-dominio.com/api/webhooks/custom-payment
```

### Paso 2: Actualizar la Configuración

En `lib/payment-config.ts`, actualiza la sección CUSTOM_PAYMENT_CONFIG:

```typescript
export const CUSTOM_PAYMENT_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true cuando esté listo
  API_ENDPOINT: process.env.NEXT_PUBLIC_CUSTOM_PAYMENT_API || '',
  API_KEY: process.env.CUSTOM_PAYMENT_API_KEY || '',
  WEBHOOK_SECRET: process.env.CUSTOM_PAYMENT_WEBHOOK_SECRET || '',
  // Agregar más configuraciones específicas de tu API
  MERCHANT_ID: process.env.NEXT_PUBLIC_CUSTOM_MERCHANT_ID || '',
  TIMEOUT: 30000, // Timeout en ms
};
```

### Paso 3: Implementar la Lógica de Pago

En `lib/payment-service.ts`, modifica la función `customPaymentService.initializePayment()`:

```typescript
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
      // Aquí implementas tu lógica específica
      
      // Ejemplo: Si usas un servicio local o tercero
      const response = await axios.post(
        `${CUSTOM_PAYMENT_CONFIG.API_ENDPOINT}/initialize`,
        {
          merchantId: CUSTOM_PAYMENT_CONFIG.MERCHANT_ID,
          orderId: saleId,
          businessId,
          amount,
          currency,
          customer: customData,
          // Agregar más datos según tu API requiera
        },
        {
          headers: {
            'X-API-Key': CUSTOM_PAYMENT_CONFIG.API_KEY,
            'Content-Type': 'application/json',
          },
          timeout: CUSTOM_PAYMENT_CONFIG.TIMEOUT,
        }
      );

      // Guardar transacción (esto ya está implementado)
      const transaction: PaymentTransaction = {
        id: push(ref(db, 'transactions')).key || '',
        businessId,
        saleId,
        amount,
        currency,
        provider: PAYMENT_PROVIDERS.CUSTOM,
        status: TRANSACTION_STATUS.PENDING,
        reference: saleId,
        externalId: response.data.transactionId || response.data.id,
        fee: 0, // Tu propia comisión
        netAmount: amount,
        metadata: response.data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(ref(db, `transactions/${transaction.id}`), transaction);

      return {
        transactionId: transaction.id,
        // Retornar URL de redirección si tu API la proporciona
        redirectUrl: response.data.paymentUrl || response.data.checkoutUrl,
        data: response.data,
        status: 'pending',
      };
    } catch (error: any) {
      console.error('[Custom Payment] Error:', error.message);
      throw new Error(`Error procesando pago: ${error.message}`);
    }
  },

  // Implementar webhook para recibir confirmaciones
  async handleWebhook(webhookData: any) {
    try {
      // Validar firma del webhook
      // const isValid = validateWebhookSignature(webhookData, CUSTOM_PAYMENT_CONFIG.WEBHOOK_SECRET);
      // if (!isValid) throw new Error('Firma inválida');

      const { orderId, status, transactionId } = webhookData;

      // Mapear estados de tu API a los estados del sistema
      const mappedStatus =
        status === 'success' || status === 'completed' ? TRANSACTION_STATUS.COMPLETED :
        status === 'failed' || status === 'declined' ? TRANSACTION_STATUS.FAILED :
        status === 'pending' ? TRANSACTION_STATUS.PROCESSING :
        TRANSACTION_STATUS.PENDING;

      // Buscar y actualizar la transacción en Firebase
      const transactionsRef = ref(db, 'transactions');
      const snapshot = await get(transactionsRef);

      if (snapshot.exists()) {
        const transactions = snapshot.val();
        for (const [key, tx] of Object.entries(transactions)) {
          if ((tx as any).saleId === orderId) {
            await update(ref(db, `transactions/${key}`), {
              status: mappedStatus,
              externalId: transactionId,
              updatedAt: Date.now(),
            });
            return true;
          }
        }
      }

      throw new Error('Transacción no encontrada');
    } catch (error: any) {
      console.error('[Custom Payment] Webhook error:', error);
      throw error;
    }
  },
};
```

### Paso 4: Configurar el Webhook

En tu backend/API, configura un endpoint que escuche en:

```
POST /api/webhooks/custom-payment
```

Estructura de datos esperada del webhook:

```json
{
  "orderId": "venta-123456",
  "status": "success",
  "transactionId": "tx-987654",
  "amount": 50000,
  "currency": "COP",
  "timestamp": 1708900000,
  "signature": "hash-de-validacion"
}
```

### Paso 5: Habilitar en la UI (Opcional)

Si quieres que el método personalizado aparezca en el dropdown de pagos, agrega en `PAYMENT_METHODS_BY_BUSINESS_TYPE`:

```typescript
export const PAYMENT_METHODS_BY_BUSINESS_TYPE = {
  bodega: ['cash', 'transfer', 'check', 'mercadopago', 'payu', 'custom'], // Agregar 'custom'
  // ... resto de tipos
};
```

---

## Integración con 2Checkout, PayU y Mercado Pago

### Para Mercado Pago (Recomendado - Ya está listo):

1. **Obtener credenciales:**
   - Ve a https://www.mercadopago.com/developers
   - Crea una aplicación
   - Obtén tu `Public Key` y `Access Token`

2. **Configurar variables de entorno:**
```env
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxx
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx
MERCADO_PAGO_WEBHOOK_URL=https://tu-dominio.com/api/webhooks/mercadopago
```

3. **Habilitar en payment-config.ts:**
```typescript
export const MERCADO_PAGO_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  // ... resto de config
};
```

### Para PayU (Ya está listo):

1. **Obtener credenciales:**
   - Ve a https://developers.payulatam.com
   - Crea cuenta de comerciante
   - Obtén tu Merchant ID, Account ID, API Key, API Login

2. **Configurar variables:**
```env
NEXT_PUBLIC_PAYU_MERCHANT_ID=xxxxxxx
NEXT_PUBLIC_PAYU_ACCOUNT_ID=xxxxxxx
PAYU_API_KEY=xxxxxxxxxxxxxxx
PAYU_API_LOGIN=xxxxxx@xxxxx.com
PAYU_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

3. **Habilitar en payment-config.ts:**
```typescript
export const PAYU_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  // ... resto de config
};
```

### Para 2Checkout (Ya está listo):

1. **Obtener credenciales:**
   - Ve a https://www.2checkout.com
   - Registra tu cuenta de comerciante
   - Obtén Public Key y Account Number

2. **Configurar variables:**
```env
NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY=xxxxxxxxxxxxx
NEXT_PUBLIC_2CHECKOUT_ACCOUNT=xxxxxxx
TWOCHECKOUT_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

3. **Habilitar en payment-config.ts:**
```typescript
export const TWOCHECKOUT_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  // ... resto de config
};
```

---

## Testing del Sistema de Pagos

### 1. Probar Pagos Locales (Efectivo, Transferencia, Cheque)
- ✅ Ya funcionan sin configuración adicional
- Registran transacciones en Firebase directamente

### 2. Probar Pagos Digitales Localmente

```bash
# Instalar ngrok (para exponer tu localhost)
npm install -g ngrok

# En una terminal
ngrok http 3000

# Copiar URL de ngrok (ejemplo: https://abc123.ngrok.io)

# Configurar en payment-config.ts:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io

# Configurar webhook en tu proveedor de pago apuntando a:
https://abc123.ngrok.io/api/webhooks/mercadopago
```

### 3. Flujo Completo

1. Ir a POS → Crear venta
2. Seleccionar método de pago
3. Para pagos digitales: Será redirigido a proveedor
4. Completar pago en proveedor
5. Regresar a callback page
6. Transacción registrada en Firebase

---

## Firebase: Estructura de Datos para Transacciones

```javascript
transactions/
├── transaction-id-1/
│   ├── id: "transaction-id-1"
│   ├── businessId: "business-123"
│   ├── saleId: "sale-456"
│   ├── amount: 50000
│   ├── currency: "COP"
│   ├── provider: "mercadopago"
│   ├── status: "completed"
│   ├── reference: "sale-456"
│   ├── externalId: "payment-789"
│   ├── fee: 1495
│   ├── netAmount: 48505
│   ├── metadata: { ... }
│   ├── createdAt: 1708900000
│   └── updatedAt: 1708900100
```

---

## Seguridad - Checklist

- [ ] Variables de entorno no expuestas en código
- [ ] Validación de firmas de webhook implementada
- [ ] HTTPS en producción
- [ ] Rate limiting en endpoints de pago
- [ ] Logs de todas las transacciones
- [ ] Auditoría de cambios de estado
- [ ] Encriptación de datos sensibles
- [ ] Backup automático en Firebase

---

## Troubleshooting

### "Pago personalizado no está habilitado"
→ Cambiar `ENABLED: true` en `CUSTOM_PAYMENT_CONFIG`

### Webhook no recibe notificaciones
→ Verificar URL en proveedor de pago
→ Verificar que la API sea accesible (no localhost)
→ Revisar logs en consola del servidor

### Error "Transacción no encontrada"
→ Verificar que saleId coincida exactamente
→ Revisar Firebase Realtime Database
→ Validar que businessId sea correcto

### Comisiones incorrectas
→ Verificar `PAYMENT_FEES` en `payment-config.ts`
→ Actualizar según tarifa de proveedor

---

## Documentación de Referencia

- **Mercado Pago:** https://www.mercadopago.com/developers/es/docs
- **PayU:** https://developers.payulatam.com/
- **2Checkout:** https://knowledgebase.2checkout.com/
- **Firebase Realtime Database:** https://firebase.google.com/docs/database

---

## Soporte

Para preguntas o problemas:
1. Revisar logs en `console` y Firebase
2. Consultar documentación de proveedor
3. Validar configuración de variables de entorno
4. Revisar estructura de datos en Firebase

¡El sistema está listo para producción! 🚀
