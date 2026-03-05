import React, { useState } from 'react';

// Tipos de Negocio para el Régimen H&I
const TIPOS_NEGOCIO = [
  { id: 'BODEGA', nombre: 'Bodega / Market' },
  { id: 'FERRETERIA', nombre: 'Ferretería' },
  { id: 'ZAPATERIA', nombre: 'Zapatería' },
  { id: 'RESTAURANTE', nombre: 'Restaurante / Food' },
  { id: 'TIENDA', nombre: 'Tienda de Ropa' }
];

export default function RegistroAlianza() {
  const [enviando, setEnviando] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        
        {/* Encabezado Corporativo */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">H&I COMMUNITY</h1>
          <p className="text-zinc-500 mt-2">Solicitud de Vinculación al Régimen de Isaac Castillo</p>
        </header>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Nombre del Comercio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Nombre del Comercio</label>
              <input 
                type="text" 
                placeholder="Ej. Bodega El Porvenir"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-zinc-500 transition-all"
                required
              />
            </div>

            {/* Campo: Tipo de Negocio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Tipo de Negocio</label>
              <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-zinc-500 transition-all">
                {TIPOS_NEGOCIO.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo: Correo del Dueño */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Correo Electrónico del Administrador</label>
            <input 
              type="email" 
              placeholder="dueño@ejemplo.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-zinc-500 transition-all"
              required
            />
          </div>

          {/* Campo: RIF / Identificación Fiscal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Identificación Fiscal (RIF / NIT)</label>
            <input 
              type="text" 
              placeholder="J-12345678-9"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-zinc-500 transition-all"
              required
            />
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-colors shadow-lg"
            >
              ENVIAR SOLICITUD DE ALIANZA
            </button>
            <p className="text-center text-xs text-zinc-600 mt-4 italic">
              * Sujeto a aprobación manual por: isaac03.24castillo@gmail.com
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
