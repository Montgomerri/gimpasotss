// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe5_hHKg1BtsK1jSQTiCPBqNId9J_bu68",
  authDomain: "asknet-qa.firebaseapp.com",
  projectId: "asknet-qa",
  storageBucket: "asknet-qa.appspot.com",
  messagingSenderId: "982056327688",
  appId: "1:982056327688:web:e3d0a786bea4b286720fbd",
  measurementId: "G-Q2LYDFBHHP",
};

// Prevent multiple Firebase instances (important for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional analytics (only runs in browser)
export let analytics: any = null;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;