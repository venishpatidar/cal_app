import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBw3ayJHEO3ALXkRX3Fg4SjA3uxKN9eYa8",
  authDomain: "sandboxschedule.firebaseapp.com",
  databaseURL: "https://sandboxschedule-default-rtdb.firebaseio.com",
  projectId: "sandboxschedule",
  storageBucket: "sandboxschedule.appspot.com",
  messagingSenderId: "949748127671",
  appId: "1:949748127671:web:a567f2fc7d7cf9bd6afa32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase();
