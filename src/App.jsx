import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core Pages
import LandingPage    from './pages/LandingPage';
import HomePage       from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import BookingPage    from './pages/BookingPage';
import MapPage        from './pages/MapPage';
import DashboardPage  from './pages/DashboardPage';

// ── Route Guards ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();
  if (authLoading) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, authLoading } = useApp();
  if (authLoading) return <AuthLoadingScreen />;
  if (user) return <Navigate to={user.role === 'Shopkeeper' ? '/dashboard' : '/home'} replace />;
  return children;
}

// ── Full-page loading screen while Firebase resolves auth state ───────────
function AuthLoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#faf8f5', gap: 16,
    }}>
      {/* Animated logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#8B1A2F', fontWeight: 900, fontSize: '2rem', letterSpacing: '0.15em' }}>
          DRIP<span style={{ color: '#1a1614' }}>X</span>
        </span>
      </div>

      {/* Spinner */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid #e8e2dc',
        borderTopColor: '#8B1A2F',
        animation: 'spin 0.8s linear infinite',
      }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p style={{ color: '#8c7e76', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Authenticating…
      </p>
    </div>
  );
}

// ── Main App Shell ────────────────────────────────────────────────────────
function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#faf8f5' }}>
      <Navbar />

      <main style={{ flexGrow: 1, paddingBottom: 64 }} className="md:pb-0">
        <Routes>
          <Route path="/" element={
            <PublicRoute><LandingPage /></PublicRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <ProtectedRoute><BookingPage /></ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute><MapPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
