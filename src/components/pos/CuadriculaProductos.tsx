"use client";
import { usePOSStore } from "@/store/posStore";
import { ProductoBase } from "@/types/master";

const PRODUCTOS_DEMO: ProductoBase[] = [
  { id: "1", codigo_barras: "7501030430034", nombre: "Harina PAN 1kg", precio_venta: 1.20, precio_costo: 0.80, stock_actual: 450, categoria: "Alimentos", impuesto_porcentaje: 0 },
  { id: "2", codigo_barras: "7501055362193", nombre: "Refresco 2L", precio_venta: 2.50, precio_costo: 1.60, stock_actual: 80, categoria: "Bebidas", impuesto_porcentaje: 16 },
  { id: "3", codigo_barras: "7700200052054", nombre: "Arroz 1kg", precio_venta: 1.10, precio_costo: 0.70, stock_actual: 200, categoria: "Alimentos", impuesto_porcentaje: 0 },
  { id: "4", codigo_barras: "7501000911521", nombre: "Aceite 1L", precio_venta: 3.80, precio_costo: 2.50, stock_actual: 35, categoria: "Alimentos", impuesto_porcentaje: 0 },
  { id: "5", codigo_barras: "7506306000097", nombre: "Leche 1L", precio_venta: 1.80, precio_costo: 1.10, stock_actual: 120, categoria: "Lacteos", impuesto_porcentaje: 0 },
  { id: "6", codigo_barras: "7501030490090", nombre: "Azucar 1kg", precio_venta: 0.90, precio_costo: 0.55, stock_actual: 300, categoria: "Alimentos", impuesto_porcentaje: 0 },
  { id: "7", codigo_barras: "7501055369550", nombre: "Agua Mineral 500ml", precio_venta: 0.80, precio_costo: 0.40, stock_actual: 240, categoria: "Bebidas", impuesto_porcentaje: 16 },
  { id: "8", codigo_barras: "7501030493619", nombre: "Pasta 500g", precio_venta: 1.40, precio_costo: 0.85, stock_actual: 180, categoria: "Alimentos", impuesto_porcentaje: 0 },
];

export default function CuadriculaProductos() {
  const { agregarProducto } = usePOSStore();

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {PRODUCTOS_DEMO.map((producto) => (
          <button
            key={producto.id}
            onClick={() => agregarProducto(producto)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 text-left transition-all duration-150 active:scale-95 group"
          >
            <span className="text-[9px] text-zinc-600 font-mono block mb-1">{producto.codigo_barras}</span>
            <p className="font-semibold text-sm text-zinc-100 group-hover:text-white leading-tight">
              {producto.nombre}
            </p>
            <div className="flex justify-between items-end mt-3">
              <span className="text-emerald-400 font-black text-base">
                ${producto.precio_venta.toFixed(2)}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                producto.stock_actual < 40
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-zinc-800 text-zinc-500"
              }`}>
                {producto.stock_actual} uds
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
