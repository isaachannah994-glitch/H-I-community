// Tipado Estricto de H&I Community
export type TipoComercio = "BODEGA" | "RESTAURANTE" | "FERRETERIA" | "ZAPATERIA" | "TIENDA";

export interface Moderador {
  email: "isaac03.24castillo@gmail.com";
  rol: "SUPER_ADMIN_ABSOLUTO";
}

export interface ProductoBase {
  id: string;
  codigo?: string;
  codigo_barras?: string;
  nombre: string;
  precio_venta: number;
  precio_costo: number;
  stock?: number;
  stock_actual?: number;
  categoria?: string;
  impuesto_porcentaje?: number;
}

// Extensión para negocios específicos
export interface ProductoZapateria extends ProductoBase {
  talla: string;
  genero: "M" | "F" | "UNISEX";
}

export interface ProductoFerreteria extends ProductoBase {
  medida: string; // Ej: "1/4 pulgada"
  ubicacion_pasillo: string;
}

export interface OrdenPOS {
  id_orden: string;
  id_comercio: string;
  cajero: string;
  items: Array<{ producto: ProductoBase; cantidad: number; subtotal: number }>;
  total: number;
  metodo_pago: "EFECTIVO" | "PAGO_MOVIL" | "TARJETA" | "DIVISAS";
  fecha: number;
  estado: "COMPLETADA" | "ESPERA";
}
