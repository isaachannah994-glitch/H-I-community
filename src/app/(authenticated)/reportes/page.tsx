"use client";
import React from "react";
import { FinanzasHI } from "@/lib/finanzas";
import { Download, TrendingUp } from "lucide-react";

const VENTAS_HOY = [
  { id: "V-001", hora: "09:30", metodo: "Efectivo USD", monto: 45.0, items: 3 },
  { id: "V-002", hora: "10:15", metodo: "Pago Móvil", monto: 12.5, items: 1 },
  { id: "V-003", hora: "11:00", metodo: "Zelle", monto: 85.0, items: 5 },
  { id: "V-004", hora: "12:30", metodo: "Efectivo USD", monto: 125.0, items: 8 },
  { id: "V-005", hora: "14:00", metodo: "Pago Móvil", monto: 35.5, items: 2 },
];

export default function ReportesPage() {
  const totalVendido = VENTAS_HOY.reduce((acc, v) => acc + v.monto, 0);
  const promedioTicket = totalVendido / VENTAS_HOY.length;

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes Financieros</h1>
          <p className="text-sm text-zinc-500 mt-1 font-mono">
            Sesión: HI-SESSION-2026-03-05
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-zinc-700 transition-colors">
            <Download className="w-4 h-4" />
            Descargar CSV
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors">
            <TrendingUp className="w-4 h-4" />
            Cerrar Caja (Z)
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">
            Venta Bruta
          </p>
          <p className="text-3xl font-mono font-bold">
            {FinanzasHI.formatoMoneda(totalVendido)}
          </p>
          <p className="text-xs text-zinc-500 mt-2">+12% vs ayer</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">
            Transacciones
          </p>
          <p className="text-3xl font-mono font-bold">{VENTAS_HOY.length}</p>
          <p className="text-xs text-zinc-500 mt-2">Completadas hoy</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">
            Promedio Ticket
          </p>
          <p className="text-3xl font-mono font-bold">
            {FinanzasHI.formatoMoneda(promedioTicket)}
          </p>
          <p className="text-xs text-zinc-500 mt-2">Ticket promedio</p>
        </div>

        <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-6 hover:border-emerald-700 transition-colors">
          <p className="text-xs uppercase tracking-widest font-bold text-emerald-500 mb-2">
            Efectivo en Caja
          </p>
          <p className="text-3xl font-mono font-bold text-emerald-400">$245.00</p>
          <p className="text-xs text-emerald-500/60 mt-2">Verificado</p>
        </div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <h2 className="font-bold text-zinc-300">Auditoría de Transacciones</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-400">Referencia</th>
              <th className="px-6 py-4 font-bold text-zinc-400">Hora</th>
              <th className="px-6 py-4 font-bold text-zinc-400">Método de Pago</th>
              <th className="px-6 py-4 font-bold text-zinc-400">Items</th>
              <th className="px-6 py-4 font-bold text-zinc-400 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {VENTAS_HOY.map((venta) => (
              <tr
                key={venta.id}
                className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-zinc-400">{venta.id}</td>
                <td className="px-6 py-4 text-zinc-300">{venta.hora}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-300">
                    {venta.metodo}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300">{venta.items}</td>
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
