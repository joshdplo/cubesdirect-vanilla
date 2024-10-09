require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Server Start
const PORT = process.env.PORT || 5000;
const NAME = process.env.NAME || 'New Server';
app.listen(PORT, () => console.log(`${NAME} Server running on port ${PORT}`));