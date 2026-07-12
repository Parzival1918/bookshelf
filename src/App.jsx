import React, { useState, useEffect } from 'react';
import { Moon, Sun, Book, GitGraph } from 'lucide-react';
import { books, readingList } from './data/books';
import { BookList } from './components/BookList';
import { BookDetailsModal } from './components/BookDetailsModal';
import { StatsView } from './components/StatsView';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('list'); // 'list' | 'stats' | 'reading-list'
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <Book className="logo-icon" size={32} />
          <h1>Bookshelf</h1>
        </div>
        
        <div className="controls">
          <div className="view-toggle">
            <button 
              className={view === 'list' ? 'active' : ''} 
              onClick={() => setView('list')}
            >
              Library
            </button>
            <button 
              className={view === 'reading-list' ? 'active' : ''} 
              onClick={() => setView('reading-list')}
            >
              Reading List
            </button>
            <button 
              className={view === 'stats' ? 'active' : ''} 
              onClick={() => setView('stats')}
            >
              Stats
            </button>
          </div>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main>
        {view === 'list' ? (
          <BookList key="library" books={books} onBookSelect={setSelectedBook} />
        ) : view === 'reading-list' ? (
          <BookList key="reading-list" books={readingList} onBookSelect={setSelectedBook} isReadingList={true} />
        ) : (
          <StatsView books={books} readingList={readingList} />
        )}
      </main>

      <BookDetailsModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  );
}

export default App;
