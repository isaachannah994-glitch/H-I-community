// Lógica de Validación de Régimen H&I
export const validarUsuarioHI = (userEmail: string, statusAlianza: string) => {
  // 1. Control Absoluto de Isaac
  if (userEmail === "isaac03.24castillo@gmail.com") {
    return { acceso: true, rol: "MODERADOR_MAESTRO" };
  }

  // 2. Control de Miembros de la Comunidad
  if (statusAlianza === "ACTIVO") {
    return { acceso: true, rol: "DUEÑO_COMERCIO" };
  }

  // 3. Bloqueo por Defecto
  return { 
    acceso: false, 
    mensaje: "Acceso restringido. Su solicitud está en revisión por el Moderador H&I." 
  };
};
