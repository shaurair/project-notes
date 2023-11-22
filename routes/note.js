const noteController	= require('../controllers/noteController');
const express			= require('express');

const router = express.Router();

router.post('/', noteController.addNote);

module.exports = router;