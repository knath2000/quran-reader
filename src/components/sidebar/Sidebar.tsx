'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';

// Interface for the surah data structure from the API
interface Surah {
  number: number;
  englishName: string;
  name: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Add onSurahSelect prop to Sidebar component
interface SidebarProps {
  onSurahSelect: (surahId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSurahSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  
  const sidebarRef = useRef(null);
  const backgroundRef = useRef(null);
  
  // Fetch surahs from the API on component mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          setSurahs(data.data);
        } else {
          setError('Failed to fetch surahs');
        }
      } catch (error) {
        setError('An error occurred while fetching surahs');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurahs();
  }, []);
  
  // Generate stars on client-side only to avoid hydration errors
  useEffect(() => {
    const generateClientStars = () => {
      const newStars = [];
      const starCount = 60; // Fixed number of stars
      
      // Different star types and their properties
      const starTypes = [
        { className: 'star-1', size: 2, brightnessMod: 1.0 },
        { className: 'star-2', size: 1, brightnessMod: 0.8 },
        { className: 'star-3', size: 1.5, brightnessMod: 0.9 }
      ];
      
      for (let i = 0; i < starCount; i++) {
        const leftPos = Math.random() * 100; // 0% - 100%
        const topPos = Math.random() * 100; // 0% - 100%
        const typeIndex = Math.floor(Math.random() * starTypes.length);
        const starType = starTypes[typeIndex];
        
        // Adjust brightness based on position - stars brighter near the center
        const distFromCenter = Math.abs(leftPos - 50) / 50; // 0 (center) to 1 (edge)
        const brightnessMod = 1 - (distFromCenter * 0.3); // 0.7 - 1.0
        const finalBrightness = starType.brightnessMod * brightnessMod;
        
        newStars.push(
          <div 
            key={`star-${i}`}
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
      
      setStars(newStars);
    };
    
    generateClientStars();
  }, []); // Only run once after component mount
  
  // Filter surahs based on search term
  const filteredSurahs = surahs.filter(surah => 
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );
  
  // Define animation keyframes for stars, aurora and moon
  const animationStyles = `
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
    
    @keyframes aurora-shift {
      0%, 100% { 
        transform: translateX(-10%) translateY(10%) rotate(5deg) scale(1);
        filter: hue-rotate(0deg) brightness(1);
      }
      25% { 
        transform: translateX(-5%) translateY(15%) rotate(10deg) scale(1.1);
        filter: hue-rotate(15deg) brightness(1.2);
      }
      50% { 
        transform: translateX(0%) translateY(10%) rotate(5deg) scale(1.2);
        filter: hue-rotate(30deg) brightness(1.5);
      }
      75% { 
        transform: translateX(-15%) translateY(5%) rotate(0deg) scale(1.1);
        filter: hue-rotate(15deg) brightness(1.2);
      }
    }

    @keyframes aurora-shift-alt {
      0%, 100% { 
        transform: translateX(-15%) translateY(15%) rotate(-5deg) scale(1);
        filter: hue-rotate(0deg) brightness(1);
      }
      30% { 
        transform: translateX(-5%) translateY(10%) rotate(0deg) scale(1.1);
        filter: hue-rotate(-15deg) brightness(1.3);
      }
      60% { 
        transform: translateX(-10%) translateY(5%) rotate(-10deg) scale(1.2);
        filter: hue-rotate(-30deg) brightness(1.4);
      }
    }
    
    @keyframes aurora-pulse {
      0%, 100% { 
        opacity: 0.5;
        filter: blur(30px) brightness(1);
      }
      50% { 
        opacity: 0.7;
        filter: blur(40px) brightness(1.2);
      }
    }
    
    @keyframes moon-glow {
      0%, 100% {
        box-shadow: 0 0 25px 5px rgba(255, 255, 255, 0.7),
                    0 0 40px 10px rgba(139, 92, 246, 0.5);
      }
      50% {
        box-shadow: 0 0 20px 3px rgba(255, 255, 255, 0.6),
                    0 0 35px 8px rgba(139, 92, 246, 0.4);
      }
    }
    
    .shooting-star {
      position: absolute;
      width: 25px;
      height: 1px;
      background: linear-gradient(to right, transparent, white, transparent);
      border-radius: 100%;
      opacity: 0;
      z-index: 1;
      animation: shooting-star 5s ease-in-out infinite;
      animation-delay: calc(var(--delay) * 1s);
      top: calc(var(--top) * 1%);
      left: 0;
      transform-origin: center;
    }
    
    .star {
      position: absolute;
      background-color: white;
      border-radius: 50%;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      z-index: 1;
    }
    
    .star-1 {
      width: 2px;
      height: 2px;
      animation: twinkle 3s infinite;
    }
    
    .star-2 {
      width: 1px;
      height: 1px;
      animation: twinkle-alt 4.5s infinite;
    }
    
    .star-3 {
      width: 1.5px;
      height: 1.5px;
      animation: twinkle 5.2s infinite;
    }
    
    .moon-container {
      position: relative;
      z-index: 3;
    }
    
    .moon {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: radial-gradient(circle at center, #ffffff 0%, #f0f0ff 50%, #e1e1ff 100%);
      z-index: 3;
      animation: moon-glow 5s ease-in-out infinite;
      box-shadow: 0 0 25px 5px rgba(255, 255, 255, 0.7),
                  0 0 40px 10px rgba(139, 92, 246, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .shahada-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
      opacity: 0.9;
      filter: brightness(5) grayscale(1) contrast(0.6);
    }
    
    .aurora-container {
      position: absolute;
      overflow: hidden;
      inset: 0;
      z-index: 2;
      filter: contrast(1.2);
    }
    
    .aurora-layer {
      position: absolute;
      width: 300%;
      height: 100%;
      left: -100%;
      top: 0;
      filter: blur(30px);
      transform-origin: center bottom;
      will-change: transform, opacity, filter;
      border-radius: 60% 70% 40% 50% / 60% 40% 80% 50%;
      mask-image: linear-gradient(to bottom, 
        rgba(0, 0, 0, 0.1) 0%, 
        rgba(0, 0, 0, 0.3) 30%, 
        rgba(0, 0, 0, 0.6) 60%, 
        rgba(0, 0, 0, 0.9) 100%
      );
      -webkit-mask-image: linear-gradient(to bottom, 
        rgba(0, 0, 0, 0.1) 0%, 
        rgba(0, 0, 0, 0.3) 30%, 
        rgba(0, 0, 0, 0.6) 60%, 
        rgba(0, 0, 0, 0.9) 100%
      );
    }
    
    .aurora-layer-1 {
      background: linear-gradient(80deg, rgba(0,210,100,0) 15%, rgba(0,210,100,0.5) 50%, rgba(0,210,100,0) 85%);
      animation: aurora-shift 12s ease-in-out infinite, aurora-pulse 8s ease-in-out infinite;
      animation-delay: 0s;
      opacity: 0.7;
      mix-blend-mode: screen;
    }
    
    .aurora-layer-2 {
      background: linear-gradient(100deg, rgba(0,200,255,0) 15%, rgba(0,200,255,0.4) 50%, rgba(0,200,255,0) 85%);
      animation: aurora-shift-alt 15s ease-in-out infinite, aurora-pulse 10s ease-in-out infinite;
      animation-delay: 1s;
      opacity: 0.5;
      mix-blend-mode: color-dodge;
    }
    
    .aurora-layer-3 {
      background: linear-gradient(60deg, rgba(70,180,100,0) 15%, rgba(70,180,100,0.4) 50%, rgba(70,180,100,0) 85%);
      animation: aurora-shift 18s ease-in-out infinite, aurora-pulse 12s ease-in-out infinite;
      animation-delay: 2s;
      opacity: 0.6;
      mix-blend-mode: screen;
    }
    
    .aurora-layer-4 {
      background: linear-gradient(120deg, rgba(120,220,150,0) 15%, rgba(120,220,150,0.4) 50%, rgba(120,220,150,0) 85%);
      animation: aurora-shift-alt 20s ease-in-out infinite, aurora-pulse 14s ease-in-out infinite;
      animation-delay: 3s;
      opacity: 0.5;
      mix-blend-mode: color-dodge;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .star, .shooting-star, .aurora-layer, .moon {
        animation: none;
      }
    }
  `;
  
  // Generate the full moon at the top of the sidebar
  const generateMoon = useMemo(() => {
    return (
      <div className="moon-container">
        <div className="moon">
          <Image 
            src="/shahada.png" 
            alt="Shahada"
            className="shahada-overlay"
            width={100}
            height={100}
            priority
          />
        </div>
      </div>
    );
  }, []);
  
  // Generate Northern Lights/aurora elements
  const generateAurora = useMemo(() => {
    return (
      <div className="aurora-container">
        <div className="aurora-layer aurora-layer-1"></div>
        <div className="aurora-layer aurora-layer-2"></div>
        <div className="aurora-layer aurora-layer-3"></div>
        <div className="aurora-layer aurora-layer-4"></div>
        
        {/* Shooting stars */}
        <div className="shooting-star" style={{ '--delay': 2, '--top': 20 } as React.CSSProperties}></div>
        <div className="shooting-star" style={{ '--delay': 7, '--top': 50 } as React.CSSProperties}></div>
        <div className="shooting-star" style={{ '--delay': 15, '--top': 70 } as React.CSSProperties}></div>
      </div>
    );
  }, []);

  // Animation for the sidebar background
  useGSAP(() => {
    if (isOpen) {
      gsap.to(backgroundRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    } else {
      gsap.to(backgroundRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
  }, [isOpen]);

  return (
    <div 
      ref={sidebarRef}
      className={`bg-black text-white h-full transition-all duration-300 relative ${isOpen ? 'w-72' : 'w-16'} flex flex-col shadow-lg shadow-violet-900/20 border-r border-indigo-900/20`}
    >
      {/* Add style tag for animations */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Starry Night Background with Northern Lights - animated with GSAP */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-[#031d3b] to-[#0a2e4e] opacity-0 overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        {/* Stars */}
        {stars}
        
        {/* Northern Lights effect - now rendered before the moon */}
        {generateAurora}
        
        {/* Full Moon - now rendered after the aurora to appear on top */}
        {generateMoon}
      </div>

      {/* Toggle Button */}
      <button 
        className="p-4 text-accent hover:text-accent-light self-end transition-colors z-10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Sidebar Content - Only visible when open */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 pt-[130px] z-10">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Surahs</span>
          </h2>
          
          {/* Search Box */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search surah..."
              className="w-full bg-midnight p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent border border-indigo-900/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-5 h-5 absolute right-3 top-3.5 text-violet-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          
          {/* Surah List */}
          <div className="space-y-1.5">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-pulse bg-midnight h-10 rounded-lg mb-2"></div>
                <div className="animate-pulse bg-midnight h-10 rounded-lg mb-2"></div>
                <div className="animate-pulse bg-midnight h-10 rounded-lg mb-2"></div>
                <div className="animate-pulse bg-midnight h-10 rounded-lg mb-2"></div>
                <div className="animate-pulse bg-midnight h-10 rounded-lg"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-4">
                {error}
                <button 
                  className="block mx-auto mt-2 px-4 py-2 bg-accent rounded-lg text-white"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              filteredSurahs.map((surah) => (
                <button 
                  key={surah.number}
                  onClick={() => {
                    onSurahSelect(surah.number);
                    if (window.innerWidth < 768) {
                      setIsOpen(false); // Close sidebar on mobile after selection
                    }
                  }}
                  className="w-full text-left p-3 hover:bg-accent hover:bg-opacity-20 rounded-lg transition-colors flex justify-between items-center hover-glow"
                >
                  <div className="flex items-center">
                    <span className="w-7 h-7 bg-gradient-accent rounded-full flex items-center justify-center text-xs mr-3 text-white">
                      {surah.number}
                    </span>
                    <span>{surah.englishName}</span>
                  </div>
                  <span className="text-sm font-arabic text-indigo-300">{surah.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Collapsed View - Empty */}
      {!isOpen && (
        <div className="flex-1 z-10">
          {/* Empty sidebar when collapsed */}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 