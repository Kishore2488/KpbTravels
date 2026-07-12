const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res) => {
  try {
    const { type, status, limit = 10, page = 1 } = req.query;
    let query = {};

    if (type) query.type = type;
    if (status) query.serviceStatus = status;

    const skip = (page - 1) * limit;
    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name email phone')
      .limit(limit)
      .skip(skip);

    const total = await Vehicle.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, manufacturer, model, year, seatingCapacity, amenities, fuelType } = req.body;

    const vehicle = new Vehicle({
      registrationNumber,
      name,
      type,
      manufacturer,
      model,
      year,
      seatingCapacity,
      owner: req.user.userId,
      amenities,
      fuelType,
      serviceStatus: 'active'
    });

    await vehicle.save();
    await vehicle.populate('owner');

    res.status(201).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner');

    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
