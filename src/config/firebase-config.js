import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgqnlemTBOPAvIWxKnk-51VbaXrpE1eAo",
  authDomain: "sandboxscheduler.firebaseapp.com",
  databaseURL: "https://sandboxscheduler-default-rtdb.firebaseio.com",
  projectId: "sandboxscheduler",
  storageBucket: "sandboxscheduler.appspot.com",
  messagingSenderId: "603937038769",
  appId: "1:603937038769:web:d68d9b85595a4e02b29d90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const database = getDatabase(app);