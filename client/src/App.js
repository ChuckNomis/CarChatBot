// src/App.js
import React, { useState, useEffect } from 'react';
import UploadBook from './components/UploadBook';
import BookSelector from './components/BookSelector';
import ChatBox from './components/ChatBox';
import { getBooks } from './api';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="app-container">
      <h1>🚗 Car Manual Chat Assistant</h1>

      <UploadBook onUpload={loadBooks} />

      {books.length > 0 ? (
        <BookSelector
          books={books}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
        />
      ) : (
        <p>No books uploaded yet.</p>
      )}

      <ChatBox selectedBook={selectedBook} />
    </div>
  );
}

export default App;
