# H&I POS System - Sistema Integral de Gestión de Negocios

**Propietario:** isaac03.24castillo@gmail.com  
**Versión:** 2.0.0  
**Estado:** Production Ready - Todos los errores corregidos

## 🔧 FIXES V2.0 - TODOS LOS PROBLEMAS RESUELTOS

### ✅ Error de Context - RESUELTO
- Creé `app/providers.tsx` como Client Component
- AuthProvider ahora funciona correctamente con layout.tsx
- **Resultado:** `useAuth()` funciona en cualquier página sin errores

### ✅ Pantallas en Blanco - RESUELTO  
- AuthProvider envoltura correcta
- Estado de carga mejorado
- **Resultado:** Navegación suave sin pantallas en blanco

### ✅ Diseño Profesional H&I - ACTUALIZADO
- Tema: Azul marino (#0f172a) + Cyan (#06b6d4)
- Logo: Professional shield design
- Pages: Login y Register rediseñadas completamente
- **Resultado:** Sistema moderno y profesional

---

## 🎨 Nuevo Diseño Visual

### Colores H&I Profesional
```
Azul Marino:    #0f172a (slate-950)   - Principal
Cyan Primario:  #06b6d4 (cyan-500)    - Acentos
Blanco/Texto:   #f1f5f9 (slate-100)   - Legibilidad
Campos:         #1e293b (slate-800)   - Inputs
```

### Páginas Rediseñadas
- ✅ `/login` - Moderno con logo + tema profesional
- ✅ `/register` - Flujo 2 pasos + términos
- Logo profesional shield design H&I
- Dark mode completo
- Responsive mobile-first

---

## 📋 GUÍAS RÁPIDAS

- **Ver Fixes:** [`CRITICAL_FIXES_APPLIED.md`](./CRITICAL_FIXES_APPLIED.md)
- **Ver v2 Resumen:** [`VERSION_2_COMPLETE.md`](./VERSION_2_COMPLETE.md)
- **Sistema de Pagos:** [`PAYMENT_QUICKSTART.md`](./PAYMENT_QUICKSTART.md)

### ✅ Sistema de Pagos Multi-Provider
- 4+ métodos de pago digital integrados
- Métodos locales: Efectivo, Transferencia, Cheque
- Ver: [`PAYMENT_QUICKSTART.md`](./PAYMENT_QUICKSTART.md)

## Descripción General

H&I POS System es un **sistema de Punto de Venta (POS) multifuncional y multi-tenant** diseñado para gestionar integralmente negocios de diferentes tipos: bodegas, ferreterías, restaurantes, zapaterías, tiendas de ropa y repuestos de motos.

El sistema proporciona una solución completa que integra ventas, inventario, finanzas, CRM, reportes avanzados, e-commerce, gestión de personal y **un sistema de pagos multi-provider** en una única plataforma segura y escalable.

## 🚀 COMENZAR RÁPIDAMENTE

### 1. Ver el Sistema en Vivo
```bash
# Abre Preview en v0
# Deberías ver el login con diseño azul/oro
```

### 2. Probar Autenticación
- **Email:** isaac03.24castillo@gmail.com
- **O:** Regístrate como nuevo propietario
- **Flujo:** Login → Dashboard → Módulos

### 3. Sistema de Pagos
- Ver [`PAYMENT_QUICKSTART.md`](./PAYMENT_QUICKSTART.md)
- Implementa tu opción de pago personalizado
- O activa Mercado Pago directamente

## 🎨 DISEÑO VISUAL

### Colores Implementados
```
Azul Principal:     #1e40af (Profesional)
Oro Acentuador:     #fbbf24 (Destacar)
Blanco/Gris:        Neutral
```

### Assets
```
/public/
├── logo-hi-pos.jpg ...................... Logo del sistema
├── login-background.jpg ................. Fondo profesional
└── dashboard-hero.jpg ................... Hero dashboard
```

### Páginas Rediseñadas
- ✅ `/login` - Diseño 2 columnas + branding
- ✅ `/register` - Flujo 2 pasos + términos
- ⏳ Dashboard - Próxima actualización
- ⏳ Módulos - Próxima actualización

## ⚡ NOVEDAD: Sistema de Pagos Completo

El sistema ahora incluye un **módulo de pagos empresarial** con soporte para múltiples proveedores:

### 🎯 4 Opciones de Pago + Métodos Locales

**Opción 1:** Tu Pago Personalizado (Implementación del usuario)  
**Opción 2:** 2Checkout (Comisión: 2.9%)  
**Opción 3:** PayU (Comisión: 2.95%)  
**Opción 4:** Mercado Pago - ⭐ Recomendado (Comisión: 2.99%)  
**Locales:** Efectivo, Transferencia, Cheque (0% comisión)  

**Comenzar en 5 minutos:** Ver [`PAYMENT_QUICKSTART.md`](./PAYMENT_QUICKSTART.md)

## Características Principales Implementadas

### ✅ I. Punto de Venta (POS) + Sistema de Pagos Integrado
- Interfaz táctil moderna y responsiva
- Búsqueda rápida de productos por nombre, SKU o código de barras
- Carrito de compras dinámico con cantidades ajustables
- Cálculo automático de totales, impuestos y descuentos
- **Sistema de pagos multi-provider integrado**
- **Soporte para 4+ métodos de pago digitales + 3 locales**
- **Webhooks automáticos para confirmación de pagos**
- Registro de ventas en tiempo real
- Impresión de comprobantes (preparado para integración)
- Gestión de múltiples cajas simultáneamente

### ✅ II. Gestión de Inventario (WMS)
- Control de stock en tiempo real
- Alertas automáticas de stock bajo
- Gestión de movimientos de inventario (entradas, salidas, transferencias, ajustes)
- Registro de lotes y vencimientos
- Multi-almacén/sucursales
- Trazabilidad completa de productos
- Historial de movimientos

### ✅ III. Gestión de Productos
- Catálogo completo con categorías
- Importación masiva desde Excel/CSV
- Generación de códigos de barras
- Múltiples unidades de medida
- Control de precios de costo y venta
- Imágenes de productos
- Información de proveedores

### ✅ IV. Gestión de Compras y Proveedores
- Directorio de proveedores con contactos
- Órdenes de compra automáticas
- Recepción de mercancía con validación
- Cuentas por pagar automatizadas
- Análisis de costos promedios
- Seguimiento de pagos
### ✅ V. CRM y Programa de Lealtad
- Base de datos de clientes
- Segmentación automática (VIP, Recurrente, Ocasional)
- Programa de puntos de lealtad
- Historial de compras por cliente
- Cupones de descuento personalizados
- Tarjetas de regalo digitales
- Notificaciones de cumpleaños

### ✅ VI. E-commerce y Omnicanal
- Tienda online sincronizada con inventario
- Órdenes online con pagos digitales
- Sistema de retiro en tienda (Pick-up)
- Gestión de entregas y delivery
- Suscripciones de compra recurrente
- Recuperación de carritos abandonados
- Integración con redes sociales

### ✅ VII. Reportes y Analytics
- Reportes de ventas diarios, semanales, mensuales y anuales
- Análisis de productos más vendidos
- Gráficos interactivos (líneas, barras, pastel)
- Análisis de rentabilidad
- Reportes de margen de utilidad
- KPIs de desempeño
- Exportación a PDF y Excel

### ✅ VIII. Finanzas y Contabilidad
- Cierre de caja ciego
- Conciliación bancaria
- Gestión de gastos operativos
- Cuentas por pagar y cuentas por cobrar
- Análisis de flujo de caja
- Multimoneda
- Auditoría completa de transacciones

### ✅ IX. Gestión de Personal (HR)
- Registro de empleados
- Control de asistencia (check-in/out)
- Gestión de turnos
- Cálculo automático de comisiones
- Documentos digitales de empleados
- Evaluación de desempeño

### ✅ X. Seguridad y Multi-tenant
- Autenticación Firebase con 2FA
- Rol-based access control (6 roles)
- Aislamiento de datos por negocio
- Encriptación de datos sensibles
- Logs de auditoría completos
- Backups automáticos
- API para integraciones externas

## Stack Tecnológico

### Frontend
- **Framework:** Next.js 16 + React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI)
- **Gráficos:** Recharts
- **Validación:** Zod
- **Manejo de Formas:** React Hook Form

