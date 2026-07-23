import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';

interface AuthContextValue {
  session: Session | null;
  approved: boolean;
  loadingAuth: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  redeemInvite: (code: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshApproval: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  approved: false,
  loadingAuth: true,
  signUp: async () => {},
  signIn: async () => {},
  redeemInvite: async () => false,
  signOut: async () => {},
  refreshApproval: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [approved, setApproved] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadApproval = async (s: Session | null) => {
    if (!s) { setApproved(false); return; }
    const { data } = await supabase
      .from('profiles')
      .select('approved')
      .eq('id', s.user.id)
      .maybeSingle();
    setApproved(!!data?.approved);
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadApproval(data.session);
      setLoadingAuth(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      await loadApproval(s);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  };

  const redeemInvite = async (code: string) => {
    const { data, error } = await supabase.rpc('redeem_invite_code', { p_code: code.trim() });
    if (error) throw error;
    const ok = data === true;
    if (ok) setApproved(true);
    return ok;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setApproved(false);
  };

  const refreshApproval = async () => { await loadApproval(session); };

  return (
    <AuthContext.Provider value={{ session, approved, loadingAuth, signUp, signIn, redeemInvite, signOut, refreshApproval }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
