const express = require('express');
const { uploadBook } = require('../controllers/uploadController');
const router = express.Router();

router.post('/upload', uploadBook);

module.exports = router;
