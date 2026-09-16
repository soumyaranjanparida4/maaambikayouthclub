import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Leadership } from './pages/Leadership';
import { Members } from './pages/Members';
import { Activities } from './pages/Activities';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberPhotoManager } from './pages/MemberPhotoManager';
import { getSettings } from './services/api';

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Layout Wrapper
const MainLayout = ({ children, settings }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar settings={settings} />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer settings={settings} />}
    </div>
  );
};

export function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout settings={settings}>
          <Routes>
            <Route path="/" element={<Home settings={settings} />} />
            <Route path="/about" element={<About settings={settings} />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/members" element={<Members />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact settings={settings} />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/members-photo"
              element={
                <ProtectedRoute>
                  <MemberPhotoManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/photos"
              element={
                <ProtectedRoute>
                  <MemberPhotoManager />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
