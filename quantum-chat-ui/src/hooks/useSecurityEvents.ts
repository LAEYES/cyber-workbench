import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SecurityEvent } from '../lib/types';

export function useSecurityEvents(userId: string | null) {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setEvents(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const stats = {
    total: events.length,
    info: events.filter((e) => e.severity === 'info').length,
    warning: events.filter((e) => e.severity === 'warning').length,
    critical: events.filter((e) => e.severity === 'critical').length,
    keyExchanges: events.filter((e) => e.event_type === 'key_exchange').length,
    messagesEncrypted: events.filter((e) => e.event_type === 'message_encrypted').length,
    roomsCreated: events.filter((e) => e.event_type === 'room_created').length,
  };

  return { events, loading, stats, refreshEvents: fetchEvents };
}
