import React, { useMemo, useState } from 'react';
import { Star, TrendingUp, Hash, Library, Award } from 'lucide-react';

const COLORS = [
  '#e63946', '#f4a261', '#2a9d8f', '#e76f51', '#264653',
  '#ffb703', '#8ab17d', '#b5179e', '#4361ee', '#f72585'
];

const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeValue = 0;
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // r is calculated such that circumference is exactly 100
  // C = 2 * PI * r = 100  =>  r = 100 / (2 * PI)
  const r = 15.9154943;
  // strokeWidth must be 2 * r so the stroke covers the entire circle to its center
  const strokeWidth = 31.8309886;

  return (
    <div className="pie-chart-container" onMouseMove={handleMouseMove}>
      <svg width="220" height="220" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        {/* Draw a subtle background circle if total is 0 or just for structure */}
        <circle cx="50" cy="50" r={r} fill="transparent" stroke="var(--bg-primary)" strokeWidth={strokeWidth} />
        
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const slice = (
            <circle
              key={item.label}
              r={r}
              cx="50"
              cy="50"
              fill="transparent"
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${percentage} ${100 - percentage}`}
              strokeDashoffset={-cumulativeValue}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transition: 'all 0.2s ease',
                opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.4,
                cursor: 'pointer',
                transformOrigin: '50px 50px',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          );
          cumulativeValue += percentage;
          return slice;
        })}
      </svg>
      {hoveredIndex !== null && (
        <div 
          className="pie-tooltip animate-fade-in"
          style={{ 
            left: mousePos.x + 20 + 'px', 
            top: mousePos.y + 20 + 'px',
            transform: 'none',
            animation: 'none' // Disable fade-in for tooltip as it stutters on move
          }}
        >
          <strong>{data[hoveredIndex].label}</strong>
          <br/>
          {data[hoveredIndex].value} books ({((data[hoveredIndex].value / total) * 100).toFixed(1)}%)
        </div>
      )}
    </div>
  );
};

export const StatsView = ({ books }) => {
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const avgRating = totalBooks > 0 
      ? (books.reduce((acc, book) => acc + book.rating, 0) / totalBooks).toFixed(1) 
      : 0;

    const booksPerYear = books.reduce((acc, book) => {
      acc[book.readingYear] = (acc[book.readingYear] || 0) + 1;
      return acc;
    }, {});

    const sortedYears = Object.entries(booksPerYear).sort(([a], [b]) => a.localeCompare(b));
    const maxBooksInYear = Math.max(...Object.values(booksPerYear), 1);

    const genres = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
    const topGenres = Object.entries(genres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const authors = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});
    const topAuthors = Object.entries(authors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalBooks, avgRating, sortedYears, maxBooksInYear, topGenres, topAuthors };
  }, [books]);

  return (
    <div className="stats-container animate-fade-in">
      <div className="stats-header-cards">
        <div className="stat-card primary">
          <div className="stat-icon"><Library size={24} /></div>
          <div className="stat-content">
            <h3>Total Books</h3>
            <p className="stat-value">{stats.totalBooks}</p>
          </div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-icon"><Star size={24} /></div>
          <div className="stat-content">
            <h3>Avg Rating</h3>
            <p className="stat-value">{stats.avgRating}</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-panel">
          <div className="panel-header">
            <TrendingUp size={20} className="panel-icon" />
            <h2>Books Per Year</h2>
          </div>
          <div className="bar-chart">
            {stats.sortedYears.map(([year, count]) => (
              <div key={year} className="bar-row">
                <span className="bar-label">{year}</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(count / stats.maxBooksInYear) * 100}%` }}
                  >
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-panel">
          <div className="panel-header">
            <Hash size={20} className="panel-icon" />
            <h2>Top Genres</h2>
          </div>
          {stats.topGenres.length > 0 && (
            <PieChart data={stats.topGenres.map(([label, value]) => ({ label, value }))} />
          )}
          <ul className="stat-list">
            {stats.topGenres.map(([genre, count], index) => (
              <li key={genre}>
                <span className="rank" style={{ color: COLORS[index % COLORS.length] }}>{index + 1}</span>
                <span className="name">{genre}</span>
                <span className="count">{count} {count === 1 ? 'book' : 'books'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="stat-panel">
          <div className="panel-header">
            <Award size={20} className="panel-icon" />
            <h2>Top Authors</h2>
          </div>
          {stats.topAuthors.length > 0 && (
            <PieChart data={stats.topAuthors.map(([label, value]) => ({ label, value }))} />
          )}
          <ul className="stat-list">
            {stats.topAuthors.map(([author, count], index) => (
              <li key={author}>
                <span className="rank" style={{ color: COLORS[index % COLORS.length] }}>{index + 1}</span>
                <span className="name">{author}</span>
                <span className="count">{count} {count === 1 ? 'book' : 'books'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
