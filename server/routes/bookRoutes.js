const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET /books — Return all uploaded books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ uploadedAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
