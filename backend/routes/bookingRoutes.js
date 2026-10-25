const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');

// Generate unique booking code
const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HP-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @route   GET /api/bookings
// @desc    Get all bookings (Admin/Staff view or filtered by guest email)
router.get('/', async (req, res) => {
  try {
    const { status, guestEmail, roomId, search } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (guestEmail) query.guestEmail = guestEmail.toLowerCase();
    if (roomId) query.room = roomId;
    if (search) {
      query.$or = [
        { bookingCode: { $regex: search, $options: 'i' } },
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/my
// @desc    Get bookings of current authenticated user
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { guestEmail: req.user.email }],
    })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID or bookingCode
router.get('/:id', async (req, res) => {
  try {
    let booking;
    if (req.params.id.startsWith('HP-')) {
      booking = await Booking.findOne({ bookingCode: req.params.id }).populate('room');
    } else {
      booking = await Booking.findById(req.params.id).populate('room');
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking reservation & invoice
router.post('/', async (req, res) => {
  try {
    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestsCount,
      specialRequests,
      paymentMethod,
      userId,
    } = req.body;

    // Validate room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected room not found' });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Calculate nights
    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const roomRate = room.pricePerNight;
    const subtotal = roomRate * nights;
    const taxAmount = Math.round(subtotal * 0.12); // 12% GST/hotel tax
    const totalAmount = subtotal + taxAmount;

    let code = generateBookingCode();
    // Ensure uniqueness
    while (await Booking.findOne({ bookingCode: code })) {
      code = generateBookingCode();
    }

    const booking = await Booking.create({
      bookingCode: code,
      user: userId || null,
      room: room._id,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      guestPhone,
      checkInDate: start,
      checkOutDate: end,
      nights,
      guestsCount: guestsCount || { adults: 1, children: 0 },
      specialRequests: specialRequests || '',
      roomRate,
      subtotal,
      taxAmount,
      totalAmount,
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Confirmed',
    });

    // Update room status
    room.status = 'Booked';
    await room.save();

    const populatedBooking = await Booking.findById(booking._id).populate('room');
    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update check-in, check-out, or cancellation
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    booking.status = status;
    await booking.save();

    // Side effect on room and housekeeping
    const room = await Room.findById(booking.room);
    if (room) {
      if (status === 'Checked-Out') {
        room.status = 'Cleaning';
        await room.save();

        // Create automatic housekeeping task
        await Task.create({
          room: room._id,
          roomNumber: room.roomNumber,
          title: `Turnover & sanitization after checkout (Booking ${booking.bookingCode})`,
          type: 'Cleaning',
          priority: 'High',
          status: 'Pending',
          assignedTo: 'Housekeeping Team',
          notes: `Guest ${booking.guestName} checked out. Prepare room for next arrival.`,
        });
      } else if (status === 'Cancelled') {
        room.status = 'Available';
        booking.paymentStatus = 'Refunded';
        await booking.save();
        await room.save();
      } else if (status === 'Checked-In') {
        room.status = 'Booked';
        await room.save();
      }
    }

    const updated = await Booking.findById(booking._id).populate('room');
    res.json({ success: true, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel/Delete booking (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // Set room back to available
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });
    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
