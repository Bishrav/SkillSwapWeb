const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authorization = require('../middleware/authorization');

router.post('/:id', authorization, commentController.addComment);
router.get('/:id', authorization, commentController.getComments);

module.exports = router;
