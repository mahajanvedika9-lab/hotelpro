import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';
import DashboardPage from './pages/DashboardPage';
import HousekeepingPage from './pages/HousekeepingPage';
import GuestCRMPage from './pages/GuestCRMPage';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          {/* Main Top Navigation */}
          <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

          {/* Core Route Views */}
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/housekeeping" element={<HousekeepingPage />} />
              <Route path="/guests" element={<GuestCRMPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer className="mt-auto py-5 border-top border-secondary border-opacity-25 bg-black bg-opacity-60">
            <div className="container">
              <div className="row g-4 align-items-center">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Building2 size={20} className="text-gold" />
                    <span className="fs-5 fw-bold font-serif text-white">
                      HOTEL<span className="text-gold">PRO</span>
                    </span>
                  </div>
                  <p className="text-secondary small mb-3" style={{ maxWidth: '420px' }}>
                    Enterprise-grade hotel management solution streamlining reservations, 
                    guest profiles, housekeeping turnovers, and financial intelligence with 
                    end-to-end security and scalability.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {['React JSX', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Bootstrap 5', 'Asynchronous JS'].map((tech) => (
                      <span key={tech} className="badge bg-dark text-secondary border border-secondary border-opacity-50 px-2 py-1 small">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-12 col-md-6 text-md-end">
                  <div className="p-3 rounded-3 glass-card d-inline-block text-start mb-2">
                    <div className="d-flex align-items-center gap-2 text-gold small fw-bold mb-1">
                      <ShieldCheck size={16} />
                      <span>Project Epics: 6 / 6 Implemented • 19 Tasks Complete</span>
                    </div>
                    <small className="text-secondary d-block">
                      MERN Architecture (MongoDB, Express, React, Node.js)
                    </small>
                  </div>
                  <div className="text-secondary small mt-2">
                    © 2026 HotelPro Management Suite. Built with excellence.
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Authentication & Role Switcher Modal */}
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
