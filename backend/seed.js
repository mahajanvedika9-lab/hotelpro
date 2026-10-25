require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await Task.deleteMany({});
    console.log('[Seed] Cleared existing data');

    // 1. Create Users
    const admin = await User.create({
      name: 'Victoria Stone',
      email: 'admin@hotelpro.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    const staff = await User.create({
      name: 'Marcus Vance',
      email: 'staff@hotelpro.com',
      password: 'staff123',
      role: 'staff',
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    });

    const guest = await User.create({
      name: 'Sophia Montgomery',
      email: 'guest@hotelpro.com',
      password: 'guest123',
      role: 'guest',
      phone: '+1 (555) 432-1098',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    console.log('[Seed] Default users created (admin@hotelpro.com, staff@hotelpro.com, guest@hotelpro.com)');

    // 2. Create Rooms
    const roomsData = [
      {
        roomNumber: 'PH-101',
        name: 'Presidential Sky Villa & Penthouse',
        type: 'Presidential',
        floor: 10,
        pricePerNight: 850,
        capacity: { adults: 4, children: 2 },
        sizeSqFt: 1450,
        amenities: ['Private Heated Pool', 'Dedicated 24/7 Butler', 'Panoramic Ocean View', 'Marble Jacuzzi', 'High-Speed Wi-Fi 6', 'B&O Surround Sound', 'Private Elevator Access', 'Nespresso Reserve Bar'],
        description: 'The pinnacle of luxury hospitality. Perched on the highest floor with unbroken 360-degree ocean and skyline views, private plunge pool, and dedicated butler service.',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Available',
        rating: 4.98,
        isFeatured: true,
      },
      {
        roomNumber: '304',
        name: 'Grand Royal Oceanfront Suite',
        type: 'Suite',
        floor: 3,
        pricePerNight: 460,
        capacity: { adults: 3, children: 1 },
        sizeSqFt: 780,
        amenities: ['Private Sun Terrace', 'Deep Soaking Tub', 'King Featherbed', 'Espresso Machine', 'Smart Lighting Control', 'High-Speed Wi-Fi', 'Complimentary Evening Cocktails'],
        description: 'Wake up to the rhythm of ocean waves. Features an expansive private terrace, plush Italian linen bedding, and a spa-inspired marble bathroom.',
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Booked',
        rating: 4.92,
        isFeatured: true,
      },
      {
        roomNumber: '205',
        name: 'Executive Horizon King Suite',
        type: 'Executive',
        floor: 2,
        pricePerNight: 340,
        capacity: { adults: 2, children: 1 },
        sizeSqFt: 560,
        amenities: ['Ergonomic Workstation', 'High-Speed Wi-Fi 6', 'Rain Shower', 'City Skyline View', 'Lounge Seating', 'Curated Minibar', 'Keyless Mobile Access'],
        description: 'Engineered for modern executives and luxury travelers seeking tranquility, ergonomic productivity, and contemporary sophistication.',
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Available',
        rating: 4.88,
        isFeatured: true,
      },
      {
        roomNumber: '102',
        name: 'Deluxe Botanic Garden Haven',
        type: 'Deluxe',
        floor: 1,
        pricePerNight: 290,
        capacity: { adults: 2, children: 1 },
        sizeSqFt: 480,
        amenities: ['Private Garden Patio', 'King Bed', 'Rain Shower', 'Organic Toiletries', 'Yoga Mat & Wellness Kit', 'Quiet Courtyard Location', 'Smart TV 55"'],
        description: 'Immerse yourself in lush botanical surroundings. Step directly out into our landscaped private garden from your tranquil ground-floor retreat.',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Available',
        rating: 4.85,
        isFeatured: false,
      },
      {
        roomNumber: '408',
        name: 'Sapphire Deluxe Coastal Room',
        type: 'Deluxe',
        floor: 4,
        pricePerNight: 310,
        capacity: { adults: 2, children: 0 },
        sizeSqFt: 440,
        amenities: ['Balcony with Sea View', 'King Bed', 'Walk-in Shower', 'Fast Wi-Fi', 'Tea & Coffee Maker', 'Daily Fresh Fruit Basket'],
        description: 'Crisp coastal tones and natural oak textures complement the sparkling coastal backdrop from your private elevated balcony.',
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Cleaning',
        rating: 4.81,
        isFeatured: false,
      },
      {
        roomNumber: '108',
        name: 'Urban Classic Queen Room',
        type: 'Standard',
        floor: 1,
        pricePerNight: 190,
        capacity: { adults: 2, children: 0 },
        sizeSqFt: 340,
        amenities: ['Queen Bed', 'Work Desk', 'Smart TV', 'In-room Safe', 'Premium Linens', 'Complimentary High-Speed WiFi'],
        description: 'Compact, tastefully designed comfort for the agile traveler. Fully equipped with every essential amenity for an effortless stay.',
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Available',
        rating: 4.75,
        isFeatured: false,
      },
      {
        roomNumber: '502',
        name: 'Imperial Family Duplex Suite',
        type: 'Suite',
        floor: 5,
        pricePerNight: 580,
        capacity: { adults: 4, children: 2 },
        sizeSqFt: 920,
        amenities: ['Two King Bedrooms', 'Two Full Bathrooms', 'Living & Dining Lounge', 'Kitchenette', 'Game Console & Smart TVs', 'Kid Amenities Pack'],
        description: 'Spacious two-level luxury duplex designed for families and discerning groups, featuring dual master suites and a welcoming living area.',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Maintenance',
        rating: 4.90,
        isFeatured: true,
      },
      {
        roomNumber: '312',
        name: 'Executive Studio Atelier',
        type: 'Executive',
        floor: 3,
        pricePerNight: 375,
        capacity: { adults: 2, children: 1 },
        sizeSqFt: 610,
        amenities: ['Harbor View', 'Bespoke Bar Cabinet', 'Plush King Bed', 'Freestanding Tub', 'Dyson Haircare', 'Fiber Internet'],
        description: 'Artisan-crafted furnishings, warm bronze fixtures, and generous light offer an inspiring environment for both creative and restorative stays.',
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Available',
        rating: 4.87,
        isFeatured: false,
      }
    ];

    const createdRooms = await Room.insertMany(roomsData);
    console.log(`[Seed] Created ${createdRooms.length} luxury hotel rooms`);

    // 3. Create Sample Bookings
    const room304 = createdRooms.find(r => r.roomNumber === '304');
    const room205 = createdRooms.find(r => r.roomNumber === '205');
    const roomPH = createdRooms.find(r => r.roomNumber === 'PH-101');

    const today = new Date();
    const future3Days = new Date(today);
    future3Days.setDate(today.getDate() + 3);

    const past4Days = new Date(today);
    past4Days.setDate(today.getDate() - 4);
    const past1Day = new Date(today);
    past1Day.setDate(today.getDate() - 1);

    const sampleBookings = [
      {
        bookingCode: 'HP-94821',
        user: guest._id,
        room: room304._id,
        guestName: 'Sophia Montgomery',
        guestEmail: 'guest@hotelpro.com',
        guestPhone: '+1 (555) 432-1098',
        checkInDate: today,
        checkOutDate: future3Days,
        nights: 3,
        guestsCount: { adults: 2, children: 1 },
        specialRequests: 'High floor preferred, late arrival at 7 PM. Champagne on arrival.',
        roomRate: room304.pricePerNight,
        subtotal: room304.pricePerNight * 3,
        taxAmount: Math.round(room304.pricePerNight * 3 * 0.12),
        totalAmount: room304.pricePerNight * 3 + Math.round(room304.pricePerNight * 3 * 0.12),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-9847192',
        status: 'Checked-In',
      },
      {
        bookingCode: 'HP-73204',
        user: null,
        room: roomPH._id,
        guestName: 'Lord Alistair Sterling',
        guestEmail: 'sterling.capital@vip-holdings.co.uk',
        guestPhone: '+44 20 7946 0912',
        checkInDate: future3Days,
        checkOutDate: new Date(future3Days.getTime() + 4 * 24 * 60 * 60 * 1000),
        nights: 4,
        guestsCount: { adults: 2, children: 0 },
        specialRequests: 'Airport helicopter transfer, sparkling mineral water stocked in suite.',
        roomRate: roomPH.pricePerNight,
        subtotal: roomPH.pricePerNight * 4,
        taxAmount: Math.round(roomPH.pricePerNight * 4 * 0.12),
        totalAmount: roomPH.pricePerNight * 4 + Math.round(roomPH.pricePerNight * 4 * 0.12),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN-8371940',
        status: 'Confirmed',
      },
      {
        bookingCode: 'HP-51092',
        user: null,
        room: createdRooms.find(r => r.roomNumber === '408')._id,
        guestName: 'Elena Rostova',
        guestEmail: 'elena.rostova@techcorp.io',
        guestPhone: '+1 (415) 890-2341',
        checkInDate: past4Days,
        checkOutDate: past1Day,
        nights: 3,
        guestsCount: { adults: 1, children: 0 },
        specialRequests: 'Quiet room near elevator.',
        roomRate: 310,
        subtotal: 930,
        taxAmount: 112,
        totalAmount: 1042,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        transactionId: 'TXN-6640192',
        status: 'Checked-Out',
      }
    ];

    await Booking.insertMany(sampleBookings);
    console.log('[Seed] Created sample reservations & invoices');

    // 4. Create Housekeeping / Maintenance Tasks
    const sampleTasks = [
      {
        room: createdRooms.find(r => r.roomNumber === '408')._id,
        roomNumber: '408',
        title: 'Deep sanitation & linen refresh after checkout',
        type: 'Cleaning',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Marcus Vance',
        notes: 'Guest checked out yesterday. Replace duvet and restock organic toiletries.',
      },
      {
        room: createdRooms.find(r => r.roomNumber === '502')._id,
        roomNumber: '502',
        title: 'AC thermostat calibration & filter check',
        type: 'Maintenance',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: 'Engineering Crew',
        notes: 'Thermostat sensor reporting 2 degree variation. Calibrate digital display.',
      },
      {
        room: createdRooms.find(r => r.roomNumber === 'PH-101')._id,
        roomNumber: 'PH-101',
        title: 'VIP Arrival Inspection & Plunge Pool Chemistry Test',
        type: 'Inspection',
        priority: 'Urgent',
        status: 'Pending',
        assignedTo: 'Senior Housekeeper & Butler',
        notes: 'VIP Lord Sterling arriving in 3 days. Verify champagne chilling and pool heat.',
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('[Seed] Created sample housekeeping & maintenance tasks');

    console.log('--- HOTELPRO DATABASE SEEDED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
