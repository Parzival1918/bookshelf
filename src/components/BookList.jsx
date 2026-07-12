import React from 'react';
import { BookCard } from './BookCard';

export function BookList({ books, onBookSelect }) {
  return (
    <div className="book-grid">
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={onBookSelect} 
        />
      ))}
    </div>
  );
}
