"use client";
import React, { useState } from 'react';
import { useBarcodeScanner } from '@/lib/scanner/ScannerListener';

export default function POSVeloz() {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [ultimoEscaneado, setUltimoEscaneado] = useState("");

  // Función que se dispara al detectar un código de barras
  const manejarEscaneo = (codigo: string) => {
    setUltimoEscaneado(codigo);
    
    // Aquí el sistema busca en tu base de datos de H&I
    // Simulamos una respuesta de la base de datos:
    const productoEncontrado = {
      id: "prod_" + codigo,
      nombre: "Producto Escaneado " + codigo,
      precio: 5.99,
      barras: codigo
    };

    setCarrito(prev => [...prev, productoEncontrado]);
    console.log("Régimen H&I: Producto añadido por barras:", codigo);
  };

  useBarcodeScanner(manejarEscaneo);

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col font-mono">
      {/* Barra de estado superior */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
        <h2 className="font-black text-xl tracking-tighter">H&I community POS</h2>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
            ESCANER ACTIVO
          </span>
          <span className="text-zinc-500 text-xs italic">{ultimoEscaneado || "Esperando lectura..."}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tabla de Venta en tiempo real */}
        <div className="flex-1 p-6 overflow-y-auto">
          <table className="w-full">
            <thead className="text-zinc-500 text-[10px] uppercase border-b border-zinc-800">
              <tr>
                <th className="pb-4 text-left">Código / Producto</th>
                <th className="pb-4 text-center">Cant</th>
                <th className="pb-4 text-right">Precio</th>
                <th className="pb-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {carrito.map((item, i) => (
                <tr key={i} className="animate-in slide-in-from-right duration-200">
                  <td className="py-4">
                    <p className="text-xs text-zinc-500">{item.barras}</p>
                    <p className="font-bold text-sm">{item.nombre}</p>
                  </td>
                  <td className="py-4 text-center">1</td>
                  <td className="py-4 text-right">${item.precio.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-emerald-400">${item.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Lateral de Totales */}
        <div className="w-80 bg-zinc-900 p-6 flex flex-col border-l border-zinc-800">
          <div className="mb-8">
            <p className="text-zinc-500 text-xs uppercase font-bold">Total Artículos</p>
            <p className="text-3xl font-black">{carrito.length}</p>
          </div>
          
          <div className="mt-auto space-y-4">
            <div className="flex justify-between text-2xl font-black border-t border-zinc-800 pt-6">
              <span>TOTAL:</span>
              <span>${carrito.reduce((a, b) => a + b.precio, 0).toFixed(2)}</span>
            </div>
            <button className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-zinc-200 transition-all uppercase tracking-tighter">
              COBRAR (F10)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
