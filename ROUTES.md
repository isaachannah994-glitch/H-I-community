# H&I Community - Estructura de Rutas

## Rutas Públicas
- `/` - Página de inicio (redirige a /dashboard)

## Rutas Autenticadas (Bajo layout protegido)
Todas las rutas siguientes están bajo `/(authenticated)` y tienen acceso al Sidebar y TopBar

### Dashboard
- `/dashboard` - Panel principal dinámico
  - Selector de tipo de negocio
  - Vista de paneles: Restaurante, Ferretería, Bodega
  - KPIs en tiempo real

### Punto de Venta
- `/pos` - Sistema de punto de venta
  - Búsqueda de productos
  - Carrito de compras en tiempo real
  - Métodos de pago
  - Cálculo automático de impuestos

### Inventario
- `/inventario` - Gestión de productos
  - Listado de productos con filtros
  - Búsqueda por nombre y SKU
  - Filtrado por categoría
  - Información de stock y precios

### Reportes
- `/reportes` - Reportes financieros
  - KPIs: venta bruta, transacciones, promedio de ticket
  - Auditoría de transacciones
  - Descarga de reportes CSV
  - Cierre de caja

### Configuración
- `/ajustes` - Ajustes del sistema
  - General (nombre del negocio, tipo, moneda)
  - Perfil de usuario
  - Seguridad (contraseña, 2FA)
  - Notificaciones
  - Apariencia
  - Integraciones

## Componentes de Layout

### Sidebar (`/src/components/layout/Sidebar.tsx`)
- Logo H&I
- Menú de navegación con iconos
- Indicador de ruta activa
- Perfil de usuario
- Botón de cerrar sesión
- Responsive (colapsable en mobile)

### TopBar (`/src/components/layout/TopBar.tsx`)
- Reloj en tiempo real
- Estado de terminal (conectada)
- Notificaciones
- Info de usuario

## Redirecciones Automáticas
Las rutas antiguas redirigen automáticamente:
- `/dashboard` → `/(authenticated)/dashboard`
- `/pos` → `/(authenticated)/pos`
- `/inventario` → `/(authenticated)/inventario`
- `/reportes` → `/(authenticated)/reportes`
- `/ajustes` → `/(authenticated)/ajustes`

## Estado Compartido (Zustand)
- `usePOSStore` - Carrito, productos, cálculos de total e impuesto
