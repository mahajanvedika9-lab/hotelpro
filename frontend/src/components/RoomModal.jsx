import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, BedDouble, Save, Plus } from 'lucide-react';

const RoomModal = ({ room, isOpen, onClose, onSaved }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    type: 'Deluxe',
    floor: 1,
    pricePerNight: 250,
    sizeSqFt: 400,
    adults: 2,
    children: 1,
    status: 'Available',
    description: '',
    amenities: 'King Bed, High-Speed Wi-Fi, Ocean View, Smart TV, Mini Bar',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        name: room.name || '',
        type: room.type || 'Deluxe',
        floor: room.floor || 1,
        pricePerNight: room.pricePerNight || 250,
        sizeSqFt: room.sizeSqFt || 400,
        adults: room.capacity?.adults || 2,
        children: room.capacity?.children || 1,
        status: room.status || 'Available',
        description: room.description || '',
        amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
        imageUrl: room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      });
    } else {
      setFormData({
        roomNumber: '',
        name: '',
        type: 'Deluxe',
        floor: 1,
        pricePerNight: 250,
        sizeSqFt: 400,
        adults: 2,
        children: 1,
        status: 'Available',
        description: '',
        amenities: 'King Bed, High-Speed Wi-Fi, Ocean View, Smart TV, Mini Bar',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      });
    }
    setError('');
  }, [room, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      roomNumber: formData.roomNumber,
      name: formData.name,
      type: formData.type,
      floor: Number(formData.floor),
      pricePerNight: Number(formData.pricePerNight),
      sizeSqFt: Number(formData.sizeSqFt),
      capacity: { adults: Number(formData.adults), children: Number(formData.children) },
      status: formData.status,
      description: formData.description,
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: [formData.imageUrl],
    };

    try {
      const url = room ? `/api/rooms/${room._id}` : '/api/rooms';
      const method = room ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setLoading(false);
      if (onSaved) onSaved(data.room);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
    >
      <div 
        className="modal-content-glass p-4 p-md-5 position-relative w-100" 
        style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-glass position-absolute top-0 end-0 m-3 text-secondary"
        >
          <X size={20} />
        </button>

        <div className="d-flex align-items-center gap-2 mb-2">
          <BedDouble size={22} className="text-gold" />
          <h3 className="text-white font-serif mb-0">
            {room ? `Edit Room #${room.roomNumber}` : 'Add New Inventory Room'}
          </h3>
        </div>
        <p className="text-secondary small mb-3">
          Configure room attributes, pricing, occupancy limits, and amenities.
        </p>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-12 col-sm-4">
              <label className="form-label text-secondary small mb-1">Room Number *</label>
              <input 
                type="text" 
                className="form-control form-control-custom"
                placeholder="e.g. 504 or PH-02"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-sm-8">
              <label className="form-label text-secondary small mb-1">Room Title / Name *</label>
              <input 
                type="text" 
                className="form-control form-control-custom"
                placeholder="e.g. Royal Oceanfront Penthouse"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6 col-sm-3">
              <label className="form-label text-secondary small mb-1">Room Type</label>
              <select 
                className="form-select form-select-custom"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Executive">Executive</option>
                <option value="Presidential">Presidential</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
            <div className="col-6 col-sm-3">
              <label className="form-label text-secondary small mb-1">Floor Level</label>
              <input 
                type="number" 
                className="form-control form-control-custom"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                min="1"
                max="50"
              />
            </div>
            <div className="col-6 col-sm-3">
              <label className="form-label text-secondary small mb-1">Price / Night ($) *</label>
              <input 
                type="number" 
                className="form-control form-control-custom"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="col-6 col-sm-3">
              <label className="form-label text-secondary small mb-1">Status</label>
              <select 
                className="form-select form-select-custom"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-4">
              <label className="form-label text-secondary small mb-1">Adults Capacity</label>
              <input 
                type="number" 
                className="form-control form-control-custom"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                min="1"
              />
            </div>
            <div className="col-4">
              <label className="form-label text-secondary small mb-1">Children Capacity</label>
              <input 
                type="number" 
                className="form-control form-control-custom"
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                min="0"
              />
            </div>
            <div className="col-4">
              <label className="form-label text-secondary small mb-1">Size (Sq Ft)</label>
              <input 
                type="number" 
                className="form-control form-control-custom"
                value={formData.sizeSqFt}
                onChange={(e) => setFormData({ ...formData, sizeSqFt: e.target.value })}
                min="100"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Image URL</label>
            <input 
              type="url" 
              className="form-control form-control-custom"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Amenities (comma separated)</label>
            <input 
              type="text" 
              className="form-control form-control-custom"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Description</label>
            <textarea 
              className="form-control form-control-custom"
              rows="3"
              placeholder="Room overview and highlights..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold d-flex align-items-center gap-2" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : room ? 'Save Changes' : 'Create Room'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
