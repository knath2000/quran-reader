import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
// import { connectFunctionsEmulator } from 'firebase/functions'; // Uncomment when needed for local development

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDAjsOoTGhdLdvpamg18E0HJ_JvrA4sfqw",
  authDomain: "quran-reader-9d31e.firebaseapp.com",
  projectId: "quran-reader-9d31e",
  storageBucket: "quran-reader-9d31e.firebasestorage.app",
  messagingSenderId: "350277356898",
  appId: "1:350277356898:web:59a9601f7a2364c096703b",
  measurementId: "G-RXRJXZFMQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Connect to Functions emulator when running locally (uncomment during local development)
// if (process.env.NODE_ENV === 'development') {
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export { app, functions };
export default app; 