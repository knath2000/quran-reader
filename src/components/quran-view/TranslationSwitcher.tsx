'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Translation {
  id: string;
  name: string;
}

interface TranslationSwitcherProps {
  translations: Translation[];
  selectedTranslation: string;
  onTranslationChange: (translationId: string) => void;
}

const TranslationSwitcher: React.FC<TranslationSwitcherProps> = ({
  translations,
  selectedTranslation,
  onTranslationChange
}) => {
  // Add state for collapse functionality
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [componentHeight, setComponentHeight] = useState<number>(0);
  const expandedDimensionsRef = useRef<{ width: number; height: number; borderWidth: number }>({ 
    width: 0, 
    height: 0,
    borderWidth: 1 
  });
  
  // Define constants for dimensions
  const BUTTON_WIDTH = 36; // Width for the toggle button area
  const CONTENT_PADDING = 12; // Padding around content
  const MIN_HEIGHT = 48; // Minimum height for the component
  const LEFT_ALIGNMENT_OFFSET = 36; // Offset to align button with verse numbers
  
  // Measure and store the expanded dimensions once
  useEffect(() => {
    const measureAndStoreExpandedDimensions = () => {
      if (contentRef.current && expandedDimensionsRef.current.height === 0) {
        // Measure the expanded dimensions once
        const containerWidth = contentRef.current.scrollWidth + BUTTON_WIDTH + (2 * CONTENT_PADDING);
        const containerHeight = Math.max(contentRef.current.scrollHeight + 16, MIN_HEIGHT);
        
        expandedDimensionsRef.current = {
          width: containerWidth,
          height: containerHeight,
          borderWidth: 1
        };
        
        setComponentHeight(containerHeight);
      }
    };
    
    // Delay to ensure content is properly rendered
    setTimeout(measureAndStoreExpandedDimensions, 100);
  }, []);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Add custom styles for horizontal collapse/expand
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .translation-switcher-wrapper {
        position: relative;
        margin-bottom: 0.75rem;
        display: flex;
        transition: all 300ms ease-in-out;
        padding-left: ${LEFT_ALIGNMENT_OFFSET}px; /* Add padding for the button */
      }
      
      .translation-switcher-container {
        position: relative;
        border-radius: 0.5rem;
        transition: all 300ms ease-in-out;
        display: flex;
        align-items: center;
        overflow: visible; /* Prevent cutting off shadows */
      }
      
      .toggle-button-container {
        position: absolute;
        left: -${LEFT_ALIGNMENT_OFFSET}px;
        top: 50%;
        transform: translateY(-50%);
        width: ${BUTTON_WIDTH}px;
        height: ${BUTTON_WIDTH}px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 30;
        overflow: visible; /* Allow shadow to extend beyond */
      }
      
      .toggle-button {
        background-color: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 50%;
        padding: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 200ms ease-in-out;
        animation: pulse-glow 2s ease-in-out infinite;
        position: relative;
        z-index: 30;
        overflow: visible; /* Allow shadow to extend beyond */
      }
      
      .toggle-button:hover {
        background-color: rgba(30, 27, 75, 0.8);
      }
      
      .toggle-button svg {
        transition: transform 300ms ease-in-out;
      }
      
      .translation-content {
        flex: 1;
        padding: ${CONTENT_PADDING}px;
        opacity: 1;
        transition: opacity 250ms ease-in-out, padding 300ms ease-in-out, width 300ms ease-in-out;
        overflow: hidden;
      }
      
      .translation-button {
        position: relative;
        overflow: hidden;
        z-index: 2;
      }
      
      .translation-button.selected::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(79, 70, 229, 0.8));
        z-index: -1;
      }
      
      /* Toggle button animation */
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 5px 0 rgba(139, 92, 246, 0.7); }
        50% { box-shadow: 0 0 10px 2px rgba(139, 92, 246, 0.9); }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Get dimensions based on stored expanded state
  const getContainerWidth = () => {
    if (expandedDimensionsRef.current.width === 0) {
      return '100%'; // Fallback if not measured yet
    }
    
    return isCollapsed ? `${BUTTON_WIDTH}px` : `${expandedDimensionsRef.current.width}px`;
  };
  
  return (
    <div 
      className="translation-switcher-wrapper"
      style={{ 
        height: `${Math.max(componentHeight, MIN_HEIGHT)}px`,
        justifyContent: 'center', // Always center
      }}
    >
      <div 
        className="translation-switcher-container"
        style={{ 
          width: getContainerWidth(),
          maxWidth: isCollapsed ? `${BUTTON_WIDTH}px` : '100%',
          background: isCollapsed ? 'transparent' : 'black',
          backdropFilter: isCollapsed ? 'none' : 'blur(4px)',
          borderWidth: isCollapsed ? '0px' : `${expandedDimensionsRef.current.borderWidth}px`,
          borderStyle: 'solid',
          borderColor: isCollapsed ? 'transparent' : 'rgba(139, 92, 246, 0.2)',
          boxShadow: isCollapsed ? 'none' : '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -4px rgba(139, 92, 246, 0.1)',
          padding: 0,
          transition: 'all 300ms ease-in-out',
          height: `${Math.max(componentHeight, MIN_HEIGHT) - 16}px`,
        }}
      >
        {/* Toggle button (now positioned absolutely outside the container) */}
        <div className="toggle-button-container">
          <button 
            onClick={toggleCollapse} 
            className="toggle-button text-violet-300 hover:text-violet-100"
            aria-label={isCollapsed ? "Expand translation options" : "Collapse translation options"}
            aria-expanded={!isCollapsed}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        {/* Content section */}
        <div 
          ref={contentRef}
          className="translation-content"
          style={{
            opacity: isCollapsed ? 0 : 1,
            padding: isCollapsed ? 0 : `${CONTENT_PADDING}px`,
            width: isCollapsed ? 0 : 'auto',
            pointerEvents: isCollapsed ? 'none' : 'auto',
            visibility: isCollapsed ? 'hidden' : 'visible'
          }}
        >
          <div className="flex flex-wrap gap-2 justify-start">
            {translations.map((translation) => (
              <button
                key={translation.id}
                onClick={() => onTranslationChange(translation.id)}
                className={`translation-button px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  selectedTranslation === translation.id
                    ? 'selected text-white shadow-md shadow-violet-900/30'
                    : 'bg-black/70 text-gray-300 hover:text-white'
                }`}
              >
                {translation.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationSwitcher; 