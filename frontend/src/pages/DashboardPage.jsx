import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  BedDouble, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Building 
} from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
      setLoading(false);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-gold mb-3" role="status"></div>
        <div className="text-secondary">Synthesizing executive hospitality metrics...</div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const roomTypes = data?.roomTypes || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="container py-4 py-lg-5">
      {/* Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            EXECUTIVE DASHBOARD & METRICS
          </span>
          <h2 className="text-white font-serif mb-1">Operational Intelligence</h2>
          <p className="text-secondary small mb-0">
            Real-time occupancy performance, automated ADR computations, room distribution, and turnover health.
          </p>
        </div>

        <button 
          onClick={fetchAnalytics}
          className="btn btn-outline-gold btn-sm d-flex align-items-center gap-2 align-self-start align-self-md-auto"
        >
          <TrendingUp size={15} />
          <span>Refresh Live Metrics</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-4 mb-4">
        {/* Occupancy Rate */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-semibold">Occupancy Rate</span>
              <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                <BedDouble size={20} />
              </div>
            </div>
            <h2 className="display-6 font-serif fw-bold text-white mb-2">{stats.occupancyRate}%</h2>
            <div className="progress bg-dark" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-warning" 
                role="progressbar" 
                style={{ width: `${stats.occupancyRate}%` }}
              ></div>
            </div>
            <small className="text-secondary mt-2 d-block">
              {stats.bookedRooms} occupied of {stats.totalRooms} total rooms
            </small>
          </div>
        </div>

        {/* Total Gross Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-semibold">Gross Revenue</span>
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                <DollarSign size={20} />
              </div>
            </div>
            <h2 className="display-6 font-serif fw-bold text-gold mb-1">${stats.totalRevenue?.toLocaleString()}</h2>
            <div className="d-flex align-items-center gap-1 text-success small">
              <TrendingUp size={14} />
              <span>Paid & Verified Bookings</span>
            </div>
            <small className="text-secondary mt-2 d-block">
              ADR: ${stats.avgDailyRate} per booking
            </small>
          </div>
        </div>

        {/* Active In-House Guests */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-semibold">Active In-House</span>
              <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                <Users size={20} />
              </div>
            </div>
            <h2 className="display-6 font-serif fw-bold text-white mb-1">{stats.activeCheckIns}</h2>
            <div className="text-secondary small">
              Guests currently checked-in
            </div>
            <small className="text-secondary mt-2 d-block">
              Total lifetime bookings: {stats.totalBookings}
            </small>
          </div>
        </div>

        {/* Pending Operations Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-semibold">Housekeeping Backlog</span>
              <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                <Sparkles size={20} />
              </div>
            </div>
            <h2 className="display-6 font-serif fw-bold text-white mb-1">{stats.pendingTasks}</h2>
            <div className="text-secondary small">
              Cleaning & Maintenance queues
            </div>
            <small className="text-secondary mt-2 d-block">
              {stats.cleaningRooms} rooms undergoing sanitization
            </small>
          </div>
        </div>
      </div>

      {/* Middle Section: Room Type Breakdown & Room Inventory Status */}
      <div className="row g-4 mb-4">
        {/* Room Category Matrix */}
        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white font-serif mb-3">Room Inventory Distribution</h5>
            <div className="d-flex flex-column gap-3">
              {roomTypes.map((rt) => (
                <div key={rt._id}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-white fw-semibold">{rt._id} Category</span>
                    <span className="text-secondary">{rt.count} Rooms • Avg ${Math.round(rt.avgPrice)}/nt</span>
                  </div>
                  <div className="progress bg-dark" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${stats.totalRooms ? (rt.count / stats.totalRooms) * 100 : 0}%`,
                        background: 'linear-gradient(90deg, #e5b95f 0%, #38bdf8 100%)' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Breakdown Circle */}
        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <h5 className="text-white font-serif mb-3">Real-Time Floor Matrix</h5>
            <div className="row g-3 text-center my-auto">
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <h3 className="text-success font-serif fw-bold mb-0">{stats.availableRooms}</h3>
                  <small className="text-secondary">Available</small>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <h3 className="text-danger font-serif fw-bold mb-0">{stats.bookedRooms}</h3>
                  <small className="text-secondary">Occupied</small>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <h3 className="text-warning font-serif fw-bold mb-0">{stats.cleaningRooms}</h3>
                  <small className="text-secondary">Cleaning</small>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3" style={{ background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
                  <h3 className="text-light font-serif fw-bold mb-0">{stats.maintenanceRooms}</h3>
                  <small className="text-secondary">Maintenance</small>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-3 mt-3 text-secondary small" style={{ background: 'rgba(255,255,255,0.02)' }}>
              💡 System auto-marks rooms as <span className="text-warning">Cleaning</span> upon checkout, and restores them to <span className="text-success">Available</span> once housekeeping tasks are marked complete.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Activity */}
      <div className="glass-card p-4">
        <h5 className="text-white font-serif mb-3">Recent Reservation Activity</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr className="border-bottom border-secondary border-opacity-50 text-secondary small">
                <th>Reference</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in Date</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="border-bottom border-secondary border-opacity-25">
                  <td className="text-gold font-monospace">{b.bookingCode}</td>
                  <td className="text-white">{b.guestName}</td>
                  <td>#{b.room?.roomNumber} • {b.room?.name}</td>
                  <td className="text-secondary">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="text-white fw-bold">${b.totalAmount}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary px-2 py-1">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
