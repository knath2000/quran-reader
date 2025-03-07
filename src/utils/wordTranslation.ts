/**
 * Utility for word-by-word Quran translations
 */
import { cleanArabicWord } from './arabicUtils';

// A basic dictionary of common Arabic words as a fallback
// In a full implementation, this would be loaded from the CSV/JSON data
const basicDictionary: Record<string, string> = {
  'الله': 'Allah',
  'الرحمن': 'The Most Gracious',
  'الرحيم': 'The Most Merciful',
  'الحمد': 'Praise',
  'رب': 'Lord',
  'العالمين': 'the worlds',
  'مالك': 'Master',
  'يوم': 'day',
  'الدين': 'the Judgment',
  'إياك': 'You alone',
  'نعبد': 'we worship',
  'نستعين': 'we ask for help',
  'اهدنا': 'Guide us',
  'الصراط': 'the path',
  'المستقيم': 'straight',
  'صراط': 'path',
  'الذين': 'those who',
  'أنعمت': 'You have blessed',
  'عليهم': 'upon them',
  'غير': 'not',
  'المغضوب': 'those who earned wrath',
  'ولا': 'and not',
  'الضالين': 'those who went astray',
  'ذلك': 'That',
  'الكتاب': 'the Book',
  'لا': 'no',
  'ريب': 'doubt',
  'فيه': 'in it',
  'هدى': 'guidance',
  'للمتقين': 'for the righteous',
  'يؤمنون': 'believe',
  'بالغيب': 'in the unseen',
  'ويقيمون': 'and establish',
  'الصلاة': 'prayer',
  'ومما': 'and from what',
  'رزقناهم': 'We have provided them',
  'ينفقون': 'they spend',
};

// Context-specific translation mapping
// In a full implementation, this would be loaded from the CSV data
const contextTranslations: Record<string, string> = {
  // Format: 'surah:verse:wordIndex': 'translation'
  '1:1:0': 'In the name of',
  '1:1:1': 'Allah',
  '1:1:2': 'the Most Gracious',
  '1:1:3': 'the Most Merciful',
};

/**
 * Get translation for an Arabic word with context awareness
 * @param word The Arabic word to translate
 * @param surahNumber The surah number for context
 * @param verseNumber The verse number for context
 * @param wordIndex The index of the word in the verse
 * @returns The English translation or undefined if not found
 */
export function getWordTranslation(
  word: string, 
  surahNumber: number, 
  verseNumber: number, 
  wordIndex: number
): string {
  // Try context-specific translation first
  const contextKey = `${surahNumber}:${verseNumber}:${wordIndex}`;
  if (contextTranslations[contextKey]) {
    return contextTranslations[contextKey];
  }
  
  // Then try word-only translation with cleaned word
  const cleanedWord = cleanArabicWord(word);
  
  // Return from basic dictionary or a generic message if not found
  return basicDictionary[cleanedWord] || 'Translation not available';
} 