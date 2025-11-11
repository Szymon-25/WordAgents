"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Firebase Web config. These keys are safe to expose in client apps.
const firebaseConfig = {
  apiKey: "AIzaSyDSd4kTzTL8y4OdwxcfQTJiuUWcB3yzXYo",
  authDomain: "word-agents.firebaseapp.com",
  projectId: "word-agents",
  storageBucket: "word-agents.firebasestorage.app",
  messagingSenderId: "370789835979",
  appId: "1:370789835979:web:7dedda072cb56eb9d8e74e",
  measurementId: "G-8REPRWCRGL",
};

let app: FirebaseApp | undefined;
let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
      .catch(() => null);
  }
  return analyticsPromise;
}
