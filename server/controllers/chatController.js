const Chat = require('../models/Chat');

// Mock AI function (replace with actual AI logic)
const generateAIResponse = (message) => {
  return `AI Response to: "${message}"`; 
};

const chat = async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Get AI response (mocked for now)
    const aiResponse = generateAIResponse(userMessage);

    // Save chat to DB
    const newChat = new Chat({ message: userMessage, response: aiResponse });
    await newChat.save();

    res.status(200).json({ message: userMessage, response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { chat };
