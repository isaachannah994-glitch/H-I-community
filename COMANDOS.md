# 🛠️ Comandos Útiles - H&I Community

## 📦 Gestión de Dependencias

### Instalar
```bash
# Todas las dependencias
npm install
pnpm install
yarn install

# Dependencia específica
npm install nombre-paquete
npm install --save-dev nombre-paquete  # Dev only

# Actualizar todas
npm update
npm upgrade
```

### Limpiar
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar desde cero
rm -rf node_modules package-lock.json
npm install

# Limpiar build
rm -rf .next
npm run build
```

---

## 🚀 Desarrollo

### Iniciar servidor
```bash
# Modo desarrollo (con hot reload)
npm run dev

# En puerto específico
npm run dev -- -p 3001

# Build de prueba
npm run build
npm start
```

### Verificar
```bash
# Linting
npm run lint

# Build (sin servir)
npm run build

# Type check (TypeScript)
npx tsc --noEmit
```

---

## 🔍 Debugging

### Consola del Navegador
```javascript
// Ver logs
console.log("[v0] Message:", variable);

// Debugger
debugger;  // Pausa ejecución
```

### React DevTools
```
1. Descargar extensión (Chrome/Firefox)
2. Abre DevTools (F12)
3. Pestaña "Components"
4. Inspecciona componentes y props
```

### Network Tab
```
1. F12 → Network
2. Filtrar por tipo (XHR, JS, CSS)
3. Ver requests y respuestas
```

---

## 📁 Estructura de Carpetas - Crear Nuevos Archivos

### Nueva Página
```bash
# Crear carpeta
mkdir src/app/\(authenticated\)/nueva-seccion

# Crear archivo page.tsx
cat > src/app/\(authenticated\)/nueva-seccion/page.tsx << 'EOF'
"use client";
export default function NuevaSeccion() {
  return <div>Nueva Página</div>;
}
EOF

# Agregar a Sidebar (src/components/layout/Sidebar.tsx)
# En MENU_ITEMS array
```

### Nuevo Componente
```bash
# Crear carpeta
mkdir src/components/nueva-carpeta

# Crear archivo
cat > src/components/nueva-carpeta/NuevoComponente.tsx << 'EOF'
import React from "react";

interface Props {
  title?: string;
}

export default function NuevoComponente({ title }: Props) {
  return <div>{title}</div>;
}
EOF
```

### Nuevo Hook
```bash
# Crear archivo
cat > src/hooks/useNuevoHook.ts << 'EOF'
import { useState } from "react";

export const useNuevoHook = () => {
  const [state, setState] = useState(false);
  return { state, setState };
};
EOF
```

---

## 🔧 Git Workflow

### Estado del Proyecto
```bash
# Ver cambios
git status

# Ver diferencias
git diff
git diff --staged

# Ver historial
git log
git log --oneline
git log --graph --all
```

### Actualizar Rama
```bash
# Traer cambios remotos
git fetch

# Rebase con main
git rebase origin/main

# O merge (si prefieres)
git merge origin/main
```

### Crear Rama
```bash
# Nueva rama desde main
git checkout main
git pull origin main
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commit
git add .
git commit -m "Descripción clara del cambio"
git push origin feature/nueva-funcionalidad
```

### Pull Request
```bash
# En GitHub:
1. Ir a repositorio
2. Click en "New Pull Request"
3. Seleccionar rama: feature/nueva-funcionalidad
4. Agregar descripción
5. Create pull request
6. Esperar revisión y merge
```

---

## 🧪 Testing (Cuando esté configurado)

### Unit Tests
```bash
# Correr tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Test específico
npm test NombreArchivo.test.ts
```

### E2E Tests (Playwright/Cypress)
```bash
# Correr todos
npm run e2e

# Test específico
npm run e2e -- tests/navigation.spec.ts

# Modo headed (ver browser)
npm run e2e -- --headed

# Debug
npm run e2e -- --debug
```

---

## 📊 Análisis

### Bundle Size
```bash
# Analizar bundle
npm install -g webpack-bundle-analyzer

# Build con análisis
ANALYZE=true npm run build
```

### Performance
```bash
# Lighthouse (en navegador)
1. F12 → Lighthouse
2. Generar reporte
3. Ver métricas

# Alternativa: CLI
npm install -g lighthouse
lighthouse https://localhost:3000
```

### Type Checking
```bash
# Verificar tipos
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

---

## 🌍 Deployment

### Vercel
```bash
# Conectar proyecto
vercel link

# Deploy manual
vercel deploy

# Deploy producción
vercel deploy --prod

# Ver deploys
vercel list
```

