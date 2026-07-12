const express = require('express');
const journeyController = require('../controllers/journeyController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/', journeyController.getAllJourneys);
router.get('/:id', journeyController.getJourneyById);
router.post('/', authenticate, journeyController.createJourney);
router.put('/:id', authenticate, journeyController.updateJourney);
router.delete('/:id', authenticate, journeyController.deleteJourney);

module.exports = router;
