const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/guests
// @desc    Get aggregated list of all hotel guests, stay history, and lifetime value
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').sort({ createdAt: -1 });

    // Aggregate guests by email
    const guestMap = new Map();

    for (const b of bookings) {
      const email = (b.guestEmail || '').toLowerCase();
      if (!email) continue;

      if (!guestMap.has(email)) {
        guestMap.set(email, {
          email,
          name: b.guestName,
          phone: b.guestPhone,
          totalStays: 0,
          totalSpent: 0,
          lastStayDate: b.checkInDate,
          recentBookings: [],
          status: 'Active',
        });
      }

      const guest = guestMap.get(email);
      guest.totalStays += 1;
      guest.totalSpent += b.totalAmount || 0;
      if (new Date(b.checkInDate) > new Date(guest.lastStayDate)) {
        guest.lastStayDate = b.checkInDate;
      }
      if (guest.recentBookings.length < 5) {
        guest.recentBookings.push({
          bookingCode: b.bookingCode,
          room: b.room ? b.room.name : 'Unknown Room',
          roomNumber: b.room ? b.room.roomNumber : '',
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          totalAmount: b.totalAmount,
          status: b.status,
        });
      }
    }

    const guests = Array.from(guestMap.values());
    res.json({ success: true, count: guests.length, guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
