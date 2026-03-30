// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://apna-member.onrender.com'],
    credentials: true
}));
app.use(express.json());

app.use(cookieParser());

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;                                                       
