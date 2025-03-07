'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface WordTooltipProps {
  translation: string;
  show: boolean;
  position: {
    x: number;
    y: number;
  };
}

const WordTooltip: React.FC<WordTooltipProps> = ({ translation, show, position }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  
  // Create a GSAP context for animations
  useGSAP(() => {
    if (!tooltipRef.current) return;
    
    // Define animation timeline
    const tl = gsap.timeline({ paused: true });
    
    // Setup animations
    tl.fromTo(
      tooltipRef.current,
      { 
        opacity: 0, 
        y: 10,
        scale: 0.95,
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.2, 
        ease: "power2.out" 
      }
    );
    
    // Play or reverse based on show state
    if (show) {
      tl.play();
    } else {
      tl.reverse();
    }
    
    // Cleanup
    return () => {
      tl.kill();
    };
  }, { dependencies: [show] });
  
  // Position the tooltip
  useEffect(() => {
    if (!tooltipRef.current || !arrowRef.current || !show) return;
    
    // Get viewport dimensions - only need width for horizontal bounds checking
    const viewportWidth = window.innerWidth;
    
    // Get tooltip dimensions
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    
    // Calculate optimal position (centered above the word)
    let left = position.x - (tooltipWidth / 2);
    let top = position.y - tooltipHeight - 10; // Position 10px above the word
    
    // Constrain to viewport edges
    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }
    
    // If tooltip would go above the viewport, show it below the word
    let isBelow = false;
    if (top < 10) {
      top = position.y + 20; // Position 20px below the word
      isBelow = true;
    }
    
    // Apply position
    tooltipRef.current.style.left = `${left}px`;
    tooltipRef.current.style.top = `${top}px`;
    
    // Position arrow to point at the word (not the cursor)
    const arrowLeftPos = Math.min(
      Math.max(
        position.x - left, // Point to center of the word
        15 // min 15px from left
      ),
      tooltipWidth - 15 // max 15px from right
    );
    
    arrowRef.current.style.left = `${arrowLeftPos}px`;
    
    // Show correct arrow (up or down)
    if (isBelow) {
      arrowRef.current.classList.remove('after:bottom-[-5px]', 'after:border-b-transparent', 'after:border-t-black/90');
      arrowRef.current.classList.add('after:top-[-5px]', 'after:border-t-transparent', 'after:border-b-black/90');
    } else {
      arrowRef.current.classList.remove('after:top-[-5px]', 'after:border-t-transparent', 'after:border-b-black/90');
      arrowRef.current.classList.add('after:bottom-[-5px]', 'after:border-b-transparent', 'after:border-t-black/90');
    }
  }, [position, show]);
  
  if (!show) return null;
  
  return (
    <div
      ref={tooltipRef}
      className="fixed z-[100] bg-black/90 text-white p-3 rounded-md shadow-xl text-sm 
                 max-w-[200px] border border-violet-500/30 transition-none pointer-events-none
                 daisy-tooltip-content"
      style={{
        transformOrigin: 'center bottom'
      }}
    >
      {/* Arrow indicator */}
      <div
        ref={arrowRef}
        className="absolute after:content-[''] after:absolute after:w-0 after:h-0 
                   after:border-l-[6px] after:border-r-[6px] after:border-transparent
                   after:left-0 after:translate-x-[-50%]"
      />
      
      {/* Tooltip content */}
      <div className="overflow-hidden text-ellipsis whitespace-normal text-center">
        {translation}
      </div>
    </div>
  );
};

export default WordTooltip; 