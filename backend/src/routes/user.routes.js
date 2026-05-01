const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

userRouter.put('/profile', authenticate, upload.single('profileImage'), userController.updateProfileController);

module.exports = userRouter;
