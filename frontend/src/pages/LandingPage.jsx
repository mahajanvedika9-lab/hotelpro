import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CalendarCheck, 
  BarChart3, 
  Sparkles, 
  CreditCard, 
  BedDouble, 
  Search, 
  CheckCircle2, 
  Star, 
  ArrowRight 
} from 'lucide-react';

const LandingPage = ({ onBookRoom }) => {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState('All');
  const [guests, setGuests] = useState('2');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/rooms?type=${roomType}&guests=${guests}`);
  };

  const epics = [
    {
      icon: <ShieldCheck size={28} className="text-gold" />,
      title: 'Secure Authentication & RBAC',
      desc: 'Role-based access control with JSON Web Tokens (JWT) and bcrypt encryption for Guests, Staff, and General Managers.',
      tag: 'Epic 1 • Security',
    },
    {
      icon: <BedDouble size={28} className="text-gold" />,
      title: 'Real-Time Inventory Tracking',
      desc: 'Instant availability synchronization, floor mapping, room categorization, and custom pricing models.',
      tag: 'Epic 2 • Room Catalog',
    },
    {
      icon: <CalendarCheck size={28} className="text-gold" />,
      title: 'End-to-End Booking Engine',
      desc: 'Seamless reservation workflows, stay calculations, automated tax calculations, and guest check-in/out lifecycles.',
      tag: 'Epic 3 • Reservations',
    },
    {
      icon: <CreditCard size={28} className="text-gold" />,
      title: 'Integrated Billing & Invoicing',
      desc: 'Multi-payment processing (Credit Card, Debit, UPI, Desk Pay), PDF-ready tax receipts, and ledger audit logs.',
      tag: 'Epic 4 • Payments',
    },
    {
      icon: <Sparkles size={28} className="text-gold" />,
      title: 'Housekeeping & Maintenance',
      desc: 'Automated room turnover task generation upon guest checkout, priority dispatching, and sanitization tracking.',
      tag: 'Epic 5 • Operations',
    },
    {
      icon: <BarChart3 size={28} className="text-gold" />,
      title: 'Executive Intelligence & CRM',
      desc: 'Live occupancy metrics, RevPAR, average daily rate calculations, guest lifetime value profiles, and revenue trends.',
      tag: 'Epic 6 • Analytics',
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="position-relative py-5 overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-2 mb-3 rounded-pill fw-semibold">
                ✨ Next-Generation Hospitality Ecosystem
              </span>
              <h1 className="display-4 fw-bold text-white font-serif lh-sm mb-3">
                Your Ultimate <span className="text-gold-gradient">Hotel Management</span> Solution.
              </h1>
              <p className="lead text-secondary mb-4 fs-6">
                Streamline modern hotel operations with a robust, scalable backend, 
                real-time availability tracking, intuitive guest profiles, automated housekeeping, 
                and secure payment processing.
              </p>

              {/* Quick Search Widget */}
              <div 
                className="p-3 p-md-4 rounded-4 glass-card mb-4"
                style={{ border: '1px solid rgba(229, 185, 95, 0.3)' }}
              >
                <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
                  <div className="col-12 col-sm-4">
                    <label className="form-label text-secondary small mb-1">Room Category</label>
                    <select 
                      className="form-select form-select-custom"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="All">All Suites & Rooms</option>
                      <option value="Presidential">Presidential</option>
                      <option value="Suite">Royal Suite</option>
                      <option value="Executive">Executive</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label text-secondary small mb-1">Guests</label>
                    <select 
                      className="form-select form-select-custom"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-4">
                    <button type="submit" className="btn btn-gold w-100 d-flex align-items-center justify-content-center gap-2 py-2">
                      <Search size={18} />
                      <span>Find Rooms</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Key Metrics Ribbon */}
              <div className="d-flex gap-4 gap-md-5 pt-2">
                <div>
                  <h3 className="text-gold font-serif fw-bold mb-0">99.8%</h3>
                  <small className="text-secondary">Uptime Reliability</small>
                </div>
                <div>
                  <h3 className="text-white font-serif fw-bold mb-0">Real-Time</h3>
                  <small className="text-secondary">Inventory Sync</small>
                </div>
                <div>
                  <h3 className="text-gold font-serif fw-bold mb-0">JWT</h3>
                  <small className="text-secondary">Enterprise Security</small>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-12 col-lg-5">
              <div className="position-relative">
                <div 
                  className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25"
                  style={{ maxHeight: '480px' }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80" 
                    alt="Presidential Penthouse" 
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                {/* Floating Notification Card */}
                <div 
                  className="position-absolute bottom-0 start-0 translate-middle-y ms-md-n4 p-3 rounded-3 glass-card shadow-lg d-flex align-items-center gap-3"
                  style={{ maxWidth: '300px', border: '1px solid rgba(229, 185, 95, 0.4)' }}
                >
                  <div className="p-2 rounded-circle bg-success bg-opacity-25 text-success">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-white small fw-bold">Instant Confirmation</div>
                    <small className="text-secondary">VIP Sky Villa Booked & Confirmed</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Epics Architecture */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="display-6 fw-bold text-white font-serif mb-2">
              Comprehensive Operations Suite
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>
              Engineered across 6 integrated functional epics to deliver unparalleled control, 
              guest satisfaction, and staff productivity.
            </p>
          </div>

          <div className="row g-4">
            {epics.map((epic, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div 
                      className="p-3 rounded-3" 
                      style={{ background: 'rgba(229, 185, 95, 0.1)', border: '1px solid rgba(229, 185, 95, 0.2)' }}
                    >
                      {epic.icon}
                    </div>
                    <span className="badge bg-dark text-dim border border-secondary px-2 py-1" style={{ fontSize: '0.7rem' }}>
                      {epic.tag}
                    </span>
                  </div>
                  <h5 className="text-white font-serif mb-2">{epic.title}</h5>
                  <p className="text-secondary small flex-grow-1">{epic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action Ribbon */}
      <section className="py-5 mb-4">
        <div className="container">
          <div 
            className="p-5 rounded-4 text-center position-relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(22, 30, 49, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(229, 185, 95, 0.3)'
            }}
          >
            <h2 className="display-6 fw-bold text-white font-serif mb-3">
              Experience the Future of Hospitality Today
            </h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Explore luxury room collections, simulate live guest check-ins, inspect revenue dashboards, 
              and dispatch staff housekeeping tasks with HotelPro.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                onClick={() => navigate('/rooms')}
                className="btn btn-gold px-4 py-2 d-flex align-items-center gap-2"
              >
                <span>Browse Rooms & Suites</span>
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline-gold px-4 py-2"
              >
                Open Executive Analytics
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
