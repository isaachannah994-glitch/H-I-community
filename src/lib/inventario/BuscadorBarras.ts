import { db } from '../FirebaseAdmin'; // El que creamos en el mensaje 1
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export const buscarPorCodigoBarras = async (codigo: string) => {
  const productosRef = collection(db, "productos_globales");
  const q = query(productosRef, where("codigo_barras", "==", codigo), limit(1));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null; // El producto no existe en el Régimen H&I
  }

  return querySnapshot.docs[0].data();
};
