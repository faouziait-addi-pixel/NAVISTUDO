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

/**
 * Sign in anonymously for instant guest access without password
 */
export async function signInAsGuest(): Promise<AppUser> {
  const credential = await fbSignInAnonymously(auth);
  const user = credential.user;
  await syncUserProfile(user);
  return mapUser(user);
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  await syncUserProfile(cred.user);
  return mapUser(cred.user);
}

/**
 * Register with Email and Password
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<AppUser> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName?.trim()) {
    try {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    } catch (e) {
      console.warn('Could not update displayName', e);
    }
  }
  await syncUserProfile(cred.user);
  return mapUser(cred.user);
}

/**
 * Link an active anonymous guest session to an Email/Password account,
 * converting it to a permanent user without losing existing Firestore submissions or bookmarks.
 */
export async function linkAnonymousWithEmail(email: string, pass: string, displayName?: string): Promise<AppUser> {
  if (!auth.currentUser) {
    return registerWithEmail(email, pass, displayName);
  }
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
}

/**
 * Sign in with Google provider
 */
export async function loginWithGoogle(): Promise<AppUser> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  await syncUserProfile(cred.user);
  return mapUser(cred.user);
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: (user: AppUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      callback(mapUser(fbUser));
      // Sync in background
      syncUserProfile(fbUser).catch(() => {});
    } else {
      callback(null);
    }
  });
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
