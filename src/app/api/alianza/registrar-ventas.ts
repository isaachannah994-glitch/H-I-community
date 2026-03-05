// Lógica para guardar ventas separadas por bodega
export const registrarVentaEcosistema = async (ventaData: any, idComercio: string) => {
  const payload = {
    ...ventaData,
    id_comercio: idComercio, // Esto asegura que la bodega A no vea lo de la bodega B
    moderador_maestro: "isaac03.24castillo@gmail.com", // Referencia de poder
    fecha: Date.now()
  };
  
  // Guardar en la colección global que Isaac puede leer
  //
};
