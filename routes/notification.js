const notificationController	= require('../controllers/notificationController');
const express			        = require('express');

const router = express.Router();

router.get('/expired', notificationController.getExpiredProjectId);
router.get('/history-update', notificationController.getHistoryUpdate);

module.exports = router;