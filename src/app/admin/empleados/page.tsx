import React from 'react';

const EMPLEADOS_MOCK = [
  { id: '1', nombre: 'Anthony Lameda', email: 'anthony2008lameda@gmail.com', rol: 'CAJERO', estado: 'ACTIVO' },
  { id: '2', nombre: 'Isaac Castillo', email: 'isaac03.24castillo@gmail.com', rol: 'MODERADOR_MAESTRO', estado: 'ACTIVO' }
];

export default function GestionEmpleados() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10 font-sans">
      <header className="mb-10 flex justify-between items-center border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Gestión de Personal H&I</h1>
          <p className="text-zinc-500 text-sm italic">Control de accesos y responsabilidades</p>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-zinc-200 transition-all text-xs">
          + VINCULAR NUEVO EMPLEADO
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {EMPLEADOS_MOCK.map((emp) => (
          <div key={emp.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between shadow-lg hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold border border-zinc-700">
                {emp.nombre[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold">{emp.nombre}</h3>
                <p className="text-zinc-500 text-sm">{emp.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${emp.rol === 'MODERADOR_MAESTRO' ? 'border-amber-500 text-amber-500' : 'border-zinc-700 text-zinc-400'}`}>
                  {emp.rol}
                </span>
                <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest">{emp.estado}</p>
              </div>
              <button className="text-zinc-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
