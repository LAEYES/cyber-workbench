import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        (async () => {
          await fetchProfile(s.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
        avatar_color: color,
        status: 'online',
      });
      if (profileError) throw profileError;
    }
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await supabase
      .from('profiles')
      .update({ status: 'online', updated_at: new Date().toISOString() })
      .eq('id', data.user.id);

    return data;
  };

  const signOut = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ status: 'offline', updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }
    await supabase.auth.signOut();
  };

  return { user, profile, session, loading, signUp, signIn, signOut };
}
