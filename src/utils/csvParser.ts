/**
 * Utility for parsing the wbw.csv file and extracting verse data
 */

import fs from 'fs';
import path from 'path';
import { cache } from 'react';

// Define types for the CSV data
interface WbwWord {
  ID: string;
  Sura_No: string;
  Verse_No: string;
  Word_No: string;
  Segment_No: string;
  Word: string;
  Without_Diacritics: string;
  Segmented_Word: string;
  Morph_Tag: string;
  Morph_Type: string;
  Punctuation_Mark: string;
  Invariable_Declinable: string;
  Syntactic_Role: string;
  Possessive_Construct: string;
  Case_Mood: string;
  Case_Mood_Marker: string;
  Phrase: string;
  Phrasal_Function: string;
  Gloss: string;
}

interface VerseData {
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  words: {
    arabic: string;
    translation: string;
  }[];
}

// Cache the parsed data to avoid re-parsing on every request
const parseWbwData = cache(() => {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'wbw.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse the CSV data
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    const parsedData: WbwWord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const entry: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      
      // Use unknown as an intermediate casting step for type safety
      parsedData.push(entry as unknown as WbwWord);
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing WBW data:', error);
    return [];
  }
});

/**
 * Get verse data for a specific surah and verse
 * @param surahNumber Surah number
 * @param verseNumber Verse number (optional)
 * @returns Verse data including Arabic text and word-by-word translations
 */
export function getVerseData(surahNumber: number, verseNumber?: number): VerseData[] {
  try {
    const wbwData = parseWbwData();
    
    // Filter by surah and verse number if provided
    const filteredData = wbwData.filter(entry => 
      parseInt(entry.Sura_No) === surahNumber && 
      (verseNumber ? parseInt(entry.Verse_No) === verseNumber : true)
    );
    
    // Group by verse
    const versesMap = new Map<string, WbwWord[]>();
    
    filteredData.forEach(entry => {
      const key = `${entry.Sura_No}:${entry.Verse_No}`;
      if (!versesMap.has(key)) {
        versesMap.set(key, []);
      }
      versesMap.get(key)!.push(entry);
    });
    
    // Convert to verse data
    const verses: VerseData[] = [];
    
    versesMap.forEach((wordEntries, key) => {
      // Sort by word number
      wordEntries.sort((a, b) => parseInt(a.Word_No) - parseInt(b.Word_No));
      
      // Extract unique words (ignore segments)
      const uniqueWords: WbwWord[] = [];
      const wordSet = new Set<string>();
      
      wordEntries.forEach(entry => {
        const wordKey = `${entry.Word_No}`;
        if (!wordSet.has(wordKey)) {
          wordSet.add(wordKey);
          uniqueWords.push(entry);
        }
      });
      
      // Generate verse data
      const arabicText = uniqueWords.map(entry => entry.Word).join(' ');
      const [surahNum, verseNum] = key.split(':');
      
      verses.push({
        surahNumber: parseInt(surahNum),
        verseNumber: parseInt(verseNum),
        arabicText,
        words: uniqueWords.map(entry => ({
          arabic: entry.Word,
          translation: entry.Gloss
        }))
      });
    });
    
    // Sort by verse number
    return verses.sort((a, b) => a.verseNumber - b.verseNumber);
  } catch (error) {
    console.error('Error getting verse data:', error);
    return [];
  }
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