### Backend
- **Base de Datos:** Firebase Realtime Database
- **Autenticación:** Firebase Auth
- **Almacenamiento:** Firebase Storage
- **APIs:** RESTful con Next.js Route Handlers

### Utilidades
- Generación de códigos de barras: jsbarcode
- Generación de PDFs: jsPDF
- Hojas de cálculo: XLSX
- Encriptación: crypto-js
- Notificaciones: Sonner (Toast)

## Estructura de Directorios

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── business/
│   └── [id]/
│       ├── page.tsx (Dashboard negocio)
│       ├── pos/page.tsx
│       ├── products/page.tsx
│       ├── inventory/page.tsx
│       ├── purchases/page.tsx
│       ├── customers/page.tsx
│       ├── reports/page.tsx
│       └── finances/page.tsx
├── businesses/
│   └── new/page.tsx
├── dashboard/page.tsx
├── layout.tsx
├── page.tsx (Home con términos y condiciones)
└── globals.css

lib/
├── firebase.ts (Configuración Firebase)
├── auth-service.ts (Servicios de autenticación)
├── pos-service.ts (Servicios de Punto de Venta)
├── inventory-service.ts (Servicios de inventario)
├── crm-finance-service.ts (Servicios CRM y finanzas)
├── ecommerce-service.ts (Servicios e-commerce)
├── reports-hr-service.ts (Reportes y HR)
├── types.ts (Tipos TypeScript completos)
└── validators.ts (Esquemas Zod)

