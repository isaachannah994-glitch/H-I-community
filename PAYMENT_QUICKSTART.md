# ⚡ QUICK START - COMIENZA EN 5 MINUTOS

## 🚀 Opción Rápida: Mercado Pago (Recomendado)

### Paso 1: Registrate en Mercado Pago (2 min)
```bash
# Ir a:
https://www.mercadopago.com/developers

# Hacer clic en "Comenzar" o "Sign up"
# Llenar: email, contraseña, país, tipo de negocio
# Verificar email
```

### Paso 2: Obtén tus Keys (2 min)
```bash
# En tu cuenta Mercado Pago:
# Settings → Credenciales de Producción

# Copiar:
PUBLIC_KEY = APP_USR-xxxxxxxx...
ACCESS_TOKEN = APP_USR-xxxxxxxx...
```

### Paso 3: Configura Variables (1 min)
```bash
# Crear archivo .env.local en raíz del proyecto
# Copiar esto:

NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-tu_public_key_aqui
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-tu_access_token_aqui
```

### Paso 4: Habilita en Código (< 1 min)
```bash
# Abrir: lib/payment-config.ts
# Buscar: MERCADO_PAGO_CONFIG
# Cambiar: ENABLED: false → ENABLED: true

# Guardar y listo!
```

### ¡LISTO! Ahora puedes:
1. Ir a POS
2. Crear una venta
3. Seleccionar "Mercado Pago"
4. Probar con tarjeta: 4235647728025682

---

## 🏪 Para Otros Proveedores

### PayU (Colombia)
```bash
# .env.local
NEXT_PUBLIC_PAYU_MERCHANT_ID=tu_merchant_id
NEXT_PUBLIC_PAYU_ACCOUNT_ID=tu_account_id
PAYU_API_KEY=tu_api_key
PAYU_API_LOGIN=tu_api_login

# lib/payment-config.ts → PAYU_CONFIG → ENABLED: true
```

### 2Checkout
```bash
# .env.local
NEXT_PUBLIC_2CHECKOUT_PUBLIC_KEY=tu_public_key
NEXT_PUBLIC_2CHECKOUT_ACCOUNT=tu_account_number

# lib/payment-config.ts → TWOCHECKOUT_CONFIG → ENABLED: true
```

### Tu Pago Personalizado
```bash
# .env.local
NEXT_PUBLIC_CUSTOM_PAYMENT_API=https://tu-api.com/payments
CUSTOM_PAYMENT_API_KEY=tu_api_key

# lib/payment-config.ts → CUSTOM_PAYMENT_CONFIG → ENABLED: true

# Luego implementar lógica en lib/payment-service.ts
```

---

## 📖 Documentación Completa

- **PAYMENT_ACTIVATION_GUIDE.md** - Guía paso a paso detallada
- **PAYMENT_IMPLEMENTATION_GUIDE.md** - Implementar tu pago personalizado
- **PAYMENT_SYSTEM_SUMMARY.md** - Resumen de características
- **PAYMENT_SYSTEM_COMPLETE.md** - Documento exhaustivo

---

## ✅ Verificar que Funciona

1. Abrir http://localhost:3000
2. Ir a Dashboard → Seleccionar negocio → POS
3. Agregar un producto al carrito
4. Click en "Cobrar"
5. Seleccionar método de pago
6. Si es local: ¡Confirmar! Listo
7. Si es digital: Serás redirigido al proveedor

---

**¡Eso es todo! Tu sistema de pagos está listo.** 🎉
