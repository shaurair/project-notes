const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.put('/', logController.checkSignInData);
router.post('/', logController.checkSignUpData);

module.exports = router;