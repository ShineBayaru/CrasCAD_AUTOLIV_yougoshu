import React, { useState } from 'react';
import { Term } from '../types';
import { Terminal, Share2, Copy, Trash2, Edit, History, User, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import { TRANSLATIONS, CATEGORY_LABELS } from '../constants';

interface TermDetailProps {
  term: Term | null;
  onEdit: (term: Term) => void;
  onDelete: (id: number) => void;
  language: 'JP' | 'ENG' | 'MN';
}

export const TermDetail: React.FC<TermDetailProps> = ({ term, onEdit, onDelete, language }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  if (!term) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-tech-muted p-8 text-center">
        <Terminal className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-mono text-sm tracking-widest">{t.SELECT_NODE}</p>
        <p className="text-xs opacity-50 mt-2">{t.WAITING_INPUT}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-tech-blue/5 to-transparent pointer-events-none"></div>
      
      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
           <div className="flex flex-wrap gap-2 items-center">
             {term.categories.map(cat => {
               const categoryLabel = CATEGORY_LABELS[cat]?.[language] || cat;
               return (
                <div key={cat} className="px-2 py-0.5 bg-tech-yellow/10 border border-tech-yellow text-tech-yellow text-[10px] font-mono font-bold tracking-wider uppercase">
                    {categoryLabel}
                </div>
               );
             })}
            
            <div className="px-2 py-0.5 bg-tech-blue/10 border border-tech-blue text-tech-blue text-[10px] font-mono font-bold tracking-wider uppercase">
                {t.CONFIDENTIAL}
            </div>
           </div>
           
           {/* Admin Controls */}
           <div className="flex items-center space-x-2">
             <button 
                onClick={() => onEdit(term)}
                className="p-2 border border-white/10 hover:border-tech-blue hover:text-tech-blue rounded bg-black/20 transition-all"
                title={t.EDIT_RECORD}
             >
                <Edit className="w-4 h-4" />
             </button>
             <button 
                onClick={() => onDelete(term.id)}
                className="p-2 border border-white/10 hover:border-red-500 hover:text-red-500 rounded bg-black/20 transition-all"
                title={t.DELETE_RECORD}
             >
                <Trash2 className="w-4 h-4" />
             </button>
           </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          {term.term}
        </h1>
        <div className="flex items-baseline space-x-4 mb-8 pb-8 border-b border-white/10">
          <span className="text-lg font-mono text-tech-muted">{term.reading}</span>
          <span className="text-sm font-mono text-tech-blue">{term.english}</span>
        </div>

        {/* Core Data Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xs font-mono text-tech-muted uppercase tracking-widest mb-3 flex items-center">
                <span className="w-2 h-2 bg-white/20 mr-2"></span>
                {t.DEFINITION}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base border-l-2 border-white/10 pl-4 py-1">
                {term.meaning}
              </p>
            </section>

            {term.alias && (
              <section>
                <h3 className="text-xs font-mono text-tech-muted uppercase tracking-widest mb-3 flex items-center">
                  <span className="w-2 h-2 bg-white/20 mr-2"></span>
                  {t.ALIASES}
                </h3>
                <div className="inline-block bg-tech-800 border border-white/10 px-3 py-1 rounded text-sm text-tech-text">
                  {term.alias}
                </div>
              </section>
            )}

            {/* MEDIA GALLERY */}
            {term.imageUrl && (
              <section className="mt-8 pt-6 border-t border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-tech-yellow" />
                  {t.MEDIA_GALLERY}
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Image Display */}
                  <div 
                    className="group relative rounded-lg border border-white/10 overflow-hidden bg-black/40 cursor-pointer"
                    onClick={() => setPreviewImage(term.imageUrl || null)}
                  >
                    <div className="absolute top-0 left-0 p-2 bg-black/60 backdrop-blur-sm z-10 flex items-center gap-2 border-b border-r border-white/10 rounded-br-lg">
                      <ImageIcon className="w-3 h-3 text-tech-blue" />
                      <span className="text-[10px] text-white font-mono uppercase">{t.REFERENCE_IMAGE}</span>
                    </div>
                    
                    {/* Hover Overlay Icon */}
                    <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Maximize2 className="w-8 h-8 text-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                    </div>

                    <img 
                      src={term.imageUrl} 
                      alt={term.term} 
                      className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/151621/00F0FF?text=IMAGE_ERROR';
                      }}
                    />
                  </div>
                </div>
              </section>
            )}
            
            {!term.imageUrl && (
               <section className="mt-8 pt-6 border-t border-white/5 opacity-50">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  {t.MEDIA_GALLERY}
                </h3>
                <div className="border border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                   <p className="text-xs font-mono text-tech-muted uppercase">{t.NO_MEDIA}</p>
                </div>
               </section>
            )}

          </div>

          {/* METADATA COLUMN */}
          <div className="flex flex-col gap-4">
            <div className="bg-black/20 border border-white/5 p-4 rounded-lg self-start w-full">
              <h3 className="text-[10px] font-mono text-tech-muted uppercase tracking-widest mb-4">{t.METADATA}</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.ID}</span>
                  <span className="text-white">#{term.id.toString().padStart(4, '0')}</span>
                </div>
                
                <div className="h-[1px] bg-white/5 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{t.AUTHOR}</span>
                  <span className="text-tech-blue flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {term.createdBy || "System"}
                  </span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-500">{t.CREATED}</span>
                  <span className="text-white">{term.createdAt || "Unknown"}</span>
                </div>

                <div className="h-[1px] bg-white/5 my-2"></div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t.ACCESS}</span>
                  <span className="text-green-400">{t.GRANTED}</span>
                </div>
                
                <div className="pt-3 border-t border-white/5 flex gap-2">
                   <button className="flex-1 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded flex items-center justify-center">
                     <Copy className="w-3 h-3" />
                   </button>
                   <button className="flex-1 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded flex items-center justify-center">
                     <Share2 className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </div>

            {/* MODIFICATION LOG */}
            <div className="bg-black/20 border border-white/5 p-4 rounded-lg w-full flex-1 max-h-60 overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-mono text-tech-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                <History className="w-3 h-3" /> {t.MODIFICATION_LOG}
              </h3>
              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-2">
                {term.history && term.history.length > 0 ? (
                  term.history.slice().reverse().map((record, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded border border-white/5">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Edit #{term.history!.length - idx}</span>
                        <span>{record.editedAt}</span>
                      </div>
                      <div className="text-xs text-tech-blue font-mono">
                         by {record.editedBy}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-600 italic py-2 text-center">No modification history</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" 
            onClick={() => setPreviewImage(null)}
          ></div>
          
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white z-[210] p-2 bg-black/50 rounded-full border border-white/10 hover:border-tech-blue hover:bg-tech-blue/20 transition-all"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative z-[205] max-w-[95vw] max-h-[90vh] overflow-hidden rounded-lg shadow-[0_0_50px_rgba(0,240,255,0.1)] border border-white/10">
             <img 
               src={previewImage} 
               alt="Full Preview" 
               className="w-full h-full object-contain max-h-[90vh]" 
             />
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
               <p className="text-white text-sm font-mono tracking-wider text-center">{term.term} // {t.REFERENCE_IMAGE}_VIEW</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};