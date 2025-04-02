const Book = require('../models/Book');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Use memory storage to avoid saving files
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const uploadBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const newBook = new Book({
        title: req.body.title,
        filename: req.file.originalname // Save original filename
      });

      const savedBook = await newBook.save();

      // Send file buffer directly to Python
      const pythonForm = new FormData();
      pythonForm.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      pythonForm.append('bookId', savedBook._id.toString());

      const response = await axios.post('http://localhost:5001/process', pythonForm, {
        headers: pythonForm.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      res.status(201).json({
        message: 'Book uploaded and processed',
        book: savedBook,
        pythonStatus: response.data.message
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadBook };
