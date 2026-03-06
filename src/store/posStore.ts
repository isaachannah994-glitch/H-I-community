import { create } from "zustand";
import { ProductoBase } from "../types/master";

interface CarritoItem {
  producto: ProductoBase;
  cantidad: number;
}

interface POSState {
  carrito: CarritoItem[];
  agregarProducto: (producto: ProductoBase, cantidad?: number) => void;
  removerProducto: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  obtenerTotal: () => number;
  obtenerSubtotal: () => number;
  obtenerImpuesto: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  carrito: [],

  agregarProducto: (producto, cantidad = 1) =>
    set((state) => {
      const existe = state.carrito.find(
        (item) => item.producto.id === producto.id
      );
      if (existe) {
        return {
          carrito: state.carrito.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          ),
        };
      }
      return { carrito: [...state.carrito, { producto, cantidad }] };
    }),

  removerProducto: (id) =>
    set((state) => ({
      carrito: state.carrito.filter((item) => item.producto.id !== id),
    })),

  actualizarCantidad: (id, cantidad) =>
    set((state) => ({
      carrito: state.carrito
        .map((item) =>
          item.producto.id === id ? { ...item, cantidad } : item
        )
        .filter((item) => item.cantidad > 0),
    })),

  limpiarCarrito: () => set({ carrito: [] }),

  obtenerSubtotal: () => {
    const { carrito } = get();
    return carrito.reduce(
      (total, item) =>
        total + item.producto.precio_venta * item.cantidad,
      0
    );
  },

  obtenerImpuesto: () => {
    const subtotal = get().obtenerSubtotal();
    return subtotal * 0.16; // 16% IVA
  },

  obtenerTotal: () => {
    const { obtenerSubtotal, obtenerImpuesto } = get();
    return obtenerSubtotal() + obtenerImpuesto();
  },
}));
