import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { generateEncryptionMetadata, simulateEncrypt, simulateDecrypt } from '../lib/crypto-sim';
import type { ChatMessage, ChatRoom, RoomMember, Profile } from '../lib/types';

export function useChat(roomId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const decryptMessage = useCallback((msg: ChatMessage): ChatMessage => ({
    ...msg,
    content: simulateDecrypt(msg.content),
  }), []);

  useEffect(() => {
    if (!roomId || !userId) return;

    setLoading(true);
    supabase
      .from('chat_messages')
      .select('*, sender:profiles!chat_messages_sender_id_fkey(*)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (data) {
          setMessages(data.map(decryptMessage));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', (payload.new as ChatMessage).sender_id)
            .maybeSingle();

          const newMsg = decryptMessage({
            ...(payload.new as ChatMessage),
            sender: sender as Profile,
          });
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userId, decryptMessage]);

  const sendMessage = async (content: string) => {
    if (!roomId || !userId || !content.trim()) return;

    const encrypted = simulateEncrypt(content.trim());
    const metadata = generateEncryptionMetadata();

    await supabase.from('chat_messages').insert({
      room_id: roomId,
      sender_id: userId,
      content: encrypted,
      encryption_metadata: metadata,
    });

    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: 'message_encrypted',
      details: {
        room_id: roomId,
        algorithm: metadata.algorithm,
        kem: metadata.kem,
      },
      severity: 'info',
    });
  };

  return { messages, loading, sendMessage };
}

export function useRooms(userId: string | null) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRooms(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (name: string, description: string, encryptionType: string) => {
    if (!userId) return null;

    const { data: room, error } = await supabase
      .from('chat_rooms')
      .insert({
        name,
        description,
        encryption_type: encryptionType,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('room_members').insert({
      room_id: room.id,
      user_id: userId,
      role: 'admin',
    });

    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: 'room_created',
      details: {
        room_id: room.id,
        encryption_type: encryptionType,
      },
      severity: 'info',
    });

    await fetchRooms();
    return room;
  };

  return { rooms, loading, createRoom, refreshRooms: fetchRooms };
}

export function useRoomMembers(roomId: string | null) {
  const [members, setMembers] = useState<RoomMember[]>([]);

  useEffect(() => {
    if (!roomId) return;

    supabase
      .from('room_members')
      .select('*, profile:profiles!room_members_user_id_fkey(*)')
      .eq('room_id', roomId)
      .then(({ data }) => {
        if (data) setMembers(data);
      });
  }, [roomId]);

  return { members };
}
