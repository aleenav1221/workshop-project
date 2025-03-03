
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA_C2TZ91X4Aw1WfHZYu0BVKDHFoD3q06Y",
    authDomain: "workshop-a105b.firebaseapp.com",
    projectId: "workshop-a105b",
    storageBucket: "workshop-a105b.firebasestorage.app",
    messagingSenderId: "28988967861",
    appId: "1:28988967861:web:9cf747e7cf64fa350127fc",
    measurementId: "G-JHQ3PWELV8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, addDoc, collection };
