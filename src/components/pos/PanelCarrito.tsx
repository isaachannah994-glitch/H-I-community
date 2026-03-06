"use client";
import React from "react";
import { usePOSStore } from "@/store/posStore";
import { Trash2, Plus, Minus, DollarSign } from "lucide-react";
import { FinanzasHI } from "@/lib/finanzas";

export default function PanelCarrito() {
  const { carrito, removerProducto, obtenerTotal, limpiarCarrito } = usePOSStore();

  const total = obtenerTotal();
  const impuesto = total * 0.16;
  const totalFinal = total + impuesto;

  if (carrito.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <ShoppingCart className="w-12 h-12 text-zinc-700 mb-4" />
        <p className="text-zinc-400 font-medium">Carrito vacío</p>
        <p className="text-xs text-zinc-500 mt-1">
          Agrega productos para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 bg-zinc-950">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Carrito</h3>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
            {carrito.length} items
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-zinc-800">
        {carrito.map((item) => (
          <div key={item.producto.id} className="p-4 hover:bg-zinc-800/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.producto.nombre}</p>
                <p className="text-xs text-zinc-500">
                  {FinanzasHI.formatoMoneda(item.producto.precio_venta)} c/u
                </p>
              </div>
              <button
                onClick={() => removerProducto(item.producto.id)}
                className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-zinc-900 rounded">
                <button className="p-1 hover:bg-zinc-800 text-zinc-400">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold">{item.cantidad}</span>
                <button className="p-1 hover:bg-zinc-800 text-zinc-400">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-bold text-emerald-400">
                {FinanzasHI.formatoMoneda(
                  item.producto.precio_venta * item.cantidad
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="border-t border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Subtotal</span>
          <span className="font-mono">{FinanzasHI.formatoMoneda(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">IVA (16%)</span>
          <span className="font-mono">{FinanzasHI.formatoMoneda(impuesto)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-zinc-800 pt-3">
          <span>Total</span>
          <span className="text-lg text-emerald-400 font-mono">
            {FinanzasHI.formatoMoneda(totalFinal)}
          </span>
        </div>

        {/* Métodos de Pago */}
        <div className="space-y-2 pt-3">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" />
            Efectivo
          </button>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-lg transition-colors">
            Tarjeta
          </button>
          <button
            onClick={limpiarCarrito}
            className="w-full bg-red-900/20 hover:bg-red-900/30 text-red-400 font-medium py-2 rounded-lg transition-colors border border-red-900/50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m10 0l2-8m-6 8h4m-11 0a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
