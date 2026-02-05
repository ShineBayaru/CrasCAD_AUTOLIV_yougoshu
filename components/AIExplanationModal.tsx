import React, { useEffect, useState } from 'react';
import { Term } from '../types';
import { explainTerm } from '../services/geminiService';
import { X, Bot, Loader2, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIExplanationModalProps {
  term: Term;
  onClose: () => void;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({ term, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await explainTerm(term);
        if (isMounted) {
          setContent(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [term]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-tech-900 border border-tech-blue/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tech-blue"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-tech-blue"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-tech-blue"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tech-blue"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-tech-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-tech-blue/10 border border-tech-blue/30 rounded">
              <Terminal className="w-5 h-5 text-tech-blue" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                DATA_ANALYSIS: <span className="text-tech-yellow">{term.term}</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-tech-muted font-mono">PROCESSING UNIT: GEMINI-3-FLASH</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 bg-tech-900/80 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-tech-blue/20 border-t-tech-blue rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-tech-yellow rounded-full"></div>
                </div>
              </div>
              <div className="space-y-1 font-mono">
                <p className="text-tech-blue animate-pulse">ESTABLISHING UPLINK...</p>
                <p className="text-xs text-tech-muted">Retrieving tactical data for "{term.term}"</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 p-6 text-center">
              <p className="text-red-400 font-mono mb-2 uppercase tracking-widest">Critical Error</p>
              <p className="text-sm text-red-300/70 font-mono">{error}</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none font-sans text-gray-300">
               <div className="font-mono text-xs text-tech-muted mb-4 pb-2 border-b border-white/5">
                 [ DECLASSIFIED INFORMATION ]
               </div>
              <ReactMarkdown 
                components={{
                  strong: ({node, ...props}) => <span className="text-tech-yellow font-bold" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-tech-blue border-l-4 border-tech-blue pl-3" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-white border-b border-white/10 pb-2 mt-6" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-tech-blue/80 mt-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 marker:text-tech-blue" {...props} />
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-tech-800/30 flex justify-between items-center">
          <span className="text-[10px] text-tech-muted font-mono uppercase">CONFIDENTIALITY: LEVEL 3</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-white/20 hover:border-tech-yellow hover:text-tech-yellow text-xs font-mono uppercase tracking-widest text-gray-400 transition-colors bg-transparent"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};