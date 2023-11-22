const noteController	= require('../controllers/noteController');
const express			= require('express');

const router = express.Router();

router.post('/', noteController.addNote);
router.get('/one-note', noteController.getOneNote);

module.exports = router;