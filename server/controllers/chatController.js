const axios = require('axios');
const Chat = require('../models/Chat');

// Function to send user message to OpenAI API and get response
const generateAIResponse = async (message) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    return "Sorry, I couldn't generate a response at the moment.";
  }
};

// Route handler for POST /chat
const chat = async (req, res) => {
  try {
    const userMessage = req.body.message;
    const aiResponse = await generateAIResponse(userMessage);

    const newChat = new Chat({ message: userMessage, response: aiResponse });
    await newChat.save();

    res.status(200).json({ message: userMessage, response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { chat };
