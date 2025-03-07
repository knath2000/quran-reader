'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import TranslationSwitcher from './TranslationSwitcher';
import ArabicText from '@/components/common/ArabicText';
import { getVerseData } from '@/utils/clientCsvParser';

// API endpoints for the Quran data from alquran.cloud
const API_BASE_URL = 'https://api.alquran.cloud/v1';

// List of available English translations
const ENGLISH_TRANSLATIONS = [
  { id: 'en.sahih', name: 'Sahih International' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
  { id: 'en.pickthall', name: 'Pickthall' }
];

interface Verse {
  id: number;
  arabic: string;
  translation: string;
}

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  verses: Verse[];
}

// API response interfaces
interface ApiResponse {
  code: number;
  status: string;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    ayahs: ApiVerse[];
  };
}

interface ApiVerse {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string;
  sajda?: {
    recommended: boolean;
    obligatory: boolean;
  };
}

interface QuranViewProps {
  surahId?: number;
  selectedTranslation?: string;
  onTranslationChange?: (translationId: string) => void;
}

// Add this type definition for audio state
interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentAudio: HTMLAudioElement | null;
  currentVerseId: number | null;
  isPaused: boolean; // Track if audio is paused
  cleanup?: () => void; // Optional cleanup function for event listeners
}

// A helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Mock data for fallback
const mockSurah: Surah = {
  id: 1,
  name: 'Al-Fatihah',
  arabicName: 'الفاتحة',
  verses: [
    {
      id: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    {
      id: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: '[All] praise is [due] to Allah, Lord of the worlds -',
    },
    {
      id: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'The Entirely Merciful, the Especially Merciful,',
    },
    {
      id: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      translation: 'Sovereign of the Day of Recompense.',
    },
    {
      id: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translation: 'It is You we worship and You we ask for help.',
    },
    {
      id: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translation: 'Guide us to the straight path -',
    },
    {
      id: 7,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    },
  ],
};

// Add a small CSS block to define the shadow-glow class
const shadowGlowStyle = `
  .shadow-glow {
    box-shadow: 0 0 10px 1px rgba(79, 70, 229, 0.4);
  }
  
  @keyframes progressPulse {
    0% {
      opacity: 1;
      box-shadow: 0 0 10px 1px rgba(79, 70, 229, 0.4);
    }
    50% {
      opacity: 0.8;
      box-shadow: 0 0 15px 3px rgba(79, 70, 229, 0.6);
    }
    100% {
      opacity: 1;
      box-shadow: 0 0 10px 1px rgba(79, 70, 229, 0.4);
    }
  }
  
  .progress-animate {
    animation: progressPulse 1.5s ease-in-out;
  }
  
  .verse {
    position: relative;
  }
  
  .verse::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.75rem;
    pointer-events: none;
    border: 1px solid rgba(99, 102, 241, 0.3);
    z-index: 0;
  }
`;

// Define animation keyframes
const animationKeyframes = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.2; }
  }
  
  @keyframes twinkle-alt {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  
  @keyframes shooting-star {
    0% { 
      transform: translateX(-100%) translateY(0) rotate(15deg) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
      transform: translateX(-80%) translateY(20%) rotate(15deg) scale(1);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(15deg) scale(0);
      opacity: 0;
    }
  }

  .shooting-star {
    position: absolute;
    width: 25px;
    height: 1px;
    background: linear-gradient(to right, transparent, white, transparent);
    border-radius: 100%;
    opacity: 0;
    z-index: 5;
    animation: shooting-star 5s ease-in-out infinite;
    animation-delay: calc(var(--delay) * 1s);
    top: calc(var(--top) * 1%);
    left: 0;
    transform-origin: center;
    -webkit-animation: shooting-star 5s ease-in-out infinite;
    -webkit-animation-delay: calc(var(--delay) * 1s);
  }
  
  .star {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    z-index: 5;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: ease-in-out;
  }
  
  .star-1 {
    width: 2px;
    height: 2px;
    animation: twinkle 3s infinite;
    -webkit-animation: twinkle 3s infinite;
  }
  
  .star-2 {
    width: 1px;
    height: 1px;
    animation: twinkle-alt 4.5s infinite;
    -webkit-animation: twinkle-alt 4.5s infinite;
  }
  
  .star-3 {
    width: 1.5px;
    height: 1.5px;
    animation: twinkle 5.2s infinite;
    -webkit-animation: twinkle 5.2s infinite;
  }

  .moon-handle {
    cursor: grab;
    transition: transform 0.2s ease;
  }
  
  .moon-handle:hover {
    transform: scale(1.2);
  }
  
  .moon-handle:active {
    cursor: grabbing;
  }

  @media (prefers-reduced-motion: reduce) {
    .star, .shooting-star {
      animation: none;
      -webkit-animation: none;
    }
    
    .moon-handle {
      transition: none;
    }
  }
`;

const QuranView: React.FC<QuranViewProps> = ({ surahId = 2, selectedTranslation, onTranslationChange }) => {
  const versesRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioStateRef = useRef<AudioState | null>(null); // Add ref to track current audio state
  const [currentPage, setCurrentPage] = useState(0);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(selectedTranslation || ENGLISH_TRANSLATIONS[0].id);
  
  // Cache for translations to avoid unnecessary API calls - use composite keys with surahId and translation
  const [translationsCache, setTranslationsCache] = useState<Record<string, Verse[]>>({});
  
  // Helper function to generate the cache key
  const getCacheKey = (sId: number, translation: string) => `${sId}_${translation}`;
  
  // Audio state
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentAudio: null,
    currentVerseId: null,
    isPaused: false,
    cleanup: () => {} // Initialize with empty function
  });
  
  // Update ref whenever audioState changes
  useEffect(() => {
    audioStateRef.current = audioState;
  }, [audioState]);
  
  // Cleanup audio resources when component unmounts
  useEffect(() => {
    // Cleanup function
    return () => {
      // Use the ref to get the current audio state
      const currentAudioState = audioStateRef.current;
      if (currentAudioState?.currentAudio) {
        // Call the cleanup function if it exists
        if (currentAudioState.cleanup) {
          currentAudioState.cleanup();
        }
        
        currentAudioState.currentAudio.pause();
        currentAudioState.currentAudio.src = '';
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentAudio: null,
          currentVerseId: null,
          cleanup: () => {} // Reset to empty function not undefined
        }));
      }
    };
  }, []); // Only run on mount/unmount
  
  // Add the style to the document
  useEffect(() => {
    // Add the shadow-glow style to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = shadowGlowStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Reset pagination when surahId changes
  useEffect(() => {
    setCurrentPage(0); // Reset to first page when surah changes
    
    // Also stop any playing audio when surah changes
    const currentAudioState = audioStateRef.current;
    if (currentAudioState?.currentAudio) {
      // Call the cleanup function if it exists first
      if (currentAudioState.cleanup) {
        currentAudioState.cleanup();
      }
      
      // Then stop the audio
      currentAudioState.currentAudio.pause();
      currentAudioState.currentAudio.src = '';
      
      // Update state last
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentAudio: null,
        currentVerseId: null,
        cleanup: () => {} // Reset to empty function
      }));
    }
  }, [surahId]); // Only depend on surahId changes

  // Fetch surah data from the API
  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create the cache key using the helper function
        const cacheKey = getCacheKey(surahId, currentTranslation);
        
        // Check if we already have this translation in cache using the composite key
        if (translationsCache[cacheKey]) {
          console.log('Using cached translation:', cacheKey);
          setSurah({
            id: surahId,
            name: surah?.name || `Surah ${surahId}`,
            arabicName: surah?.arabicName || '',
            verses: translationsCache[cacheKey],
          });
          setLoading(false);
          return;
        }
        
        // Get the wbw.csv data for this surah (works for Al-Fatihah and Al-Baqarah)
        const wbwVerses = getVerseData(surahId);
        const hasPreloadedData = wbwVerses.length > 0;
        
        // Fetch English translation using the selected translation
        const englishResponse = await fetchWithTimeout(`${API_BASE_URL}/surah/${surahId}/${currentTranslation}`);
        if (!englishResponse.ok) throw new Error(`Failed to fetch English translation: ${englishResponse.status} ${englishResponse.statusText}`);
        const englishData = await englishResponse.json() as ApiResponse;
        
        if (!englishData.data) {
          throw new Error('Invalid data format returned from API for English translation');
        }
        
        let arabicData: ApiResponse | null = null;
        
        // Only fetch Arabic text from API if we don't have preloaded data
        if (!hasPreloadedData) {
          // Fetch Arabic text (original Quran)
          const arabicResponse = await fetchWithTimeout(`${API_BASE_URL}/surah/${surahId}/ar`);
          if (!arabicResponse.ok) throw new Error(`Failed to fetch Arabic text: ${arabicResponse.status} ${arabicResponse.statusText}`);
          arabicData = await arabicResponse.json() as ApiResponse;
          
          if (!arabicData.data) {
            throw new Error('Invalid data format returned from API for Arabic text');
          }
        }
        
        // Combine the data
        const verses: Verse[] = englishData.data.ayahs.map((englishVerse: ApiVerse) => {
          // First, try to find the verse in our wbw.csv data
          const wbwVerse = wbwVerses.find(v => v.verseNumber === englishVerse.numberInSurah);
          
          // If we have wbw data, use it
          if (wbwVerse) {
            return {
              id: englishVerse.numberInSurah,
              arabic: wbwVerse.arabicText,
              translation: englishVerse.text,
            };
          }
          
          // Otherwise, if we have API Arabic data, use that
          if (arabicData) {
            const arabicVerse = arabicData.data.ayahs.find(
              (v: ApiVerse) => v.numberInSurah === englishVerse.numberInSurah
            );
            
            if (arabicVerse) {
              return {
                id: englishVerse.numberInSurah,
                arabic: arabicVerse.text,
                translation: englishVerse.text,
              };
            }
          }
          
          // As a last resort, fall back to English text
          return {
            id: englishVerse.numberInSurah,
            arabic: englishVerse.text, // Fallback to English if no Arabic available
            translation: englishVerse.text,
          };
        });
        
        // Get Arabic name from the appropriate source
        let arabicName = '';
        if (hasPreloadedData) {
          // For preloaded surahs, we don't have the Arabic name, so we'll use a placeholder
          arabicName = surahId === 1 ? 'الفاتحة' : 'البقرة';
        } else if (arabicData) {
          arabicName = arabicData.data.name || '';
        }
        
        console.log('Successfully loaded Surah data:', {
          name: englishData.data.englishName,
          arabicName: arabicName,
          verseCount: verses.length,
          source: hasPreloadedData ? 'wbw.csv' : 'API'
        });
        
        // Cache the translation using the composite key
        setTranslationsCache(prevCache => ({
          ...prevCache,
          [cacheKey]: verses
        }));
        
        // Set surah data
        setSurah({
          id: surahId,
          name: englishData.data.englishName || `Surah ${surahId}`,
          arabicName: arabicName,
          verses: verses,
        });
        
      } catch (err: unknown) {
        console.error('Error fetching Quran data:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Unknown error occurred';
        setError(`Failed to load Quran data: ${errorMessage}. Using mock data instead.`);
        
        // Fallback to mock data if API fails
        setSurah(mockSurah);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurah();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahId, currentTranslation, JSON.stringify(translationsCache)]);
  
  // Calculate pagination
  const versesPerPage = 5;
  const totalPages = surah ? Math.ceil(surah.verses.length / versesPerPage) : 0;
  const startIndex = currentPage * versesPerPage;
  const displayedVerses = surah ? surah.verses.slice(startIndex, startIndex + versesPerPage) : [];
  
  // Handle previous page click - Fix for the non-functional previous button
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      // Explicitly use a callback to ensure we're working with the latest state
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  // Handle next page click
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      // Use the same callback pattern for consistency
      setCurrentPage(prevPage => prevPage + 1);
    }
  };
  
  // Animation effect when component mounts or page changes
  useEffect(() => {
    if (versesRef.current) {
      const verses = versesRef.current.querySelectorAll('.verse');
      
      gsap.fromTo(
        verses,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6,
          ease: 'power2.out'
        }
      );
      
      // Animate the border of each verse with a pulsing effect
      verses.forEach((verse) => {
        const borderElement = verse.querySelector('.verse-border');
        if (borderElement) {
          // Create a repeating pulsing animation on the border
          gsap.timeline({ repeat: -1, yoyo: true })
            .to(borderElement, {
              boxShadow: '0 0 12px 3px rgba(99, 102, 241, 0.6)',
              borderColor: 'rgba(99, 102, 241, 0.8)',
              duration: 2,
              ease: 'sine.inOut'
            });
        }
      });
      
      // Find progress bar and add animation class
      const progressBar = document.querySelector('.progress-bar-fill');
      if (progressBar) {
        // Remove the class to reset the animation
        progressBar.classList.remove('progress-animate');
        
        // Force a reflow to restart the animation
        void (progressBar as HTMLElement).offsetWidth;
        
        // Add the class to start the animation
        progressBar.classList.add('progress-animate');
      }
    }
  }, [currentPage, surah]);

  // Calculate progress percentage for generating stars
  const progressPercentage = useMemo(() => {
    if (!surah) return 0;
    return Math.round(Math.min((currentPage + 1) * versesPerPage, surah.verses.length) / (surah.verses.length) * 100);
  }, [currentPage, surah, versesPerPage]);
  
  // Final percentage for display and calculations
  const displayPercentage = currentPage === 0 ? 0 : progressPercentage;

  // Generate dynamic stars based on progress - memoized for performance
  const generateStars = useMemo(() => {
    if (typeof progressPercentage !== 'number') return [];
    
    // Calculate number of stars based on progress (more progress = more stars)
    // Min stars: 20, Max stars: 80 (reduced for better performance)
    const baseStarCount = 20;
    const maxAdditionalStars = 60;
    const starCount = baseStarCount + Math.floor((progressPercentage / 100) * maxAdditionalStars);
    
    // Calculate brightness factor based on progress (more progress = brighter stars)
    // Min brightness: 0.3, Max brightness: 1.0
    const minBrightness = 0.3;
    const maxBrightness = 1.0;
    const brightnessFactor = minBrightness + ((progressPercentage / 100) * (maxBrightness - minBrightness));
    
    const stars = [];
    
    // Different star types and their properties
    const starTypes = [
      { className: 'star-1', size: 2, brightnessMod: 1.0 },
      { className: 'star-2', size: 1, brightnessMod: 0.8 },
      { className: 'star-3', size: 1.5, brightnessMod: 0.9 }
    ];
    
    // Generate stars with varied positions, types, and brightness
    for (let i = 0; i < starCount; i++) {
      // Distribute stars with higher density toward the right (higher progress)
      // This calculation makes stars more likely to appear on the right side
      // The higher the progress, the more stars will cluster toward the right
      const positionBias = Math.min(progressPercentage / 100, 0.8); // Max bias of 0.8
      let leftPos;
      
      if (Math.random() < positionBias) {
        // Place more stars on the right side with higher progress
        leftPos = 50 + (Math.random() * 50); // 50% - 100%
      } else {
        // Some stars distributed throughout
        leftPos = Math.random() * 100; // 0% - 100%
      }
      
      const topPos = Math.random() * 100; // 0% - 100%
      const typeIndex = Math.floor(Math.random() * starTypes.length);
      const starType = starTypes[typeIndex];
      
      // Adjust brightness based on progress and position
      // Stars further to the right (higher progress) are brighter
      const positionBrightnessMod = (leftPos / 100) * 0.5 + 0.5; // 0.5 - 1.0 based on position
      const finalBrightness = brightnessFactor * starType.brightnessMod * positionBrightnessMod;
      
      stars.push(
        <div 
          key={`star-${i}-${progressPercentage}`} // More stable key that includes progress
          className={`star ${starType.className}`} 
          style={{ 
            top: `${topPos}%`, 
            left: `${leftPos}%`,
            opacity: finalBrightness,
            width: `${starType.size}px`,
            height: `${starType.size}px`
          }}
        />
      );
    }
    
    return stars;
  }, [progressPercentage]); // Only recalculate when progress changes
  
  // Handle dragging the moon icon with proper event cleanup
  useEffect(() => {
    // Define event handlers within the effect to ensure proper cleanup
    const handleDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !progressBarRef.current || !surah) return;
      
      // Get progress bar dimensions and position
      const rect = progressBarRef.current.getBoundingClientRect();
      
      // Handle both mouse and touch events
      const clientX = 'touches' in e 
        ? e.touches[0].clientX 
        : (e as MouseEvent).clientX;
      
      const offsetX = clientX - rect.left;
      
      // Calculate percentage (clamped between 0-100)
      const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      
      // Calculate corresponding page based on percentage
      const calculatedPage = Math.floor((percentage / 100) * totalPages);
      
      // Update page (clamped between 0 and totalPages-1)
      const newPage = Math.max(0, Math.min(totalPages - 1, calculatedPage));
      
      // Only update if page changed
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
    };
    
    // Add event listeners when dragging starts
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('touchmove', handleDrag, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }
    
    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, currentPage, totalPages, surah]); // Dependencies for the effect
  
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      if (currentPage < totalPages - 1) {
        setCurrentPage(prevPage => prevPage + 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      if (currentPage > 0) {
        setCurrentPage(prevPage => prevPage - 1);
      }
      e.preventDefault();
    } else if (e.key === 'Home') {
      setCurrentPage(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setCurrentPage(totalPages - 1);
      e.preventDefault();
    }
  };
  
  // Handle translation change
  const handleTranslationChange = (translationId: string) => {
    setCurrentTranslation(translationId);
    if (onTranslationChange) {
      onTranslationChange(translationId);
    }
  };
  
  // Function to stop current audio
  const stopCurrentAudio = () => {
    if (audioState.currentAudio) {
      // Call cleanup function if it exists
      if (audioState.cleanup) {
        audioState.cleanup();
      }
      
      audioState.currentAudio.pause();
      audioState.currentAudio.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentAudio: null,
        currentVerseId: null,
        cleanup: () => {} // Reset to empty function
      }));
    }
  };
  
  // Function to pause current audio without resetting
  const pauseCurrentAudio = () => {
    if (audioState.currentAudio && audioState.isPlaying) {
      audioState.currentAudio.pause();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: true
      }));
    }
  };
  
  // Function to resume paused audio
  const resumeCurrentAudio = () => {
    if (audioState.currentAudio && audioState.isPaused) {
      try {
        // Set state before playing to avoid race conditions
        setAudioState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false
        }));
        
        // Play with error handling
        audioState.currentAudio.play().catch(e => {
          console.error('Error resuming audio:', e);
          setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        });
      } catch (error) {
        console.error('Error in resumeCurrentAudio:', error);
        setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
      }
    }
  };
  
  // Function to play verse audio
  const playVerseAudio = async (verseNumber: number, isPartOfSequence: boolean = false) => {
    // If the same verse audio is already playing, pause it
    if (audioState.isPlaying && audioState.currentVerseId === verseNumber) {
      pauseCurrentAudio();
      return;
    }
    
    // If the verse audio is paused, resume it
    if (audioState.isPaused && audioState.currentAudio && audioState.currentVerseId === verseNumber) {
      resumeCurrentAudio();
      return;
    }
    
    // Otherwise, stop any existing audio and play the new one
    stopCurrentAudio();
    
    try {
      // Create a new audio element with improved settings
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      
      // Set the current verse ID right away
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: true, 
        currentVerseId: verseNumber,
        isPlaying: false,
        isPaused: false
      }));
      
      // Initialize Firebase if needed
      const { initializeFirebaseIfNeeded } = await import('@/utils/firebaseHelpers');
      await initializeFirebaseIfNeeded();
      
      // Import the Firebase function dynamically to prevent server-side rendering issues
      const { getQuranAudioUrl } = await import('@/firebase/functions');
      
      // Format IDs for different API sources (e.g., 001 instead of 1)
      const formattedSurahId = surahId.toString().padStart(3, '0');
      const formattedVerseNumber = verseNumber.toString().padStart(3, '0');
      
      // Array of potential audio sources for verse (with Firebase Function as primary source)
      const audioSources = [
        // Primary source - Firebase Function with multiple fallbacks
        getQuranAudioUrl(surahId, verseNumber),
        
        // Client-side fallbacks as backup
        `https://quranaudio.pages.dev/1/${surahId}_${verseNumber}.mp3`,
        `https://audio.recitequran.com/verse/AbdulBaset/${surahId}:${verseNumber}`,
        `https://everyayah.com/data/Abdullah_Basfar_64kbps/${formattedSurahId}${formattedVerseNumber}.mp3`,
        `https://verse.mp3quran.net/arabic/Abdullah_Basfar/${formattedSurahId}${formattedVerseNumber}.mp3`
      ];
      
      console.log(`Attempting to load verse ${verseNumber} audio with ${audioSources.length} potential sources`);
      
      // Set a timeout to handle potential loading issues
      const timeoutId = setTimeout(() => {
        if (audioState.isLoading) {
          console.error('Audio loading timeout');
          setAudioState(prev => ({ 
            ...prev, 
            isLoading: false, 
            currentVerseId: null
          }));
        }
      }, 10000); // 10 seconds timeout
      
      // Track which source we're trying
      let currentSourceIndex = 0;
      let audioBlob: Blob | null = null;
      let objectUrl: string | null = null;
      
      // Try to fetch each source until one works
      const tryNextSource = async () => {
        if (currentSourceIndex >= audioSources.length) {
          // We've tried all sources
          console.error(`All audio sources failed for verse ${verseNumber}. Please check audio availability or network connection.`);
          
          setAudioState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isPlaying: false, 
            isPaused: false,
            currentVerseId: null,
            currentAudio: null
          }));
          
          clearTimeout(timeoutId);
          return false;
        }
        
        const source = audioSources[currentSourceIndex];
        const sourceType = source.includes('getquranaudio')
          ? 'Firebase Function'
          : source.includes('quranaudio.pages.dev') 
            ? 'quranaudio.pages.dev' 
            : source.includes('recitequran.com')
              ? 'recitequran.com'
              : source.includes('everyayah.com')
                ? 'everyayah.com'
                : source.includes('mp3quran.net')
                  ? 'mp3quran.net'
                  : 'other source';
        
        console.log(`Trying audio source ${currentSourceIndex} (${sourceType}): ${source}`);
        
        try {
          // Use fetch API first to check if the audio is accessible
          const response = await fetch(source, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Accept': 'audio/mpeg,audio/*;q=0.8,*/*;q=0.5',
            }
          });
          
          if (!response.ok) {
            console.warn(`Audio source ${currentSourceIndex} (${sourceType}) failed with status ${response.status}: ${source}`);
            currentSourceIndex++;
            return tryNextSource();
          }
          
          // Convert the response to a blob
          audioBlob = await response.blob();
          
          // Create an object URL from the blob
          objectUrl = URL.createObjectURL(audioBlob);
          
          console.log(`Successfully loaded audio for verse ${verseNumber} from source ${currentSourceIndex} (${sourceType})`);
          return true;
        } catch (error) {
          console.warn(`Error fetching from source ${currentSourceIndex} (${sourceType}):`, error);
          currentSourceIndex++;
          return tryNextSource();
        }
      };
      
      // Store event listeners to be able to remove them properly
      const onCanPlayThrough = () => {
        clearTimeout(timeoutId);
        console.log(`Audio for verse ${verseNumber} is ready to play`);
        
        // Check if we should still be playing this verse
        if (audioStateRef.current?.currentVerseId !== verseNumber) {
          console.log(`Verse changed from ${verseNumber} to ${audioStateRef.current?.currentVerseId}, not playing`);
          return;
        }
        
        // Add a small delay before playing to ensure all state updates have been processed
        setTimeout(() => {
          // First update state to indicate we're attempting to play
          setAudioState(prev => ({ 
            ...prev, 
            isLoading: false,
            isPaused: false
          }));
          
          // Only attempt to play if the audio exists and is currently paused
          if (audio && audio.paused) {
            console.log(`Starting playback for verse ${verseNumber}`);
            
            // Use the Promise returned by play() to handle success/failure
            audio.play()
              .then(() => {
                console.log(`Playback started successfully for verse ${verseNumber}`);
                // We use a callback here to ensure we're working with the latest state
                setAudioState(prev => ({ 
                  ...prev, 
                  isPlaying: true 
                }));
              })
              .catch(e => {
                console.error('Audio play error:', e);
                // If autoplay is blocked, we'll need user interaction
                setAudioState(prev => ({ 
                  ...prev, 
                  isPlaying: false, 
                  isPaused: true 
                }));
              });
          } else {
            console.log(`Audio for verse ${verseNumber} is already playing or unavailable`);
          }
        }, 10); // Reduced from 50ms to 10ms for faster response
      };
      
      const onError = () => {
        const errorCode = audio.error ? audio.error.code : 0;
        const errorMessage = audio.error ? audio.error.message : 'Unknown error';
        
        console.error(`Error playing verse ${verseNumber} audio (code ${errorCode}): ${errorMessage}`, audio.error);
        
        // Different handling for different error codes
        if (errorCode === 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED
          currentSourceIndex++;
          tryNextSource().then(success => {
            if (success && objectUrl) {
              // Set the new object URL as the audio source
              audio.src = objectUrl;
              audio.load();
            }
          });
        }
      };
      
      const onEnded = () => {
        console.log(`Verse ${verseNumber} audio playback complete`);
        
        // Clean up object URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
        
        // Reset audio state when complete (but not when part of a sequence)
        if (!isPartOfSequence) {
          setAudioState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            currentVerseId: null
          }));
        }
      };
      
      const onAbort = () => {
        console.warn(`Audio playback for verse ${verseNumber} aborted`);
        clearTimeout(timeoutId);
        
        // Clean up object URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
      
      // Try to fetch the first source
      const fetchSuccess = await tryNextSource();
      
      if (fetchSuccess && objectUrl) {
        // Set up event listeners first, before setting the source
        audio.addEventListener('canplaythrough', onCanPlayThrough);
        audio.addEventListener('error', onError);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('abort', onAbort);
        
        // Create a proper cleanup function for event listeners and object URL
        const cleanup = () => {
          console.log(`Cleaning up audio resources for verse ${verseNumber}`);
          
          // Remove event listeners if audio element still exists
          if (audio) {
            // Save a reference to whether audio was playing before cleanup
            const wasPlaying = !audio.paused;
            
            if (wasPlaying) {
              console.log(`Stopping playback during cleanup for verse ${verseNumber}`);
            }
            
            // Stop the audio if it's playing
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch (e) {
              console.warn('Error while stopping audio during cleanup:', e);
            }
            
            // Remove all event listeners
            audio.removeEventListener('canplaythrough', onCanPlayThrough);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('abort', onAbort);
            
            // Clear src to release resources
            audio.src = '';
          }
          
          // Clear timeout if it exists
          clearTimeout(timeoutId);
          
          // Clean up object URL if it exists
          if (objectUrl) {
            console.log(`Revoking object URL during cleanup for verse ${verseNumber}`);
            URL.revokeObjectURL(objectUrl);
          }
        };
        
        // Update audio state with the new audio element and cleanup function
        setAudioState(prev => ({ 
          ...prev, 
          currentAudio: audio,
          cleanup
        }));
        
        // Now set the source and load the audio
        console.log(`Setting audio source for verse ${verseNumber} to object URL`);
        audio.src = objectUrl;
        audio.load(); // Explicitly load the audio
      }
    } catch (error) {
      console.error('Error in playVerseAudio:', error);
      setAudioState(prev => ({ 
        ...prev,
        isLoading: false,
        isPlaying: false,
        isPaused: false,
        currentVerseId: null
      }));
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-indigo-900/90 to-purple-900/80 rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-500/30 overflow-hidden relative min-h-[400px] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
          <p className="text-lg">Loading Surah {surahId}...</p>
        </div>
      </div>
    );
  }

  // If no surah data is available, show error
  if (!surah) {
    return (
      <div className="bg-gradient-to-b from-indigo-900/90 to-purple-900/80 rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-500/30 overflow-hidden relative">
        <div className="text-white text-center">
          <div className="mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-300 text-lg font-semibold">{error || 'Unable to load Quran data'}</p>
          <p className="mt-2 text-gray-300">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-500/30 overflow-hidden relative">
      {/* Add style tag for animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `${shadowGlowStyle}\n${animationKeyframes}` }} />
      
      {/* Debug log for audio state */}
      {process.env.NODE_ENV === 'development' && (
        <div className="hidden">
          Debug - Audio State: 
          isPlaying: {audioState.isPlaying ? 'true' : 'false'}, 
          currentVerseId: {audioState.currentVerseId === null ? 'null' : audioState.currentVerseId}, 
          isPaused: {audioState.isPaused ? 'true' : 'false'},
        </div>
      )}
      
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full"></div>
      
      {/* Surah Header */}
      <div className="text-center mb-10 pb-6 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center text-white text-2xl shadow-lg shadow-violet-500/20">
            {surah.id}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          {surah.name}
        </h1>
        <h2 className="text-4xl font-arabic text-white mb-4 rtl">
          {surah.arabicName}
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <span className="bg-accent/10 text-accent-light px-4 py-1.5 rounded-full text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            {surah.verses.length} Verses
          </span>
          {/* Play Audio and Stop buttons have been removed as requested */}
        </div>
        
        {/* Verse and Page indicator */}
        <div className="text-sm text-gray-300 mt-3 mb-2">
          Page {currentPage + 1} of {totalPages} • 
          Verses {surah ? startIndex + 1 : 0}-{surah ? Math.min(startIndex + versesPerPage, surah.verses.length) : 0} of {surah?.verses.length || 0}
        </div>
        
        {/* Progress Bar */}
        <div 
          ref={progressBarRef}
          className="h-8 bg-black rounded-full mx-auto w-full max-w-lg overflow-hidden border border-indigo-400/20 shadow-md my-6 relative"
          role="progressbar"
          aria-valuenow={displayPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Reading progress: ${displayPercentage}% of surah completed`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Percentage indicator */}
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white z-10 drop-shadow-md">
            {displayPercentage}%
          </div>
          
          {/* Starry Night Background with Moon - Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-br from-[#0c112a] to-[#1f2b59] rounded-full shadow-lg shadow-accent/40 overflow-hidden relative"
            style={{ 
              width: currentPage === 0 ? '28px' : `${progressPercentage}%`,
              transition: isDragging ? 'none' : 'width 0.5s ease-in-out',
              boxShadow: '0 0 12px rgba(78, 53, 141, 0.7)'
            }}
            title={`${displayPercentage}% of Surah read`}
          >
            {/* Shooting stars animation - only show when progress is substantial */}
            {progressPercentage > 5 && (
              <>
                <div className="shooting-star" style={{ '--delay': 1, '--top': 30 } as React.CSSProperties}></div>
                <div className="shooting-star" style={{ '--delay': 6, '--top': 60 } as React.CSSProperties}></div>
                <div className="shooting-star" style={{ '--delay': 11, '--top': 15 } as React.CSSProperties}></div>
              </>
            )}
            
            {/* Stars - Dynamically generated based on progress */}
            {generateStars}
            
            {/* Crescent Moon Icon - positioned at the right edge */}
            <div 
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center mr-0.5 z-10 moon-handle"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              title="Drag to navigate through the surah"
              role="slider"
              aria-label="Drag to navigate through surah pages"
              aria-valuemin={0}
              aria-valuemax={totalPages - 1}
              aria-valuenow={currentPage}
              tabIndex={0}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="white" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                style={{ transform: "rotate(30deg)" }}
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.62-.08-1.21-.21-1.78-.76 3.54-3.91 6.19-7.67 6.19-4.34 0-7.87-3.53-7.87-7.87 0-3.76 2.65-6.91 6.19-7.67C11.79 2.08 11.38 2 12 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Top Navigation Buttons */}
        <div className="flex justify-center space-x-4 my-4">
          <button 
            className={`px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full transition-colors duration-200 flex items-center z-10 relative text-sm ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:shadow-accent/30'}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            style={{ pointerEvents: currentPage === 0 ? 'none' : 'auto' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Previous
          </button>
          <button 
            className={`px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full transition-colors duration-200 flex items-center z-10 relative text-sm ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:shadow-accent/30'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            style={{ pointerEvents: currentPage === totalPages - 1 ? 'none' : 'auto' }}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* Translation Switcher - moved to this position */}
        <div className="mt-4 mb-1 max-w-md mx-auto">
          <TranslationSwitcher 
            translations={ENGLISH_TRANSLATIONS}
            selectedTranslation={currentTranslation}
            onTranslationChange={handleTranslationChange}
          />
        </div>
      </div>

      {/* Verses */}
      <div ref={versesRef} className="space-y-8 relative z-10">
        {displayedVerses.map((verse) => (
          <div key={verse.id} className="verse group bg-black p-6 rounded-xl border border-indigo-500/20 hover:shadow-md hover:border-violet-400/30 transition-all">
            {/* Verse border element for GSAP animation */}
            <div className="verse-border absolute inset-0 rounded-xl border border-indigo-500/30 pointer-events-none"></div>
            
            {/* Verse container with proper RTL layout */}
            <div className="flex flex-col md:flex-row relative z-10">
              {/* Verse number on left */}
              <div className="flex justify-center md:justify-start mb-4 md:mb-0">
                <span className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white font-medium shrink-0 shadow-md shadow-violet-500/20">
                  {verse.id}
                </span>
              </div>
              
              {/* Verse content with Arabic on right and translation centered */}
              <div className="flex flex-col md:flex-1">
                {/* Arabic Text */}
                <div className="mb-4">
                  <ArabicText
                    text={verse.arabic}
                    surahNumber={surahId}
                    verseNumber={verse.id}
                    useClientData={true}
                    isPlaying={
                      audioState.isPlaying && 
                      (audioState.currentVerseId === verse.id || 
                       (audioState.currentVerseId === null && surah?.id === surahId)) // Show animations for both verse and surah playback
                    }
                    className="text-3xl font-arabic leading-loose text-white max-w-3xl"
                  />
                </div>
                
                {/* English translation - centered */}
                <div className="text-center">
                  <p className="text-gray-200 text-lg">
                    {verse.translation}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Verse Actions - Visible on hover */}
            <div className="mt-4 pt-4 border-t border-indigo-500/20 flex justify-end space-x-4">
              <button 
                onClick={() => playVerseAudio(verse.id)}
                disabled={audioState.isLoading} 
                className={`text-accent-light hover:text-white transition-colors p-2 rounded-full hover:bg-accent/20 ${
                  (audioState.isLoading && audioState.currentVerseId === verse.id) ? 'opacity-70 cursor-wait' : ''
                } ${(audioState.isPlaying && audioState.currentVerseId === verse.id) ? 'bg-accent/30 text-white' : ''} ${(audioState.isPaused && audioState.currentVerseId === verse.id) ? 'bg-accent/20 text-accent' : ''}`} 
                aria-label={`${
                  audioState.isPlaying && audioState.currentVerseId === verse.id ? 'Pause' : 
                  audioState.isPaused && audioState.currentVerseId === verse.id ? 'Resume' : 'Play'
                } audio for verse ${verse.id}`}
              >
                {audioState.isLoading && audioState.currentVerseId === verse.id ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : audioState.isPlaying && audioState.currentVerseId === verse.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                  </svg>
                ) : audioState.isPaused && audioState.currentVerseId === verse.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
              
              {/* Stop button - only show when audio is playing or paused for this verse */}
              {(audioState.isPlaying || audioState.isPaused) && audioState.currentVerseId === verse.id && (
                <button 
                  onClick={stopCurrentAudio}
                  className="text-accent-light hover:text-white transition-colors p-2 rounded-full hover:bg-accent/20"
                  aria-label={`Stop audio for verse ${verse.id}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                  </svg>
                </button>
              )}

              <button className="text-accent-light hover:text-white transition-colors p-2 rounded-full hover:bg-accent/20" aria-label="Bookmark verse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </button>
              <button className="text-accent-light hover:text-white transition-colors p-2 rounded-full hover:bg-accent/20" aria-label="Share verse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Page Navigation Buttons */}
      <div className="mt-10 flex justify-between">
        <button 
          className={`px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full transition-colors duration-200 flex items-center z-10 relative ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-accent/30'}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          style={{ pointerEvents: currentPage === 0 ? 'none' : 'auto' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Previous Page
        </button>
        <button 
          className={`px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full transition-colors duration-200 flex items-center z-10 relative ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-accent/30'}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          style={{ pointerEvents: currentPage === totalPages - 1 ? 'none' : 'auto' }}
        >
          Next Page
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      {/* Error notification - show at bottom if using fallback data */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-300 mt-0.5 mr-2 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p>{error}</p>
              <p className="mt-1 text-xs opacity-80">Using fallback data instead. Some features may be limited.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranView; 