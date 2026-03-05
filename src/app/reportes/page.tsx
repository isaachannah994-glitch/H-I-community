import React from 'react';
import { FinanzasHI } from '@/lib/finanzas';

// Datos simulados de una jornada de ventas en una Bodega o Zapatería
const VENTAS_HOY = [
  { id: 'V-001', hora: '09:30', metodo: 'Efectivo USD', monto: 45.00, items: 3 },
  { id: 'V-002', hora: '10:15', metodo: 'Pago Móvil', monto: 12.50, items: 1 },
  { id: 'V-003', hora: '11:00', metodo: 'Zelle', monto: 85.00, items: 5 },
];

export default function ReportesFinancieros() {
  const totalVendido = VENTAS_HOY.reduce((acc, v) => acc + v.monto, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporte de Operaciones</h1>
          <p className="text-sm text-zinc-500 font-mono">ID Sesión: HI-SESSION-2026-03-05</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded text-sm font-medium border border-zinc-700">DESCARGAR CSV</button>
          <button className="bg-white hover:bg-zinc-200 text-black px-6 py-2 rounded text-sm font-bold shadow-lg">CERRAR CAJA (Z)</button>
        </div>
      </header>

      {/* Indicadores Clave (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-2">Venta Bruta</p>
          <p className="text-3xl font-mono font-bold">{FinanzasHI.formatoMoneda(totalVendido)}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-2">Transacciones</p>
          <p className="text-3xl font-mono font-bold">{VENTAS_HOY.length}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-2">Promedio Ticket</p>
          <p className="text-3xl font-mono font-bold">{FinanzasHI.formatoMoneda(totalVendido / VENTAS_HOY.length)}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm border-l-4 border-l-emerald-700">
          <p className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-2">Efectivo en Caja</p>
          <p className="text-3xl font-mono font-bold text-emerald-400">$130.00</p>
        </div>
      </div>

      {/* Desglose de Ventas Recientes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-bold text-zinc-300">Auditoría de Transacciones</h2>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">TIEMPO REAL</span>
        </div>
        <table className="w-full text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
            <tr>
              <th className="px-6 py-4 font-bold">Referencia</th>
              <th className="px-6 py-4 font-bold">Hora</th>
              <th className="px-6 py-4 font-bold">Método de Pago</th>
              <th className="px-6 py-4 font-bold text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {VENTAS_HOY.map((venta) => (
              <tr key={venta.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-zinc-400">{venta.id}</td>
                <td className="px-6 py-4 text-zinc-300">{venta.hora}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-300">
                     {venta.metodo}
                   </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-white">
                  {FinanzasHI.formatoMoneda(venta.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
