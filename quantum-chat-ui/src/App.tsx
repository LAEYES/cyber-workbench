import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import './App.css';

function Header() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  if (location.pathname === '/' || location.pathname === '/auth') return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <ShieldCheck size={20} />
        Q-Secure Chat
      </Link>

      <nav className="app-header__nav">
        <Link
          to="/chat"
          className={`app-header__link ${isActive('/chat') ? 'app-header__link--active' : ''}`}
        >
          <MessageSquare size={15} />
          Chat
        </Link>
        <Link
          to="/dashboard"
          className={`app-header__link ${isActive('/dashboard') ? 'app-header__link--active' : ''}`}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </Link>
      </nav>

      <div className="app-header__actions">
        {user && profile && (
          <>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {profile.username}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={signOut}>
              <LogOut size={14} />
            </button>
          </>
        )}
        {!user && (
          <Link to="/auth" className="btn btn--primary btn--sm">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        color: 'var(--color-text-muted)',
      }}>
        Establishing secure session...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
