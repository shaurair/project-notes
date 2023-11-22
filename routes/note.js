const noteController	= require('../controllers/noteController');
const express			= require('express');

const router = express.Router();

router.post('/', noteController.addNote);
router.get('/one-note', noteController.getOneNote);
router.delete('/', noteController.deleteNote);

module.exports = router;