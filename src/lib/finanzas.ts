// Motor de Cálculo Financiero H&I
export const FinanzasHI = {
  // Formatea a dólares americanos con 2 decimales exactos
  formatoMoneda: (cantidad: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(cantidad);
  },

  // Cálculo de impuestos (IVA 16% por defecto, ajustable por el Super Admin)
  calcularImpuesto: (subtotal: number, tasa: number = 0.16): number => {
    return Number((subtotal * tasa).toFixed(2));
  },

  // Cálculo de vuelto (cambio) para pagos en efectivo
  calcularVuelto: (totalAPagar: number, montoEntregado: number): number => {
    if (montoEntregado < totalAPagar) {
      throw new Error("El monto entregado es menor al total de la factura.");
    }
    return Number((montoEntregado - totalAPagar).toFixed(2));
  }
};
