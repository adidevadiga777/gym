const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const authenticate = require('../middlewares/auth.middleware');

postRouter.post("/", upload.single("chacha"), authenticate, postController.createPostController)

postRouter.get("/", authenticate, postController.getPostsController)

postRouter.get("/:postId", authenticate, postController.getPostDetailsController)
postRouter.get("/user/:userId", authenticate, postController.getUserPostsController)

module.exports = postRouter