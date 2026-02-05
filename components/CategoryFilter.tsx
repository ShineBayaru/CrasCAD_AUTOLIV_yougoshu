import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | 'ALL';
  onSelectCategory: (category: Category | 'ALL') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center perspective-container py-4">
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`relative group px-6 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 
          transform hover:-translate-y-1 hover:shadow-[0_5px_0_0_rgba(0,240,255,0.2)] active:translate-y-0 active:shadow-none
          border-b-4 ${
          selectedCategory === 'ALL'
            ? 'bg-tech-blue text-tech-900 border-tech-blue/50 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            : 'bg-tech-800 text-tech-muted border-tech-700 hover:text-white hover:border-tech-blue hover:bg-tech-700'
        } clip-path-slant`}
        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
      >
        ALL SYSTEMS
      </button>
      
      {Object.values(Category).map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`relative px-4 py-2 text-xs font-mono tracking-wider transition-all duration-200 
              transform hover:-translate-y-1 active:translate-y-0
              border-l-2 border-r-2 border-t border-b-4 ${
              isSelected
                ? 'bg-tech-yellow text-tech-900 border-tech-yellow/50 border-b-tech-yellow font-bold shadow-[0_0_15px_rgba(255,214,0,0.5)]'
                : 'bg-tech-800/50 text-tech-muted border-tech-700 hover:text-white hover:border-tech-yellow hover:bg-tech-700'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};