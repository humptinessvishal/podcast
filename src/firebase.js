// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgpZgOa_LL5LZRUGVfhWR4VOIAd_bnr-Q",
    authDomain: "podcast-vishal.firebaseapp.com",
    projectId: "podcast-vishal",
    storageBucket: "podcast-vishal.appspot.com",
    messagingSenderId: "913111845866",
    appId: "1:913111845866:web:43ee27faaed319d4194093",
    measurementId: "G-68BFY0X5K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);       //for DataBase
const storage = getStorage(app);    //for Storage
const auth = getAuth(app);          //for Authenication

export { auth, db, storage };