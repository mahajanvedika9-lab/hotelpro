import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  BedDouble, 
  CalendarCheck, 
  BarChart3, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserCheck 
} from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const { user, logout, switchDemoRole, isAdmin, isStaff } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg glass-navbar py-3">
      <div className="container-fluid px-lg-5">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div 
            className="d-flex align-items-center justify-content-center rounded-3 p-2"
            style={{ 
              background: 'linear-gradient(135deg, rgba(229, 185, 95, 0.25) 0%, rgba(229, 185, 95, 0.05) 100%)',
              border: '1px solid rgba(229, 185, 95, 0.4)'
            }}
          >
            <Building2 size={24} className="text-gold" />
          </div>
          <div>
            <span className="fs-4 fw-bold font-serif text-white tracking-wide">
              HOTEL<span className="text-gold">PRO</span>
            </span>
            <span className="badge bg-dark text-gold border border-warning-subtle ms-2 px-2 py-1" style={{ fontSize: '0.65rem' }}>
              v2.4 ENTERPRISE
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-secondary text-light" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#hotelproNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="hotelproNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-xl-2">
            <li className="nav-item">
              <Link 
                to="/rooms" 
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive('/rooms') ? 'text-gold fw-semibold' : 'text-light opacity-75'}`}
                style={isActive('/rooms') ? { background: 'rgba(229, 185, 95, 0.12)' } : {}}
              >
                <BedDouble size={18} />
                <span>Rooms & Suites</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/bookings" 
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive('/bookings') ? 'text-gold fw-semibold' : 'text-light opacity-75'}`}
                style={isActive('/bookings') ? { background: 'rgba(229, 185, 95, 0.12)' } : {}}
              >
                <CalendarCheck size={18} />
                <span>Reservations</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive('/dashboard') ? 'text-gold fw-semibold' : 'text-light opacity-75'}`}
                style={isActive('/dashboard') ? { background: 'rgba(229, 185, 95, 0.12)' } : {}}
              >
                <BarChart3 size={18} />
                <span>Executive Analytics</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/housekeeping" 
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive('/housekeeping') ? 'text-gold fw-semibold' : 'text-light opacity-75'}`}
                style={isActive('/housekeeping') ? { background: 'rgba(229, 185, 95, 0.12)' } : {}}
              >
                <Sparkles size={18} />
                <span>Housekeeping</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/guests" 
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive('/guests') ? 'text-gold fw-semibold' : 'text-light opacity-75'}`}
                style={isActive('/guests') ? { background: 'rgba(229, 185, 95, 0.12)' } : {}}
              >
                <Users size={18} />
                <span>Guest CRM</span>
              </Link>
            </li>
          </ul>

          {/* Right Controls: Role Switcher & User Profile */}
          <div className="d-flex align-items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div 
              className="d-none d-md-flex align-items-center p-1 rounded-pill"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              title="Test the system as different roles"
            >
              <button 
                onClick={() => switchDemoRole('guest')}
                className={`btn btn-sm rounded-pill px-3 py-1 ${user?.role === 'guest' ? 'btn-gold shadow-sm' : 'text-secondary border-0 bg-transparent'}`}
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                Guest
              </button>
              <button 
                onClick={() => switchDemoRole('staff')}
                className={`btn btn-sm rounded-pill px-3 py-1 ${user?.role === 'staff' ? 'btn-gold shadow-sm' : 'text-secondary border-0 bg-transparent'}`}
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                Staff
              </button>
              <button 
                onClick={() => switchDemoRole('admin')}
                className={`btn btn-sm rounded-pill px-3 py-1 ${user?.role === 'admin' ? 'btn-gold shadow-sm' : 'text-secondary border-0 bg-transparent'}`}
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                Admin
              </button>
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="dropdown position-relative">
                <button 
                  className="btn btn-glass d-flex align-items-center gap-2 px-3 py-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt={user.name} 
                    className="rounded-circle"
                    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                  />
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-white lh-1" style={{ fontSize: '0.82rem' }}>{user.name.split(' ')[0]}</div>
                    <small className="text-capitalize text-gold text-uppercase" style={{ fontSize: '0.65rem' }}>{user.role}</small>
                  </div>
                </button>

                {dropdownOpen && (
                  <div 
                    className="position-absolute end-0 mt-2 p-3 rounded-3 shadow-lg"
                    style={{ 
                      width: '240px', 
                      background: '#121828', 
                      border: '1px solid rgba(229, 185, 95, 0.3)',
                      zIndex: 1050 
                    }}
                  >
                    <div className="pb-2 border-bottom border-secondary mb-2">
                      <div className="fw-bold text-white">{user.name}</div>
                      <div className="text-secondary small">{user.email}</div>
                      <div className="badge bg-warning-subtle text-warning border border-warning mt-1 text-uppercase">
                        {user.role} Access
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <Link 
                        to="/bookings" 
                        className="btn btn-sm text-start text-light py-2 px-2 rounded-2 hover-bg"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserCheck size={16} className="me-2 text-gold" />
                        My Reservations
                      </Link>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="btn btn-sm text-start text-danger py-2 px-2 rounded-2 mt-1"
                      >
                        <LogOut size={16} className="me-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn btn-gold d-flex align-items-center gap-2"
              >
                <LogIn size={17} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
