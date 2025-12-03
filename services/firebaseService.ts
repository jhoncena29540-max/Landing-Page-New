import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { LandingPage } from "../types";

const USERS_COLLECTION = "users";
const PAGES_COLLECTION = "landingPages";

// Helper to construct the path: users/{userId}/landingPages
const getUserPagesRef = (userId: string) => collection(db, USERS_COLLECTION, userId, PAGES_COLLECTION);

export const createLandingPage = async (userId: string, title: string, prompt: string, htmlContent: string) => {
  const docRef = await addDoc(getUserPagesRef(userId), {
    ownerId: userId,
    title,
    prompt,
    htmlContent,
    isPublished: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getUserLandingPages = async (userId: string) => {
  // Query the subcollection directly.
  // No complex index needed for simple retrieval.
  const querySnapshot = await getDocs(getUserPagesRef(userId));
  
  const pages = querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  } as LandingPage));

  // Client-side sort by createdAt descending
  return pages.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

export const getLandingPageById = async (userId: string, pageId: string) => {
  // Now requires userId to find the path
  const docRef = doc(db, USERS_COLLECTION, userId, PAGES_COLLECTION, pageId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as LandingPage;
  }
  return null;
};

export const updateLandingPage = async (userId: string, pageId: string, data: Partial<LandingPage>) => {
  const docRef = doc(db, USERS_COLLECTION, userId, PAGES_COLLECTION, pageId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const publishLandingPage = async (userId: string, pageId: string) => {
  // Hash routing format used for the public URL
  const publicUrl = `${window.location.origin}/#/p/${userId}/${pageId}`;
  await updateLandingPage(userId, pageId, {
    isPublished: true,
    publicUrl
  });
  return publicUrl;
};