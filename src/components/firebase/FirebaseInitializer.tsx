'use client';

import { useEffect, useState } from 'react';
import { initializeFirebaseIfNeeded } from '@/utils/firebaseHelpers';

/**
 * FirebaseInitializer component
 * This component initializes Firebase on the client side
 * It is meant to be used in the RootLayout component
 */
export default function FirebaseInitializer() {
  const [, setInitialized] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const success = await initializeFirebaseIfNeeded();
        setInitialized(success);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initFirebase();
  }, []);

  // This component doesn't render anything visible
  return null;
} 