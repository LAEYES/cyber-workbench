import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  Hash,
  Shield,
  Users,
  Lock,
  X,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat, useRooms, useRoomMembers } from '../hooks/useChat';
import Avatar from '../components/Avatar';
import EncryptionBadge from '../components/EncryptionBadge';
import type { ChatRoom } from '../lib/types';
import './Chat.css';

function CreateRoomModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, desc: string, enc: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [encryption, setEncryption] = useState('hybrid');

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="chat-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-modal__header">
          <h3>Create Secure Room</h3>
          <button className="btn btn--ghost btn--sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="chat-modal__body">
          <div className="auth__field">
            <label>Room Name</label>
            <input
              className="input"
              placeholder="general-secure"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="auth__field">
            <label>Description</label>
            <input
              className="input"
              placeholder="Post-quantum encrypted channel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="auth__field">
            <label>Encryption</label>
            <div className="chat-enc-options">
              {[
                { value: 'hybrid', label: 'Hybrid (ECC + PQC)', desc: 'Maximum compatibility' },
                { value: 'pqc', label: 'PQC Only', desc: 'Lattice-based only' },
                { value: 'ecc', label: 'ECC Only', desc: 'Traditional security' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`chat-enc-option ${encryption === opt.value ? 'chat-enc-option--active' : ''}`}
                  onClick={() => setEncryption(opt.value)}
                  type="button"
                >
                  <Shield size={14} />
                  <div>
                    <div>{opt.label}</div>
                    <small>{opt.desc}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="chat-modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            onClick={() => { if (name.trim()) onCreate(name.trim(), description.trim(), encryption); }}
            disabled={!name.trim()}
          >
            <Lock size={14} />
            Create Room
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function RoomSidebar({ rooms, activeRoom, onSelect, onCreateClick }: {
  rooms: ChatRoom[];
  activeRoom: string | null;
  onSelect: (id: string) => void;
  onCreateClick: () => void;
}) {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar__header">
        <h3>
          <MessageSquare size={16} />
          Channels
        </h3>
        <button className="btn btn--ghost btn--sm" onClick={onCreateClick}>
          <Plus size={16} />
        </button>
      </div>
      <div className="chat-sidebar__rooms">
        {rooms.length === 0 && (
          <div className="chat-sidebar__empty">
            No rooms yet. Create one to start chatting.
          </div>
        )}
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`chat-sidebar__room ${activeRoom === room.id ? 'chat-sidebar__room--active' : ''}`}
            onClick={() => onSelect(room.id)}
          >
            <Hash size={14} />
            <div className="chat-sidebar__room-info">
              <span>{room.name}</span>
              <small>
                <Lock size={10} />
                {room.encryption_type.toUpperCase()}
              </small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageArea({ roomId, userId }: { roomId: string; userId: string }) {
  const { messages, loading, sendMessage } = useChat(roomId, userId);
  const { members } = useRoomMembers(roomId);
  const [input, setInput] = useState('');
  const [showMeta, setShowMeta] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="chat-messages">
      <div className="chat-messages__header">
        <div className="chat-messages__title">
          <Shield size={16} />
          <span>Encrypted Channel</span>
          <span className="badge badge--success">PQC Active</span>
        </div>
        <div className="chat-messages__members">
          <Users size={14} />
          <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="chat-messages__list">
        {loading && (
          <div className="chat-messages__loading">Loading encrypted messages...</div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === userId;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`chat-msg ${isOwn ? 'chat-msg--own' : ''}`}
            >
              {!isOwn && msg.sender && (
                <Avatar
                  name={msg.sender.display_name || msg.sender.username}
                  color={msg.sender.avatar_color}
                  size={28}
                />
              )}
              <div className="chat-msg__body">
                {!isOwn && msg.sender && (
                  <div className="chat-msg__sender">
                    {msg.sender.display_name || msg.sender.username}
                  </div>
                )}
                <div className="chat-msg__bubble">
                  <p>{msg.content}</p>
                  <button
                    className="chat-msg__lock"
                    onClick={() => setShowMeta(showMeta === msg.id ? null : msg.id)}
                    title="View encryption details"
                  >
                    <Lock size={10} />
                  </button>
                </div>
                <AnimatePresence>
                  {showMeta === msg.id && msg.encryption_metadata?.algorithm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <EncryptionBadge metadata={msg.encryption_metadata} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="chat-msg__time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-messages__input" onSubmit={handleSend}>
        <input
          className="input"
          placeholder="Type an encrypted message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function Chat() {
  const { user, profile } = useAuth();
  const { rooms, createRoom } = useRooms(user?.id ?? null);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = async (name: string, desc: string, enc: string) => {
    const room = await createRoom(name, desc, enc);
    if (room) {
      setActiveRoom(room.id);
      setShowCreate(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="chat-empty-state">
        <Lock size={32} />
        <h2>Authentication Required</h2>
        <p>Sign in to access encrypted channels</p>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      <RoomSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onSelect={setActiveRoom}
        onCreateClick={() => setShowCreate(true)}
      />
      <div className="chat-content">
        {activeRoom ? (
          <MessageArea roomId={activeRoom} userId={user.id} />
        ) : (
          <div className="chat-empty-state">
            <Shield size={32} />
            <h2>Select a Channel</h2>
            <p>Choose an encrypted channel or create a new one</p>
            <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              Create Room
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateRoomModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
