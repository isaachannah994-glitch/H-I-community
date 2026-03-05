import { db } from '../FirebaseAdmin';
import { collection, addDoc } from "firebase/firestore";

export const RegistrarEvidencia = async (accion: string, usuario: string, idComercio: string) => {
  const log = {
    fecha: Date.now(),
    timestamp: new Date().toISOString(),
    accion: accion, // Ej: "VENTA_ELIMINADA", "CAMBIO_DE_PRECIO"
    usuario: usuario,
    id_comercio: idComercio,
    ip_origen: "capturada_automaticamente"
  };

  // Se guarda en una colección secreta que solo Isaac puede borrar
  await addDoc(collection(db, "logs_de_seguridad"), log);
};
