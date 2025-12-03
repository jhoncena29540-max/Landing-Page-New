import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { LandingPage } from "../types";

const PAGES_COLLECTION = "landingPages";

export const createLandingPage = async (userId: string, title: string, prompt: string, htmlContent: string) => {
  const docRef = await addDoc(collection(db, PAGES_COLLECTION), {
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
  // We remove orderBy("createdAt") from the query to avoid needing a composite index.
  // We will sort the results in memory instead.
  const q = query(
    collection(db, PAGES_COLLECTION), 
    where("ownerId", "==", userId)
  );
  
  const querySnapshot = await getDocs(q);
  
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

export const getLandingPageById = async (pageId: string) => {
  const docRef = doc(db, PAGES_COLLECTION, pageId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as LandingPage;
  }
  return null;
};

export const updateLandingPage = async (pageId: string, data: Partial<LandingPage>) => {
  const docRef = doc(db, PAGES_COLLECTION, pageId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const publishLandingPage = async (pageId: string, userId: string) => {
  // Hash routing format used for the public URL
  const publicUrl = `${window.location.origin}/#/p/${userId}/${pageId}`;
  await updateLandingPage(pageId, {
    isPublished: true,
    publicUrl
  });
  return publicUrl;
};