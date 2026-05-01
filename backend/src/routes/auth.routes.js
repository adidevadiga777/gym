const express = require('express')
const authController = require('../controllers/auth.controller')
const passport = require('passport')

const authRouter = express.Router()

/**
 * POST /api/auth/register
 */
authRouter.post('/register', authController.registerController)


/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginController)

/**
 * GET /api/auth/google
 */
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * GET /api/auth/google/callback
 */
authRouter.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: req.user._id, username: req.user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token);
        // Redirect to frontend dashboard or home
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/?token=${token}`);
    }
);

const authenticate = require('../middlewares/auth.middleware')

/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", authenticate, authController.getMeController)

module.exports = authRouter