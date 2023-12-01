const notificationController	= require('../controllers/notificationController');
const express			        = require('express');

const router = express.Router();

router.get('/expired', notificationController.getExpiredProjectId);

module.exports = router;