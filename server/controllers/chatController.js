const Chat = require('../models/Chat');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// This could point to your Python service (if RAG is handled separately)
// OR you can integrate directly here using LangChain in Python

const chat = async (req, res) => {
  const { message, bookId } = req.body;

  if (!message || !bookId) {
    return res.status(400).json({ error: 'Missing message or bookId' });
  }

  try {
    // Use Python API to get RAG response from the correct FAISS index
    const ragResponse = await axios.post('http://localhost:5001/rag', {
      message,
      bookId
    });

    const responseText = ragResponse.data.response;

    const chatRecord = new Chat({ message, response: responseText });
    await chatRecord.save();

    res.status(200).json({ message, response: responseText });
  } catch (error) {
    console.error('RAG Chat Error:', error.message);
    res.status(500).json({ error: "Something went wrong while generating the response." });
  }
};

module.exports = { chat };
