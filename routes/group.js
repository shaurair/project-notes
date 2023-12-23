const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/new-group', groupController.createGroup);
router.get('/my-group', groupController.getMyGroup);
router.get('/group-member', groupController.getGroupMember);
router.put('/group-member', groupController.updateMember);
router.put('/group-name', groupController.updateTeamName);

module.exports = router;