import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  update,
  query,
  orderByChild,
  equalTo,
  remove,
} from 'firebase/database';
import { auth, database } from './firebase';
import { User, Business } from './types';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'h-i-pos-default-key-2026';

// ============================================================================
// AUTENTICACIÓN Y GESTIÓN DE USUARIOS
// ============================================================================

export async function registerMasterAdmin(
  email: string,
  password: string,
  displayName: string
) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName });

    const user: User = {
      uid: firebaseUser.uid,
      email: email,
      displayName: displayName,
      role: 'master_admin',
      isActive: true,
      createdAt: Date.now(),
    };

    await set(ref(database, `users/${firebaseUser.uid}`), user);

    return { success: true, user: firebaseUser };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Actualizar último login
    await update(ref(database, `users/${firebaseUser.uid}`), {
      lastLogin: Date.now(),
    });

    return { success: true, user: firebaseUser };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserData(uid: string): Promise<User | null> {
  try {
    const snapshot = await get(ref(database, `users/${uid}`));
    return snapshot.exists() ? (snapshot.val() as User) : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function updateUserData(uid: string, updates: Partial<User>) {
  try {
    await update(ref(database, `users/${uid}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GESTIÓN DE NEGOCIOS (MULTI-TENANT)
// ============================================================================

export async function createBusiness(business: Omit<Business, 'id' | 'createdAt'>) {
  try {
    const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBusiness: Business = {
      ...business,
      id: businessId,
      createdAt: Date.now(),
    };

    await set(ref(database, `businesses/${businessId}`), newBusiness);
    return { success: true, businessId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBusiness(businessId: string): Promise<Business | null> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}`));
    return snapshot.exists() ? (snapshot.val() as Business) : null;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export async function getUserBusinesses(ownerUid: string): Promise<Business[]> {
  try {
    const snapshot = await get(
      query(
        ref(database, 'businesses'),
        orderByChild('ownerUid'),
        equalTo(ownerUid)
      )
    );

    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.values(data) as Business[];
  } catch (error) {
    console.error('Error fetching user businesses:', error);
    return [];
  }
}

export async function updateBusiness(businessId: string, updates: Partial<Business>) {
  try {
    await update(ref(database, `businesses/${businessId}`), updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GESTIÓN DE USUARIOS POR NEGOCIO
// ============================================================================

export async function createBusinessUser(
  businessId: string,
  email: string,
  password: string,
  role: 'manager' | 'cashier' | 'inventory_staff' | 'accountant',
  displayName: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName });

    const user: User = {
      uid: firebaseUser.uid,
      email: email,
      displayName: displayName,
      businessId: businessId,
      role: role,
      isActive: true,
      createdAt: Date.now(),
    };

    await set(ref(database, `users/${firebaseUser.uid}`), user);
    await set(ref(database, `businesses/${businessId}/users/${firebaseUser.uid}`), {
      role: role,
      addedAt: Date.now(),
    });

    return { success: true, user: firebaseUser };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBusinessUsers(businessId: string): Promise<User[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/users`));
    if (!snapshot.exists()) return [];

    const userIds = Object.keys(snapshot.val());
    const users: User[] = [];

    for (const userId of userIds) {
      const userData = await getUserData(userId);
      if (userData) users.push(userData);
    }

    return users;
  } catch (error) {
    console.error('Error fetching business users:', error);
    return [];
  }
}

export async function removeBusinessUser(businessId: string, userId: string) {
  try {
    await remove(ref(database, `businesses/${businessId}/users/${userId}`));
    await update(ref(database, `users/${userId}`), { isActive: false, businessId: null });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBusinessUserRole(
  businessId: string,
  userId: string,
  newRole: string
) {
  try {
    await update(ref(database, `businesses/${businessId}/users/${userId}`), {
      role: newRole,
    });
    await update(ref(database, `users/${userId}`), { role: newRole });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// UTILIDADES DE ENCRIPTACIÓN
// ============================================================================

export function encryptData(data: any): string {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptData(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// ============================================================================
// AUDITORÍA Y SEGURIDAD
// ============================================================================

export async function logAuditEvent(
  businessId: string,
  userId: string,
  action: string,
  module: string,
  targetId?: string,
  changes?: any
) {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await set(ref(database, `businesses/${businessId}/auditLogs/${logId}`), {
      userId,
      action,
      module,
      targetId,
      changes,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

export async function getAuditLogs(businessId: string, limit: number = 100): Promise<any[]> {
  try {
    const snapshot = await get(ref(database, `businesses/${businessId}/auditLogs`));
    if (!snapshot.exists()) return [];

    const logs = Object.values(snapshot.val()) as any[];
    return logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

// ============================================================================
// GESTIÓN DE CONTRASEÑAS Y RECUPERACIÓN
// ============================================================================

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserEmail(uid: string, newEmail: string) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updateEmail(user, newEmail);
    await update(ref(database, `users/${uid}`), { email: newEmail });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserPassword(newPassword: string) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
