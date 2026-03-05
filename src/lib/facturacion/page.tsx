"use client";
import React, { useState } from 'react';
import { TicketTermico } from '@/components/facturacion/TicketTermico';

export default function ProcesarFactura() {
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [ticketListo, setTicketListo] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex gap-8 font-sans">
      
      {/* Columna Izquierda: Selección de Pago */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-black mb-8 tracking-tighter">FINALIZAR VENTA</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {['EFECTIVO', 'PAGO MOVIL', 'ZELLE', 'TARJETA'].map((m) => (
            <button 
              key={m}
              onClick={() => setMetodo(m)}
              className={`p-6 rounded-xl border-2 font-bold transition-all ${metodo === m ? 'border-white bg-zinc-800' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <div className="flex justify-between text-2xl font-bold mb-6">
            <span>Total a Pagar:</span>
            <span className="text-emerald-400">$120.00</span>
          </div>
          <button 
            onClick={() => setTicketListo(true)}
            className="w-full bg-white text-black py-5 rounded-xl font-black text-xl hover:bg-zinc-200 transition-transform active:scale-95"
          >
            CONFIRMAR E IMPRIMIR
          </button>
        </div>
      </div>

      {/* Columna Derecha: Previsualización del Ticket */}
      <div className="w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-y-auto">
        <h3 className="text-center text-zinc-500 text-xs font-bold uppercase mb-4 tracking-widest">Vista Previa del Ticket</h3>
        {ticketListo ? (
          <div className="animate-in fade-in zoom-in duration-300">
             <TicketTermico factura={/* datos de prueba */ undefined as any} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-600 italic text-sm text-center px-10">Esperando confirmación de pago para generar ticket...</p>
          </div>
        )}
      </div>
    </div>
  );
}
