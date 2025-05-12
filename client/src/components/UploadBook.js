import React, { useState } from 'react';
import { uploadBook } from '../api';
import './UploadBook.css'; // 💡 import the external stylesheet

export default function UploadBook({ onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert('Please enter a book title and select a PDF, HTML, or TXT file.');
      return;
    }

    try {
      await uploadBook(file, title);
      alert('✅ Book uploaded successfully!');
      setFile(null);
      setTitle('');
      onUpload(); // Notify parent
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed. Please check the file and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label>Book Title:</label>
      <input
        type="text"
        placeholder="Book Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="upload-input"
      />

      <label>Select PDF File:</label>
      <input
        type="file"
        accept=".pdf,.html,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="upload-input"
      />

      <button type="submit" className="upload-button">📤 Upload Book</button>
    </form>
  );
}
