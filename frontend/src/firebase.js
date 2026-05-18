// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8I28sB7j47SXTq1-W70oNNn8czk08e7I",
  authDomain: "price-tracke.firebaseapp.com",
  projectId: "price-tracke",
  storageBucket: "price-tracke.firebasestorage.app",
  messagingSenderId: "325235228338",
  appId: "1:325235228338:web:c6f6628432d7295ed293ab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
