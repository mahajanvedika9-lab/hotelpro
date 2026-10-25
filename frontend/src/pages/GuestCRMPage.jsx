import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone, 
  Award, 
  X,
  History 
} from 'lucide-react';

const GuestCRMPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/guests');
      const data = await res.json();
      if (data.success) {
        setGuests(data.guests);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch guests error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const filteredGuests = guests.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      (g.phone && g.phone.includes(q))
    );
  });

  return (
    <div className="container py-4 py-lg-5">
      {/* Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            GUEST RELATIONS & CRM
          </span>
          <h2 className="text-white font-serif mb-1">Guest Profiles & Lifetime Value</h2>
          <p className="text-secondary small mb-0">
            Track repeat stays, historical expenditure, customized preferences, and VIP tiers.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-3 p-md-4 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-dark border-secondary text-secondary">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            className="form-control form-control-custom"
            placeholder="Search guest by name, email, or telephone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Guests Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold mb-3" role="status"></div>
          <div className="text-secondary">Retrieving guest profiles...</div>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="text-center py-5 glass-card p-5">
          <Users size={48} className="text-secondary opacity-50 mb-3" />
          <h4 className="text-white font-serif mb-2">No Guest Profiles Found</h4>
          <p className="text-secondary small">Guest profiles are compiled automatically upon guest reservations.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredGuests.map((guest, idx) => (
            <div key={idx} className="col-12 col-md-6 col-xl-4">
              <div className="glass-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guest.name)}&backgroundColor=0ea5e9,6366f1,8b5cf6`} 
                    alt={guest.name} 
                    className="rounded-circle border border-warning-subtle"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="text-white font-serif mb-0">{guest.name}</h5>
                    <div className="d-flex align-items-center gap-1 text-gold small">
                      <Award size={13} />
                      <span>{guest.totalSpent > 2000 ? 'VIP Platinum Guest' : 'Preferred Guest'}</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 mb-3 small text-secondary">
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={14} className="text-dim" />
                    <span>{guest.email}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Phone size={14} className="text-dim" />
                    <span>{guest.phone || 'No phone recorded'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-dim" />
                    <span>Last visit: {new Date(guest.lastStayDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div 
                  className="p-3 rounded-3 mt-auto mb-3" 
                  style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                >
                  <div className="row text-center">
                    <div className="col-6 border-end border-secondary border-opacity-25">
                      <small className="text-dim d-block">Total Stays</small>
                      <strong className="text-white fs-5">{guest.totalStays}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-dim d-block">Lifetime Spend</small>
                      <strong className="text-gold fs-5">${guest.totalSpent?.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedGuest(guest)}
                  className="btn btn-glass btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <History size={15} />
                  <span>View Stay History</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guest History Modal */}
      {selectedGuest && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-content-glass p-4 p-md-5 position-relative w-100" style={{ maxWidth: '580px' }}>
            <button 
              onClick={() => setSelectedGuest(null)} 
              className="btn btn-sm btn-glass position-absolute top-0 end-0 m-3 text-secondary"
            >
              <X size={18} />
            </button>

            <h4 className="text-white font-serif mb-1">{selectedGuest.name} - Stay History</h4>
            <p className="text-secondary small mb-3">Audit of past reservations and room choices.</p>

            <div className="d-flex flex-column gap-2 mb-4">
              {selectedGuest.recentBookings.map((b, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-3" 
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="font-monospace text-gold fw-bold">{b.bookingCode}</span>
                    <span className="badge bg-dark text-secondary border border-secondary">{b.status}</span>
                  </div>
                  <div className="text-white small fw-semibold">{b.room}</div>
                  <div className="d-flex justify-content-between text-dim small mt-1">
                    <span>{new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}</span>
                    <strong className="text-gold">${b.totalAmount}</strong>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedGuest(null)} className="btn btn-gold w-100">
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestCRMPage;
