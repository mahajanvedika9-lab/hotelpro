import React from 'react';
import { X, Printer, Download, Building2, CheckCircle2 } from 'lucide-react';

const InvoiceModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const room = booking.room || {};

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1060 }}
    >
      <div 
        className="modal-content-glass p-4 p-md-5 position-relative w-100" 
        style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-secondary mb-4">
          <div className="d-flex align-items-center gap-2">
            <Building2 size={24} className="text-gold" />
            <span className="fs-5 fw-bold font-serif text-white">
              HOTEL<span className="text-gold">PRO</span> INVOICE
            </span>
          </div>
          <div className="d-flex gap-2">
            <button onClick={handlePrint} className="btn btn-sm btn-outline-gold d-flex align-items-center gap-1">
              <Printer size={15} />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="btn btn-sm btn-glass text-secondary">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <small className="text-secondary d-block">Billed To:</small>
            <strong className="text-white fs-6">{booking.guestName}</strong>
            <div className="text-secondary small">{booking.guestEmail}</div>
            <div className="text-secondary small">{booking.guestPhone}</div>
          </div>
          <div className="col-6 text-end">
            <small className="text-secondary d-block">Invoice Reference:</small>
            <span className="text-gold fw-bold font-monospace fs-6">{booking.bookingCode}</span>
            <div className="text-secondary small">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</div>
            <div className="text-secondary small">Txn: <span className="font-monospace">{booking.transactionId}</span></div>
          </div>
        </div>

        {/* Stay Details */}
        <div 
          className="p-3 rounded-3 mb-4" 
          style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="row g-2 small">
            <div className="col-6">
              <span className="text-secondary">Room:</span> <strong className="text-white">{room.name || 'Deluxe Room'}</strong>
            </div>
            <div className="col-6">
              <span className="text-secondary">Room No:</span> <strong className="text-white">#{room.roomNumber} ({room.type})</strong>
            </div>
            <div className="col-6">
              <span className="text-secondary">Check-in:</span> <strong className="text-white">{new Date(booking.checkInDate).toLocaleDateString()}</strong>
            </div>
            <div className="col-6">
              <span className="text-secondary">Check-out:</span> <strong className="text-white">{new Date(booking.checkOutDate).toLocaleDateString()}</strong>
            </div>
            <div className="col-6">
              <span className="text-secondary">Length of Stay:</span> <strong className="text-white">{booking.nights} Nights</strong>
            </div>
            <div className="col-6">
              <span className="text-secondary">Payment Method:</span> <strong className="text-white">{booking.paymentMethod}</strong>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="table table-dark table-borderless small mb-4">
          <thead>
            <tr className="border-bottom border-secondary text-secondary">
              <th>Description</th>
              <th className="text-center">Rate</th>
              <th className="text-center">Qty</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="fw-semibold text-white">{room.name || 'Room Stay'}</div>
                <small className="text-secondary">Daily accommodation including luxury amenities</small>
              </td>
              <td className="text-center text-white">${booking.roomRate}</td>
              <td className="text-center text-white">{booking.nights}</td>
              <td className="text-end text-white">${booking.subtotal}</td>
            </tr>
            <tr className="border-top border-secondary">
              <td colSpan="3" className="text-secondary">Subtotal</td>
              <td className="text-end text-white">${booking.subtotal}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-secondary">Hospitality & State Tax (12%)</td>
              <td className="text-end text-white">${booking.taxAmount}</td>
            </tr>
            <tr className="border-top border-secondary">
              <td colSpan="3" className="fw-bold text-white fs-6">Total Paid</td>
              <td className="text-end fw-bold text-gold fs-5">${booking.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
          <div className="d-flex align-items-center gap-2">
            <CheckCircle2 size={18} className="text-success" />
            <span className="text-success small fw-semibold">Payment Completed & Verified</span>
          </div>
          <button onClick={onClose} className="btn btn-gold px-4 py-1 small">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
