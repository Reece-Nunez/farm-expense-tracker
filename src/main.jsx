import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";


// For React Modal
import Modal from "react-modal";
Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* React Hot Toast */}
    <Toaster />
  </React.StrictMode>
);

// Register Service Worker only in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('SW: Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('SW: New service worker found!');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, refresh to update
            console.log('SW: New content available, page will refresh...');
            window.location.reload();
          }
        });
      });
      
    } catch (error) {
      console.error('SW: Service Worker registration failed:', error);
    }
  });
}
