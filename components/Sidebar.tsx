import React from 'react';
import { Category } from '../types';
import { Layers, Box, PenTool, Settings, Hash, Component, FileText, PlusCircle, Languages } from 'lucide-react';
import { TRANSLATIONS, CATEGORY_LABELS } from '../constants';

interface SidebarProps {
  selectedCategory: Category | 'ALL';
  onSelectCategory: (category: Category | 'ALL') => void;
  onAddTerm: () => void;
  currentLang: 'JP' | 'ENG' | 'MN';
  onLanguageChange: (lang: 'JP' | 'ENG' | 'MN') => void;
}

const ICONS: Record<string, React.ElementType> = {
  'ALL': Layers,
  [Category.GENERAL]: Hash,
  [Category.ALJ_SPECIALIZED]: Settings,
  [Category.TOYOTA_TERMS]: FileText,
  [Category.OTHER]: Box,
  [Category.RESIN_MOLDING]: Component,
  [Category.RESIN_MOLD]: Box, // Reusing Box for similar concept
  [Category.DESIGN_SPECIALIZED]: PenTool,
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, onAddTerm, currentLang, onLanguageChange }) => {
  const categories = ['ALL', ...Object.values(Category)];
  const languages: ('JP' | 'ENG' | 'MN')[] = ['JP', 'ENG', 'MN'];
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="flex flex-col h-full py-4 overflow-y-auto custom-scrollbar">
      <div className="px-4 mb-4">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-tech-muted mb-2">{t.DATA_CATEGORIES}</h2>
        <div className="h-[1px] bg-gradient-to-r from-tech-blue/50 to-transparent w-full"></div>
      </div>
      
      <div className="space-y-1 px-2 flex-grow">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const Icon = ICONS[cat as string] || Box;
          
          let displayLabel = cat;
          if (cat === 'ALL') {
             displayLabel = t.ALL_SYSTEMS;
          } else {
             displayLabel = CATEGORY_LABELS[cat as string]?.[currentLang] || cat as string;
          }
          
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat as Category | 'ALL')}
              className={`w-full flex items-center px-4 py-3 text-xs font-mono transition-all duration-200 group relative
                ${isSelected 
                  ? 'bg-tech-blue/10 text-white' 
                  : 'text-tech-muted hover:text-white hover:bg-white/5'
                }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-tech-blue shadow-[0_0_10px_#00F0FF]"></div>
              )}
              <Icon className={`w-4 h-4 mr-3 ${isSelected ? 'text-tech-blue' : 'text-tech-muted group-hover:text-tech-text'}`} />
              <span className="truncate tracking-wide">{displayLabel}</span>
              
              {isSelected && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-tech-blue animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-4 space-y-4 pt-4 border-t border-white/5">
        
        <button 
          onClick={onAddTerm}
          className="w-full py-3 border border-dashed border-tech-yellow/50 bg-tech-yellow/5 hover:bg-tech-yellow/10 text-tech-yellow rounded flex items-center justify-center space-x-2 transition-all group"
        >
          <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{t.ADD_ENTRY}</span>
        </button>

        {/* Language Switcher */}
        <div className="p-3 border border-white/5 rounded bg-black/20">
          <div className="text-[10px] text-tech-muted mb-2 flex items-center gap-2 uppercase tracking-widest">
            <Languages className="w-3 h-3" /> {t.SYSTEM_LANGUAGE}
          </div>
          <div className="grid grid-cols-3 gap-1 bg-tech-900 rounded border border-white/10 p-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`py-1 text-[10px] font-mono font-bold rounded transition-all duration-200 ${
                  currentLang === lang 
                    ? 'bg-tech-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};