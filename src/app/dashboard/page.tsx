"use client";
import React from 'react';
import { PanelRestaurante } from '@/components/paneles/PanelRestaurante';
import { PanelFerreteria } from '@/components/paneles/PanelFerreteria';
import { PanelZapateria } from '@/components/paneles/PanelZapateria';
import { PanelBodega } from '@/components/paneles/PanelBodega'; // El POS que ya hicimos

export default function DashboardDinamico({ tipoNegocio }: { tipoNegocio: string }) {
  
  // Renderizado condicional bajo el régimen H&I
  const renderPanel = () => {
    switch (tipoNegocio) {
      case 'RESTAURANTE': return <PanelRestaurante />;
      case 'FERRETERIA': return <PanelFerreteria />;
      case 'ZAPATERIA': return <PanelZapateria />;
      default: return <PanelBodega />; // Por defecto el POS de Bodega
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950">
        <div className="flex items-center gap-4">
          <span className="font-black text-xl tracking-tighter italic underline decoration-zinc-700">H&I {tipoNegocio}</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">Terminal Activa</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold">Admin: Isaac Castillo</p>
          <p className="text-[9px] text-zinc-500 font-mono italic">isaac03.24castillo@gmail.com</p>
        </div>
      </nav>
      
      {/* El sistema inyecta el panel correspondiente aquí */}
      <main className="animate-in fade-in duration-500">
        {renderPanel()}
      </main>
    </div>
  );
}
