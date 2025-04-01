const express = require('express');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('dotenv').config();

connectDB();
const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(uploadRoutes);
app.use(chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
