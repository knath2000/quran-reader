/**
 * Client-side utility for accessing word-by-word translation data
 * Since we can't access the filesystem directly in the browser,
 * we'll use a simpler approach with a pre-defined set of translations
 */

interface WordTranslation {
  arabic: string;
  translation: string;
}

interface VerseData {
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  words: WordTranslation[];
}

// Sample data for Al-Baqarah (first few verses)
// In a production environment, this would be loaded from a JSON file
// or fetched from an API that processes the CSV file on the server
const baqarahVerses: VerseData[] = [
  {
    surahNumber: 2,
    verseNumber: 1,
    arabicText: "الم",
    words: [
      { arabic: "الم", translation: "Alif Lam Mim" }
    ]
  },
  {
    surahNumber: 2,
    verseNumber: 2,
    arabicText: "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ",
    words: [
      { arabic: "ذَلِكَ", translation: "That" },
      { arabic: "الْكِتَابُ", translation: "the Book" },
      { arabic: "لَا", translation: "no" },
      { arabic: "رَيْبَ", translation: "doubt" },
      { arabic: "فِيهِ", translation: "in it" },
      { arabic: "هُدًى", translation: "guidance" },
      { arabic: "لِلْمُتَّقِينَ", translation: "for the God-conscious" }
    ]
  },
  {
    surahNumber: 2,
    verseNumber: 3,
    arabicText: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ",
    words: [
      { arabic: "الَّذِينَ", translation: "Those who" },
      { arabic: "يُؤْمِنُونَ", translation: "believe" },
      { arabic: "بِالْغَيْبِ", translation: "in the unseen" },
      { arabic: "وَيُقِيمُونَ", translation: "and establish" },
      { arabic: "الصَّلَاةَ", translation: "the prayer" },
      { arabic: "وَمِمَّا", translation: "and from what" },
      { arabic: "رَزَقْنَاهُمْ", translation: "We have provided them" },
      { arabic: "يُنْفِقُونَ", translation: "they spend" }
    ]
  },
  {
    surahNumber: 2,
    verseNumber: 4,
    arabicText: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
    words: [
      { arabic: "وَالَّذِينَ", translation: "And those who" },
      { arabic: "يُؤْمِنُونَ", translation: "believe" },
      { arabic: "بِمَا", translation: "in what" },
      { arabic: "أُنْزِلَ", translation: "was revealed" },
      { arabic: "إِلَيْكَ", translation: "to you" },
      { arabic: "وَمَا", translation: "and what" },
      { arabic: "أُنْزِلَ", translation: "was revealed" },
      { arabic: "مِنْ", translation: "from" },
      { arabic: "قَبْلِكَ", translation: "before you" },
      { arabic: "وَبِالْآخِرَةِ", translation: "and in the Hereafter" },
      { arabic: "هُمْ", translation: "they" },
      { arabic: "يُوقِنُونَ", translation: "firmly believe" }
    ]
  },
  {
    surahNumber: 2,
    verseNumber: 5,
    arabicText: "أُولَئِكَ عَلَى هُدًى مِنْ رَبِّهِمْ وَأُولَئِكَ هُمُ الْمُفْلِحُونَ",
    words: [
      { arabic: "أُولَئِكَ", translation: "Those" },
      { arabic: "عَلَى", translation: "are on" },
      { arabic: "هُدًى", translation: "guidance" },
      { arabic: "مِنْ", translation: "from" },
      { arabic: "رَبِّهِمْ", translation: "their Lord" },
      { arabic: "وَأُولَئِكَ", translation: "and those" },
      { arabic: "هُمُ", translation: "they are" },
      { arabic: "الْمُفْلِحُونَ", translation: "the successful" }
    ]
  }
];

