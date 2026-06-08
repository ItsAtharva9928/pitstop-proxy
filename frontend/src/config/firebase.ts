import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Add Firebase config here later
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "MOCK_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-f1-companion.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "mock-f1-companion",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// FCM Initialization would go here, often requiring native module setup in Expo
// e.g. import messaging from '@react-native-firebase/messaging';
// export const setupFCM = async () => { ... }
export const setupFCM = async () => {
  console.log('FCM Listener Setup (Mocked)');
};
