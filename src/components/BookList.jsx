import React, { useState, useMemo } from 'react';
import { BookCard } from './BookCard';
import { Search } from 'lucide-react';

export function BookList({ books, onBookSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('readingYear');

  const groupedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        (b.series && b.series.toLowerCase().includes(q)) ||
        b.genre.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'readingYear') return b.readingYear - a.readingYear;
      if (sortBy === 'publicationYear') return a.publicationYear - b.publicationYear;
      if (sortBy === 'series') {
        const seriesA = a.series || 'Standalone Books';
        const seriesB = b.series || 'Standalone Books';
        const seriesCompare = seriesA.localeCompare(seriesB);
        if (seriesCompare !== 0) return seriesCompare;
        return a.publicationYear - b.publicationYear;
      }
      return 0;
    });

    const groups = [];
    let currentGroupTitle = null;
    let currentGroupBooks = [];

    result.forEach(book => {
      let groupTitle = '';

      if (sortBy === 'readingYear') {
        groupTitle = `Read in ${book.readingYear}`;
      } else if (sortBy === 'publicationYear') {
        const decadeStart = Math.floor(book.publicationYear / 10) * 10;
        const decadeEnd = decadeStart + 9; // Show as 2000-2009 for example
        groupTitle = `${decadeStart} - ${decadeEnd}`;
      } else if (sortBy === 'series') {
        groupTitle = book.series || 'Standalone Books';
      }

      if (groupTitle !== currentGroupTitle) {
        if (currentGroupTitle !== null) {
          groups.push({ title: currentGroupTitle, books: currentGroupBooks });
        }
        currentGroupTitle = groupTitle;
        currentGroupBooks = [book];
      } else {
        currentGroupBooks.push(book);
      }
    });

    if (currentGroupBooks.length > 0) {
      groups.push({ title: currentGroupTitle, books: currentGroupBooks });
    }

    return groups;
  }, [books, searchQuery, sortBy]);

  return (
    <div className="book-list-container">
      <div className="list-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search books by title, author, or series..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-wrapper">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="readingYear">Reading Order (Newest)</option>
            <option value="publicationYear">Publication Year</option>
            <option value="series">Saga / Series</option>
          </select>
        </div>
      </div>
      <div className="book-groups">
        {groupedBooks.map(group => (
          <div key={group.title} className="book-group">
            <h2 className="group-title">{group.title}</h2>
            <div className="book-grid">
              {group.books.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={onBookSelect} 
                />
              ))}
            </div>
          </div>
        ))}
        {groupedBooks.length === 0 && (
          <div className="no-results">No books found matching your search.</div>
        )}
      </div>
    </div>
  );
}
