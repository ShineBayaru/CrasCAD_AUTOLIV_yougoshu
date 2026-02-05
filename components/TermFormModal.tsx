import React, { useState, useEffect, useRef } from 'react';
import { Term, Category } from '../types';
import { X, Save, User, Image, Check, Upload, Trash2 } from 'lucide-react';
import { TRANSLATIONS, CATEGORY_LABELS } from '../constants';

interface TermFormModalProps {
  initialData?: Term | null;
  onSave: (term: Omit<Term, 'id'> | Term, username: string) => void;
  onClose: () => void;
  language: 'JP' | 'ENG' | 'MN';
}

export const TermFormModal: React.FC<TermFormModalProps> = ({ initialData, onSave, onClose, language }) => {
  const [formData, setFormData] = useState<Partial<Term>>({
    term: '',
    reading: '',
    english: '',
    meaning: '',
    alias: '',
    categories: [Category.GENERAL], // Default to GENERAL
    imageUrl: ''
  });
  
  const [username, setUsername] = useState('');
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.meaning || !username) return;
    if (!formData.categories || formData.categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    
    // Pass back the data and the username
    onSave(formData as Term, username);
    onClose();
  };

  const toggleCategory = (category: Category) => {
    setFormData(prev => {
      const currentCats = prev.categories || [];
      if (currentCats.includes(category)) {
        // Remove if exists, but prevent removing the last one if you want at least one
        if (currentCats.length === 1) return prev; 
        return { ...prev, categories: currentCats.filter(c => c !== category) };
      } else {
        // Add
        return { ...prev, categories: [...currentCats, category] };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-tech-900 border border-tech-blue/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tech-border bg-tech-800/50">
          <h2 className="text-sm font-bold text-tech-text uppercase tracking-widest font-mono">
            {initialData ? t.EDIT_ENTRY : t.NEW_ENTRY}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-tech-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Operator Signature (User Name) */}
          <div className="p-3 bg-tech-blue/5 border border-tech-blue/20 rounded">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-tech-blue font-mono flex items-center gap-2">
                <User className="w-3 h-3" />
                {t.OPERATOR_NAME}
              </label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-tech-800/40 border border-tech-blue/30 focus:border-tech-blue rounded px-3 py-2 text-sm text-tech-text font-mono focus:outline-none focus:ring-1 focus:ring-tech-blue placeholder-tech-muted"
                placeholder={t.ENTER_NAME}
              />
            </div>
          </div>

          <div className="h-[1px] bg-tech-border w-full my-2"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.TERM_JP}</label>
              <input
                required
                type="text"
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
                className="w-full bg-tech-800/20 border border-tech-border focus:border-tech-blue/50 rounded px-3 py-2 text-sm text-tech-text font-mono focus:outline-none focus:ring-1 focus:ring-tech-blue/50"
                placeholder={`${t.EXAMPLE}: 射出成形`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.READING}</label>
              <input
                required
                type="text"
                value={formData.reading}
                onChange={(e) => setFormData({...formData, reading: e.target.value})}
                className="w-full bg-tech-800/20 border border-tech-border focus:border-tech-blue/50 rounded px-3 py-2 text-sm text-tech-text font-mono focus:outline-none focus:ring-1 focus:ring-tech-blue/50"
                placeholder={`${t.EXAMPLE}: しゃしゅつせいけい`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.CATEGORY}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(Category).map((cat) => {
                const isSelected = formData.categories?.includes(cat);
                const displayLabel = CATEGORY_LABELS[cat]?.[language] || cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`relative text-[10px] px-2 py-2 rounded border font-mono transition-all duration-200 text-left flex items-center justify-between
                      ${isSelected 
                        ? 'bg-tech-blue/20 border-tech-blue text-tech-text shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                        : 'bg-tech-800/20 border-tech-border text-tech-muted hover:border-tech-text/30 hover:text-tech-text'
                      }`}
                  >
                    <span className="truncate mr-1">{displayLabel}</span>
                    {isSelected && <Check className="w-3 h-3 text-tech-blue" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.TERM_EN}</label>
              <input
                required
                type="text"
                value={formData.english}
                onChange={(e) => setFormData({...formData, english: e.target.value})}
                className="w-full bg-tech-800/20 border border-tech-border focus:border-tech-blue/50 rounded px-3 py-2 text-sm text-tech-text font-mono focus:outline-none focus:ring-1 focus:ring-tech-blue/50"
                placeholder={`${t.EXAMPLE}: Injection Molding`}
              />
            </div>
             <div className="space-y-1 col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.ALIAS}</label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                className="w-full bg-tech-800/20 border border-tech-border focus:border-tech-blue/50 rounded px-3 py-2 text-sm text-tech-text font-mono focus:outline-none focus:ring-1 focus:ring-tech-blue/50"
                placeholder={`${t.EXAMPLE}: インジェクション`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">{t.MEANING}</label>
            <textarea
              required
              rows={4}
              value={formData.meaning}
              onChange={(e) => setFormData({...formData, meaning: e.target.value})}
              className="w-full bg-tech-800/20 border border-tech-border focus:border-tech-blue/50 rounded px-3 py-2 text-sm text-tech-text font-sans focus:outline-none focus:ring-1 focus:ring-tech-blue/50 resize-none"
              placeholder="..."
            />
          </div>

          {/* Media Section */}
          <div className="space-y-2 pt-2 border-t border-tech-border">
             <h3 className="text-[10px] uppercase tracking-widest text-tech-muted font-mono">Media Attachments</h3>
             
             {/* Hidden File Input */}
             <input
               type="file"
               ref={fileInputRef}
               className="hidden"
               accept="image/*"
               onChange={handleFileUpload}
             />

             {/* Image Preview or Upload Controls */}
             {formData.imageUrl ? (
               <div className="relative group rounded-lg overflow-hidden border border-tech-blue/50 bg-tech-800/50 mt-2">
                 <img 
                   src={formData.imageUrl} 
                   alt="Preview" 
                   className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                 />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button
                     type="button"
                     onClick={() => setFormData({...formData, imageUrl: ''})}
                     className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50 rounded flex items-center gap-2 transition-all font-mono text-xs uppercase tracking-wider backdrop-blur-sm"
                   >
                     <Trash2 className="w-4 h-4" />
                     {t.REMOVE_IMAGE}
                   </button>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-3">
                 {/* Upload Button */}
                 <button
                   type="button"
                   onClick={triggerFileUpload}
                   className="w-full py-4 border border-dashed border-tech-blue/30 hover:border-tech-blue hover:bg-tech-blue/5 rounded flex flex-col items-center justify-center gap-2 transition-all group"
                 >
                   <Upload className="w-6 h-6 text-tech-muted group-hover:text-tech-blue transition-colors" />
                   <span className="text-xs text-tech-muted group-hover:text-tech-text font-mono uppercase tracking-widest">{t.UPLOAD_IMAGE}</span>
                 </button>

                 <div className="relative flex items-center py-2">
                   <div className="flex-grow h-px bg-tech-border"></div>
                   <span className="flex-shrink-0 text-[10px] text-tech-muted px-4 font-mono uppercase">{t.OR_ENTER_URL}</span>
                   <div className="flex-grow h-px bg-tech-border"></div>
                 </div>

                 {/* URL Input Fallback */}
                 <div className="flex items-center space-x-2 bg-tech-800/20 border border-tech-border rounded px-2">
                   <Image className="w-4 h-4 text-tech-muted" />
                   <input 
                     type="text"
                     value={formData.imageUrl || ''}
                     onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                     className="w-full bg-transparent border-none text-sm text-tech-text font-mono focus:ring-0 py-2 placeholder-tech-muted"
                     placeholder={`${t.IMAGE_URL} (https://...)`}
                   />
                 </div>
               </div>
             )}
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-tech-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-tech-border hover:bg-tech-text/5 text-tech-muted hover:text-tech-text text-xs font-mono uppercase tracking-widest transition-colors rounded"
            >
              {t.CANCEL}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-tech-blue/10 border border-tech-blue/50 hover:bg-tech-blue/20 text-tech-blue text-xs font-mono uppercase tracking-widest transition-colors rounded flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Save className="w-3 h-3" />
              {t.SAVE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};