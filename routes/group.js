const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/create', groupController.createGroup);
router.get('/get-my-group', groupController.getMyGroup);
router.get('/get-group-member', groupController.getGroupMember);

module.exports = router;