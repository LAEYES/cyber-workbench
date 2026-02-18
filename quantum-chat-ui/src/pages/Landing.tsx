import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Zap,
  Network,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Layers,
  Cpu,
  Globe,
} from 'lucide-react';
import QuantumGrid from '../components/QuantumGrid';
import './Landing.css';

const features = [
  {
    icon: Shield,
    title: 'Post-Quantum Cryptography',
    description: 'CRYSTALS-Kyber lattice-based key encapsulation protects against quantum computing attacks.',
    badge: 'ML-KEM-1024',
  },
  {
    icon: KeyRound,
    title: 'Perfect Forward Secrecy',
    description: 'Ephemeral per-session keys ensure past communications stay secure even if long-term keys are compromised.',
    badge: 'PFS',
  },
  {
    icon: Layers,
    title: 'Hybrid Encryption',
    description: 'Combined ECC + PQC security layer provides defense-in-depth against both classical and quantum adversaries.',
    badge: 'X25519 + Kyber',
  },
  {
    icon: Zap,
    title: 'High Concurrency',
    description: 'Goroutine-per-client model enables thousands of simultaneous encrypted connections.',
    badge: 'Go Routines',
  },
  {
    icon: Network,
    title: 'Scalable Architecture',
    description: 'Horizontal scaling support with stateless session management and distributed key exchange.',
    badge: 'Distributed',
  },
  {
    icon: Cpu,
    title: 'AES-256-GCM',
    description: 'Military-grade symmetric encryption for message payloads with authenticated encryption.',
    badge: '256-bit',
  },
];

const stats = [
  { value: '256', label: 'Bit Symmetric Keys', suffix: '-bit' },
  { value: '1024', label: 'Lattice Dimension', suffix: '' },
  { value: '<1', label: 'Key Exchange Latency', suffix: 'ms' },
  { value: '100K', label: 'Concurrent Sessions', suffix: '+' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing__hero">
        <QuantumGrid />
        <div className="landing__hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="landing__hero-badge"
          >
            <ShieldCheck size={14} />
            Quantum-Resistant Encryption Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="landing__hero-title"
          >
            Secure messaging for the
            <span className="landing__hero-highlight"> post-quantum </span>
            era
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="landing__hero-subtitle"
          >
            High-performance chat infrastructure built with Go, protected by lattice-based
            cryptography. Resist quantum computing attacks while maintaining sub-millisecond
            key exchange latency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="landing__hero-actions"
          >
            <Link to="/auth" className="btn btn--primary" style={{ padding: '12px 28px', fontSize: 15 }}>
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn--secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
              <Globe size={16} />
              View Dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="landing__hero-code"
          >
            <div className="landing__code-header">
              <Lock size={12} />
              <span>Encryption Handshake</span>
            </div>
            <pre className="landing__code-block">
{`kem     := kyber.NewKEM1024()
pk, sk  := kem.KeyGen()
ct, ss  := kem.Encapsulate(pk)
key     := hkdf(ss, "aes-256-gcm")
cipher  := aes.NewGCM(key)`}
            </pre>
          </motion.div>
        </div>
      </section>

      <section className="landing__stats">
        <div className="landing__stats-grid">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="landing__stat"
            >
              <div className="landing__stat-value">
                {stat.value}
                <span className="landing__stat-suffix">{stat.suffix}</span>
              </div>
              <div className="landing__stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="landing__features">
        <div className="landing__section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="landing__section-title"
          >
            Built for Security
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="landing__section-subtitle"
          >
            Every layer engineered to withstand both classical and quantum-era threats
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="landing__features-grid"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item} className="landing__feature">
              <div className="landing__feature-icon">
                <feature.icon size={20} />
              </div>
              <div className="landing__feature-content">
                <div className="landing__feature-header">
                  <h3>{feature.title}</h3>
                  <span className="badge badge--cyan">{feature.badge}</span>
                </div>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="landing__architecture">
        <div className="landing__section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="landing__section-title"
          >
            Architecture
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="landing__arch-diagram"
        >
          <div className="landing__arch-row">
            <div className="landing__arch-box landing__arch-box--client">
              <Lock size={16} />
              <span>Client</span>
              <small>X25519 + ML-KEM</small>
            </div>
            <div className="landing__arch-arrow">
              <RefreshCw size={14} />
            </div>
            <div className="landing__arch-box landing__arch-box--server">
              <Cpu size={16} />
              <span>Go Server</span>
              <small>Goroutine Pool</small>
            </div>
          </div>
          <div className="landing__arch-row">
            <div className="landing__arch-box landing__arch-box--kem">
              <KeyRound size={16} />
              <span>KEM Layer</span>
              <small>Kyber-1024</small>
            </div>
            <div className="landing__arch-arrow">
              <ArrowRight size={14} />
            </div>
            <div className="landing__arch-box landing__arch-box--aes">
              <Shield size={16} />
              <span>AES-256-GCM</span>
              <small>Symmetric</small>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="landing__footer">
        <div className="landing__footer-content">
          <div className="landing__footer-brand">
            <ShieldCheck size={18} />
            <span>Quantum-Secure Chat</span>
          </div>
          <p>Educational security research project. Not for production use.</p>
        </div>
      </footer>
    </div>
  );
}
