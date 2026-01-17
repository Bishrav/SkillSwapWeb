const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authorization = require('../middleware/authorization');

router.post('/like', authorization, interactionController.likePost);
router.post('/save', authorization, interactionController.savePost);
router.get('/saved', authorization, interactionController.getSavedPosts);
router.get('/liked', authorization, interactionController.getLikedPosts);

module.exports = router;
