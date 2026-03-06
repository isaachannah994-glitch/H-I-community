"use client";
import React from "react";
import { usePOSStore } from "@/store/posStore";
import { ShoppingCart, Plus } from "lucide-react";
import { FinanzasHI } from "@/lib/finanzas";
import type { ProductoBase } from "@/types/master";

interface CuadriculaProductosProps {
  searchQuery?: string;
}

// Productos demo
const PRODUCTOS_DEMO: ProductoBase[] = [
  {
    id: "1",
    nombre: "Cemento Portland 50kg",
    precio_costo: 5.5,
    precio_venta: 8.5,
    stock: 145,
    codigo: "CEM-001",
  },
  {
    id: "2",
    nombre: "Tubo PVC 2 pulgadas",
    precio_costo: 8.0,
    precio_venta: 12.0,
    stock: 89,
    codigo: "PVC-002",
  },
  {
    id: "3",
    nombre: "Clavos 2 pulgadas (1kg)",
    precio_costo: 0.1,
    precio_venta: 0.15,
    stock: 456,
    codigo: "CLV-003",
  },
  {
    id: "4",
    nombre: "Bloque de Concreto",
    precio_costo: 0.8,
    precio_venta: 1.2,
    stock: 234,
    codigo: "BLC-004",
  },
  {
    id: "5",
    nombre: "Arena Fina (Bolsa)",
    precio_costo: 2.0,
    precio_venta: 3.5,
    stock: 125,
    codigo: "ARE-005",
  },
  {
    id: "6",
    nombre: "Grava (Bolsa)",
    precio_costo: 1.8,
    precio_venta: 3.0,
    stock: 98,
    codigo: "GRA-006",
  },
  {
    id: "7",
    nombre: "Pintura Exterior (Galón)",
    precio_costo: 15.0,
    precio_venta: 25.0,
    stock: 45,
    codigo: "PIN-007",
  },
  {
    id: "8",
    nombre: "Varilla Estructural ⅜",
    precio_costo: 2.5,
    precio_venta: 4.0,
    stock: 156,
    codigo: "VAR-008",
  },
];

export default function CuadriculaProductos({
  searchQuery = "",
}: CuadriculaProductosProps) {
  const { agregarProducto } = usePOSStore();

  const productosFiltrados = PRODUCTOS_DEMO.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {productosFiltrados.length > 0 ? (
        productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 flex flex-col"
          >
            {/* Imagen placeholder */}
            <div className="w-full h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center group-hover:from-zinc-700 group-hover:to-zinc-800 transition-colors">
              <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center">
                <PackageIcon className="w-8 h-8 text-zinc-500" />
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 flex flex-col p-4 gap-2">
              <div>
                <p className="text-xs text-zinc-500 font-mono mb-1">
                  {producto.codigo}
                </p>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {producto.nombre}
                </h4>
              </div>

              <div className="flex-1" />

              {/* Precio y Stock */}
              <div className="space-y-2 border-t border-zinc-800 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Stock:</span>
                  <span
                    className={`text-xs font-bold ${
                      producto.stock > 50 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {producto.stock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-400">
                    {FinanzasHI.formatoMoneda(producto.precio_venta)}
                  </span>
                </div>
              </div>

              {/* Botón agregar */}
              <button
                onClick={() => agregarProducto(producto)}
                disabled={producto.stock === 0}
                className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="w-12 h-12 text-zinc-700 mb-4" />
          <p className="text-zinc-400 font-medium">No hay productos</p>
          <p className="text-xs text-zinc-500 mt-1">
            Intenta con otra búsqueda
          </p>
        </div>
      )}
    </div>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4v-10M4 7v10l8 4"
      />
    </svg>
  );
}
