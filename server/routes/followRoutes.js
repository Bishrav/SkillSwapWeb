const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authorization = require('../middleware/authorization');

router.post('/:id', authorization, followController.followUser);
router.delete('/:id', authorization, followController.unfollowUser);
router.get('/check/:id', authorization, followController.checkFollowStatus);

module.exports = router;
