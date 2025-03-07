/**
 * Utility functions for processing Arabic text
 */

/**
 * Normalize Arabic text by removing diacritics and special characters
 * @param text Arabic text to normalize
 * @returns Normalized text
 */
export function normalizeArabicText(text: string): string {
  // Remove diacritics (harakat)
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove harakat (fathah, dammah, kasrah, etc.)
    .replace(/\u0640/g, '')  // Remove tatweel
    .replace(/[ًٌٍَُِّْ]/g, ''); // Remove tanween and shadda
}

/**
 * Split Arabic text into individual words
 * @param text Arabic text to split
 * @returns Array of words
 */
export function splitArabicText(text: string): string[] {
  // Split by spaces and filter out empty strings
  return text
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Clean up an Arabic word for better matching
 * @param word Arabic word to clean
 * @returns Cleaned word
 */
export function cleanArabicWord(word: string): string {
  const normalized = normalizeArabicText(word);
  // Remove non-Arabic characters and punctuation
  return normalized
    .replace(/[^\u0600-\u06FF]/g, '') // Keep only Arabic Unicode range
    .trim();
} 