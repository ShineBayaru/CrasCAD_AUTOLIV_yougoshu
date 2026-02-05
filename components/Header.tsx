import React from 'react';
import { Database, Activity, Cpu } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  language: 'JP' | 'ENG' | 'MN';
}

export const Header: React.FC<HeaderProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="border-b border-white/10 bg-tech-800/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-tech-blue rounded blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-tech-900 p-2 border border-white/10 rounded flex items-center justify-center">
              <Cpu className="h-6 w-6 text-tech-blue" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
              CrasCAD<span className="text-tech-yellow animate-pulse">_</span>
            </h1>
            <div className="flex items-center space-x-2 text-[10px] text-tech-muted uppercase tracking-widest font-mono">
              <span>{t.SLOGAN}</span>
              <span className="w-1 h-1 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>

        {/* Right Side: Status Indicators */}
        <div className="hidden md:flex items-center space-x-6 font-mono text-xs">
          <div className="flex items-center space-x-2 text-tech-muted">
            <Database className="h-4 w-4" />
            <span>V.2.0.4</span>
          </div>
          <div className="px-3 py-1 bg-tech-yellow/10 border border-tech-yellow/50 text-tech-yellow rounded flex items-center space-x-2">
            <Activity className="h-3 w-3" />
            <span>{t.GLOSSARY_TITLE}</span>
          </div>
        </div>
      </div>
      {/* Decorative Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-tech-blue/50 to-transparent"></div>
    </header>
  );
};