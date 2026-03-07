import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVRORSvfBh9QsjwpocOfo4hmUgM3SevWc",
  authDomain: "h-i-community.firebaseapp.com",
  projectId: "h-i-community",
  storageBucket: "h-i-community.firebasestorage.app",
  messagingSenderId: "760376100566",
  appId: "1:760376100566:web:79d5425ca4e40776952b77",
  measurementId: "G-HVEL8C1XW3",
  databaseURL: "https://h-i-community-default-rtdb.firebaseio.com"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const database: Database = getDatabase(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
