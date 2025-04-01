import React from 'react';

export default function BookSelector({books, selectedBook, setSelectedBook}){
  return(
    <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
      <option value="">Select a book</option>
      {books.map(book => (
        <option key={book._id} value={book._id}>{book.title}</option>
      ))}
    </select>
  );
}