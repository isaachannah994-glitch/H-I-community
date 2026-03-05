// Definición estricta de jerarquías
export const ROLES_HI = {
  SUPER_ADMIN: {
    id: "MODERADOR_MAESTRO",
    permisos: ["*"], // Isaac tiene acceso a TODO
    email: "isaac03.24castillo@gmail.com"
  },
  DUEÑO: {
    id: "PROPIETARIO_COMERCIO",
    permisos: ["VENTAS", "REPORTES", "GESTION_EMPLEADOS", "INVENTARIO_PROPIO"]
  },
  EMPLEADO: {
    id: "CAJERO",
    permisos: ["VENTAS", "VER_PRODUCTOS"] // Anthony solo puede vender y ver precios
  }
};

// Función para verificar si alguien puede realizar una acción
export const tienePermiso = (usuarioRol: string, accionSolicitada: string) => {
  if (usuarioRol === "MODERADOR_MAESTRO") return true;
  
  const rol = Object.values(ROLES_HI).find(r => r.id === usuarioRol);
  return rol?.permisos.includes(accionSolicitada) || false;
};
