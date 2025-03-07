import { initializeApp } from 'firebase/app';

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

// Initialize Firebase - this is required for the Firebase services to work
// even if we don't directly reference the app instance
/* eslint-disable @typescript-eslint/no-unused-vars */
const app = initializeApp(firebaseConfig);
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Function to get the URL for an audio file
 * Tries direct access first, falls back to Firebase Function if needed
 * 
 * @param surahId - The ID of the surah
 * @param verseNumber - The verse number
 * @returns Promise with the audio URL
 */
export const getAudioFileUrl = async (surahId: number, verseNumber: number): Promise<string> => {
  try {
    // Use direct URL to audio source instead of going through Firebase Function
    // This is the same URL that the Firebase Function was using internally
    return `https://quranaudio.pages.dev/1/${surahId}_${verseNumber}.mp3`;
  } catch (error) {
    console.error('Error getting audio file URL:', error);
    throw error;
  }
};

/**
 * Function to fetch the audio file as a blob
 * Includes fallback mechanisms in case of CORS issues
 * 
 * @param surahId - The ID of the surah
 * @param verseNumber - The verse number
 * @returns Promise with the audio blob
 */
export const fetchAudioBlob = async (surahId: number, verseNumber: number): Promise<Blob> => {
  try {
    const audioUrl = await getAudioFileUrl(surahId, verseNumber);
    console.log(`Attempting to fetch audio from direct URL: ${audioUrl}`);
    
    // Try fetching directly from the source URL
    try {
      const response = await fetch(audioUrl);
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch audio directly: ${response.status} ${response.statusText}`);
      }
      
      // Convert the response to a blob
      const audioBlob = await response.blob();
      return audioBlob;
    } catch (directError) {
      // If direct fetching fails (likely due to CORS), try falling back to the Firebase Function
      console.warn('Direct fetch failed, possibly due to CORS. Error:', directError);
      console.log('Attempting fallback to Firebase Function...');
      
      // Firebase Function URL (this was failing with 403, but keeping as fallback)
      const fallbackUrl = `https://getaudiofile-guxly47vna-uc.a.run.app?surahId=${surahId}&verseNumber=${verseNumber}`;
      
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback also failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
      }
      
      return await fallbackResponse.blob();
    }
  } catch (error) {
    console.error('Error fetching audio file:', error);
    throw error;
  }
};

// Create a named export object before exporting as default
const firebaseService = {
  getAudioFileUrl,
  fetchAudioBlob,
};

export default firebaseService; 