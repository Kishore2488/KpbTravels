const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/dashboard/stats', authenticate, analyticsController.getDashboardStats);
router.get('/revenue', authenticate, analyticsController.getRevenueAnalytics);
router.get('/journeys', authenticate, analyticsController.getJourneyAnalytics);

module.exports = router;
