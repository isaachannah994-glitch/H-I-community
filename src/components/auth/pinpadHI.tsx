// Interfaz de teclado numérico para empleados
export const PinPadHI = ({ alIngresar }) => {
  return (
    <div className="bg-black text-white p-8 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">H&I COMMUNITY</h2>
      <p className="text-gray-400 text-center mb-6">Ingresa tu código de acceso</p>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
          <button 
            key={btn}
            className="h-20 w-20 text-3xl font-bold bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
            onClick={() => alIngresar(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
