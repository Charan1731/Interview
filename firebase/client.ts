import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgpjvWdAN2GmxrEld-LPl2Z5MNIOkgdKg",
  authDomain: "techronin-6a71f.firebaseapp.com",
  projectId: "techronin-6a71f",
  storageBucket: "techronin-6a71f.firebasestorage.app",
  messagingSenderId: "509573301883",
  appId: "1:509573301883:web:15df87027b702ecf54c4de",
  measurementId: "G-W78HV5V5H3"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};