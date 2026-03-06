# 🏗️ Arquitectura de H&I Community

## Visión General

H&I Community es un sistema ERP modular basado en Next.js 14 con arquitectura de componentes y state management centralizado. La aplicación está diseñada para ser escalable, performante y adaptable a múltiples tipos de negocios.

```
┌─────────────────────────────────────────┐
│         Cliente (Next.js + React)       │
├─────────────────────────────────────────┤
│     Rutas (/(authenticated)/*)          │
│     Componentes UI + Paneles             │
│     State Management (Zustand)           │
├─────────────────────────────────────────┤
│          Backend (Próximamente)         │
│      Firebase / Database Integrations    │
└─────────────────────────────────────────┘
```

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 4.5
- **Icons**: lucide-react
- **Language**: TypeScript 5.3
- **Package Manager**: npm/yarn/pnpm

### Backend (Roadmap)
- **Database**: Firebase Firestore / Neon PostgreSQL
- **Authentication**: Firebase Auth
- **API**: Next.js API Routes
- **Hosting**: Vercel

## Estructura de Directorios

```
src/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # Grupo de rutas protegidas
│   │   ├── layout.tsx            # Layout compartido (Sidebar + TopBar)
│   │   ├── dashboard/page.tsx    # Panel principal
│   │   ├── pos/page.tsx          # Punto de venta
│   │   ├── inventario/page.tsx   # Gestión de productos
│   │   ├── reportes/page.tsx     # Reportes financieros
│   │   └── ajustes/page.tsx      # Configuración
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Página raíz (redirect)
│   └── globals.css               # Estilos globales
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navegación lateral
│   │   └── TopBar.tsx            # Barra superior
│   ├── pos/
│   │   ├── PanelCarrito.tsx      # Carrito dinámico
│   │   └── CuadriculaProductos.tsx # Grid de productos
│   ├── paneles/
│   │   ├── PanelRestaurante.tsx  # Dashboard restaurante
│   │   ├── PanelFerreteria.tsx   # Dashboard ferretería
│   │   ├── PanelBodega.tsx       # Dashboard bodega
│   │   └── PanelZapateria.tsx    # Dashboard zapatería (pendiente)
│   ├── ErrorBoundary.tsx         # Error handling
│   └── layout/                   # Componentes de layout
├── hooks/
│   └── useAuth.ts                # Hook de autenticación
├── store/
│   └── posStore.ts               # State management (Zustand)
├── lib/
│   ├── finanzas.ts               # Utilidades financieras
│   └── ...
├── types/
│   └── master.ts                 # Tipos principales
└── public/                       # Activos estáticos
```

## Flujo de Datos

### 1. Layout Anidado

```
RootLayout
└── /(authenticated)/Layout
    ├── Sidebar
    ├── TopBar
    └── Page (Dynamic Content)
        ├── Dashboard
        ├── POS
        ├── Inventario
        ├── Reportes
        └── Ajustes
```

### 2. State Management (POS)

```
Component Tree
    ↓
usePOSStore (Zustand)
    ├── carrito []
    ├── agregarProducto()
    ├── removerProducto()
    ├── actualizarCantidad()
    ├── limpiarCarrito()
    ├── obtenerTotal()
    └── obtenerImpuesto()
```

El store es accesible desde cualquier componente sin prop drilling.

### 3. Patrón de Componentes

```
Page Component (RSC)
└── Client Component ("use client")
    ├── State Hooks (useState)
    ├── Store Integration (usePOSStore)
    └── Child Components
        ├── Layout Components
        ├── Feature Components
        └── UI Components
```

## Componentes Principales

### Sidebar
- **Ubicación**: `src/components/layout/Sidebar.tsx`
- **Responsabilidades**:
  - Renderizar menú de navegación
  - Indicar ruta activa
  - Mostrar perfil de usuario
  - Toggle en mobile
- **Props**: Ninguno (usa `usePathname`)
- **State**: `isOpen` (mobile)

### TopBar
- **Ubicación**: `src/components/layout/TopBar.tsx`
- **Responsabilidades**:
  - Mostrar reloj en tiempo real
  - Indicar estado de terminal
  - Notificaciones
  - Info de usuario
- **Props**: Ninguno
- **State**: `time` (reloj)

### PanelCarrito
- **Ubicación**: `src/components/pos/PanelCarrito.tsx`
- **Responsabilidades**:
  - Mostrar items del carrito
  - Cálculo de totales e impuestos
  - Botones de métodos de pago
- **Props**: Ninguno
- **Store**: `usePOSStore`

### CuadriculaProductos
- **Ubicación**: `src/components/pos/CuadriculaProductos.tsx`
- **Responsabilidades**:
  - Grid de productos
  - Búsqueda filtrada
  - Botones para agregar al carrito
- **Props**: `searchQuery`
- **Store**: `usePOSStore`

### Paneles de Dashboard
- **Ubicación**: `src/components/paneles/Panel*.tsx`
- **Responsabilidades**:
  - Funcionalidades específicas por tipo de negocio
  - Integración con datos locales
