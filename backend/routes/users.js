const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id/deactivate', userController.deactivateUser);

module.exports = router;
