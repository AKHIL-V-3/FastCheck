
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCIIUmYQu0UGSYwNobhHMtY7ALrjF2OvP4",
  authDomain: "hotel-booking-2d903.firebaseapp.com",
  projectId: "hotel-booking-2d903",
  storageBucket: "hotel-booking-2d903.appspot.com",
  messagingSenderId: "106202780238",
  appId: "1:106202780238:web:c2d1cb78e3f138a1b1691f",
  measurementId: "G-WZMCN227S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}
