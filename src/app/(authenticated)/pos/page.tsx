"use client";
import React from "react";
import { usePOSStore } from "@/store/posStore";
import PanelCarrito from "@/components/pos/PanelCarrito";
import CuadriculaProductos from "@/components/pos/CuadriculaProductos";
import { Search } from "lucide-react";

export default function PantallaPOS() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Área Central: Categorías y Productos */}
      <main className="flex-1 flex flex-col h-full p-6 overflow-hidden">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Punto de Venta</h1>
            <p className="text-sm text-zinc-500">Terminal 01 • H&I Community</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Escanear código o buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              autoFocus
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <CuadriculaProductos searchQuery={searchQuery} />
        </div>
      </main>

      {/* Panel Derecho: El Carrito y Cobro */}
      <aside className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full hidden lg:flex">
        <PanelCarrito />
      </aside>
    </div>
  );
}
