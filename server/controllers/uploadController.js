const Book = require('../models/Book');
const multer = require('multer');

// Configure multer to save uploaded files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage }).single('file');

const uploadBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const newBook = new Book({
        title: req.body.title,
        filename: req.file.filename,
      });

      await newBook.save();
      res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadBook };