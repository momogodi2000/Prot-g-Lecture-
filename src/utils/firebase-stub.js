// Stub module to prevent Firebase import errors during build
// This is used when Firebase is referenced but not actually used in the frontend

export default {};
export const initializeApp = () => {};
export const getAuth = () => {};
export const createUserWithEmailAndPassword = () => Promise.resolve({});
export const GoogleAuthProvider = {};
export const getMessaging = () => {};
export const getAnalytics = () => {};
