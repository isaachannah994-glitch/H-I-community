import { FinanzasHI } from '../finanzas';
import { ProductoBase } from '../../types/master';

export interface FacturaHI {
  nro_control: string;
  fecha: number;
  cliente: { nombre: string; rif: string };
  items: Array<{ producto: ProductoBase; cantidad: number }>;
  tasas: { usd_bs: number }; // Tasa del día para superar a INVU
  subtotal: number;
  iva: number;
  total: number;
}

export const Facturador = {
  // Genera un número de control único basado en tiempo y prefijo del comercio
  generarNroControl: (prefijo: string) => {
    const timestamp = Date.now().toString().slice(-8);
    return `${prefijo}-${timestamp}`;
  },

  // Calcula el cuerpo de la factura
  prepararFactura: (items: any[], tasaCambio: number): FacturaHI => {
    const subtotal = items.reduce((acc, item) => acc + (item.producto.precio_venta * item.cantidad), 0);
    const iva = FinanzasHI.calcularImpuesto(subtotal);
    
    return {
      nro_control: Facturador.generarNroControl('HI'),
      fecha: Date.now(),
      cliente: { nombre: "CONTADO", rif: "V-00000000" },
      items,
      tasas: { usd_bs: tasaCambio },
      subtotal,
      iva,
      total: subtotal + iva
    };
  }
};
