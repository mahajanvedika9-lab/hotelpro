const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/tasks
// @desc    Get all housekeeping and maintenance tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (type && type !== 'All') query.type = type;

    const tasks = await Task.find(query).populate('room').sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
  try {
    const { roomId, title, type, priority, assignedTo, notes } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const task = await Task.create({
      room: room._id,
      roomNumber: room.roomNumber,
      title,
      type: type || 'Cleaning',
      priority: priority || 'Medium',
      assignedTo: assignedTo || 'Housekeeping Staff',
      notes: notes || '',
    });

    if (type === 'Maintenance') {
      room.status = 'Maintenance';
      await room.save();
    } else if (type === 'Cleaning' && room.status !== 'Booked') {
      room.status = 'Cleaning';
      await room.save();
    }

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status or details
router.put('/:id', async (req, res) => {
  try {
    const { status, notes, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (status) task.status = status;
    if (notes !== undefined) task.notes = notes;
    if (assignedTo) task.assignedTo = assignedTo;

    if (status === 'Completed') {
      task.completedAt = new Date();
      // If room is in Cleaning or Maintenance, set it back to Available
      const room = await Room.findById(task.room);
      if (room && (room.status === 'Cleaning' || room.status === 'Maintenance')) {
        room.status = 'Available';
        await room.save();
      }
    }

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
