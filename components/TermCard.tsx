import React from 'react';
import { Term } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Sparkles } from 'lucide-react';

interface TermCardProps {
  term: Term;
  onExplainAI: () => void;
}

export const TermCard: React.FC<TermCardProps> = ({ term, onExplainAI }) => {
  return (
    <div className="group relative h-full perspective-container">
      {/* 3D Container - Rotates on hover */}
      <div className="h-full bg-tech-800/40 backdrop-blur-md border border-white/10 transition-all duration-500 transform-style-3d hover:rotate-x-6 hover:rotate-y-6 hover:scale-105 hover:bg-tech-800/60 hover:border-tech-blue/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,240,255,0.1)] rounded-xl overflow-hidden flex flex-col">
        
        {/* Holographic Reflection Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"></div>

        {/* Tech Corner Accents - 3D Popout */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/10 group-hover:border-tech-blue group-hover:translate-z-10 transition-all duration-500 rounded-tr-xl z-30"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/10 group-hover:border-tech-yellow group-hover:translate-z-10 transition-all duration-500 rounded-bl-xl z-30"></div>

        <div className="p-6 flex-grow relative z-10 transform transition-transform group-hover:translate-z-8">
          <div className="flex flex-wrap gap-2 justify-between items-start mb-4">
            <div className="flex flex-wrap gap-1">
              {term.categories.map(cat => (
                 <span key={cat} className={`px-2 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border rounded-sm shadow-sm ${CATEGORY_COLORS[cat]}`}>
                  {cat}
                </span>
              ))}
            </div>
            <span className="font-mono text-xs text-tech-muted group-hover:text-tech-blue transition-colors">
              ID::{term.id.toString().padStart(3, '0')}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-tech-blue transition-colors duration-300 drop-shadow-md">
              {term.term}
            </h3>
            <p className="text-xs text-tech-muted font-mono">{term.reading}</p>
          </div>

          <div className="mt-6 space-y-3 bg-black/20 p-3 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
            {term.alias && (
               <div className="flex flex-col space-y-1">
               <span className="text-[10px] uppercase tracking-widest text-tech-muted font-mono w-full block">Alias</span>
               <span className="text-sm text-tech-text font-mono">{term.alias}</span>
             </div>
            )}
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-tech-muted font-mono w-full block">English</span>
              <span className="text-sm text-tech-blue font-medium">{term.english}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-sm text-gray-300 leading-relaxed opacity-90 font-light">
              {term.meaning}
            </p>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="relative p-1 bg-tech-900/50 border-t border-white/5 backdrop-blur-xl transform transition-transform group-hover:translate-z-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExplainAI();
            }}
            className="w-full relative overflow-hidden group/btn flex items-center justify-center space-x-2 py-3 text-xs font-mono uppercase tracking-widest text-tech-muted hover:text-tech-yellow transition-colors hover:bg-white/5 cursor-pointer"
          >
            <span className="absolute inset-0 bg-tech-yellow/10 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></span>
            <Sparkles className="w-4 h-4" />
            <span className="relative z-10">AI Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};