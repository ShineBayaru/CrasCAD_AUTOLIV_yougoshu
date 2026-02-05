import React from 'react';
import { Term } from '../types';
import { Search, ChevronRight } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS, TRANSLATIONS } from '../constants';

interface TermListProps {
  terms: Term[];
  selectedTermId: number | null;
  onSelectTerm: (term: Term) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  language: 'JP' | 'ENG' | 'MN';
}

export const TermList: React.FC<TermListProps> = ({ terms, selectedTermId, onSelectTerm, searchTerm, onSearchChange, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-white/10 bg-tech-900/50 backdrop-blur sticky top-0 z-20">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-tech-blue/20 rounded opacity-0 group-focus-within:opacity-100 transition duration-300 blur"></div>
          <div className="relative flex items-center bg-tech-800 border border-white/10 rounded px-3 py-2">
            <Search className="h-4 w-4 text-tech-muted" />
            <input
              type="text"
              className="bg-transparent border-none text-white text-xs ml-2 w-full focus:ring-0 placeholder-gray-600 font-mono"
              placeholder={t.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center text-[10px] text-tech-muted font-mono uppercase">
          <span>{t.RESULTS}: {terms.length}</span>
          <span>{t.SORT}</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {terms.length > 0 ? (
          terms.map((term) => {
            const isSelected = selectedTermId === term.id;
            
            return (
              <button
                key={term.id}
                onClick={() => onSelectTerm(term)}
                className={`w-full text-left p-3 rounded border transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'bg-tech-blue/10 border-tech-blue/50 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]' 
                    : 'bg-tech-800/40 border-white/5 hover:bg-tech-800/80 hover:border-white/20'
                  }`}
              >
                {/* Active Indicator Line */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-blue"></div>}

                <div className="flex flex-wrap gap-1 mb-1">
                  {term.categories.map((cat, index) => {
                    const categoryLabel = CATEGORY_LABELS[cat]?.[language] || cat;
                    // Show max 2 categories in list to save space, or just small tags
                    if (index > 2) return null;
                    return (
                       <span key={cat} className={`text-[9px] px-1.5 py-0.5 rounded font-mono border whitespace-nowrap ${CATEGORY_COLORS[cat]}`}>
                        {categoryLabel}
                      </span>
                    );
                  })}
                  {term.categories.length > 3 && (
                    <span className="text-[9px] text-tech-muted font-mono">+{term.categories.length - 3}</span>
                  )}
                  <span className="text-[9px] text-tech-muted font-mono ml-auto">ID:{term.id.toString().padStart(3, '0')}</span>
                </div>
                
                <h3 className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  {term.term}
                </h3>
                <p className="text-[10px] text-tech-muted font-mono truncate">{term.reading}</p>
                
                {isSelected && (
                  <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-tech-blue w-4 h-4 opacity-50" />
                )}
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-tech-muted text-xs font-mono border border-dashed border-white/10 rounded m-2">
            {t.NO_DATA}
          </div>
        )}
      </div>
    </div>
  );
};