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
            'http://192.168.1.2:5173',
            'http://192.168.1.2:5174',
            'https://apna-member.onrender.com'
        ];
        // Allow if in list, if local network, or if it's any Render subdomain
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.startsWith('http://192.168.')) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin);
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
