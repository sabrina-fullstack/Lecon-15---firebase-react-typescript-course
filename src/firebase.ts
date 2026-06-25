import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export function createConverter<T extends { id: string }>() {
  return {
    toFirestore(data: T) {
      const { id, ...rest } = data as T & { id: string };
      return rest;
    },
    fromFirestore(snapshot: any): T {
      return { id: snapshot.id, ...snapshot.data() } as T;
    },
  };
}

export const db = getFirestore(app);
export const auth = getAuth(app);
