import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  DollarSign,
  FileText 
} from 'lucide-react';

const BookingModal = ({ room, isOpen, onClose, onBookingSuccess }) => {
  const { user } = useAuth();

  // Dates defaults: Check-in tomorrow, Check-out in 3 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const inThreeDays = new Date(today);
  inThreeDays.setDate(today.getDate() + 4);

  const formatDateForInput = (d) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDateForInput(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDateForInput(inThreeDays));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Guest info
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 234-8900');

  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen || !room) return null;

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffTime) || diffTime <= 0 ? 1 : diffTime;

  const roomRate = room.pricePerNight;
  const subtotal = roomRate * nights;
  const taxAmount = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + taxAmount;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room._id,
          guestName: guestName || 'Valued Guest',
          guestEmail: guestEmail || 'guest@hotelpro.com',
          guestPhone: guestPhone || '+1 (555) 234-8900',
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount: { adults: Number(adults), children: Number(children) },
          specialRequests,
          paymentMethod,
          userId: user?._id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to complete reservation');

      setConfirmedBooking(data.booking);
      setLoading(false);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e5b95f', '#d4af37', '#38bdf8', '#ffffff'],
      });

      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
    >
      <div 
        className="modal-content-glass p-4 p-md-5 position-relative w-100" 
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-glass position-absolute top-0 end-0 m-3 text-secondary"
        >
          <X size={20} />
        </button>

        {!confirmedBooking ? (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1">
                INSTANT RESERVATION
              </span>
              <span className="text-secondary small">Room #{room.roomNumber} • {room.type}</span>
            </div>

            <h3 className="text-white font-serif mb-1">{room.name}</h3>
            <p className="text-secondary small mb-4">
              Secure booking guaranteed with real-time room locking and encrypted checkout.
            </p>

            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-3">
              {/* Dates */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-secondary small mb-1">Check-in Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-gold">
                      <Calendar size={16} />
                    </span>
                    <input 
                      type="date" 
                      className="form-control form-control-custom"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-secondary small mb-1">Check-out Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-gold">
                      <Calendar size={16} />
                    </span>
                    <input 
                      type="date" 
                      className="form-control form-control-custom"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Guests Count */}
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label text-secondary small mb-1">Adults</label>
                  <select 
                    className="form-select form-select-custom"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small mb-1">Children</label>
                  <select 
                    className="form-select form-select-custom"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label text-secondary small mb-1">Guest Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom"
                    placeholder="e.g. John Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label text-secondary small mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-custom"
                    placeholder="guest@domain.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label text-secondary small mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control form-control-custom"
                    placeholder="+1 555-0199"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="form-label text-secondary small mb-1">Special Preferences / Requests</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom"
                  placeholder="e.g. High floor preference, airport pickup, anniversary champagne..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="form-label text-secondary small mb-1">Payment Method</label>
                <div className="d-flex gap-2 flex-wrap">
                  {['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash at Desk'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`btn btn-sm ${paymentMethod === m ? 'btn-gold' : 'btn-glass text-secondary'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div 
                className="p-3 rounded-3 mt-2" 
                style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                <div className="d-flex justify-content-between text-secondary small mb-1">
                  <span>${roomRate} × {nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>Occupancy & Hospitality Tax (12%)</span>
                  <span>${taxAmount}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
                  <span className="fw-bold text-white">Estimated Grand Total</span>
                  <span className="fs-4 fw-bold text-gold">${totalAmount}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-gold w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span>Processing Reservation & Payment...</span>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Confirm & Pay ${totalAmount}</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)' }}
            >
              <CheckCircle size={48} className="text-success" />
            </div>

            <h2 className="text-white font-serif mb-2">Booking Confirmed!</h2>
            <p className="text-secondary mb-4">
              Your stay at <span className="text-white fw-bold">{room.name}</span> has been confirmed.
            </p>

            <div 
              className="p-4 rounded-3 text-start mb-4" 
              style={{ background: 'rgba(229, 185, 95, 0.06)', border: '1px solid rgba(229, 185, 95, 0.3)' }}
            >
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
                <div>
                  <small className="text-secondary d-block">Booking Reference</small>
                  <span className="fs-5 fw-bold text-gold font-monospace">{confirmedBooking.bookingCode}</span>
                </div>
                <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
                  PAID & GUARANTEED
                </span>
              </div>

              <div className="row g-2 small text-secondary">
                <div className="col-6">
                  <span>Guest Name:</span> <strong className="text-white">{confirmedBooking.guestName}</strong>
                </div>
                <div className="col-6">
                  <span>Room Number:</span> <strong className="text-white">#{room.roomNumber} ({room.type})</strong>
                </div>
                <div className="col-6">
                  <span>Check-in:</span> <strong className="text-white">{new Date(confirmedBooking.checkInDate).toLocaleDateString()}</strong>
                </div>
                <div className="col-6">
                  <span>Check-out:</span> <strong className="text-white">{new Date(confirmedBooking.checkOutDate).toLocaleDateString()}</strong>
                </div>
                <div className="col-6">
                  <span>Duration:</span> <strong className="text-white">{confirmedBooking.nights} Nights</strong>
                </div>
                <div className="col-6">
                  <span>Transaction ID:</span> <strong className="text-white font-monospace">{confirmedBooking.transactionId}</strong>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button 
                onClick={onClose} 
                className="btn btn-gold px-4 py-2"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
