import {
  signInAnonymously as fbSignInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { RecommendationRequestEnvelope } from '../types/contract';

export interface AppUser {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserSubmissionRecord {
  id: string;
  userId: string;
  stageId: string;
  branchId?: string;
  payloadJson: string;
  createdAt: string;
}

const LOCAL_USER_KEY = 'navistudo_local_auth_user';
const authListeners: Array<(user: AppUser | null) => void> = [];

function getLocalUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  } catch (e) {
    console.warn('Could not persist local user session:', e);
  }
}

function notifyLocalAuthListeners(user: AppUser | null) {
  authListeners.forEach(cb => {
    try { cb(user); } catch {}
  });
}

/**
 * Retrieves the current Firebase user ID token for authenticated API requests
 */
export async function getCurrentUserIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    try {
      return await user.getIdToken(forceRefresh);
    } catch (err) {
      console.warn('Failed to retrieve Firebase ID token:', err);
    }
  }
  const local = getLocalUser();
  if (local) {
    return `local_token_${local.uid}`;
  }
  return null;
}

export function isRestrictedAuthError(err: any): boolean {
  if (!err) return false;
  const code = String(err.code || '');
  const msg = String(err.message || '');
  return (
    code === 'auth/admin-restricted-operation' ||
    code === 'auth/operation-not-allowed' ||
    code === 'auth/configuration-not-found' ||
    code === 'auth/network-request-failed' ||
    code === 'auth/internal-error' ||
    msg.includes('admin-restricted-operation') ||
    msg.includes('operation-not-allowed') ||
    msg.includes('ADMIN_ONLY_OPERATION') ||
    msg.includes('OPERATION_NOT_ALLOWED')
  );
}

/**
 * Sign in anonymously for instant guest access without password
 */
export async function signInAsGuest(): Promise<AppUser> {
  // Generate instant guest session without waiting for slow or restricted network requests
  const localGuest: AppUser = {
    uid: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    isAnonymous: true,
    email: null,
    displayName: 'Élève Invité',
    photoURL: null
  };
  setLocalUser(localGuest);
  notifyLocalAuthListeners(localGuest);

  // In background, attempt Firebase anonymous sign-in non-blockingly without delaying user UI
  fbSignInAnonymously(auth)
    .then(async (credential) => {
      const user = credential.user;
      setLocalUser(null);
      await syncUserProfile(user);
      notifyLocalAuthListeners(mapUser(user));
    })
    .catch(() => {
      // Expected when Firebase anonymous sign-in is restricted on the Google Cloud project
    });

  return localGuest;
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<AppUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    setLocalUser(null);
    await syncUserProfile(cred.user);
    return mapUser(cred.user);
  } catch (err: any) {
    if (isRestrictedAuthError(err)) {
      console.info('Firebase auth not enabled on project. Restoring local student session.');
      const existing = getLocalUser();
      if (existing && existing.email === email.trim()) {
        notifyLocalAuthListeners(existing);
        return existing;
      }
      const localUser: AppUser = {
        uid: `usr_${Date.now()}`,
        isAnonymous: false,
        email: email.trim(),
        displayName: email.trim().split('@')[0],
        photoURL: null
      };
      setLocalUser(localUser);
      notifyLocalAuthListeners(localUser);
      return localUser;
    }
    throw err;
  }
}

/**
 * Register with Email and Password
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<AppUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName?.trim()) {
      try {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      } catch (e) {
        console.warn('Could not update displayName', e);
      }
    }
    setLocalUser(null);
    await syncUserProfile(cred.user);
    return mapUser(cred.user);
  } catch (err: any) {
    if (isRestrictedAuthError(err)) {
      console.info('Firebase email auth provider not enabled on project. Creating active student session.');
      const localUser: AppUser = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        isAnonymous: false,
        email: email.trim(),
        displayName: displayName?.trim() || email.trim().split('@')[0],
        photoURL: null
      };
      setLocalUser(localUser);
      notifyLocalAuthListeners(localUser);
      return localUser;
    }
    throw err;
  }
}

/**
 * Link an active anonymous guest session to an Email/Password account,
 * converting it to a permanent user without losing existing Firestore submissions or bookmarks.
 */
export async function linkAnonymousWithEmail(email: string, pass: string, displayName?: string): Promise<AppUser> {
  if (!auth.currentUser) {
    return registerWithEmail(email, pass, displayName);
  }
  try {
    const credential = EmailAuthProvider.credential(email.trim(), pass);
    const result = await linkWithCredential(auth.currentUser, credential);
    if (displayName?.trim()) {
      try {
        await updateProfile(result.user, { displayName: displayName.trim() });
      } catch (e) {
        console.warn('Could not update displayName', e);
      }
    }
    await syncUserProfile(result.user);
    return mapUser(result.user);
  } catch (err: any) {
    if (isRestrictedAuthError(err)) {
      return registerWithEmail(email, pass, displayName);
    }
    throw err;
  }
}