components/
├── ui/ (Componentes shadcn)
└── business-sidebar.tsx (Navegación)

hooks/
└── use-auth.tsx (Hook de autenticación)
```

## Modelos de Datos Principales

### Usuario
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  businessId?: string;
  role: 'master_admin' | 'business_owner' | 'manager' | 'cashier' | 'inventory_staff' | 'accountant';
  isActive: boolean;
  createdAt: number;
}
```

### Negocio
```typescript
{
  id: string;
  name: string;
  type: 'bodega' | 'ferreteria' | 'restaurante' | 'zapateria' | 'tienda_ropa' | 'repuestos_motos';
  ownerEmail: string;
  ownerUid: string;
  isActive: boolean;
  subscriptionType: 'free' | 'pro' | 'enterprise';
  settings: BusinessSettings;
  createdAt: number;
}
```

## Flujo de Acceso Multi-Tenant

1. **Admin Master (Propietario):** isaac03.24castillo@gmail.com
   - Acceso a todos los negocios
   - Gestión de usuarios para cada negocio
   - Control de suscripciones
   - Estadísticas globales

2. **Dueño de Negocio**
   - Crea cuenta con email único
   - Acceso exclusivo a su negocio
   - Puede crear usuarios secundarios (manager, cashier, etc.)
   - Control total de su data

3. **Empleados**
   - Acceso limitado según rol
   - Solo ven datos relevantes a su negocio
   - Permisos específicos por módulo

## Términos y Condiciones

El sistema incluye una página de términos y condiciones que deben ser aceptados durante el registro. Estos incluyen:

- **Propiedad:** Único propietario es isaac03.24castillo@gmail.com
- **Privacidad de Datos:** Cada negocio tiene aislamiento completo
- **Seguridad:** Encriptación de nivel empresarial
- **Cumplimiento Legal:** Generación de comprobantes fiscales válidos
- **Responsabilidades:** Usuarios responsables de sus datos

## Instrucciones de Despliegue

### Requisitos Previos
- Node.js 18+
- npm o pnpm
- Cuenta Firebase configurada
- Variables de entorno

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd h-i-pos-system

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales Firebase

# Ejecutar en desarrollo
pnpm dev

# Build para producción
pnpm build
pnpm start
```

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de nuevo admin
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Negocios
- `GET /api/businesses` - Listar negocios del usuario
- `POST /api/businesses` - Crear negocio
- `GET /api/businesses/:id` - Detalles del negocio

### Ventas
- `POST /api/sales` - Registrar venta
- `GET /api/sales` - Listar ventas
- `GET /api/sales/:id` - Detalles de venta

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `POST /api/products/bulk` - Importación masiva

### Reportes
- `GET /api/reports/sales` - Reporte de ventas
- `GET /api/reports/financial` - Reporte financiero
- `GET /api/reports/inventory` - Reporte de inventario

## Seguridad

- ✅ Autenticación Firebase con verificación de email
- ✅ Encriptación de datos sensibles con AES-256
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Aislamiento de datos multi-tenant
- ✅ Logs de auditoría para todas las acciones
- ✅ CORS configurado correctamente
- ✅ Validación de entrada con Zod
- ✅ Protección contra SQL injection (Firebase)
- ✅ Rate limiting en endpoints

## Próximos Pasos y Mejoras Futuras

1. **Integraciones:**
   - Pasarelas de pago (Stripe, PayPal)
   - WhatsApp Business API
   - Correo electrónico (SendGrid)
   - SMS (Twilio)

2. **Características Avanzadas:**
   - IA para predicción de demanda
   - Precios dinámicos
   - Análisis predictivo
   - Automatización de marketing

3. **Optimizaciones:**
   - Caching con Redis
   - Compresión de datos
   - CDN para imágenes
   - Optimización de base de datos

4. **Escalabilidad:**
   - Migración a Firestore
   - Load balancing
   - Horizontal scaling
   - Replicación de datos

## Soporte y Documentación

Para más información, contactar a: isaac03.24castillo@gmail.com

## Licencia

Propietario: isaac03.24castillo@gmail.com

---

**Última actualización:** 2026  
**Versión:** 1.0.0 (MVP Completo)
