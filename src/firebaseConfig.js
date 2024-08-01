// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlSMqvGE0mjmWZWfaMbSENwSVIbmEPI8Q",
  authDomain: "garista-2c343.firebaseapp.com",
  databaseURL: "https://garista-2c343-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "garista-2c343",
  storageBucket: "garista-2c343.appspot.com",
  messagingSenderId: "867759082356",
  appId: "1:867759082356:web:d4f0252cc4d2447dc97a21",
  measurementId: "G-XZ7GSTBQ1T"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database, ref, onValue };

