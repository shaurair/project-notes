const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.create);
router.get('/auth', projectController.getAuthorization);
router.get('/content', projectController.getContent);
router.get('/comment', projectController.getComment);
router.patch('/', projectController.update);
router.post('/comment', projectController.addComment);
router.delete('/comment', projectController.deleteComment);
router.patch('/comment', projectController.updateComment);
router.patch('/status', projectController.updateStatus);
router.get('/main-info', projectController.getProjectMainAndRole);

module.exports = router;