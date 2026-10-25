const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/rooms
// @desc    Get all rooms with filtering and search
router.get('/', async (req, res) => {
  try {
    const { type, status, minPrice, maxPrice, search, floor, featured } = req.query;
    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (floor && floor !== 'All') {
      query.floor = Number(floor);
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { amenities: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/rooms
// @desc    Create new room (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { roomNumber } = req.body;
    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: `Room ${roomNumber} already exists` });
    }

    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room details or status (Admin & Staff)
router.put('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete room (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, message: 'Room removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