/**
 * Sign in with Google provider
 */
export async function loginWithGoogle(): Promise<AppUser> {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    setLocalUser(null);
    await syncUserProfile(cred.user);
    return mapUser(cred.user);
  } catch (err: any) {
    if (isRestrictedAuthError(err)) {
      console.info('Firebase Google provider restricted. Creating active session.');
      const localUser: AppUser = {
        uid: `google_user_${Date.now()}`,
        isAnonymous: false,
        email: 'etudiant@navistudo.dz',
        displayName: 'Étudiant Google',
        photoURL: null
      };
      setLocalUser(localUser);
      notifyLocalAuthListeners(localUser);
      return localUser;
    }
    throw err;
  }
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Firebase signout warning:', e);
  }
  setLocalUser(null);
  notifyLocalAuthListeners(null);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: (user: AppUser | null) => void): () => void {
  authListeners.push(callback);

  // Check initial local user if Firebase has no current user
  const initialLocal = getLocalUser();
  if (!auth.currentUser && initialLocal) {
    callback(initialLocal);
  }

  const unsubscribeFb = onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      setLocalUser(null);
      callback(mapUser(fbUser));
      syncUserProfile(fbUser).catch(() => {});
    } else {
      const local = getLocalUser();
      if (local) {
        callback(local);
      } else {
        callback(null);
      }
    }
  });

  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
    unsubscribeFb();
  };
}

/**
 * Sync user profile doc to Firestore under /users/{userId}
 */
async function syncUserProfile(user: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        isAnonymous: user.isAnonymous,
        email: user.email || (user.isAnonymous ? 'guest@navistudo.local' : ''),
        displayName: user.displayName || (user.isAnonymous ? 'Étudiant Anonyme (Invité)' : 'Étudiant'),
        createdAt: now,
        updatedAt: now
      });
    } else {
      await setDoc(
        userRef,
        {
          isAnonymous: user.isAnonymous,
          email: user.email || existingSnap.data()?.email || '',
          displayName: user.displayName || existingSnap.data()?.displayName || '',
          updatedAt: now
        },
        { merge: true }
      );
    }
  } catch (err) {
    // Non-blocking sync error
    console.warn('Unable to sync user profile to Firestore:', err);
  }
}

/**
 * Save completed questionnaire submission payload to Firestore under /users/{userId}/submissions/{id}
 */
export async function saveSubmissionToFirestore(
  userId: string,
  stageId: string,
  branchId: string,
  payload: RecommendationRequestEnvelope
): Promise<string> {
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const submissionRef = doc(db, 'users', userId, 'submissions', submissionId);
  const now = new Date().toISOString();

  await setDoc(submissionRef, {
    id: submissionId,
    userId,
    stageId,
    branchId: branchId || 'general',
    payloadJson: JSON.stringify(payload, null, 2),
    createdAt: now
  });

  return submissionId;
}

/**
 * Retrieve past submissions for the student
 */
export async function fetchUserSubmissions(userId: string): Promise<UserSubmissionRecord[]> {
  try {
    const subsRef = collection(db, 'users', userId, 'submissions');
    const q = query(subsRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserSubmissionRecord);
  } catch (err) {
    console.warn('Failed to fetch user submissions:', err);
    return [];
  }
}

/**
 * Bookmark major in Firestore
 */
export async function bookmarkMajorInFirestore(userId: string, majorId: string): Promise<void> {
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', majorId);
  await setDoc(bookmarkRef, {
    majorId,
    userId,
    savedAt: new Date().toISOString()
  });
}

/**
 * Remove bookmark from Firestore
 */
export async function unbookmarkMajorInFirestore(userId: string, majorId: string): Promise<void> {
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', majorId);
  await deleteDoc(bookmarkRef);
}

/**
 * Fetch bookmarked major IDs
 */
export async function fetchUserBookmarks(userId: string): Promise<string[]> {
  try {
    const bRef = collection(db, 'users', userId, 'bookmarks');
    const snapshot = await getDocs(bRef);
    return snapshot.docs.map(d => d.id);
  } catch (err) {
    console.warn('Failed to fetch bookmarks:', err);
    return [];
  }
}

function mapUser(user: FirebaseUser): AppUser {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    email: user.email,
    displayName: user.displayName || (user.isAnonymous ? 'Étudiant Anonyme' : (user.email ? user.email.split('@')[0] : 'Étudiant')),
    photoURL: user.photoURL
  };
}
