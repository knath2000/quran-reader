'use client';

import React, { ReactNode } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  onSurahSelect: (surahId: number) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSurahSelect }) => {
  return (
    <div className="flex min-h-screen relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-violet-500/5 rounded-full blur-3xl -z-10"></div>
      
      {/* Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar onSurahSelect={onSurahSelect} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl">
          {/* Center the content within a reasonable max-width */}
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 