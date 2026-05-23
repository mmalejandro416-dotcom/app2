import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Nueva configuración de Firebase para el proyecto rute-1c93c
const firebaseConfig = {
  apiKey: "AIzaSyC7HlJR4sAp4VvteRlhpEsl2XQTUDlPBL0",
  authDomain: "rute-1c93c.firebaseapp.com",
  projectId: "rute-1c93c",
  storageBucket: "rute-1c93c.firebasestorage.app",
  messagingSenderId: "1077342295770",
  appId: "1:1077342295770:web:ac12f4f2502f9f68f837e3",
  measurementId: "G-M0MN5HW6PX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
