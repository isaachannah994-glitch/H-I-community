import React from 'react';

// Atajos para los productos que más se venden en una bodega
const PRODUCTOS_FRECUENTES = [
  { id: '1', nombre: 'Harina PAN', precio: 1.20, stock: 450 },
  { id: '2', nombre: 'Refresco 2L', precio: 2.50, stock: 80 },
  { id: '3', nombre: 'Arroz 1kg', precio: 1.10, stock: 200 },
  { id: '4', nombre: 'Aceite 1L', precio: 3.80, stock: 35 },
];

export const PanelBodega = () => (
  <div className="flex h-[calc(100vh-64px)] overflow-hidden">
    
    {/* Área de Ventas e Inventario Rápido */}
    <div className="flex-1 p-6 overflow-y-auto bg-black">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-black text-xl uppercase tracking-tighter">Terminal de Bodega</h3>
        <div className="flex gap-2">
          <span className="bg-zinc-900 border border-zinc-700 px-3 py-1 rounded text-[10px] text-zinc-400 font-mono">MODO: ESCÁNER ACTIVO</span>
        </div>
      </div>

      {/* Grid de Acceso Rápido (Touch/Click) */}
      <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Productos Frecuentes</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {PRODUCTOS_FRECUENTES.map(prod => (
          <button key={prod.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-500 transition-all text-left active:scale-95">
            <p className="text-zinc-400 text-[10px] font-mono">Stock: {prod.stock}</p>
            <p className="font-bold text-white text-sm">{prod.nombre}</p>
            <p className="text-emerald-400 font-black mt-2">${prod.precio.toFixed(2)}</p>
          </button>
        ))}
      </div>

      {/* Lista de Últimos Movimientos */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h4 className="text-white font-bold mb-4 text-sm">Alertas de Reposición (Stock Bajo)</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-red-900/10 border border-red-900/20 rounded-lg">
            <span className="text-xs text-red-200
