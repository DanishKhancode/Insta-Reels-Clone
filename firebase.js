// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK75gaX6coS3jiUF2M7pRqDA1tKTP-hbg",
  authDomain: "insta-reels-dk.firebaseapp.com",
  projectId: "insta-reels-dk",
  storageBucket: "insta-reels-dk.appspot.com",
  messagingSenderId: "1058306420415",
  appId: "1:1058306420415:web:455fd0e33e92f8306fa00a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
const db = getFirestore(app);
export { auth, storage, db};

