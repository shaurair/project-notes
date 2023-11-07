const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.patch('/update/image', memberController.upload.single('photo'), memberController.updateImage);

module.exports = router;