"use client";
import React, { useEffect, useState } from 'react';
import { FinanzasHI } from '@/lib/finanzas';

export default function DashboardIsaac() {
  const [bodegas, setBodegas] = useState([
    { id: 'HI-001', nombre: 'Bodega El Chino', tipo: 'BODEGA', ventas_hoy: 450.20, estado: 'ACTIVO' },
    { id: 'HI-002', nombre: 'Zapatería Sport', tipo: 'ZAPATERIA', ventas_hoy: 1200.00, estado: 'ACTIVO' },
    { id: 'HI-003', nombre: 'Ferretería Central', tipo: 'FERRETERIA', ventas_hoy: 0.00, estado: 'PENDIENTE' }
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-black tracking-tighter">H&I ECOSYSTEM CONTROL</h1>
        <p className="text-zinc-500 font-mono mt-2">ADMINISTRADOR ABSOLUTO: isaac03.24castillo@gmail.com</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Comercios</p>
          <p className="text-4xl font-black mt-2">{bodegas.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Ventas de la Red (Hoy)</p>
          <p className="text-4xl font-black mt-2 text-emerald-400">
            {FinanzasHI.formatoMoneda(bodegas.reduce((a, b) => a + b.ventas_hoy, 0))}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl border-l-4 border-l-blue-600">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Estado del Servidor</p>
          <p className="text-4xl font-black mt-2 text-blue-500">OPTIMO</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Monitoreo de Bodegas y Comercios Aliados</h2>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase font-bold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">ID / Comercio</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-right">Ventas 24h</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {bodegas.map((b) => (
              <tr key={b.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold">{b.nombre}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{b.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300">
                    {b.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold">
                  {FinanzasHI.formatoMoneda(b.ventas_hoy)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`h-2 w-2 inline-block rounded-full mr-2 ${b.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span className="text-xs">{b.estado}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-xs font-bold transition-all">
                    AUDITAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
