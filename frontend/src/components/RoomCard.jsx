import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Maximize2, Star, Edit3, CheckCircle, Clock, Wrench } from 'lucide-react';

const RoomCard = ({ room, onBook, onEdit, onStatusChange }) => {
  const { isStaff, isAdmin } = useAuth();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge-status badge-available"><CheckCircle size={13} /> Available</span>;
      case 'Booked':
        return <span className="badge-status badge-booked"><Clock size={13} /> Occupied</span>;
      case 'Cleaning':
        return <span className="badge-status badge-cleaning"><Clock size={13} /> Housekeeping</span>;
      case 'Maintenance':
        return <span className="badge-status badge-maintenance"><Wrench size={13} /> Maintenance</span>;
      default:
        return <span className="badge-status badge-available">{status}</span>;
    }
  };

  const image = room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="card glass-card glass-card-interactive h-100 overflow-hidden border-0">
      {/* Image & Overlay */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img 
          src={image} 
          alt={room.name} 
          className="w-100 h-100 object-fit-cover"
          style={{ transition: 'transform 0.6s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(9,13,22,0.85) 100%)' }}
        />
        
        {/* Badges on image */}
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2 align-items-center">
          <span className="badge bg-black bg-opacity-75 text-gold border border-warning-subtle px-2 py-1 small fw-bold">
            ROOM #{room.roomNumber}
          </span>
          <span className="badge bg-primary bg-opacity-75 text-white px-2 py-1 small">
            Floor {room.floor}
          </span>
        </div>

        <div className="position-absolute top-0 end-0 m-3">
          {getStatusBadge(room.status)}
        </div>

        <div className="position-absolute bottom-0 start-0 m-3 d-flex align-items-center gap-1 text-gold small">
          <Star size={14} fill="#e5b95f" />
          <span className="fw-bold">{room.rating || 4.9}</span>
          <span className="text-secondary opacity-75">({room.type})</span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-4 d-flex flex-column">
        <h5 className="card-title text-white font-serif mb-2">{room.name}</h5>
        <p className="card-text text-secondary small flex-grow-1 mb-3 line-clamp-2" style={{ minHeight: '38px' }}>
          {room.description || 'Luxury accommodation curated with bespoke appointments and tranquil ambience.'}
        </p>

        {/* Specs */}
        <div className="d-flex align-items-center gap-3 text-secondary small mb-3 py-2 border-top border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-1">
            <Users size={14} className="text-gold" />
            <span>{room.capacity?.adults || 2} Adults{room.capacity?.children ? `, ${room.capacity.children} Ch` : ''}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Maximize2 size={14} className="text-gold" />
            <span>{room.sizeSqFt || 450} sq ft</span>
          </div>
        </div>

        {/* Amenities chips */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {(room.amenities || []).slice(0, 3).map((a, idx) => (
            <span 
              key={idx} 
              className="badge text-secondary border border-secondary border-opacity-25 fw-normal py-1 px-2"
              style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.02)' }}
            >
              {a}
            </span>
          ))}
          {(room.amenities || []).length > 3 && (
            <span className="badge text-dim py-1 px-1" style={{ fontSize: '0.72rem' }}>
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Price & Booking CTA */}
        <div className="d-flex align-items-center justify-content-between pt-2 mt-auto">
          <div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fs-4 fw-bold text-gold">${room.pricePerNight}</span>
              <span className="text-secondary small">/ night</span>
            </div>
            <small className="text-dim d-block" style={{ fontSize: '0.68rem' }}>+12% taxes & fees</small>
          </div>

          <div className="d-flex gap-2">
            {isStaff && (
              <button 
                onClick={() => onEdit(room)}
                className="btn btn-sm btn-glass text-secondary"
                title="Edit Room Details"
              >
                <Edit3 size={15} />
              </button>
            )}

            {room.status === 'Available' ? (
              <button 
                onClick={() => onBook(room)}
                className="btn btn-gold btn-sm px-3 fw-semibold shadow-sm"
              >
                Book Now
              </button>
            ) : (
              <button 
                disabled 
                className="btn btn-glass btn-sm px-3 text-secondary opacity-75"
              >
                {room.status === 'Booked' ? 'Reserved' : room.status}
              </button>
            )}
          </div>
        </div>

        {/* Staff Quick Status Override Strip */}
        {isStaff && (
          <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
            <span className="text-dim" style={{ fontSize: '0.7rem' }}>Staff Action:</span>
            <div className="btn-group btn-group-sm">
              {['Available', 'Cleaning', 'Maintenance'].map((st) => (
                <button
                  key={st}
                  onClick={() => onStatusChange(room._id, st)}
                  disabled={room.status === st}
                  className={`btn py-0 px-2 ${room.status === st ? 'btn-secondary disabled' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.68rem' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
