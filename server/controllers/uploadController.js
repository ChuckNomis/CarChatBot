const Book = require('../models/Book');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');


// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage }).single('file');

const uploadBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const newBook = new Book({
        title: req.body.title,
        filename: req.file.filename
      });

      const savedBook = await newBook.save();

      // Now send the file to the Python server for processing
      const pythonForm = new FormData();
      const filePath = path.join(__dirname, '../uploads', req.file.filename);

      pythonForm.append('file', fs.createReadStream(filePath));
      pythonForm.append('bookId', savedBook._id.toString());

      const response = await axios.post('http://localhost:5001/process', pythonForm, {
        headers: {
          ...pythonForm.getHeaders()
        },
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
