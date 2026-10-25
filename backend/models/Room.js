const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Room title/name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Deluxe', 'Suite', 'Executive', 'Presidential', 'Standard'],
      default: 'Deluxe',
    },
    floor: {
      type: Number,
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0,
    },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 1 },
    },
    sizeSqFt: {
      type: Number,
      default: 350,
    },
    amenities: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Cleaning', 'Maintenance'],
      default: 'Available',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
