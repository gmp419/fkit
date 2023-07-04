import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAh7TNS9V5EGkv84nJxrK1-vtG1vX-aFk",
  authDomain: "fireship-c85f8.firebaseapp.com",
  projectId: "fireship-c85f8",
  storageBucket: "fireship-c85f8.appspot.com",
  messagingSenderId: "806775882916",
  appId: "1:806775882916:web:57934aa4199b9b9c07d231",
  measurementId: "G-RWC9BR0C51"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    })

    return () => unsubscribe();
  });

  return {
    subscribe
  };
}

export const user = userStore();

export function docStore<T>(path: string) {
  let unsubscribe: () => void;
  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    })

    return () => unsubscribe();
  })

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  }
}

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}
export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
  if($user) {
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set)
  } else {
    set(null);
  }
})

