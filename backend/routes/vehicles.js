const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', authenticate, vehicleController.createVehicle);
router.put('/:id', authenticate, vehicleController.updateVehicle);
router.delete('/:id', authenticate, vehicleController.deleteVehicle);

module.exports = router;
