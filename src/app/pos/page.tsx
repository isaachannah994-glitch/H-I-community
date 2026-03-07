"use client";
import { usePOSStore } from "@/store/posStore";
import PanelCarrito from "@/components/pos/PanelCarrito";
import CuadriculaProductos from "@/components/pos/CuadriculaProductos";
// CuadriculaProductos creado en src/components/pos/CuadriculaProductos.tsx

export default function PantallaPOS() {
  // Verificación de seguridad en el cliente
  const usuarioActivo = "empleado@alianzahi.com"; // Esto vendrá de Firebase Auth

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Barra de Navegación Lateral (Menú rápido) */}
      <aside className="w-20 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6">
        <div className="h-12 w-12 bg-zinc-100 text-zinc-900 rounded-lg flex items-center justify-center font-bold text-xl mb-8">
          H&I
        </div>
        {/* Aquí irán los iconos de Almacén, Reportes, etc. */}
      </aside>

      {/* Área Central: Categorías y Productos */}
      <main className="flex-1 flex flex-col h-full p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Punto de Venta</h1>
            <p className="text-sm text-zinc-500">Terminal 01 • Conectado al Régimen H&I</p>
          </div>
          <input 
            type="text" 
            placeholder="Escanear código o buscar..." 
            className="w-1/3 bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            autoFocus
          />
        </header>
        
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <CuadriculaProductos />
        </div>
      </main>

      {/* Panel Derecho: El Carrito y Cobro */}
      <aside className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full">
        <PanelCarrito />
      </aside>
    </div>
  );
}
