import React from 'react';
import './BookSelector.css'; 

export default function BookSelector({ books, selectedBook, setSelectedBook }) {
  return (
    <div className="book-selector">
      <label htmlFor="book-select">Choose a manual:</label>
      <select
        id="book-select"
        value={selectedBook}
        onChange={(e) => setSelectedBook(e.target.value)}
        className="book-dropdown"
      >
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title}
          </option>
        ))}
      </select>
    </div>
  );
}
