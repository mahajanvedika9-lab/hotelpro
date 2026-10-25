import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { 
  BedDouble, 
  Search, 
  Filter, 
  Plus, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Wrench, 
  SlidersHorizontal 
} from 'lucide-react';

const RoomsPage = () => {
  const { isAdmin, isStaff, token } = useAuth();
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');

  // Modals state
  const [bookingRoom, setBookingRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let url = '/api/rooms?';
      if (selectedType !== 'All') url += `type=${selectedType}&`;
      if (selectedStatus !== 'All') url += `status=${selectedStatus}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch rooms error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType, selectedStatus, search]);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRooms(rooms.map((r) => (r._id === roomId ? data.room : r)));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Sort rooms
  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.roomNumber.localeCompare(b.roomNumber);
  });

  // Calculate quick inventory stats
  const totalCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const bookedCount = rooms.filter((r) => r.status === 'Booked').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Cleaning' || r.status === 'Maintenance').length;

  return (
    <div className="container py-4 py-lg-5">
      {/* Header & Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            INVENTORY & REAL-TIME STATUS
          </span>
          <h2 className="text-white font-serif mb-1">Rooms & Luxury Suites</h2>
          <p className="text-secondary small mb-0">
            Real-time live catalog with floor locations, capacity constraints, amenities, and dynamic pricing.
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-gold d-flex align-items-center gap-2 align-self-start align-self-md-auto"
          >
            <Plus size={18} />
            <span>Add New Room</span>
          </button>
        )}
      </div>

      {/* Metrics Ribbon */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <small className="text-secondary d-block">Total Inventory</small>
              <h4 className="text-white font-serif mb-0">{totalCount} Rooms</h4>
            </div>
            <BedDouble className="text-gold" size={24} />
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <small className="text-secondary d-block">Available Now</small>
              <h4 className="text-success font-serif mb-0">{availableCount} Rooms</h4>
            </div>
            <CheckCircle className="text-success" size={24} />
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <small className="text-secondary d-block">Currently Occupied</small>
              <h4 className="text-danger font-serif mb-0">{bookedCount} Rooms</h4>
            </div>
            <Clock className="text-danger" size={24} />
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <small className="text-secondary d-block">Housekeeping / Maint.</small>
              <h4 className="text-warning font-serif mb-0">{cleaningCount} Rooms</h4>
            </div>
            <Wrench className="text-warning" size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        className="glass-card p-3 p-md-4 mb-4"
        style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-12 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                className="form-control form-control-custom"
                placeholder="Search room name, #number, or amenity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="col-6 col-sm-4 col-lg-3">
            <select 
              className="form-select form-select-custom"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Room Types</option>
              <option value="Presidential">Presidential</option>
              <option value="Suite">Royal Suite</option>
              <option value="Executive">Executive</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-sm-4 col-lg-3">
            <select 
              className="form-select form-select-custom"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Booked">Occupied</option>
              <option value="Cleaning">In Housekeeping</option>
              <option value="Maintenance">In Maintenance</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-12 col-sm-4 col-lg-2">
            <select 
              className="form-select form-select-custom"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold mb-3" role="status"></div>
          <div className="text-secondary">Syncing real-time room inventories...</div>
        </div>
      ) : sortedRooms.length === 0 ? (
        <div className="text-center py-5 glass-card p-5">
          <BedDouble size={48} className="text-secondary opacity-50 mb-3" />
          <h4 className="text-white font-serif mb-2">No Matching Rooms Found</h4>
          <p className="text-secondary small mb-3">Try adjusting your filters, room category, or search criteria.</p>
          <button 
            onClick={() => { setSelectedType('All'); setSelectedStatus('All'); setSearch(''); }}
            className="btn btn-outline-gold btn-sm d-inline-flex align-items-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {sortedRooms.map((room) => (
            <div key={room._id} className="col-12 col-md-6 col-xl-4">
              <RoomCard 
                room={room}
                onBook={(r) => setBookingRoom(r)}
                onEdit={(r) => setEditingRoom(r)}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingRoom && (
        <BookingModal 
          room={bookingRoom}
          isOpen={!!bookingRoom}
          onClose={() => setBookingRoom(null)}
          onBookingSuccess={() => {
            fetchRooms();
          }}
        />
      )}

      {/* Admin Add/Edit Room Modal */}
      {(isAddModalOpen || editingRoom) && (
        <RoomModal 
          room={editingRoom}
          isOpen={isAddModalOpen || !!editingRoom}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingRoom(null);
          }}
          onSaved={() => {
            fetchRooms();
          }}
        />
      )}
    </div>
  );
};

export default RoomsPage;
