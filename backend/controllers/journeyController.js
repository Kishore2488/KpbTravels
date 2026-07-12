const Journey = require('../models/Journey');

exports.getAllJourneys = async (req, res) => {
  try {
    const { source, destination, departureDate, limit = 10, page = 1 } = req.query;
    let query = { status: 'scheduled' };

    if (source) query['source.city'] = { $regex: source, $options: 'i' };
    if (destination) query['destination.city'] = { $regex: destination, $options: 'i' };
    if (departureDate) {
      const date = new Date(departureDate);
      query.departureTime = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    const skip = (page - 1) * limit;
    const journeys = await Journey.find(query)
      .populate('driver', 'name phone')
      .populate('vehicle', 'name type seatingCapacity')
      .limit(limit)
      .skip(skip)
      .sort({ departureTime: 1 });

    const total = await Journey.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      journeys
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
      .populate('driver', 'name phone email')
      .populate('vehicle');

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    res.status(200).json({ success: true, journey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJourney = async (req, res) => {
  try {
    const { routeName, source, destination, distance, estimatedDuration, departureTime, arrivalTime, vehicleId, totalSeats, pricePerSeat, amenities, notes } = req.body;

    const journey = new Journey({
      routeName,
      source,
      destination,
      distance,
      estimatedDuration,
      departureTime,
      arrivalTime,
      vehicle: vehicleId,
      driver: req.user.userId,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      amenities,
      notes
    });

    await journey.save();
    await journey.populate('driver vehicle');

    res.status(201).json({ success: true, journey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJourney = async (req, res) => {
  try {
    let journey = await Journey.findById(req.params.id);
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    journey = await Journey.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('driver vehicle');

    res.status(200).json({ success: true, journey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findByIdAndDelete(req.params.id);
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    res.status(200).json({ success: true, message: 'Journey deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
