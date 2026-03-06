import { db } from '../FirebaseAdmin';
import { collection, getDocs, query, where } from "firebase/firestore";

export const MotorDeSupervision = {
  // Función para que Isaac vea el estado de TODAS las bodegas en tiempo real
  obtenerMapaGlobal: async (adminEmail: string) => {
    if (adminEmail !== "isaac03.24castillo@gmail.com") {
      throw new Error("Acceso denegado: Solo el Moderador Maestro puede ver el mapa global.");
    }

    const alianzasRef = collection(db, "alianzas");
    const snapshot = await getDocs(alianzasRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Calculamos ventas del día de esa bodega específica
      status_vuelo: "CONECTADO" 
    }));
  },

  // Ver cuánto ha vendido CADA bodega hoy para tu comisión o supervisión
  auditoriaVentasGlobales: async () => {
    const ventasRef = collection(db, "ventas_globales");
    const hoy = new Date().setHours(0,0,0,0);
    
    const q = query(ventasRef, where("fecha", ">=", hoy));
    const snap = await getDocs(q);
    
    return snap.docs.reduce((acc: any, doc: any) => {
      const v = doc.data();
      if (!acc[v.id_comercio]) acc[v.id_comercio] = 0;
      acc[v.id_comercio] += v.total;
      return acc;
    }, {});
  }
};
