const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Task = require('../models/Task');
const User = require('../models/User');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard metrics, occupancy rate, revenue, and quick stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const bookedRooms = await Room.countDocuments({ status: 'Booked' });
    const cleaningRooms = await Room.countDocuments({ status: 'Cleaning' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });

    const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

    const totalBookings = await Booking.countDocuments();
    const activeCheckIns = await Booking.countDocuments({ status: 'Checked-In' });
    const pendingTasks = await Task.countDocuments({ status: { $ne: 'Completed' } });
    const totalGuests = await User.countDocuments({ role: 'guest' });

    // Calculate revenue
    const paidBookings = await Booking.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgDailyRate = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0;

    // Room type distribution
    const roomTypes = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, avgPrice: { $avg: '$pricePerNight' } } },
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('room')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        bookedRooms,
        cleaningRooms,
        maintenanceRooms,
        occupancyRate,
        totalBookings,
        activeCheckIns,
        pendingTasks,
        totalGuests,
        totalRevenue,
        avgDailyRate,
      },
      roomTypes,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
