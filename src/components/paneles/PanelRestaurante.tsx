export const PanelRestaurante = () => (
  <div className="grid grid-cols-4 gap-4 p-6">
    {/* Mapa de Mesas - Único para Restaurantes */}
    <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4">Plano de Mesas / Comandas</h3>
      <div className="grid grid-cols-5 gap-4">
        {[1,2,3,4,5,6,7,8,9,10].map(mesa => (
          <div key={mesa} className="h-24 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-zinc-700 hover:border-emerald-500 cursor-pointer">
            <span className="text-xs text-zinc-500">Mesa</span>
            <span className="text-xl font-black text-white">{mesa}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
      <h3 className="text-emerald-500 font-bold text-xs uppercase mb-4">Cocina / Estado</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between"><span>Pizza Marg.</span> <span className="text-amber-500">Preparando</span></li>
        <li className="flex justify-between"><span>Hamburguesa H&I</span> <span className="text-emerald-500">Listo</span></li>
      </ul>
    </div>
  </div>
);
