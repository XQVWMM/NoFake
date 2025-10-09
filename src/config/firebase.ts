import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhBLCuRob4qTsGfmYJBmasYKxxhdcdriw",
  authDomain: "nofake-fc3c3.firebaseapp.com",
  projectId: "nofake-fc3c3",
  storageBucket: "nofake-fc3c3.firebasestorage.app",
  messagingSenderId: "980847738583",
  appId: "1:980847738583:web:eb83111050c6c70495ba92",
  measurementId: "G-0ZGXB9B721",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
