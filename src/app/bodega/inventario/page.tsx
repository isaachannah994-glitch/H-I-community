export default function InventarioBodega() {
  const productosVencer = [
    { nombre: 'Leche Líquida', lote: 'L-404', vencimiento: '2026-03-15', stock: 12 },
    { nombre: 'Yogurt Natural', lote: 'L-501', vencimiento: '2026-03-10', stock: 24 },
  ];

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-black mb-8 border-b border-zinc-800 pb-4">CONTROL DE CADUCIDAD - H&I</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productosVencer.map((p, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{p.nombre}</p>
              <p className="text-xs text-zinc-500 uppercase">Vence en: <span className="text-amber-500 font-mono">{p.vencimiento}</span></p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{p.stock}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Unidades</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
