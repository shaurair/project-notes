const noteController	= require('../controllers/noteController');
const express			= require('express');

const router = express.Router();

router.post('/', noteController.addNote);
router.get('/one-note', noteController.getOneNote);
router.get('/notes', noteController.getNotes);
router.delete('/', noteController.deleteNote);
router.put('/top-note', noteController.setTopNote);

module.exports = router;