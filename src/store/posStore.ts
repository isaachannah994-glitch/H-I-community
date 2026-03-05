import { create } from 'zustand';
import { ProductoBase } from '../types/master';

interface POSState {
  carrito: Array<{ producto: ProductoBase; cantidad: number }>;
  agregarProducto: (producto: ProductoBase) => void;
  removerProducto: (id: string) => void;
  limpiarCarrito: () => void;
  obtenerTotal: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  carrito: [],
  
  agregarProducto: (producto) => set((state) => {
    const existe = state.carrito.find(item => item.producto.id === producto.id);
    if (existe) {
      return {
        carrito: state.carrito.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      };
    }
    return { carrito: [...state.carrito, { producto, cantidad: 1 }] };
  }),

  removerProducto: (id) => set((state) => ({
    carrito: state.carrito.filter(item => item.producto.id !== id)
  })),

  limpiarCarrito: () => set({ carrito: [] }),

  obtenerTotal: () => {
    const { carrito } = get();
    return carrito.reduce((total, item) => total + (item.producto.precio_venta * item.cantidad), 0);
  }
}));
