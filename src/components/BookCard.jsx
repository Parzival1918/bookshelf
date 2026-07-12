import React from 'react';

export function BookCard({ book, onClick }) {
  return (
    <div 
      className="book-card" 
      onClick={() => onClick(book)}
      style={{ '--card-color': book.coverColor }}
    >
      <h3>{book.title}</h3>
      <div className="book-author">by {book.author}</div>
      
      <div className="book-meta">
        <span>{book.genre}</span>
        <span>{book.publicationYear}</span>
      </div>
    </div>
  );
}
