import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TermList } from './components/TermList';
import { TermDetail } from './components/TermDetail';
import { TermFormModal } from './components/TermFormModal';
import { MOCK_TERMS, TRANSLATIONS } from './constants';
import { Category, Term } from './types';

const App: React.FC = () => {
  // Initialize state from localStorage if available, otherwise use MOCK_TERMS
  const [terms, setTerms] = useState<Term[]>(() => {
    const savedTerms = localStorage.getItem('crascad_terms');
    if (savedTerms) {
      try {
        return JSON.parse(savedTerms);
      } catch (e) {
        console.error("Failed to parse saved terms", e);
        return MOCK_TERMS;
      }
    }
    return MOCK_TERMS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [language, setLanguage] = useState<'JP' | 'ENG' | 'MN'>('ENG');
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);

  // Save to localStorage whenever terms change
  useEffect(() => {
    localStorage.setItem('crascad_terms', JSON.stringify(terms));
  }, [terms]);

  // Filter logic
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      // Check if ANY of the term's categories match the selected category
      const matchesCategory = selectedCategory === 'ALL' || term.categories.includes(selectedCategory);
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        term.term.toLowerCase().includes(searchLower) ||
        term.reading.toLowerCase().includes(searchLower) ||
        term.english.toLowerCase().includes(searchLower) ||
        term.meaning.toLowerCase().includes(searchLower) ||
        (term.alias && term.alias.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [terms, searchTerm, selectedCategory]);

  // Auto-select first item if selection is invalid or empty (optional, for smooth UX)
  useEffect(() => {
    if (filteredTerms.length > 0 && !filteredTerms.find(t => t.id === selectedTerm?.id)) {
      setSelectedTerm(filteredTerms[0]);
    } else if (filteredTerms.length === 0) {
      setSelectedTerm(null);
    }
  }, [filteredTerms, selectedTerm]);

  // CRUD Operations
  const handleAddNew = () => {
    setEditingTerm(null);
    setIsFormOpen(true);
  };

  const handleEdit = (term: Term) => {
    setEditingTerm(term);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(TRANSLATIONS[language].CONFIRM_DELETE)) {
      const newTerms = terms.filter(t => t.id !== id);
      setTerms(newTerms);
      if (selectedTerm?.id === id) {
        setSelectedTerm(null);
      }
    }
  };

  const handleSaveTerm = (termData: Term | Omit<Term, 'id'>, username: string) => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if ('id' in termData) {
      // Update existing
      setTerms(prev => prev.map(t => {
        if (t.id === termData.id) {
          // preserve existing info, update fields, and append to history
          const updatedHistory = [
            ...(t.history || []),
            { editedBy: username, editedAt: currentDate }
          ];
          
          const updatedTerm: Term = {
            ...termData as Term,
            createdBy: t.createdBy, // Keep original creator
            createdAt: t.createdAt, // Keep original creation date
            history: updatedHistory
          };
          
          if (selectedTerm?.id === updatedTerm.id) {
            setSelectedTerm(updatedTerm);
          }
          return updatedTerm;
        }
        return t;
      }));
    } else {
      // Create new
      const newId = terms.length > 0 ? Math.max(...terms.map(t => t.id)) + 1 : 1;
      const newTerm: Term = { 
        ...termData, 
        id: newId,
        createdBy: username,
        createdAt: currentDate,
        history: [] // Initial history is empty
      } as Term;
      
      setTerms(prev => [newTerm, ...prev]);
      setSelectedTerm(newTerm);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-tech-900 text-white flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0"></div>
      
      <Header language={language} />
      
      {/* Main Content Area - 3 Pane Layout */}
      <div className="flex-1 flex overflow-hidden z-10 relative">
        
        {/* PANE 1: Sidebar (Navigation) */}
        <nav className="w-64 flex-shrink-0 border-r border-white/5 bg-tech-900/90 backdrop-blur-md flex flex-col">
          <Sidebar 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory}
            onAddTerm={handleAddNew}
            currentLang={language}
            onLanguageChange={setLanguage}
          />
        </nav>

        {/* PANE 2: List (Browser) */}
        <section className="w-80 md:w-96 flex-shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-sm flex flex-col">
          <TermList 
            terms={filteredTerms} 
            selectedTermId={selectedTerm?.id || null}
            onSelectTerm={setSelectedTerm}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            language={language}
          />
        </section>

        {/* PANE 3: Detail (Inspector) */}
        <main className="flex-1 flex flex-col bg-tech-800/10 overflow-hidden relative">
          <TermDetail 
            term={selectedTerm} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            language={language}
          />
        </main>

      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-tech-900 border-t border-white/10 flex items-center justify-between px-4 text-[10px] font-mono text-tech-muted uppercase tracking-wider z-50">
        <div className="flex items-center space-x-4">
          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>{TRANSLATIONS[language].SYSTEM_ONLINE}</span>
          <span>{TRANSLATIONS[language].LATENCY}: 12ms</span>
          <span>{TRANSLATIONS[language].DB_RECORDS}: {terms.length}</span>
        </div>
        <div>
          {TRANSLATIONS[language].CREATED_BY}
        </div>
      </footer>

      {/* Modals */}
      {isFormOpen && (
        <TermFormModal 
          initialData={editingTerm} 
          onSave={handleSaveTerm} 
          onClose={() => setIsFormOpen(false)}
          language={language}
        />
      )}
    </div>
  );
};

export default App;
