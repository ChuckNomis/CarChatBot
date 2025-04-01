const express = require('express');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const bookRoutes = require('./routes/bookRoutes')
const cors = require('cors');


require('dotenv').config({ path: '../.env' });
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(uploadRoutes);
app.use(chatRoutes);
app.use(bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
