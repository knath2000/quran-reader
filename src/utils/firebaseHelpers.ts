import { getApps } from 'firebase/app';

/**
 * Check if Firebase has been initialized
 * @returns boolean - Whether Firebase has been initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return getApps().length > 0;
};

/**
 * Dynamically import Firebase configuration
 * This helps prevent server-side rendering issues
 */
export const initializeFirebaseIfNeeded = async () => {
  if (!isFirebaseInitialized()) {
    try {
      await import('@/firebase/config');
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return false;
    }
  }
  return true;
}; 