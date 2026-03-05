import React from 'react';
import { FacturaHI } from '../../lib/facturacion/GeneradorFactura';
import { FinanzasHI } from '../../lib/finanzas';

export const TicketTermico = ({ factura }: { factura: FacturaHI }) => {
  return (
    <div className="w-[300px] bg-white text-black p-4 font-mono text-[11px] leading-tight mx-auto shadow-md">
      <div className="text-center border-b border-black pb-2 mb-2">
        <h2 className="font-bold text-sm">H&I COMMUNITY</h2>
        <p className="text-[9px]">SISTEMA DE GESTIÓN PROFESIONAL</p>
        <p className="mt-1">RIF: J-50000000-0</p>
        <p>MODERADOR: isaac03.24castillo@gmail.com</p>
      </div>

      <div className="flex justify-between mb-2">
        <span>FACTURA: {factura.nro_control}</span>
        <span>{new Date(factura.fecha).toLocaleDateString()}</span>
      </div>

      <div className="border-b border-black mb-2">
        <div className="flex justify-between font-bold mb-1">
          <span className="w-1/2">PRODUCTO</span>
          <span className="w-1/4 text-right">CANT</span>
          <span className="w-1/4 text-right">TOTAL</span>
        </div>
        {factura.items.map((item, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span className="w-1/2 truncate">{item.producto.nombre.toUpperCase()}</span>
            <span className="w-1/4 text-right">x{item.cantidad}</span>
            <span className="w-1/4 text-right">${(item.producto.precio_venta * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-right">
        <p>SUBTOTAL: {FinanzasHI.formatoMoneda(factura.subtotal)}</p>
        <p>IVA (16%): {FinanzasHI.formatoMoneda(factura.iva)}</p>
        <p className="font-bold text-sm">TOTAL USD: {FinanzasHI.formatoMoneda(factura.total)}</p>
        {/* Superioridad: Muestra el total en Bs según la tasa de Vercel/API */}
        <p className="font-bold">TOTAL BS: {(factura.total * factura.tasas.usd_bs).toFixed(2)}</p>
      </div>

      <div className="mt-4 pt-2 border-t border-dashed border-black text-center text-[9px]">
        <p>TASA: {factura.tasas.usd_bs} BS/USD</p>
        <p className="mt-2 uppercase">¡Gracias por su compra en la Alianza H&I!</p>
        <p className="font-bold mt-1">WWW.HICOMMUNITY.APP</p>
      </div>
    </div>
  );
};
