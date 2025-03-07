'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-midnight via-primary to-violet-dark shadow-lg border-b border-indigo-700/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center shadow-md shadow-violet-500/20">
              <span className="text-white font-arabic text-2xl">ق</span>
            </div>
            <Link href="/" className="text-white text-xl font-bold tracking-wide">
              Quran Reader
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu.Root className="relative">
              <NavigationMenu.List className="flex space-x-6">
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger className="text-white hover:text-accent-light transition-colors flex items-center">
                    <span>Surahs</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="absolute top-full mt-2 bg-white rounded-md shadow-lg shadow-violet-500/20 p-4 w-64 border border-indigo-500/20">
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/surah/1" className="p-2 hover:bg-accent hover:text-white rounded transition-colors">
                        Al-Fatihah
                      </Link>
                      <Link href="/surah/2" className="p-2 hover:bg-accent hover:text-white rounded transition-colors">
                        Al-Baqarah
                      </Link>
                      <Link href="/surah/3" className="p-2 hover:bg-accent hover:text-white rounded transition-colors">
                        Ali &apos;Imran
                      </Link>
                      <Link href="/surah/4" className="p-2 hover:bg-accent hover:text-white rounded transition-colors">
                        An-Nisa
                      </Link>
                    </div>
                    <div className="mt-4 pt-2 border-t border-indigo-500/20">
                      <Link href="/surahs" className="text-accent hover:underline flex items-center">
                        <span>View all Surahs</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link href="/search" className="text-white hover:text-accent-light transition-colors">
                    Search
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link href="/bookmarks" className="text-white hover:text-accent-light transition-colors">
                    Bookmarks
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link href="/settings" className="text-white hover:text-accent-light transition-colors">
                    Settings
                  </Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white bg-accent/20 p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-midnight-light rounded-md p-4 shadow-lg shadow-violet-500/20 border border-indigo-500/20">
            <nav className="flex flex-col space-y-3">
              <Link href="/surahs" className="text-white hover:text-accent-light transition-colors">
                Surahs
              </Link>
              <Link href="/search" className="text-white hover:text-accent-light transition-colors">
                Search
              </Link>
              <Link href="/bookmarks" className="text-white hover:text-accent-light transition-colors">
                Bookmarks
              </Link>
              <Link href="/settings" className="text-white hover:text-accent-light transition-colors">
                Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 