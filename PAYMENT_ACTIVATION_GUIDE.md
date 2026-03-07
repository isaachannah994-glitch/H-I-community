# INSTRUCCIONES DE ACTIVACIÓN - SISTEMA DE PAGOS H&I POS

## 📋 ÍNDICE RÁPIDO

1. [Opción 1: Pago Personalizado](#opción-1-pago-personalizado)
2. [Opción 2: 2Checkout](#opción-2-2checkout)
3. [Opción 3: PayU](#opción-3-payu)
4. [Opción 4: Mercado Pago](#opción-4-mercado-pago)
5. [Métodos Locales](#métodos-locales-efectivo-transferencia-cheque)

---

## ✨ OPCIÓN 1: Pago Personalizado

### Tu Implementación

**Tiempo de Setup:** 30-60 minutos (depende de complejidad)

### Paso 1: Crear tu API de Pagos

Tu API debe ser capaz de:
- Recibir solicitudes POST con información de pago
- Procesar el pago en tu proveedor o sistema
- Retornar un ID de transacción único
- Enviar un webhook cuando el pago se confirme

### Paso 2: Documentación Mínima

Tu API debe documentar:
- Endpoint para iniciar pago
- Payload esperado
- Respuesta exitosa
- Estructura de webhook
- Formato de firma para validación

### Paso 3: Configurar Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_CUSTOM_PAYMENT_API=https://tu-api.com/payments
CUSTOM_PAYMENT_API_KEY=tu_api_key_secreto
CUSTOM_PAYMENT_WEBHOOK_SECRET=tu_webhook_secret
```

### Paso 4: Implementar Lógica

Editar `lib/payment-service.ts` en la función `customPaymentService`:

```typescript
// Ejemplo básico
export const customPaymentService = {
  async initializePayment(
    businessId: string,
    saleId: string,
    amount: number,
    currency: string,
    customData: Record<string, any>
  ) {
    // Tu implementación aquí
    const response = await fetch(`${CUSTOM_PAYMENT_CONFIG.API_ENDPOINT}/initialize`, {
      method: 'POST',
      headers: {
        'X-API-Key': CUSTOM_PAYMENT_CONFIG.API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId: businessId,
        orderId: saleId,
        amount,
        currency,
        ...customData,
      }),
    });
    
    // Procesar respuesta
    const data = await response.json();
    // ... resto de lógica
  }
};
```

### Paso 5: Habilitar en Configuración

En `lib/payment-config.ts`:

```typescript
export const CUSTOM_PAYMENT_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  API_ENDPOINT: process.env.NEXT_PUBLIC_CUSTOM_PAYMENT_API || '',
  API_KEY: process.env.CUSTOM_PAYMENT_API_KEY || '',
  WEBHOOK_SECRET: process.env.CUSTOM_PAYMENT_WEBHOOK_SECRET || '',
};
```

### Paso 6: Probar

1. Crear una venta en POS
2. Seleccionar "Pago Personalizado"
3. Verificar que se envíe a tu API
4. Confirmar que webhook se reciba

### Documentación Extendida

Ver: `PAYMENT_IMPLEMENTATION_GUIDE.md` → Sección "GUÍA: Implementar tu Opción 1 Personalizada"

---

## 🔗 OPCIÓN 2: 2Checkout

### Información del Proveedor

- **Sitio Web:** https://www.2checkout.com
- **Documentación:** https://knowledgebase.2checkout.com/
- **Soporte:** support@2checkout.com
- **Comisión:** 2.9%

### Paso 1: Registrarse

1. Ir a https://www.2checkout.com
2. Hacer clic en "Signup" o "Comenzar"
3. Llenar información de negocio:
   - Nombre de empresa
   - Email
   - País
   - Tipo de producto/servicio
4. Verificar email

### Paso 2: Obtener Credenciales

1. Acceder a tu cuenta
2. Ir a **Settings → Developer**
3. Buscar "API Keys" o "Credentials"
4. Copiar:
   - **Public Key** → `NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY`
   - **Account Number** → `NEXT_PUBLIC_2CHECKOUT_ACCOUNT`
5. Generar webhook secret en **Webhooks section**

### Paso 3: Configurar Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY=tu_public_key_aqui
NEXT_PUBLIC_2CHECKOUT_ACCOUNT=tu_account_number_aqui
TWOCHECKOUT_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### Paso 4: Habilitar en Configuración

En `lib/payment-config.ts`:

```typescript
export const TWOCHECKOUT_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  PUBLIC_KEY: process.env.NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY || '',
  ACCOUNT_NUMBER: process.env.NEXT_PUBLIC_2CHECKOUT_ACCOUNT || '',
  // ... resto permanece igual
};
```

### Paso 5: Configurar Webhook

1. En cuenta 2Checkout → Settings → Webhooks
2. Agregar URL de webhook:
   ```
   https://tu-dominio.com/api/webhooks/2checkout
   ```
3. Seleccionar eventos:
   - Payment completed
   - Payment refunded
4. Guardar

### Paso 6: Pruebas

**Ambiente de Prueba:**

1. Usar tarjeta de prueba: `4111111111111111`
2. CVC: `123`
3. Fecha: Cualquiera futura
4. Crear una venta en POS
5. Seleccionar "2Checkout"
6. Verificar que se redirija a 2Checkout
7. Completar con tarjeta de prueba

### Paso 7: Deploy a Producción

1. En Vercel Settings → Vars
2. Agregar variables de entorno
3. Cambiar `ENABLED: true`
4. Re-deploy

---

## 💳 OPCIÓN 3: PayU

### Información del Proveedor

- **Sitio Web:** https://www.payulatam.com
- **Documentación:** https://developers.payulatam.com/
- **Soporte:** developers@payulatam.com
- **Comisión:** 2.95%
- **Países:** Colombia, Perú, Argentina, Chile, México

### Paso 1: Registrarse

1. Ir a https://www.payulatam.com
2. Hacer clic en "Registrarse"
3. Llenar información:
   - Nombre completo
   - Email
   - Tipo de negocio
4. Verificar email

### Paso 2: Obtener Credenciales

1. Acceder a cuenta
2. Ir a **Panel de Control → Configuración**
3. Buscar "Información de Cuenta"
4. Copiar:
   - **Merchant ID** → `NEXT_PUBLIC_PAYU_MERCHANT_ID`
   - **Account ID** → `NEXT_PUBLIC_PAYU_ACCOUNT_ID`
5. En **Configuración → API & Webhooks**:
   - Copiar **API Key** → `PAYU_API_KEY`
   - Copiar **API Login** → `PAYU_API_LOGIN`
   - Generar **Webhook Secret** → `PAYU_WEBHOOK_SECRET`

### Paso 3: Configurar Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_PAYU_MERCHANT_ID=tu_merchant_id_aqui
NEXT_PUBLIC_PAYU_ACCOUNT_ID=tu_account_id_aqui
PAYU_API_KEY=tu_api_key_aqui
PAYU_API_LOGIN=tu_api_login_aqui
PAYU_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### Paso 4: Habilitar en Configuración

En `lib/payment-config.ts`:

```typescript
export const PAYU_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  MERCHANT_ID: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || '',
  ACCOUNT_ID: process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID || '',
  API_KEY: process.env.PAYU_API_KEY || '',
  API_LOGIN: process.env.PAYU_API_LOGIN || '',
  // ... resto permanece igual
};
```

### Paso 5: Configurar Webhook

1. En cuenta PayU → Configuración → Webhooks
2. Agregar URL:
   ```
   https://tu-dominio.com/api/webhooks/payu
   ```
3. Seleccionar eventos:
   - TRANSACTION_NOTIFICATION
   - AUTHORIZATION_FAILED
4. Guardar

### Paso 6: Pruebas

**Tarjetas de Prueba:**

| Número | CVC | Resultado |
|--------|-----|-----------|
| 4111111111111111 | 123 | Aprobado |
| 4111111111111112 | 123 | Rechazado |
| 5425233010103403 | 123 | Aprobado (Mastercard) |

### Paso 7: Deploy a Producción

1. En Vercel Settings → Vars
2. Agregar variables de entorno
3. Cambiar `ENABLED: true`
4. Re-deploy

---

## 💰 OPCIÓN 4: Mercado Pago ⭐ (Recomendado)

### Información del Proveedor

- **Sitio Web:** https://www.mercadopago.com
- **Documentación:** https://www.mercadopago.com/developers
- **Soporte:** developers@mercadopago.com
- **Comisión:** 2.99%
- **Países:** Argentina, Brasil, Chile, Colombia, Costa Rica, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, Uruguay, Venezuela

### Paso 1: Registrarse

1. Ir a https://www.mercadopago.com/developers
2. Hacer clic en "Comenzar"
3. Llenar información:
   - Correo electrónico
   - Contraseña
   - País
   - Tipo de cuenta
4. Verificar email

### Paso 2: Obtener Credenciales

1. Acceder a tu cuenta de desarrollador
2. Ir a **Tu Negocio → Credenciales de Producción**
3. Copiar:
   - **Public Key** → `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`
   - **Access Token** → `MERCADO_PAGO_ACCESS_TOKEN`

**O Si estás en pruebas:**
- Ir a **Credenciales de Prueba** (Sandbox)
- Copiar keys de prueba

### Paso 3: Configurar Variables de Entorno

```bash
# .env.local (Desarrollo - Sandbox)
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-tu_public_key_sandbox
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-tu_access_token_sandbox

# O (Producción)
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-tu_public_key_produccion
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-tu_access_token_produccion
```

### Paso 4: Habilitar en Configuración

En `lib/payment-config.ts`:

```typescript
export const MERCADO_PAGO_CONFIG = {
  ENABLED: true, // ✅ Cambiar a true
  PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '',
  ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  // ... resto permanece igual
};
```

### Paso 5: Configurar Webhook (Opcional)

Para recibir notificaciones en tiempo real:

1. En tu cuenta → Webhooks
2. Agregar URL:
   ```
   https://tu-dominio.com/api/webhooks/mercadopago
   ```
3. Eventos a recibir:
   - payment.created
   - payment.updated

### Paso 6: Pruebas

**Tarjetas de Prueba (Sandbox):**

| Número | CVC | Resultado |
|--------|-----|-----------|
| 4235647728025682 | 123 | Aprobado |
| 5031433215406351 | 123 | Rechazado |
| 6011555333300068 | 123 | Aprobado (Discover) |

**Instrucciones:**
1. Crear una venta en POS
2. Seleccionar "Mercado Pago"
3. Usar tarjeta de prueba
4. Completar datos ficticios
5. Confirmar que se redirija a Mercado Pago
6. Completar pago
7. Retornar a callback page
8. Verificar en Firebase que se haya registrado

### Paso 7: Deploy a Producción

1. En Vercel Settings → Vars
2. Agregar variables de entorno (keys de producción)
3. Cambiar `ENABLED: true`
4. Re-deploy

---

## 💵 Métodos Locales: Efectivo, Transferencia, Cheque

### ✅ NO REQUIERE CONFIGURACIÓN

Estos métodos están **siempre disponibles** sin necesidad de credenciales.

### Efectivo

**Flujo:**
1. Cliente selecciona "Efectivo"
2. Sistema genera comprobante
3. Pago registrado inmediatamente
0. Sin comisión

**Instrucciones en UI:**
- Recibe pago en efectivo del cliente
- Confirma monto exacto
- Entrega recibo o factura

### Transferencia Bancaria

**Flujo:**
1. Cliente selecciona "Transferencia"
2. Sistema muestra datos bancarios
3. Cliente realiza transferencia
4. Confirmar en sistema una vez recibida

**Datos a mostrar:**
- Banco
- Número de cuenta
- Titular
- RUT/NIT

### Cheque

**Flujo:**
1. Cliente selecciona "Cheque"
2. Sistema solicita datos del cheque
3. Registrar número de cheque
4. Datos guardados en transacción

**Información requerida:**
- Número de cheque
- Banco
- Fecha de vencimiento
- Titular

---

## 🔄 CAMBIAR ENTRE PROVEEDORES

### Si ya configuraste uno, agregar otro:

1. Obtener credenciales del nuevo proveedor
2. Agregar variables de entorno
3. En `lib/payment-config.ts`, cambiar `ENABLED: true`
4. Probar en desarrollo
5. Deploy

### Si quieres deshabilitar un proveedor:

```typescript
// En lib/payment-config.ts
export const MERCADO_PAGO_CONFIG = {
  ENABLED: false, // ✅ Cambiar a false
  // ...
};
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Proveedor no está habilitado"
**Solución:** Cambiar `ENABLED: true` en `payment-config.ts`

### Error: "API Key no encontrada"
**Solución:** Verificar que las variables de entorno estén configuradas en `.env.local`

### Error: "Webhook no se recibe"
**Solución:** 
1. Verificar URL en proveedor
2. Usar ngrok si está en localhost
3. Revisar logs en consola

### Pago no se procesa
**Solución:**
1. Verificar credenciales
2. Revisar moneda/monto
3. Contactar soporte del proveedor

---

## ✅ CHECKLIST FINAL

Antes de ir a producción:

- [ ] Credenciales obtenidas
- [ ] Variables de entorno configuradas
- [ ] ENABLED: true en payment-config.ts
- [ ] Webhooks configurados en proveedor
- [ ] Pruebas realizadas en desarrollo
- [ ] Transacciones aparecen en Firebase
- [ ] Variables agregadas en Vercel
- [ ] HTTPS configurado en dominio de producción
- [ ] Documentación de soporte lista

---

**¡Listo para aceptar pagos!** 🚀