// Sample data for Al-Fatihah
const fatihahVerses: VerseData[] = [
  {
    surahNumber: 1,
    verseNumber: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    words: [
      { arabic: "بِسْمِ", translation: "In the name" },
      { arabic: "اللَّهِ", translation: "of Allah" },
      { arabic: "الرَّحْمَنِ", translation: "the Most Gracious" },
      { arabic: "الرَّحِيمِ", translation: "the Most Merciful" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 2,
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    words: [
      { arabic: "الْحَمْدُ", translation: "All praise" },
      { arabic: "لِلَّهِ", translation: "is to Allah" },
      { arabic: "رَبِّ", translation: "Lord" },
      { arabic: "الْعَالَمِينَ", translation: "of the worlds" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 3,
    arabicText: "الرَّحْمَنِ الرَّحِيمِ",
    words: [
      { arabic: "الرَّحْمَنِ", translation: "The Most Gracious" },
      { arabic: "الرَّحِيمِ", translation: "the Most Merciful" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 4,
    arabicText: "مَالِكِ يَوْمِ الدِّينِ",
    words: [
      { arabic: "مَالِكِ", translation: "Master" },
      { arabic: "يَوْمِ", translation: "of the Day" },
      { arabic: "الدِّينِ", translation: "of Judgment" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 5,
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    words: [
      { arabic: "إِيَّاكَ", translation: "You alone" },
      { arabic: "نَعْبُدُ", translation: "we worship" },
      { arabic: "وَإِيَّاكَ", translation: "and You alone" },
      { arabic: "نَسْتَعِينُ", translation: "we ask for help" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 6,
    arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    words: [
      { arabic: "اهْدِنَا", translation: "Guide us" },
      { arabic: "الصِّرَاطَ", translation: "to the path" },
      { arabic: "الْمُسْتَقِيمَ", translation: "the straight" }
    ]
  },
  {
    surahNumber: 1,
    verseNumber: 7,
    arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    words: [
      { arabic: "صِرَاطَ", translation: "The path" },
      { arabic: "الَّذِينَ", translation: "of those" },
      { arabic: "أَنْعَمْتَ", translation: "You have bestowed favor" },
      { arabic: "عَلَيْهِمْ", translation: "upon them" },
      { arabic: "غَيْرِ", translation: "not" },
      { arabic: "الْمَغْضُوبِ", translation: "of those who earned wrath" },
      { arabic: "عَلَيْهِمْ", translation: "upon them" },
      { arabic: "وَلَا", translation: "nor" },
      { arabic: "الضَّالِّينَ", translation: "of those who are astray" }
    ]
  }
];

/**
 * Get verse data for the specified surah and verse
 * @param surahNumber Surah number
 * @param verseNumber Optional verse number
 * @returns Verse data
 */
export function getVerseData(surahNumber: number, verseNumber?: number): VerseData[] {
  // Use hardcoded data for Surah Al-Fatiha (1) and Al-Baqarah (2)
  if (surahNumber === 1) {
    if (verseNumber) {
      return fatihahVerses.filter(verse => verse.verseNumber === verseNumber);
    }
    return fatihahVerses;
  } else if (surahNumber === 2) {
    if (verseNumber) {
      return baqarahVerses.filter(verse => verse.verseNumber === verseNumber);
    }
    return baqarahVerses;
  }
  
  // For other surahs, return an empty array indicating we don't have preloaded data
  // The QuranView component will fall back to API data
  return [];
}

/**
 * Get multiple verses from a surah
 * @param surahNumber Surah number
 * @param startVerse Starting verse number
 * @param count Number of verses to retrieve
 * @returns Array of verse data
 */
export function getSurahVerses(surahNumber: number, startVerse: number = 1, count: number = 5): VerseData[] {
  const allVerses = getVerseData(surahNumber);
  const startIndex = allVerses.findIndex(verse => verse.verseNumber >= startVerse);
  
  if (startIndex === -1) return [];
  
  return allVerses.slice(startIndex, startIndex + count);
}

/**
 * Get translation for a specific word in a verse
 * @param word Arabic word
 * @param surahNumber Surah number
 * @param verseNumber Verse number
 * @param wordIndex Word index in the verse
 * @returns English translation
 */
export function getWordTranslationFromVerse(
  word: string,
  surahNumber: number,
  verseNumber: number,
  wordIndex: number
): string {
  const verseData = getVerseData(surahNumber, verseNumber);
  
  if (verseData.length === 0) return "Translation not available";
  
  const verse = verseData[0];
  
  if (wordIndex >= verse.words.length) return "Translation not available";
  
  return verse.words[wordIndex].translation;
} 