- **Tipos**:
  - PanelBodega: Productos frecuentes, alertas
  - PanelFerreteria: Búsqueda por pasillo y medida
  - PanelRestaurante: Mapa de mesas
  - PanelZapateria: Filtros por talla y género

## State Management (Zustand)

### usePOSStore

```typescript
interface POSState {
  carrito: CarritoItem[];
  agregarProducto(producto, cantidad?): void;
  removerProducto(id): void;
  actualizarCantidad(id, cantidad): void;
  limpiarCarrito(): void;
  obtenerTotal(): number;
  obtenerSubtotal(): number;
  obtenerImpuesto(): number;
}
```

**Uso**:
```typescript
const { carrito, agregarProducto, obtenerTotal } = usePOSStore();
```

### Ventajas
- Acceso global sin prop drilling
- Updates reactivos
- Persist opcional
- Computadas (selectors)

## Tipos Principales

### ProductoBase
```typescript
interface ProductoBase {
  id: string;
  codigo?: string;
  nombre: string;
  precio_venta: number;
  precio_costo: number;
  stock?: number;
  categoria?: string;
}
```

### User (Autenticación)
```typescript
interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'GERENTE' | 'CAJERO' | 'VENDEDOR';
}
```

### OrdenPOS
```typescript
interface OrdenPOS {
  id_orden: string;
  cajero: string;
  items: Array<{producto, cantidad, subtotal}>;
  total: number;
  metodo_pago: 'EFECTIVO' | 'PAGO_MOVIL' | 'TARJETA';
  fecha: number;
  estado: 'COMPLETADA' | 'ESPERA';
}
```

## Patrones de Routing

### Dynamic Routing
```
/(authenticated)/[id]/page.tsx
```

### Nested Layouts
```
/(authenticated)/[seccion]/[subseccion]/layout.tsx
/(authenticated)/[seccion]/[subseccion]/page.tsx
```

### Redirecciones
```typescript
// Hook de redirección
useRouter().push('/ruta')
// O useRouter().replace()
```

## Performance Optimizations

### 1. Code Splitting
- Next.js divide automáticamente por ruta
- Componentes lazy en componentes grandes

### 2. Image Optimization
- Uso de next/image para imágenes
- Lazy loading automático

### 3. Caching
- ISR (Incremental Static Regeneration) para datos estáticos
- SWR para datos dinámicos (implementación futura)

### 4. Bundle Size
- Tree-shaking automático
- Imports nombrados en lugar de * imports

## Convenciones de Código

### Archivos
- PascalCase para componentes: `PanelBodega.tsx`
- camelCase para utilities: `useAuth.ts`
- kebab-case para carpetas: `src/components/pos/`

### Componentes
```typescript
"use client"; // Si usas hooks
import type { Props } from '@/types';

interface ComponentProps {
  // Props...
}

export default function Component(props: ComponentProps) {
  // JSX
}
```

### Imports
```typescript
// Siempre usar @/ alias
import { Component } from '@/components/...'
import type { Type } from '@/types/...'
import { useStore } from '@/store/...'
```

## Seguridad

### CORS
- Configurado en Next.js

### CSRF Protection
- Next.js incluido por defecto

### XSS Prevention
- React escapa automáticamente

### SQL Injection
- Preparado para queries parametrizadas (cuando se integre BD)

### Rate Limiting
- Implementable en middleware

## Testing (Roadmap)

```
tests/
├── unit/
│   ├── hooks/
│   ├── store/
│   └── utils/
├── integration/
│   └── pages/
└── e2e/
    └── scenarios/
```

## Deployment

### Vercel (Recomendado)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## Monitoreo (Roadmap)

- **Errores**: Sentry
- **Performance**: Vercel Analytics
- **Logs**: Winston o similar
- **Auditoría**: Base de datos de eventos

## Próximas Integraciones

1. **Firebase**
   - Authentication
   - Firestore / Realtime Database
   - Cloud Storage

2. **Stripe/PayPal**
   - Pagos en línea
   - Webhooks

3. **Impresoras Térmicas**
   - Print server
   - Tickets

4. **SMS/Email**
   - Twilio
   - SendGrid

5. **Análisis**
   - Google Analytics
   - Mixpanel

## Contribuyendo

### Crear Nueva Página
1. Crear carpeta en `src/app/(authenticated)/`
2. Agregar `page.tsx`
3. Agregar a Sidebar en `MENU_ITEMS`
4. Crear tipo si es necesario

### Crear Nuevo Hook
1. Crear en `src/hooks/`
2. Exportar en index.ts
3. Usar en componentes

### Crear Componente
1. Crear en `src/components/` (en carpeta apropiada)
2. Exportar como default o named
3. Tipar props con interface

## Troubleshooting

### "Cannot find module"
- Verificar imports con @/
- Limpiar node_modules

### "Hydration mismatch"
- Usar `"use client"` si hay hooks
- Verificar renderizado condicional

### "State not updating"
- Verificar que usas spread operator: `[...array]`
- Usar immer en store si es necesario

### Performance lento
- Inspeccionar con DevTools
- Verificar renders innecesarios
- Usar React.memo si es necesario

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.0
**Mantenedor**: Isaac Castillo
