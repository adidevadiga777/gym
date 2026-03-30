const express = require('express')
const authController = require('../controllers/auth.controller')

const authRouter = express.Router()

/**
 * POST /api/auth/register
 */
authRouter.post('/register', authController.registerController)


/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginController)

const authenticate = require('../middlewares/auth.middleware')

/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", authenticate, authController.getMeController)

module.exports = authRouter