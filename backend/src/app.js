// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:5174', 
            'http://192.168.1.2:5173', // Add your laptop's IP
            'http://192.168.1.2:5174',
            'https://apna-member.onrender.com'
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://192.168.')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
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
