"use client";
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

interface ProductoInventario {
  id: string;
  nombre: string;
  sku: string;
  cantidad: number;
  precio: number;
  categoria: string;
}

const PRODUCTOS_DEMO: ProductoInventario[] = [
  {
    id: "1",
    nombre: "Cemento Gris 50kg",
    sku: "CEM-GR-50",
    cantidad: 145,
    precio: 8.5,
    categoria: "Materiales",
  },
  {
    id: "2",
    nombre: "Tubo PVC 2 pulgadas",
    sku: "PVC-2-10",
    cantidad: 89,
    precio: 12.0,
    categoria: "Tuberías",
  },
  {
    id: "3",
    nombre: "Clavos 2 pulgadas",
    sku: "CLV-2-1K",
    cantidad: 456,
    precio: 0.15,
    categoria: "Tornillería",
  },
];

export default function InventarioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categorias = ["Todos", ...new Set(PRODUCTOS_DEMO.map((p) => p.categoria))];

  const productosFiltrados = PRODUCTOS_DEMO.filter(
    (p) =>
      (selectedCategory === "Todos" || p.categoria === selectedCategory) &&
      (p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {productosFiltrados.length} productos en stock
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-300">Producto</th>
              <th className="px-6 py-4 font-bold text-zinc-300">SKU</th>
              <th className="px-6 py-4 font-bold text-zinc-300">Categoría</th>
              <th className="px-6 py-4 font-bold text-zinc-300 text-right">Cantidad</th>
              <th className="px-6 py-4 font-bold text-zinc-300 text-right">Precio Unit.</th>
              <th className="px-6 py-4 font-bold text-zinc-300 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{producto.nombre}</td>
                <td className="px-6 py-4 font-mono text-zinc-400">{producto.sku}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
                    {producto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`font-bold ${
                      producto.cantidad > 50 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {producto.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  ${producto.precio.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs hover:text-emerald-400 transition-colors">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
