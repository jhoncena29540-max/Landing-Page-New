export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LandingPage {
  id?: string;
  ownerId: string;
  title: string;
  prompt: string;
  htmlContent: string;
  isPublished: boolean;
  publicUrl?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}