### Docker
```bash
# Build imagen
docker build -t hi-community:latest .

# Run localmente
docker run -p 3000:3000 hi-community:latest

# Push a registry
docker tag hi-community:latest tu-user/hi-community:latest
docker push tu-user/hi-community:latest
```

### Netlify
```bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📝 Utilidades de Código

### Formateo
```bash
# Instalar prettier (si no está)
npm install --save-dev prettier

# Formatear archivos
npx prettier --write "src/**/*.{ts,tsx,css}"

# Check sin cambiar
npx prettier --check "src/**/*.{ts,tsx,css}"
```

### ESLint
```bash
# Verificar
npm run lint

# Fijar automáticamente
npx eslint --fix "src/**/*.{ts,tsx}"
```

### Imports
```bash
# Organizar imports (agregar a package.json scripts)
npx sort-imports "src/**/*.{ts,tsx}"
```

---

## 🔐 Variables de Entorno

### Crear archivo .env.local
```bash
# En raíz del proyecto
cat > .env.local << 'EOF'
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF

# No commitear este archivo!
echo ".env.local" >> .gitignore
```

### Variables Públicas vs Privadas
```javascript
// Público (accesible en navegador)
NEXT_PUBLIC_API_URL=...

// Privado (solo server)
DATABASE_URL=...
SECRET_KEY=...
```

---

## 📊 Monitoreo

### Logs
```bash
# En development
npm run dev 2>&1 | tee app.log

# Ver logs en tiempo real
tail -f app.log

# Buscar errores
grep ERROR app.log
```

### Health Check
```bash
# Verificar si está corriendo
curl http://localhost:3000

# Con detalles
curl -v http://localhost:3000

# Headers
curl -I http://localhost:3000
```

---

## 🚨 Solucionar Problemas

### Puertos
```bash
# Ver qué está usando puerto 3000
# Mac/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Matar proceso
# Mac/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### Permisos
```bash
# Dar permisos de ejecución
chmod +x scripts/deploy.sh

# Recursivo en carpeta
chmod -R 755 src/
```

### Cache
```bash
# Limpiar npm cache
npm cache clean --force

# Limpiar yarn cache
yarn cache clean

# Limpiar Next.js
rm -rf .next

# Limpiar todo
rm -rf node_modules .next package-lock.json
npm install
```

---

## 🔄 Actualizar Dependencias

### Verificar desactualizadas
```bash
npm outdated
```

### Actualizar
```bash
# Mayor versión (MAYOR.menor.patch)
npm update

# A versión específica
npm install nombre@versión

# Mayor version (con riesgo)
npm install -g npm-check-updates
ncu -u
npm install
```

---

## 📚 Recursos

### Documentación
```bash
# Next.js
https://nextjs.org/docs

# React
https://react.dev/

# Tailwind
https://tailwindcss.com/docs

# TypeScript
https://www.typescriptlang.org/docs/

# Zustand
https://github.com/pmndrs/zustand
```

### CLI Tools
```bash
# Crear nuevo proyecto
npx create-next-app@latest

# Agregar shadcn/ui
npx shadcn-ui@latest add button

# Verificar tipos
npx typescript --version

# Actualizar Node
nvm use 18
nvm install 20
```

---

## ⚡ Shortcuts Productivos

### VS Code
```
Ctrl+Shift+P    - Command palette
Ctrl+/          - Comentar/descomentar
Ctrl+D          - Seleccionar palabra siguiente
Ctrl+H          - Buscar y reemplazar
F12             - DevTools navegador
Alt+Z           - Toggle word wrap
```

### Terminal
```
npm run dev     - Iniciar servidor
Ctrl+C          - Detener servidor
↑               - Comando anterior
clear           - Limpiar pantalla
```

---

## 🎓 Ejemplos Comunes

### Instalar Dependencia Nueva
```bash
# 1. Instalar
npm install lodash

# 2. Importar en componente
import { debounce } from "lodash";

# 3. Usar
const debouncedSearch = debounce((query) => {
  // búsqueda
}, 300);
```

### Agregar Página Nueva
```bash
# 1. Crear carpeta
mkdir src/app/\(authenticated\)/nueva-pagina

# 2. Crear page.tsx
# 3. Agregar a Sidebar en MENU_ITEMS
# 4. Navegar a /nueva-pagina
```

### Usar Store
```typescript
// 1. En componente
import { usePOSStore } from "@/store/posStore";

// 2. Obtener estado
const { carrito, agregarProducto } = usePOSStore();

// 3. Usar
agregarProducto(producto);
console.log(carrito);
```

---

**Last updated**: Marzo 2026
**Vercel Project**: h-i-community
**GitHub**: isaachannah994-glitch/H-I-community
