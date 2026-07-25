import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKJLKzSmcRSX5O01UrAHSn-jRw409XMJg",
  authDomain: "family-hub-d9e66.firebaseapp.com",
  projectId: "family-hub-d9e66",
  storageBucket: "family-hub-d9e66.firebasestorage.app",
  messagingSenderId: "215596428913",
  appId: "1:215596428913:web:9e6b4e7a6068f9199ab5d0",
  measurementId: "G-4H792EZQKX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
