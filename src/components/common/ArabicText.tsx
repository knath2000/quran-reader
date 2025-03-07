'use client';

import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { splitArabicText } from '@/utils/arabicUtils';
import { getWordTranslation } from '@/utils/wordTranslation';
import { getWordTranslationFromVerse } from '@/utils/clientCsvParser';
import WordTooltip from './WordTooltip';

// Register the GSAP plugins
gsap.registerPlugin(useGSAP);

interface ArabicTextProps {
  text: string;
  surahNumber: number;
  verseNumber: number;
  className?: string;
  useClientData?: boolean;
  isPlaying?: boolean;
}

const ArabicText: React.FC<ArabicTextProps> = ({ 
  text, 
  surahNumber, 
  verseNumber, 
  className = '',
  useClientData = false,
  isPlaying = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipState, setTooltipState] = useState({
    show: false,
    translation: '',
    position: { x: 0, y: 0 },
    currentWordIndex: -1,
  });

  // Split the Arabic text into words
  const words = splitArabicText(text);

  // GSAP animations for when audio is playing
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Get all word elements within this specific container
    const wordElements = containerRef.current.querySelectorAll('.arabic-word');
    
    // Kill any existing animations first to prevent conflicts
    gsap.killTweensOf(wordElements);
    
    if (isPlaying) {
      // Create an initial state for all words
      gsap.set(wordElements, { 
        opacity: 1,
        textShadow: "0 0 0 rgba(167, 139, 250, 0)", 
        color: "#a78bfa", // violet-400
        scale: 1
      });
      
      // Create a glowing animation timeline for all words
      const tl = gsap.timeline({ repeat: -1 });
      
      // Add each word to the timeline with a slight stagger
      wordElements.forEach((word, index) => {
        // Calculate a delay based on word position to create a wave effect
        const delay = index * 0.1;
        
        // Add sequences to the timeline for each word
        tl.to(word, {
          opacity: 1,
          color: "#c4b5fd", // violet-300
          textShadow: "0 0 8px rgba(167, 139, 250, 0.6), 0 0 12px rgba(139, 92, 246, 0.4)",
          scale: 1.05,
          duration: 0.4,
          ease: "power1.inOut",
        }, delay)
        .to(word, {
          opacity: 0.9,
          color: "#a78bfa", // violet-400
          textShadow: "0 0 0 rgba(167, 139, 250, 0)",
          scale: 1,
          duration: 0.4,
          ease: "power1.inOut",
        }, delay + 0.5);
      });
      
      // Return a cleanup function
      return () => {
        tl.kill();
      };
    } else {
      // Reset all words to normal state when not playing
      gsap.to(wordElements, { 
        opacity: 1, 
        color: "inherit",
        textShadow: "none",
        scale: 1,
        duration: 0.3 
      });
    }
  }, [isPlaying, text]); // Re-run when isPlaying or text changes

  // Handle mouse enter event on a word
  const handleWordHover = (
    word: string, 
    wordIndex: number, 
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    // Get the element being hovered
    const wordElement = event.currentTarget;
    const rect = wordElement.getBoundingClientRect();
    
    // Calculate position at the top-center of the word
    const x = rect.left + (rect.width / 2);
    const y = rect.top;
    
    // Get the translation based on the source
    const translation = useClientData 
      ? getWordTranslationFromVerse(word, surahNumber, verseNumber, wordIndex)
      : getWordTranslation(word, surahNumber, verseNumber, wordIndex);

    // Show tooltip above the word
    setTooltipState({
      show: true,
      translation,
      position: { x, y },
      currentWordIndex: wordIndex,
    });
  };

  // Handle mouse leave event
  const handleWordLeave = () => {
    setTooltipState(prevState => ({
      ...prevState,
      show: false,
      currentWordIndex: -1,
    }));
  };

  return (
    <>
      <div ref={containerRef} className={`text-right rtl ${className}`}>
        {words.map((word, index) => (
          <span
            key={`${surahNumber}-${verseNumber}-${index}`}
            className={`inline-block transition-colors cursor-pointer mx-0.5 arabic-word ${
              !isPlaying ? 'hover:text-violet-300' : ''
            }`}
            onMouseEnter={(e) => handleWordHover(word, index, e)}
            onMouseLeave={handleWordLeave}
          >
            {word}
          </span>
        ))}
      </div>
      <WordTooltip
        translation={tooltipState.translation}
        show={tooltipState.show}
        position={tooltipState.position}
      />
    </>
  );
};

export default ArabicText; 