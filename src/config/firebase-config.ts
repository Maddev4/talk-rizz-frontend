import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBznzFT3gMDdBT10sUTsPi7gjSk6SInUBQ",
    authDomain: "catnnect-ab73f.firebaseapp.com",
    projectId: "catnnect-ab73f",
    storageBucket: "catnnect-ab73f.firebasestorage.app",
    messagingSenderId: "871084142539",
    appId: "1:871084142539:android:daae6bb42cb5243f1cd04e"
  };

  const app = initializeApp(firebaseConfig);
  getMessaging(app);
}; 