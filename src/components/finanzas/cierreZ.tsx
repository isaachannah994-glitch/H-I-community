import React from 'react';
import { FinanzasHI } from '@/lib/finanzas';

interface CierreZProps {
  comercio: string;
  fecha: string;
  datos: {
    base_imponible: number;
    impuestos: number;
    total: number;
    metodos: { efectivo: number; digital: number; divisas: number };
  }
}

export const CierreZComponent = ({ comercio, fecha, datos }: CierreZProps) => {
  return (
    <div className="w-80 bg-white text-black p-6 font-mono text-xs shadow-2xl mx-auto border-t-8 border-black">
      <div className="text-center mb-4 border-b border-black pb-4">
        <h2 className="font-black text-lg">H&I COMMUNITY</h2>
        <p className="uppercase font-bold">{comercio}</p>
        <p>RIF: J-40000000-0</p>
        <p>{fecha}</p>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>BASE IMPONIBLE:</span>
          <span>{FinanzasHI.formatoMoneda(datos.base_imponible)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (16%):</span>
          <span>{FinanzasHI.formatoMoneda(datos.impuestos)}</span>
        </div>
        <div className="flex justify-between font-black text-sm pt-2 border-t border-dashed border-black">
          <span>TOTAL CIERRE Z:</span>
          <span>{FinanzasHI.formatoMoneda(datos.total)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-black">
        <p className="font-bold mb-2">DESGLOSE DE CAJA:</p>
        <div className="flex justify-between italic">
          <span>EFECTIVO BS/USD:</span>
          <span>{FinanzasHI.formatoMoneda(datos.metodos.efectivo)}</span>
        </div>
        <div className="flex justify-between italic">
          <span>PAGO MÓVIL/ELECT:</span>
          <span>{FinanzasHI.formatoMoneda(datos.metodos.digital)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] border-t pt-4">
        <p>REPORTE GENERADO BAJO EL RÉGIMEN H&I</p>
        <p>MODERADOR: isaac03.24castillo@gmail.com</p>
        <p className="mt-2 font-bold italic">*** COPIA DE AUDITORÍA ***</p>
      </div>
    </div>
  );
};
