export const ClausulasLegales = {
  deslinde: "H&I Community funciona como una plataforma de gestión. El Moderador Maestro (Isaac Castillo) no se hace responsable por las obligaciones fiscales, deudas o faltantes de inventario de los comercios afiliados.",
  privacidad: "Los datos de ventas son propiedad del comercio, pero el Moderador Maestro tiene facultad de auditoría para garantizar la integridad del ecosistema."
};

// Este componente bloquea el acceso hasta que marquen "Acepto"
export default function CheckpointLegal({ alAceptar }: any) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg shadow-2xl">
        <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Acuerdo de Adhesión H&I</h2>
        <div className="h-48 overflow-y-auto text-xs text-zinc-500 mb-6 bg-black p-4 rounded border border-zinc-800 leading-relaxed">
          <p className="mb-4 font-bold text-zinc-300">1. RESPONSABILIDAD FISCAL:</p>
          <p>{ClausulasLegales.deslinde}</p>
          <p className="mt-4 font-bold text-zinc-300">2. USO DE LA PLATAFORMA:</p>
          <p>El usuario declara que los fondos y productos registrados en el sistema provienen de actividades lícitas.</p>
        </div>
        <button 
          onClick={alAceptar}
          className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all uppercase text-sm"
        >
          Acepto los términos y me vinculo al régimen
        </button>
      </div>
    </div>
  );
}
