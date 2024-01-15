import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCNNy7dO3NIQhBcnrmT03so1nZFP09SSlA",
  authDomain: "polylingua-94f50.firebaseapp.com",
  databaseURL:
    "https://polylingua-94f50-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "polylingua-94f50",
  storageBucket: "polylingua-94f50.appspot.com",
  messagingSenderId: "246921675799",
  appId: "1:246921675799:web:8caf26c4174b5ac4a60852",
  measurementId: "G-0FR2TY4Y5Y",
};
let move = document.getElementById("move");
let crop = document.getElementById("crop");
let cropper;

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();