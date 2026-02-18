import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import QuantumGrid from '../components/QuantumGrid';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, username.trim());
      }
      navigate('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <QuantumGrid />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth__card"
      >
        <div className="auth__header">
          <div className="auth__logo">
            <ShieldCheck size={24} />
          </div>
          <h1>Quantum-Secure Chat</h1>
          <p>{mode === 'login' ? 'Sign in to your secure session' : 'Create your encrypted identity'}</p>
        </div>

        <div className="auth__tabs">
          <button
            className={`auth__tab ${mode === 'login' ? 'auth__tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth__tab ${mode === 'register' ? 'auth__tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth__form">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="auth__error"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="auth__field"
            >
              <label>Username</label>
              <div className="auth__input-wrap">
                <User size={16} />
                <input
                  type="text"
                  className="input"
                  placeholder="quantum_alice"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </motion.div>
          )}

          <div className="auth__field">
            <label>Email</label>
            <div className="auth__input-wrap">
              <Mail size={16} />
              <input
                type="email"
                className="input"
                placeholder="alice@quantum.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="auth__field">
            <label>Password</label>
            <div className="auth__input-wrap">
              <Lock size={16} />
              <input
                type="password"
                className="input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary auth__submit"
            disabled={loading}
          >
            {loading ? 'Establishing secure session...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth__footer">
          <Lock size={12} />
          <span>End-to-end encrypted with ML-KEM-1024</span>
        </div>
      </motion.div>
    </div>
  );
}
