import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLNwOt1rh-JzjxobZzFeDSHG1tV1IR64s",
  authDomain: "school-bus-tracking-fbf78.firebaseapp.com",
  projectId: "school-bus-tracking-fbf78",
  storageBucket: "school-bus-tracking-fbf78.firebasestorage.app",
  messagingSenderId: "482721508252",
  appId: "1:482721508252:web:1ffaf1bab3894c91a33659",
  measurementId: "G-4NBXVB3JMD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
