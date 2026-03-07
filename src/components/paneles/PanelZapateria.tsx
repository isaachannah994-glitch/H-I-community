export const PanelZapateria = () => (
  <div className="p-6 space-y-6">
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4">Inventario de Zapateria</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black p-4 rounded-lg border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase">Filtro por Talla</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {["35","36","37","38","39","40","41","42"].map(t => (
              <button key={t} className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-black p-4 rounded-lg border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase">Genero</p>
          <div className="flex gap-2 mt-2">
            {["Dama","Caballero","Unisex"].map(g => (
              <button key={g} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors">
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-black p-4 rounded-lg border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase">Stock Bajo</p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-red-300">Talla 38 Dama</span>
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">2 pares</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-red-300">Talla 42 Caballero</span>
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">1 par</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
