# 🚀 Guía de Navegación - H&I Community

## ¿Qué se ha mejorado?

### ✅ Problemas Solucionados

1. **Falta de Layout Global**
   - ✅ Creado layout principal con navegación consistente
   - ✅ Sidebar con menú de navegación funcional
   - ✅ TopBar con reloj, notificaciones y perfil de usuario

2. **Rutas sin Estructura**
   - ✅ Reorganizadas las rutas bajo `/(authenticated)` layout
   - ✅ Sistema de redirecciones automáticas para rutas antiguas
   - ✅ Ruta raíz que redirige a dashboard

3. **Navegación Incompleta**
   - ✅ Menú lateral con 5 secciones principales
   - ✅ Indicador visual de ruta activa
   - ✅ Responsive en mobile (sidebar colapsable)
   - ✅ Breadcrumbs en TopBar

4. **Experiencia de Usuario**
   - ✅ Transiciones suaves entre páginas
   - ✅ Estados visuales consistentes
   - ✅ Color scheme unificado (Zinc + Emerald)
   - ✅ Animaciones de carga

## 📋 Secciones Disponibles

### 1. **Dashboard** (`/dashboard`)
Panel dinámico con selector de tipo de negocio:
- Restaurante 🍽️
- Ferretería 🔨
- Bodega 📦

Cada uno tiene su propio panel con funcionalidades específicas.

### 2. **Punto de Venta** (`/pos`)
Sistema completo de POS con:
- Búsqueda y filtrado de productos
- Carrito dinámico
- Cálculo automático de impuestos (16% IVA)
- Métodos de pago (Efectivo, Tarjeta)
- Cuadrícula de productos con stock

**Mejoras:**
- Input de búsqueda con ícono
- Visualización responsive
- Panel de carrito flotante (desktop)
- Estado vacío con instrucciones

### 3. **Inventario** (`/inventario`)
Gestión completa de productos:
- Búsqueda por nombre o SKU
- Filtrado por categoría
- Tabla con información completa
- Indicadores de stock bajo
- Botón para agregar productos

**Mejoras:**
- Tabla responsive y ordenada
- Colores que indican estado (stock)
- Búsqueda en tiempo real
- Categorías como filtros rápidos

### 4. **Reportes** (`/reportes`)
Análisis financiero en tiempo real:
- KPIs principales (Venta Bruta, Transacciones, Promedio de Ticket)
- Auditoría de transacciones
- Métodos de pago
- Efectivo en caja verificado

**Mejoras:**
- 4 tarjetas KPI con colores diferenciados
- Tabla de transacciones con estado
- Descarga de CSV
- Botón de cierre de caja

### 5. **Configuración** (`/ajustes`)
Panel de ajustes con 6 pestañas:
- **General**: Nombre del negocio, tipo, moneda
- **Usuario**: Perfil personal
- **Seguridad**: Contraseña, 2FA
- **Notificaciones**: Preferencias de alertas
- **Apariencia**: Tema (oscuro por defecto)
- **Integraciones**: Conectar servicios externos

## 🎨 Componentes Principales

### Layout System
```
RootLayout
└── /(authenticated)/layout
    ├── Sidebar (menú navegación)
    ├── TopBar (header con info)
    └── main (contenido dinámico)
```

### Navegación
- **Sidebar**: Icono + Texto, indica ruta activa
- **TopBar**: Reloj, estado terminal, notificaciones, usuario
- **Breadcrumbs**: Contexto de ubicación

### Responsive
- **Desktop**: Sidebar visible + TopBar + Contenido
- **Mobile**: Sidebar oculto (toggle button) + TopBar + Contenido

## 🔄 Flujo de Navegación

1. Accede a `/` → Redirige automáticamente a `/dashboard`
2. En la sidebar, haz clic en cualquier sección
3. El indicador verde muestra dónde estás
4. El contenido se carga con transición suave
5. En mobile, el sidebar se cierra automáticamente

## 📱 Responsive Design

Todas las páginas son responsivas:
- **Mobile**: < 768px (sidebar colapsable)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (sidebar visible)

## 🎯 Características Avanzadas

### Sidebar
- ✅ Menú con icónos de lucide-react
- ✅ Indicador de ruta activa (borde verde + fondo tenue)
- ✅ Avatar de usuario con iniciales
- ✅ Info de rol (Administrador)
- ✅ Botón de logout

### TopBar
- ✅ Reloj en tiempo real
- ✅ Indicador de terminal conectada
- ✅ Notificaciones (con punto rojo)
- ✅ Perfil de usuario con avatar

### POS
- ✅ Carrito dinámico con Zustand
- ✅ Cálculo automático de totales
- ✅ Cuadrícula de productos responsiva
- ✅ Búsqueda en tiempo real
- ✅ Estados de producto (stock disponible)

### Inventario
- ✅ Tabla con scroll horizontal en mobile
- ✅ Búsqueda y filtros
- ✅ Indicadores de estado
- ✅ Acciones por producto

### Reportes
- ✅ KPIs en grid responsive
- ✅ Tabla de auditoría
- ✅ Acciones de descarga y cierre

## 🔐 Seguridad

La estructura está lista para integrar:
- Autenticación con Firebase
- Protección de rutas por rol
- RLS en base de datos
- Auditoría de acciones

## 📚 Estructura de Carpetas

```
src/
├── app/
│   ├── (authenticated)/
│   │   ├── dashboard/
│   │   ├── pos/
│   │   ├── inventario/
│   │   ├── reportes/
│   │   ├── ajustes/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── pos/
│   │   ├── PanelCarrito.tsx
│   │   └── CuadriculaProductos.tsx
│   ├── paneles/
│   │   ├── PanelRestaurante.tsx
│   │   ├── PanelFerreteria.tsx
│   │   └── PanelBodega.tsx
│   └── ErrorBoundary.tsx
├── hooks/
│   └── useAuth.ts
├── store/
│   └── posStore.ts
├── lib/
├── types/
└── public/
```

## 🚀 Próximos Pasos

1. **Autenticación**: Integrar Firebase Auth
2. **Base de Datos**: Conectar Firestore/Realtime DB
3. **Permisos**: Implementar RLS por rol
4. **Análisis**: Gráficos en reportes
5. **Impresoras**: Integración de térmicas
6. **Mobile App**: Versión PWA o React Native

## ✨ Super Features vs Competencia

Comparado con sistemas como InVU POS:

1. **Navegación Fluida**: Cambios de página instantáneos
2. **Diseño Moderno**: UI oscura profesional
3. **Componentes Reutilizables**: Sidebar, TopBar, Buttons
4. **Estado Compartido**: Zustand para carrito global
5. **Responsive Real**: Funciona perfecto en mobile
6. **Organización**: Carpetas por característica
7. **Type Safe**: TypeScript en todo
8. **Rendimiento**: Next.js 14 con optimizaciones

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.0
