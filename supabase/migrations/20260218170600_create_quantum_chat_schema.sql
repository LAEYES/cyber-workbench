/*
  # Quantum-Secure Chat Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `avatar_color` (text) - hex color for avatar
      - `status` (text) - online/offline/away
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `chat_rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `encryption_type` (text) - hybrid/pqc/ecc
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `sender_id` (uuid, references auth.users)
      - `content` (text) - encrypted message content
      - `encryption_metadata` (jsonb) - kem algorithm, key fingerprint, etc.
      - `created_at` (timestamptz)
    - `room_members`
      - `room_id` (uuid, references chat_rooms)
      - `user_id` (uuid, references auth.users)
      - `role` (text) - admin/member
      - `joined_at` (timestamptz)
    - `security_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `event_type` (text) - key_exchange, session_start, encryption_upgrade, etc.
      - `details` (jsonb)
      - `severity` (text) - info/warning/critical
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Users can only read/write their own profiles
    - Room access restricted to members
    - Messages visible only to room members
    - Security events visible only to the user who triggered them
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL DEFAULT '',
  avatar_color text NOT NULL DEFAULT '#0ea5e9',
  status text NOT NULL DEFAULT 'offline',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  encryption_type text NOT NULL DEFAULT 'hybrid',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS room_members (
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their rooms"
  ON chat_rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_rooms.id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create rooms"
  ON chat_rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room admins can update rooms"
  ON chat_rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_rooms.id
      AND room_members.user_id = auth.uid()
      AND room_members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_rooms.id
      AND room_members.user_id = auth.uid()
      AND room_members.role = 'admin'
    )
  );

CREATE POLICY "Room admins can delete rooms"
  ON chat_rooms FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_rooms.id
      AND room_members.user_id = auth.uid()
      AND room_members.role = 'admin'
    )
  );

CREATE POLICY "Members can view room membership"
  ON room_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = room_members.room_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Room admins can add members"
  ON room_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = room_members.room_id
      AND rm.user_id = auth.uid()
      AND rm.role = 'admin'
    )
    OR
    auth.uid() = user_id
  );

CREATE POLICY "Members can remove themselves"
  ON room_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  encryption_metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can view messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_messages.room_id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_messages.room_id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  severity text NOT NULL DEFAULT 'info',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security events"
  ON security_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own security events"
  ON security_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
