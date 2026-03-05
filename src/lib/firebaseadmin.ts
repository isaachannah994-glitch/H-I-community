import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Las API Keys se jalan desde Vercel automáticamente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: "https://h-i-community.firebaseapp.com", //
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Función de Validación de Alianza
export const verificarAccesoHI = async (email: string) => {
  if (email === "isaac03.24castillo@gmail.com") return "SUPER_ADMIN"; //
  
  const ref = doc(db, "alianzas", email);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) throw new Error("No perteneces a la Comunidad H&I.");
  return snap.data();
};
