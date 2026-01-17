const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorization = require('../middleware/authorization');

router.get('/profile', authorization, userController.getProfile);
router.put('/update-image', authorization, userController.updateUserImage);
router.get('/my-posts', authorization, userController.getUserPosts);
router.get('/:id', authorization, userController.getUserById);
router.get('/posts/:id', authorization, userController.getUserPostsById);

module.exports = router;
