import React, { useState } from "react";
import { Search, MapPin, Grid3x3, Wrench } from "lucide-react";

interface ProductoFerreteria {
  id: string;
  nombre: string;
  medida: string;
  precio: number;
  pasillo: string;
  estante: string;
  stock: number;
}

const PRODUCTOS_FERRETERIA: ProductoFerreteria[] = [
  {
    id: "1",
    nombre: "Tubo PVC",
    medida: "1/2\"",
    precio: 2.5,
    pasillo: "2",
    estante: "A",
    stock: 145,
  },
  {
    id: "2",
    nombre: "Codo PVC",
    medida: "3/4\"",
    precio: 1.2,
    pasillo: "2",
    estante: "B",
    stock: 89,
  },
  {
    id: "3",
    nombre: "Varilla Estructural",
    medida: "3/8\"",
    precio: 4.0,
    pasillo: "3",
    estante: "A",
    stock: 67,
  },
  {
    id: "4",
    nombre: "Cemento Portland",
    medida: "50kg",
    precio: 8.5,
    pasillo: "4",
    estante: "A",
    stock: 125,
  },
];

const MEDIDAS = ["1/2\"", "3/4\"", "1\"", "1 1/4\"", "1 1/2\"", "2\""];

export const PanelFerreteria = () => {
  const [selectedMedida, setSelectedMedida] = useState<string>("");
  const [selectedPasillo, setSelectedPasillo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const productosFiltrados = PRODUCTOS_FERRETERIA.filter(
    (p) =>
      (selectedMedida === "" || p.medida === selectedMedida) &&
      (selectedPasillo === "" || p.pasillo === selectedPasillo) &&
      (p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.medida.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pasillos = [...new Set(PRODUCTOS_FERRETERIA.map((p) => p.pasillo))].sort();

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 overflow-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Panel de Ferretería</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Buscador de pasillos, medidas e inventario
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Búsqueda
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Filtro por Medida */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Filtro por Medida
            </label>
            <select
              value={selectedMedida}
              onChange={(e) => setSelectedMedida(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todas las medidas</option>
              {MEDIDAS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Pasillo */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2">
              Ubicación (Pasillo)
            </label>
            <select
              value={selectedPasillo}
              onChange={(e) => setSelectedPasillo(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos los pasillos</option>
              {pasillos.map((p) => (
                <option key={p} value={p}>
                  Pasillo {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de Medidas Rápidas */}
        <div>
          <p className="text-xs font-bold text-zinc-400 mb-2 uppercase">
            Medidas Rápidas
          </p>
          <div className="flex flex-wrap gap-2">
            {MEDIDAS.map((m) => (
              <button
                key={m}
                onClick={() =>
                  setSelectedMedida(selectedMedida === m ? "" : m)
                }
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  selectedMedida === m
                    ? "bg-emerald-500 text-black"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-white text-sm">{producto.nombre}</p>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  {producto.medida}
                </p>
              </div>
              <Wrench className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="space-y-2 mb-3 py-3 border-y border-zinc-800">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span className="text-zinc-300">
                  Pasillo {producto.pasillo} - Estante {producto.estante}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Grid3x3 className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-300">Stock: {producto.stock}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-400">
                ${producto.precio.toFixed(2)}
              </span>
              <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded transition-colors">
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wrench className="w-12 h-12 text-zinc-700 mb-4" />
          <p className="text-zinc-400 font-medium">No hay productos</p>
          <p className="text-xs text-zinc-500 mt-1">
            Intenta con otros filtros
          </p>
        </div>
      )}
    </div>
  );
};

export default PanelFerreteria;
