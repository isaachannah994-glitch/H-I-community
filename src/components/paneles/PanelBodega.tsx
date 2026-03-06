import React from "react";
import { AlertTriangle, TrendingDown, Package, Clock } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface Alerta {
  id: string;
  producto: string;
  stockActual: number;
  nivelMinimo: number;
  urgencia: "crítica" | "baja";
}

const PRODUCTOS_FRECUENTES: Producto[] = [
  { id: "1", nombre: "Harina PAN", precio: 1.2, stock: 450, categoria: "Alimentos" },
  { id: "2", nombre: "Refresco 2L", precio: 2.5, stock: 80, categoria: "Bebidas" },
  { id: "3", nombre: "Arroz 1kg", precio: 1.1, stock: 200, categoria: "Alimentos" },
  { id: "4", nombre: "Aceite 1L", precio: 3.8, stock: 35, categoria: "Alimentos" },
];

const ALERTAS: Alerta[] = [
  { id: "1", producto: "Aceite 1L", stockActual: 35, nivelMinimo: 50, urgencia: "crítica" },
  { id: "2", producto: "Refresco 2L", stockActual: 80, nivelMinimo: 100, urgencia: "baja" },
];

export const PanelBodega = () => (
  <div className="w-full h-full flex flex-col p-6 gap-6 overflow-auto">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Panel de Bodega</h2>
        <p className="text-sm text-zinc-500 mt-1">Gestión de inventario y acceso rápido</p>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-emerald-400">ESCÁNER ACTIVO</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Productos Frecuentes */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h3 className="font-bold text-white mb-3">Productos Frecuentes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRODUCTOS_FRECUENTES.map((prod) => (
              <button
                key={prod.id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-left group active:scale-95"
              >
                <p className="text-zinc-400 text-xs font-mono mb-1">
                  Stock: {prod.stock}
                </p>
                <p className="font-bold text-white text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                  {prod.nombre}
                </p>
                <p className="text-emerald-400 font-bold mt-2">
                  ${prod.precio.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Últimos Movimientos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-zinc-400" />
            <h3 className="font-bold text-white">Últimos Movimientos</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { hora: "14:32", accion: "Venta", producto: "Arroz 1kg", cantidad: 5 },
              { hora: "14:15", accion: "Reposición", producto: "Harina PAN", cantidad: 50 },
              { hora: "13:48", accion: "Venta", producto: "Aceite 1L", cantidad: 3 },
            ].map((mov, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-zinc-800/30 rounded">
                <div>
                  <p className="text-zinc-300 font-medium">{mov.producto}</p>
                  <p className="text-xs text-zinc-500">{mov.accion}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">{mov.cantidad}</p>
                  <p className="text-xs text-zinc-500 font-mono">{mov.hora}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas de Stock */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-white">Alertas (Stock Bajo)</h3>
        </div>
        <div className="space-y-3">
          {ALERTAS.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-3 rounded-lg border ${
                alerta.urgencia === "crítica"
                  ? "bg-red-900/20 border-red-900/50"
                  : "bg-amber-900/20 border-amber-900/50"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p
                  className={`text-sm font-bold ${
                    alerta.urgencia === "crítica" ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {alerta.producto}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    alerta.urgencia === "crítica"
                      ? "bg-red-500 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {alerta.urgencia === "crítica" ? "CRÍTICO" : "BAJO"}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Actual: {alerta.stockActual} | Mínimo: {alerta.nivelMinimo}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg transition-colors text-sm">
          Ver Reposición
        </button>
      </div>
    </div>

    {/* Estadísticas Rápidas */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Total Productos", valor: "245", icon: Package },
        { label: "Bajo Stock", valor: "12", icon: TrendingDown },
        { label: "Valor Total", valor: "$8,450", icon: "💰" },
        { label: "Última Venta", valor: "14:32 hrs", icon: Clock },
      ].map((stat, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 font-bold uppercase mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-white">{stat.valor}</p>
        </div>
      ))}
    </div>
  </div>
);
