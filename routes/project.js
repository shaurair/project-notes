const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.create);
router.get('/auth', projectController.getAuthorization);
router.get('/content', projectController.getContent);
router.get('/comment', projectController.getComment);
router.put('/', projectController.update);
router.post('/comment', projectController.addComment);
router.delete('/comment', projectController.deleteComment);
router.put('/comment', projectController.updateComment);
router.put('/status', projectController.updateStatus);
router.get('/main-info', projectController.getProjectMainAndRole);
router.post('/file', projectController.upload.single('file'),projectController.addFile);
router.get('/file', projectController.getFile);
router.delete('/file', projectController.deleteFile);

module.exports = router;