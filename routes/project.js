const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.create);
router.get('/content', projectController.getContent);
router.get('/comment', projectController.getComment);
router.patch('/', projectController.update);
router.post('/comment', projectController.addComment);
router.delete('/comment', projectController.deleteComment);
router.patch('/comment', projectController.updateComment);

module.exports = router;