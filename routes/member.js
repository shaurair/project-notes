const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.patch('/update/image', memberController.upload.single('photo'), memberController.updateImage);
router.patch('/update/name', memberController.updateName);

module.exports = router;