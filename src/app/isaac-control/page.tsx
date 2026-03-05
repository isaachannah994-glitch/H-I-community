import React from 'react';

// Simulamos las solicitudes que llegan a tu base de datos
const SOLICITUDES_PENDIENTES = [
  { id: 'req_001', nombre: 'Bodega El Sol', dueño: 'carlos@elsol.com', tipo: 'BODEGA', fecha: '05 Mar 2026' },
  { id: 'req_002', nombre: 'Ferretería Tuerca Plus', dueño: 'admin@tuercaplus.com', tipo: 'FERRETERIA', fecha: '05 Mar 2026' },
];

export default function CentroDeMandoIsaac() {
  // En producción, aquí validaríamos que el usuario activo sea isaac03.24castillo@gmail.com

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex justify-between items-center border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">H&I COMMAND CENTER</h1>
            <p className="text-sm text-zinc-500 mt-2 font-mono">MODERADOR MAESTRO: isaac03.24castillo@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-white">{SOLICITUDES_PENDIENTES.length}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Solicitudes Pendientes</p>
          </div>
        </header>

        <h2 className="text-xl font-semibold mb-6 text-white">Cola de Aprobación de Alianzas</h2>

        <div className="grid grid-cols-1 gap-4">
          {SOLICITUDES_PENDIENTES.map((req) => (
            <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex items-center justify-between shadow-lg">
              <div>
                <h3 className="text-lg font-bold text-white">{req.nombre}</h3>
                <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                  <p>Dueño: <span className="text-zinc-300">{req.dueño}</span></p>
                  <p>•</p>
                  <p>Tipo: <span className="bg-zinc-800 text-white px-2 py-0.5 rounded text-xs">{req.tipo}</span></p>
                  <p>•</p>
                  <p>Fecha: {req.fecha}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="bg-transparent border border-red-900 text-red-500 hover:bg-red-950 font-bold py-2 px-6 rounded transition-colors text-sm">
                  RECHAZAR
                </button>
                <button className="bg-white text-black hover:bg-zinc-300 font-bold py-2 px-6 rounded transition-colors text-sm shadow-md">
                  APROBAR ALIANZA
                </button>
              </div>
            </div>
          ))}
          
          {SOLICITUDES_PENDIENTES.length === 0 && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
              <p className="text-zinc-500">No hay comercios pendientes de aprobación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
