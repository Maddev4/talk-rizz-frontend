import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { Capacitor } from '@capacitor/core';
import App from "./App";

// Conditionally initialize Firebase only on Android
if (Capacitor.getPlatform() === 'android') {
  // Initialize Firebase only for Android
  import('./config/firebase-config').then(({ initializeFirebase }) => {
    initializeFirebase();
  });
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

defineCustomElements(window);