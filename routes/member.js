const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.put('/image', memberController.upload.single('photo'), memberController.updateImage);
router.put('/name', memberController.updateName);

module.exports = router;