import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Activity,
  KeyRound,
  AlertTriangle,
  MessageSquare,
  Users,
  Hash,
  CheckCircle2,
  Clock,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { SecurityEvent } from '../lib/types';
import { useSecurityEvents } from '../hooks/useSecurityEvents';
import { useRooms } from '../hooks/useChat';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: typeof Shield;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="dash-stat"
      style={{ '--stat-color': color } as React.CSSProperties}
    >
      <div className="dash-stat__icon">
        <Icon size={18} />
      </div>
      <div className="dash-stat__info">
        <div className="dash-stat__value">{value}</div>
        <div className="dash-stat__label">{label}</div>
      </div>
    </motion.div>
  );
}

function EventRow({ event }: { event: SecurityEvent }) {
  const iconMap: Record<string, typeof Shield> = {
    message_encrypted: Lock,
    key_exchange: KeyRound,
    room_created: Hash,
    session_start: Activity,
  };
  const Icon = iconMap[event.event_type] || Shield;

  const severityClass = event.severity === 'critical' ? 'badge--error' : event.severity === 'warning' ? 'badge--warning' : 'badge--info';

  return (
    <div className="dash-event">
      <div className={`dash-event__icon dash-event__icon--${event.severity}`}>
        <Icon size={14} />
      </div>
      <div className="dash-event__body">
        <div className="dash-event__type">{event.event_type.replace(/_/g, ' ')}</div>
        {'algorithm' in event.details && (
          <div className="dash-event__detail">
            <Fingerprint size={10} />
            {String(event.details.algorithm)}
          </div>
        )}
      </div>
      <span className={`badge ${severityClass}`}>{event.severity}</span>
      <div className="dash-event__time">
        <Clock size={10} />
        {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { events, stats } = useSecurityEvents(user?.id ?? null);
  const { rooms } = useRooms(user?.id ?? null);

  if (!user) {
    return (
      <div className="chat-empty-state">
        <Lock size={32} />
        <h2>Authentication Required</h2>
        <p>Sign in to view your security dashboard</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>Security Dashboard</h1>
          <p>Monitor your quantum-secure communication infrastructure</p>
        </div>
        <div className="dashboard__status">
          <CheckCircle2 size={14} />
          <span>All systems operational</span>
        </div>
      </div>

      <div className="dash-stats-grid">
        <StatCard icon={Lock} label="Messages Encrypted" value={stats.messagesEncrypted} color="var(--color-accent)" delay={0} />
        <StatCard icon={Hash} label="Secure Rooms" value={rooms.length} color="var(--color-success)" delay={0.05} />
        <StatCard icon={KeyRound} label="Key Exchanges" value={stats.keyExchanges} color="var(--color-cyan)" delay={0.1} />
        <StatCard icon={Activity} label="Security Events" value={stats.total} color="var(--color-warning)" delay={0.15} />
        <StatCard icon={AlertTriangle} label="Warnings" value={stats.warning} color="var(--color-warning)" delay={0.2} />
        <StatCard icon={Shield} label="Critical Alerts" value={stats.critical} color="var(--color-error)" delay={0.25} />
      </div>

      <div className="dashboard__panels">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="dash-panel"
        >
          <div className="dash-panel__header">
            <h3>
              <Activity size={16} />
              Security Event Log
            </h3>
            <span className="badge badge--info">{events.length} events</span>
          </div>
          <div className="dash-panel__body">
            {events.length === 0 ? (
              <div className="dash-panel__empty">
                <Shield size={20} />
                <span>No security events yet</span>
              </div>
            ) : (
              <div className="dash-events-list">
                {events.slice(0, 20).map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="dash-panel"
        >
          <div className="dash-panel__header">
            <h3>
              <MessageSquare size={16} />
              Active Rooms
            </h3>
            <span className="badge badge--success">{rooms.length} rooms</span>
          </div>
          <div className="dash-panel__body">
            {rooms.length === 0 ? (
              <div className="dash-panel__empty">
                <Hash size={20} />
                <span>No rooms created yet</span>
              </div>
            ) : (
              <div className="dash-rooms-list">
                {rooms.map((room) => (
                  <div key={room.id} className="dash-room">
                    <div className="dash-room__info">
                      <Hash size={14} />
                      <span>{room.name}</span>
                    </div>
                    <div className="dash-room__meta">
                      <span className="badge badge--cyan">{room.encryption_type.toUpperCase()}</span>
                      <span className="dash-room__date">
                        {new Date(room.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dash-panel"
        >
          <div className="dash-panel__header">
            <h3>
              <Shield size={16} />
              Encryption Status
            </h3>
          </div>
          <div className="dash-panel__body">
            <div className="dash-enc-status">
              <div className="dash-enc-row">
                <div className="dash-enc-label">
                  <Lock size={14} />
                  Post-Quantum KEM
                </div>
                <span className="badge badge--success">Active</span>
              </div>
              <div className="dash-enc-row">
                <div className="dash-enc-label">
                  <KeyRound size={14} />
                  Perfect Forward Secrecy
                </div>
                <span className="badge badge--success">Enabled</span>
              </div>
              <div className="dash-enc-row">
                <div className="dash-enc-label">
                  <Shield size={14} />
                  Hybrid Mode (ECC + PQC)
                </div>
                <span className="badge badge--success">Active</span>
              </div>
              <div className="dash-enc-row">
                <div className="dash-enc-label">
                  <Fingerprint size={14} />
                  Key Algorithm
                </div>
                <span className="dash-enc-value">CRYSTALS-Kyber-1024</span>
              </div>
              <div className="dash-enc-row">
                <div className="dash-enc-label">
                  <Users size={14} />
                  Symmetric Cipher
                </div>
                <span className="dash-enc-value">AES-256-GCM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
