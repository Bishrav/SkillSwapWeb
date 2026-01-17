const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authorization = require('../middleware/authorization');

// Get all posts - protected to see feed? Let's make it protected
router.get('/', authorization, postController.getAllPosts);

// Create post
router.post('/', authorization, postController.createPost);
router.get('/:id', authorization, postController.getPostById);
router.delete('/:id', authorization, postController.deletePost);

module.exports = router;
