"use client";
import { usePOSStore } from "@/store/posStore";

export default function PanelCarrito() {
  const { carrito, obtenerTotal, limpiarCarrito } = usePOSStore();
  const total = obtenerTotal();

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-xl font-semibold mb-6 border-b border-zinc-800 pb-4">Orden Actual</h2>
      
      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto">
        {carrito.length === 0 ? (
          <p className="text-zinc-500 text-center mt-10 text-sm">Escanea un producto para comenzar.</p>
        ) : (
          carrito.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4 text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.producto.nombre}</p>
                <p className="text-zinc-500 text-xs">{item.cantidad} x ${item.producto.precio_venta.toFixed(2)}</p>
              </div>
              <p className="font-semibold">${(item.cantidad * item.producto.precio_venta).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      {/* Resumen de Cobro */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="flex justify-between text-zinc-400 text-sm mb-2">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-400 text-sm mb-4">
          <span>Impuestos (16%)</span>
          <span>${(total * 0.16).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Total a Cobrar</span>
          <span>${(total * 1.16).toFixed(2)}</span>
        </div>
        
        <button 
          className="w-full bg-zinc-100 text-zinc-950 hover:bg-white font-semibold py-4 rounded-md transition-colors shadow-sm disabled:opacity-50"
          disabled={carrito.length === 0}
        >
          Procesar Pago
        </button>
        <button 
          onClick={limpiarCarrito}
          className="w-full mt-3 bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-medium py-3 rounded-md transition-colors text-sm"
          disabled={carrito.length === 0}
        >
          Cancelar Orden
        </button>
      </div>
    </div>
  );
}
