# ⚡ Guía Rápida - H&I Community

## 🚀 Para Empezar

### 1. Instalar dependencias
```bash
npm install
# o
pnpm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Construir para producción
```bash
npm run build
npm start
```

---

## 📱 Navegar por la Aplicación

### Rutas Principales
| Ruta | Descripción | Icono |
|------|-------------|-------|
| `/` | Inicio (redirige a dashboard) | - |
| `/dashboard` | Panel principal | 📊 |
| `/pos` | Punto de venta | 🛒 |
| `/inventario` | Gestión de productos | 📦 |
| `/reportes` | Reportes financieros | 📈 |
| `/ajustes` | Configuración | ⚙️ |

### Navegación
1. **Sidebar izquierda**: Haz clic en cualquier opción
2. **Indicador activo**: Borde verde indica dónde estás
3. **Mobile**: Botón hamburguesa para abrir/cerrar sidebar
4. **TopBar**: Muestra la hora, estado y perfil

---

## 💳 Usar el Punto de Venta

### Flujo Completo
```
1. Accede a /pos
2. Busca productos en el input superior
3. Haz clic en "Agregar" en cualquier producto
4. Revisa el carrito en el panel derecho
5. Selecciona método de pago (Efectivo o Tarjeta)
6. Listo! ✅
```

### Productos Disponibles (Demo)
- Cemento Portland 50kg - $8.50
- Tubo PVC 2" - $12.00
- Clavos 2" - $0.15
- Bloque de Concreto - $1.20
- Arena Fina - $3.50
- Grava - $3.00
- Pintura Exterior - $25.00
- Varilla Estructural - $4.00

---

## 📊 Dashboard Dinámico

### Cambiar Tipo de Negocio
1. Accede a `/dashboard`
2. Haz clic en los botones superiores:
   - 🍽️ Restaurante
   - 🔨 Ferretería
   - 📦 Bodega

Cada uno muestra un panel diferente con funcionalidades específicas.

---

## 📦 Gestionar Inventario

### Buscar Productos
```
1. Accede a /inventario
2. Usa la barra de búsqueda por nombre o SKU
3. Filtra por categoría (botones superiores)
```

### Ver Detalles
- **SKU**: Código único del producto
- **Stock**: Cantidad disponible (verde = abundante)
- **Precio**: Precio de venta unitario
- **Categoría**: Clasificación del producto

---

## 📈 Ver Reportes

### KPIs Principales
- **Venta Bruta**: Total vendido hoy
- **Transacciones**: Cantidad de ventas
- **Promedio Ticket**: Venta promedio
- **Efectivo en Caja**: Dinero verificado

### Auditoría
Tabla con todas las transacciones:
- Referencia (ID de venta)
- Hora exacta
- Método de pago
- Cantidad de items
- Monto

### Descargar
Botón "Descargar CSV" para análisis en Excel

---

## ⚙️ Configurar Sistema

### Pestañas Disponibles

#### General
- Nombre del negocio
- Tipo de negocio
- Moneda por defecto

#### Usuario
- Nombre completo
- Email
- Rol (ver solo)

#### Seguridad
- Cambiar contraseña
- Activar 2FA (próximamente)

#### Notificaciones
- Alertas de ventas
- Alertas de stock bajo
- Resumen de reportes
- Notificaciones del sistema

#### Apariencia
- Tema (solo oscuro disponible)
- Tema claro (próximamente)
- Automático (próximamente)

#### Integraciones
- Estado de conexiones
- Botones para conectar/desconectar

---

## 🔑 Información de Acceso

**Usuario**: Isaac Castillo  
**Email**: isaac03.24castillo@gmail.com  
**Rol**: Administrador  
**Estado**: Conectado ✅

*En producción, integrar con Firebase Auth*

---

## 🛠️ Características Técnicas

### State Management
El carrito de POS usa **Zustand** para estado global:
```typescript
import { usePOSStore } from '@/store/posStore';

const { carrito, agregarProducto, obtenerTotal } = usePOSStore();
```

### Componentes Reutilizables
- `Sidebar`: Menú de navegación
- `TopBar`: Barra superior
- `PanelCarrito`: Carrito de compras
- `CuadriculaProductos`: Grid de productos

### Estilos
- **Framework**: Tailwind CSS
- **Colores**: Zinc (neutral) + Emerald (acento)
- **Tamaños**: Escala de espaciado estándar
- **Tipografía**: Geist (default)

---

## 🐛 Solucionar Problemas

### El sidebar no aparece
- Verifica que estés en una ruta bajo `/(authenticated)`
- Abre la consola para ver errores

### Carrito vacío al refrescar
- Normal (estado en memoria). En producción usar base de datos

### Búsqueda no funciona
- Asegúrate de escribir el nombre o SKU correctamente
- Clearfix: borra el input y vuelve a escribir

### Sidebar lento en mobile
- Reduce la cantidad de items si es necesario
- Considera virtualización en listas grandes

---

## 📚 Recursos Adicionales

### Documentación
- `NAVEGACION.md` - Guía de rutas y secciones
- `ARQUITECTURA.md` - Estructura técnica profunda
- `ROUTES.md` - Mapa de rutas detallado

### Repositorio
- Branch: `main`
- Conectado a Vercel para auto-deploy

### Próximos Pasos
1. Integrar Firebase Auth
2. Conectar Firestore para datos
3. Implementar impresoras térmicas
4. Agregar gráficos en reportes
5. Crear versión móvil (PWA)

---

## 💡 Tips Pro

### Keyboard Shortcuts
- `Cmd/Ctrl + K` - Búsqueda rápida (implementar después)
- `Escape` - Cerrar modales
- `Tab` - Navegar entre campos

### Performance
- Los datos actuales son mocks (demo)
- En producción, usar SWR para caching
- Implementar lazy loading en listas largas

### Escalabilidad
- Agregar más tipos de negocio sin cambiar estructura
- Crear nuevas páginas solo agregando carpeta en `/(authenticated)`
- Reutilizar componentes del layout

### Seguridad
- Cambiar email hardcodeado en TopBar
- Implementar RLS en base de datos
- Usar variables de entorno para configs

---

## 📞 Soporte

Si encontras problemas:

1. **Verifica la consola del navegador** (F12)
2. **Revisa los archivos markdown** (NAVEGACION, ARQUITECTURA)
3. **Reinicia el servidor dev**
4. **Limpia cache/cookies** si persisten problemas

---

## ✅ Checklist de Funcionalidades

- [x] Navegación funcional
- [x] Sistema de rutas protegidas
- [x] Panel POS completo
- [x] Gestión de inventario
- [x] Reportes financieros
- [x] Configuración del sistema
- [x] Dashboard dinámico
- [x] State management (Zustand)
- [x] Responsive design
- [x] TypeScript type-safe
- [ ] Autenticación Firebase
- [ ] Base de datos Firestore
- [ ] Impresoras térmicas
- [ ] Gráficos en reportes
- [ ] PWA/Offline mode
- [ ] Tests unitarios
- [ ] Documentación API

---

**Creado**: Marzo 2026  
**Versión**: 1.0.0  
**Última actualización**: Hoy ✨
