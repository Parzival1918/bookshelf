import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function BookDetailsModal({ book, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>{book.title}</h2>
          <div className="modal-subtitle">
            <span>{book.author}</span>
            <span className="modal-tag" style={{ color: book.coverColor, border: `1px solid ${book.coverColor}` }}>
              {book.series}
            </span>
          </div>
        </div>
        
        <div className="modal-body">
          <p>{book.description}</p>
        </div>
        
        <div className="modal-stats">
          <div className="stat-item">
            <span className="stat-label">Published</span>
            <span className="stat-value">{book.publicationYear}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Read</span>
            <span className="stat-value">{book.readingYear}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rating</span>
            <span className="stat-value">{book.rating} / 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
