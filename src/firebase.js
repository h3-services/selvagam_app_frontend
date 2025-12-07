import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPcBxlMYDr1Q3rnj8iMCGlIOQpyG0rhVw",
  authDomain: "our-area-b5901.firebaseapp.com",
  projectId: "our-area-b5901",
  storageBucket: "our-area-b5901.firebasestorage.app",
  messagingSenderId: "407606866326",
  appId: "1:407606866326:web:296ba3730c61c1bdfa6db7",
  measurementId: "G-F8WF674GLT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
