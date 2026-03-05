// Lógica de servidor para validar PIN de empleados
export async function validarPinH&I(pinIngresado: string, idComercio: string) {
  // En producción, buscaríamos el PIN encriptado en tu base de datos de Firebase
  // Si el PIN coincide, devolvemos el perfil del empleado (Anthony o Isaac)
  
  if (pinIngresado === "1234") {
    return {
      nombre: "Anthony Lameda",
      rol: "CAJERO",
      id_comercio: idComercio
    };
  }
  
  if (pinIngresado === "0000") { // Tu PIN Maestro de ejemplo
    return {
      nombre: "Isaac Castillo",
      rol: "MODERADOR_MAESTRO",
      id_comercio: "GLOBAL"
    };
  }

  throw new Error("PIN de acceso incorrecto.");
}
