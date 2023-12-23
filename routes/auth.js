const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getUser);
router.put('/', authController.checkSignInData);
router.post('/', authController.checkSignUpData);

module.exports = router;