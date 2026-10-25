import React, { useState, useEffect } from 'react';
import InvoiceModal from '../components/InvoiceModal';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarCheck, 
  Search, 
  FileText, 
  CheckCircle, 
  LogOut, 
  XCircle, 
  Printer, 
  RotateCcw,
  CreditCard 
} from 'lucide-react';

const BookingsPage = () => {
  const { isStaff, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/api/bookings?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      // If user is guest and not staff, filter by their email
      if (user && user.role === 'guest') {
        url += `guestEmail=${encodeURIComponent(user.email)}&`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, search, user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map((b) => (b._id === bookingId ? data.booking : b)));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-primary bg-opacity-25 text-info border border-info px-2 py-1">Confirmed</span>;
      case 'Checked-In':
        return <span className="badge bg-success bg-opacity-25 text-success border border-success px-2 py-1">Checked-In</span>;
      case 'Checked-Out':
        return <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary px-2 py-1">Checked-Out</span>;
      case 'Cancelled':
        return <span className="badge bg-danger bg-opacity-25 text-danger border border-danger px-2 py-1">Cancelled</span>;
      default:
        return <span className="badge bg-dark text-secondary">{status}</span>;
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            RESERVATIONS & AUDIT TRAIL
          </span>
          <h2 className="text-white font-serif mb-1">
            {user?.role === 'guest' ? 'My Guest Reservations' : 'Guest Reservations & Front Desk'}
          </h2>
          <p className="text-secondary small mb-0">
            {user?.role === 'guest' 
              ? 'View your booking history, stay invoices, and check-in status.' 
              : 'Manage real-time guest arrivals, departures, billing receipts, and automatic housekeeping triggers.'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                className="form-control form-control-custom"
                placeholder="Search booking code (e.g. HP-94821), guest name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
            {['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-gold' : 'btn-glass text-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold mb-3" role="status"></div>
          <div className="text-secondary">Retrieving reservations...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5 glass-card p-5">
          <CalendarCheck size={48} className="text-secondary opacity-50 mb-3" />
          <h4 className="text-white font-serif mb-2">No Reservations Found</h4>
          <p className="text-secondary small mb-3">No matching booking records exist for your filter selection.</p>
          <button 
            onClick={() => { setStatusFilter('All'); setSearch(''); }}
            className="btn btn-outline-gold btn-sm d-inline-flex align-items-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Reset Search</span>
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="border-bottom border-secondary border-opacity-50 text-secondary small text-uppercase">
                  <th className="py-3 px-4">Booking Code</th>
                  <th className="py-3 px-3">Guest Details</th>
                  <th className="py-3 px-3">Room</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Amount & Payment</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-bottom border-secondary border-opacity-25">
                    {/* Booking Code */}
                    <td className="py-3 px-4">
                      <span className="font-monospace text-gold fw-bold">{booking.bookingCode}</span>
                      <small className="text-dim d-block" style={{ fontSize: '0.7rem' }}>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </small>
                    </td>

                    {/* Guest */}
                    <td className="py-3 px-3">
                      <div className="text-white fw-semibold">{booking.guestName}</div>
                      <small className="text-secondary d-block">{booking.guestEmail}</small>
                      <small className="text-dim" style={{ fontSize: '0.72rem' }}>{booking.guestPhone}</small>
                    </td>

                    {/* Room */}
                    <td className="py-3 px-3">
                      <div className="text-white">
                        Room #{booking.room?.roomNumber || 'N/A'}
                      </div>
                      <small className="text-gold opacity-75">{booking.room?.name || 'Standard'}</small>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-3">
                      <div className="small text-white">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </div>
                      <small className="badge bg-dark text-secondary border border-secondary" style={{ fontSize: '0.68rem' }}>
                        {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
                      </small>
                    </td>

                    {/* Financials */}
                    <td className="py-3 px-3">
                      <div className="text-gold fw-bold">${booking.totalAmount}</div>
                      <small className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                        <CreditCard size={12} />
                        <span>{booking.paymentStatus} ({booking.paymentMethod})</span>
                      </small>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Lifecycle Actions */}
                    <td className="py-3 px-4 text-end">
                      <div className="d-flex justify-content-end gap-1 flex-wrap">
                        {/* Check In Action */}
                        {booking.status === 'Confirmed' && isStaff && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'Checked-In')}
                            className="btn btn-sm btn-outline-success py-1 px-2"
                            title="Check-In Guest"
                          >
                            <CheckCircle size={14} className="me-1" />
                            Check-In
                          </button>
                        )}

                        {/* Check Out Action */}
                        {booking.status === 'Checked-In' && isStaff && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'Checked-Out')}
                            className="btn btn-sm btn-outline-warning py-1 px-2"
                            title="Check-Out Guest & Queue Cleaning"
                          >
                            <LogOut size={14} className="me-1" />
                            Check-Out
                          </button>
                        )}

                        {/* Invoice View */}
                        <button 
                          onClick={() => setSelectedInvoice(booking)}
                          className="btn btn-sm btn-glass text-gold py-1 px-2"
                          title="View Official Invoice"
                        >
                          <FileText size={14} className="me-1" />
                          Receipt
                        </button>

                        {/* Cancel Action */}
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                            className="btn btn-sm btn-glass text-danger py-1 px-2"
                            title="Cancel Reservation"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal 
          booking={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default BookingsPage;
