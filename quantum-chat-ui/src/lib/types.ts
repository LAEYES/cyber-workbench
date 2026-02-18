export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_color: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  encryption_type: 'hybrid' | 'pqc' | 'ecc';
  created_by: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  encryption_metadata: EncryptionMetadata;
  created_at: string;
  sender?: Profile;
}

export interface EncryptionMetadata {
  algorithm?: string;
  kem?: string;
  key_fingerprint?: string;
  pfs?: boolean;
}

export interface RoomMember {
  room_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  details: Record<string, unknown>;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}
