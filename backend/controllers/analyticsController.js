const Booking = require('../models/Booking');
const Journey = require('../models/Journey');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalJourneys = await Journey.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ bookingStatus: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVehicles,
        totalJourneys,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { paymentStatus: 'completed' };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const revenue = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, revenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJourneyAnalytics = async (req, res) => {
  try {
    const journeyStats = await Journey.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricePerSeat' }
        }
      }
    ]);

    const topRoutes = await Journey.aggregate([
      {
        $group: {
          _id: '$routeName',
          count: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$pricePerSeat', '$totalSeats'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      journeyStats,
      topRoutes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
