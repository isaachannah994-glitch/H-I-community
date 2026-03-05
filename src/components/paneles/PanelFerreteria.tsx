export const PanelFerreteria = () => (
  <div className="p-6 space-y-6">
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4">Buscador de Pasillos y Medidas</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-black p-4 rounded-lg border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase">Filtro por Pulgadas</p>
          <div className="flex gap-2 mt-2">
            {["1/2", "1/4", "3/8", "1\""].map(m => <button key={m} className="px-3 py-1 bg-zinc-800 rounded text-xs">{m}</button>)}
          </div>
        </div>
        <div className="bg-black p-4 rounded-lg border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase">Ubicación de Almacén</p>
          <p className="text-lg font-mono text-zinc-300">PASILLO 4 - ESTANTE B</p>
        </div>
      </div>
    </div>
  </div>
);
