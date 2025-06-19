// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFyeo29AElQo0O59VBFze2-bAZvlfg0_c",
  authDomain: "thesis-evaluation-survey.firebaseapp.com",
  databaseURL: "https://thesis-evaluation-survey-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thesis-evaluation-survey",
  storageBucket: "thesis-evaluation-survey.firebasestorage.app",
  messagingSenderId: "105595165578",
  appId: "1:105595165578:web:7eba9493f9ac587d6e0673",
  measurementId: "G-7SGRLDZKYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);