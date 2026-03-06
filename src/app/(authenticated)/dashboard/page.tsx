"use client";
import React, { useState } from "react";
import { PanelRestaurante } from "@/components/paneles/PanelRestaurante";
import { PanelFerreteria } from "@/components/paneles/PanelFerreteria";
import { PanelBodega } from "@/components/paneles/PanelBodega";

const TIPOS_NEGOCIO = [
  { id: "RESTAURANTE", label: "🍽️ Restaurante", icon: "restaurant" },
  { id: "FERRETERIA", label: "🔨 Ferretería", icon: "wrench" },
  { id: "BODEGA", label: "📦 Bodega", icon: "box" },
];

export default function DashboardPage() {
  const [tipoNegocio, setTipoNegocio] = useState("BODEGA");

  const renderPanel = () => {
    switch (tipoNegocio) {
      case "RESTAURANTE":
        return <PanelRestaurante />;
      case "FERRETERIA":
        return <PanelFerreteria />;
      default:
        return <PanelBodega />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header con selector de tipo de negocio */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard H&I</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Selecciona el tipo de negocio para ver su panel
            </p>
          </div>
          <div className="flex gap-3">
            {TIPOS_NEGOCIO.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setTipoNegocio(tipo.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  tipoNegocio === tipo.id
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel dinámico */}
      <div className="flex-1 overflow-auto">
        <div className="animate-in fade-in duration-300">{renderPanel()}</div>
      </div>
    </div>
  );
}
