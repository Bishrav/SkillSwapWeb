const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authorization = require('../middleware/authorization');

// Experience
router.post('/experience', authorization, profileController.addExperience);
router.get('/experience', authorization, profileController.getExperiences);
router.delete('/experience/:id', authorization, profileController.deleteExperience);

// Education
router.post('/education', authorization, profileController.addEducation);
router.get('/education', authorization, profileController.getEducations);
router.delete('/education/:id', authorization, profileController.deleteEducation);

module.exports = router;
