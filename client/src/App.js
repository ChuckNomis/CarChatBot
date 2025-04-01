// src/App.js
import React, { useState, useEffect } from 'react';
import UploadBook from './components/UploadBook';
import BookSelector from './components/BookSelector';
import ChatBox from './components/ChatBox';
import { getBooks } from './api';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');

  const loadBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div>
      <h1>Car Book Chatbot</h1>
      <UploadBook onUpload={loadBooks} />
      <BookSelector books={books} selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
      <ChatBox selectedBook={selectedBook} />
    </div>
  );
}

export default App;
