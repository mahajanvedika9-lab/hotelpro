import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, KeyRound, ShieldAlert } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest',
    phone: '',
    adminSecretKey: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.phone,
        formData.adminSecretKey
      );
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickLogin = (role) => {
    switchDemoRole(role);
    onClose();
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div 
        className="modal-content-glass p-4 p-md-5 position-relative w-100" 
        style={{ maxWidth: '480px' }}
      >
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-glass position-absolute top-0 end-0 m-3 text-secondary"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-4">
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            HOTELPRO SECURITY & AUTH
          </span>
          <h3 className="text-white font-serif mb-1">
            {isRegister ? 'Create HotelPro Account' : 'Welcome to HotelPro'}
          </h3>
          <p className="text-secondary small">
            {isRegister 
              ? 'Access real-time reservations, invoices, and custom stays'
              : 'Sign in to access your hotel management suite'
            }
          </p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div 
          className="p-3 rounded-3 mb-4 text-center" 
          style={{ background: 'rgba(229, 185, 95, 0.08)', border: '1px dashed rgba(229, 185, 95, 0.3)' }}
        >
          <div className="text-gold small fw-bold mb-2">⚡ Instant One-Click Evaluation Demo:</div>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-sm btn-outline-gold px-2 py-1 small"
            >
              👑 Login as Admin
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('staff')}
              className="btn btn-sm btn-outline-gold px-2 py-1 small"
            >
              🛎️ Login as Staff
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('guest')}
              className="btn btn-sm btn-outline-gold px-2 py-1 small"
            >
              🧳 Login as Guest
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {isRegister && (
            <div>
              <label className="form-label text-secondary small mb-1">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <User size={16} />
                </span>
                <input 
                  type="text" 
                  className="form-control form-control-custom"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="form-label text-secondary small mb-1">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                className="form-control form-control-custom"
                placeholder="admin@hotelpro.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                className="form-control form-control-custom"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="form-label text-secondary small mb-1">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Phone size={16} />
                  </span>
                  <input 
                    type="tel" 
                    className="form-control form-control-custom"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-secondary small mb-1">Account Role</label>
                <select 
                  className="form-select form-select-custom"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="guest">Guest / Client</option>
                  <option value="staff">Operations & Housekeeping Staff</option>
                  <option value="admin">Hotel General Manager / Admin</option>
                </select>
              </div>

              {formData.role !== 'guest' && (
                <div>
                  <label className="form-label text-secondary small mb-1">Staff / Admin Passkey</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <KeyRound size={16} />
                    </span>
                    <input 
                      type="password" 
                      className="form-control form-control-custom"
                      placeholder="Enter HOTELPRO_ADMIN_2026"
                      value={formData.adminSecretKey}
                      onChange={(e) => setFormData({ ...formData, adminSecretKey: e.target.value })}
                    />
                  </div>
                  <small className="text-dim" style={{ fontSize: '0.7rem' }}>Default passkey: HOTELPRO_ADMIN_2026</small>
                </div>
              )}
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-gold w-100 py-2 mt-2"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In with JWT'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button"
            className="btn btn-link text-gold text-decoration-none small"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister 
              ? 'Already have an account? Sign in here' 
              : "Don't have an account? Register as guest or staff"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
