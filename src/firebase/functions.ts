import { functions } from '@/firebase/config';
import { httpsCallable } from 'firebase/functions';

/**
 * Get Quran audio from Firebase Function with fallback options
 * @param surahId - The ID of the surah (chapter)
 * @param verseNumber - The verse number within the surah
 * @returns URL to the audio file from Firebase Functions
 */
export const getQuranAudioUrl = (surahId: number, verseNumber: number): string => {
  // Use the deployed Firebase Function URL
  return `https://getquranaudio-guxly47vna-uc.a.run.app?surahId=${surahId}&verseNumber=${verseNumber}`;
};

/**
 * Alternative approach using httpsCallable (not currently used but preserved for reference)
 * This approach sends a direct function call to Firebase
 */
export const getQuranAudioHttpsCallable = async (surahId: number, verseNumber: number) => {
  try {
    const getQuranAudioFunction = httpsCallable(functions, 'getQuranAudio');
    const result = await getQuranAudioFunction({ surahId, verseNumber });
    return result.data;
  } catch (error) {
    console.error('Error calling Firebase Function:', error);
    throw error;
  }
}; 