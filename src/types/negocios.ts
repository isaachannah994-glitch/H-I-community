export interface ComercioHI {
  id_comercio: string;
  dueño: string;
  nombre_fantasia: string;
  tipo_negocio: "BODEGA" | "RESTAURANTE" | "FERRETERIA" | "ZAPATERIA";
  inventario: {
    id_producto: string;
    nombre: string;
    precio_costo: number;
    precio_venta: number; // Lista de precio maestra
    stock: number;
    alerta_minima: number;
    talla_o_medida?: string; // Para Zapaterías o Ferreterías
  }[];
  estado_alianza: "ESPERANDO_APROBACION_ISAAC" | "ACTIVO"; //
}
