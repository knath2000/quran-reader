'use client';

import React from 'react';
import ArabicText from './ArabicText';

// Define the VerseData interface directly
interface VerseData {
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  words: {
    arabic: string;
    translation: string;
  }[];
}

interface QuranVerseProps {
  verse: VerseData;
  showTranslation?: boolean;
}

const QuranVerse: React.FC<QuranVerseProps> = ({ 
  verse, 
  showTranslation = true 
}) => {
  // Combine all translations for a simple English rendering
  const englishTranslation = verse.words.map((word) => word.translation).join(' ');
  
  return (
    <div className="verse group bg-black/80 p-6 rounded-xl border border-indigo-500/20 hover:shadow-md hover:border-violet-400/30 transition-all my-4">
      {/* Verse border element for visual effect */}
      <div className="verse-border absolute inset-0 rounded-xl border border-indigo-500/30 pointer-events-none"></div>
      
      {/* Verse container with proper RTL layout */}
      <div className="flex flex-col md:flex-row relative z-10">
        {/* Verse number on left */}
        <div className="flex justify-center md:justify-start mb-4 md:mb-0">
          <span className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white font-medium shrink-0 shadow-md shadow-violet-500/20">
            {verse.verseNumber}
          </span>
        </div>
        
        {/* Verse content with Arabic on right and translation centered */}
        <div className="flex flex-col md:flex-1">
          {/* Arabic text - right aligned, RTL with word-by-word translation */}
          <div className="flex justify-end mb-4">
            <ArabicText 
              text={verse.arabicText}
              surahNumber={verse.surahNumber}
              verseNumber={verse.verseNumber}
              className="text-3xl font-arabic leading-loose text-white max-w-3xl"
              useClientData={true}
            />
          </div>
          
          {/* English translation - centered */}
          {showTranslation && (
            <div className="text-center">
              <p className="text-gray-200 text-lg">
                {englishTranslation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranVerse; 