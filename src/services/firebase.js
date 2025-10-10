import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getRemoteConfig } from 'firebase/remote-config';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "protegeqv-2532f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "protegeqv-2532f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "protegeqv-2532f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "553100729963",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:553100729963:web:1f4fba71360fe864be1b2e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N3NB5PWT1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Messaging (with browser support check)
let messaging = null;
isMessagingSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  }
}).catch(console.error);

export { messaging };

// Analytics (with browser support check)
let analytics = null;
isAnalyticsSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(console.error);

export { analytics };

// Performance Monitoring
export const performance = getPerformance(app);

// Remote Config
export const remoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000, // 1 hour
  fetchTimeoutMillis: 60000
};

remoteConfig.defaultConfig = {
  maintenance_mode: false,
  max_reservations_per_day: 20,
  feature_notifications_enabled: true,
  feature_groups_enabled: true,
  feature_newsletter_enabled: true
};

export default app;

