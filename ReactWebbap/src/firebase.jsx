// src/firebase_config/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIPoki5tnSMZJq6CmTaEtM1inSRY7CxBg",
  authDomain: "dsm-vertiz-muro-proyecto-react.firebaseapp.com",
  databaseURL: "https://dsm-vertiz-muro-proyecto-react-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dsm-vertiz-muro-proyecto-react",
  storageBucket: "dsm-vertiz-muro-proyecto-react.firebasestorage.app",
  messagingSenderId: "814138972562",
  appId: "1:814138972562:web:4af704634b4ab52492894b",
  measurementId: "G-LY3KY0JT3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Obtener la base de datos
const db = getDatabase(app);

const auth = getAuth(app);

export { db , auth};

