import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: 請前往 Firebase Console -> Project Settings -> General -> Your apps
// 複製 "firebaseConfig" 物件的內容並貼在下方
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);