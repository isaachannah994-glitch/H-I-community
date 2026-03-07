"use client";
import { useState } from "react";
import { PanelBodega } from "@/components/paneles/PanelBodega";
import { PanelRestaurante } from "@/components/paneles/PanelRestaurante";
import { PanelFerreteria } from "@/components/paneles/PanelFerreteria";

type TipoNegocio = "BODEGA" | "RESTAURANTE" | "FERRETERIA";

const TIPOS: { tipo: TipoNegocio; label: string; descripcion: string }[] = [
  { tipo: "BODEGA", label: "Bodega / Minimarket", descripcion: "POS con escaner de barras, inventario y alertas de stock" },
  { tipo: "RESTAURANTE", label: "Restaurante / Bar", descripcion: "Mesas, ordenes por mesa y menu dinamico" },
  { tipo: "FERRETERIA", label: "Ferreteria / Tienda", descripcion: "Productos por pasillo, medidas y unidades" },
];

export default function HomePage() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoNegocio | null>(null);

  if (tipoSeleccionado === "BODEGA") return <PanelBodega />;
  if (tipoSeleccionado === "RESTAURANTE") return <PanelRestaurante />;
  if (tipoSeleccionado === "FERRETERIA") return <PanelFerreteria />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      {/* Logo / Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter italic text-white mb-2">
          H<span className="text-zinc-400">&</span>I Community
        </h1>
        <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">
          Sistema Operativo de Negocios
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Sistema Activo</span>
        </div>
      </div>

      {/* Selector de tipo de negocio */}
      <div className="w-full max-w-2xl">
        <p className="text-zinc-600 text-xs uppercase font-bold tracking-widest mb-4 text-center">
          Selecciona tu tipo de negocio para iniciar
        </p>
        <div className="grid gap-3">
          {TIPOS.map(({ tipo, label, descripcion }) => (
            <button
              key={tipo}
              onClick={() => setTipoSeleccionado(tipo)}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-500 rounded-xl p-5 text-left transition-all duration-150 active:scale-[0.99] group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-base group-hover:text-zinc-100">{label}</p>
                  <p className="text-zinc-500 text-xs mt-1">{descripcion}</p>
                </div>
                <span className="text-zinc-700 group-hover:text-zinc-300 text-xl font-light transition-colors">
                  &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-zinc-800 text-xs font-mono">
          Admin: isaac03.24castillo@gmail.com
        </p>
        <p className="text-zinc-800 text-[10px] font-mono mt-1">v2.0 — H&I Community POS</p>
      </div>
    </div>
  );
}
