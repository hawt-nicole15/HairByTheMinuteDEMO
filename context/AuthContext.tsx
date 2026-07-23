import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { WAIVER_VERSION } from '@/constants/waiver';

interface AuthContextValue {
  session: Session | null;
  approved: boolean;
  waiverAccepted: boolean;
  loadingAuth: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  redeemInvite: (code: string) => Promise<boolean>;
  acceptWaiver: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  approved: false,
  waiverAccepted: false,
  loadingAuth: true,
  signUp: async () => {},
  signIn: async () => {},
  redeemInvite: async () => false,
  acceptWaiver: async () => {},
  signOut: async () => {},
  refreshStatus: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [approved, setApproved] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Load the gating status (approval + current-version waiver acceptance).
  const loadStatus = async (s: Session | null) => {
    if (!s) {
      setApproved(false);
      setWaiverAccepted(false);
      return;
    }
    const [profileRes, waiverRes] = await Promise.all([
      supabase.from('profiles').select('approved').eq('id', s.user.id).maybeSingle(),
      supabase
        .from('waiver_acceptances')
        .select('id')
        .eq('user_id', s.user.id)
        .eq('waiver_version', WAIVER_VERSION)
        .maybeSingle(),
    ]);
    setApproved(!!profileRes.data?.approved);
    setWaiverAccepted(!!waiverRes.data);
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadStatus(data.session);
      setLoadingAuth(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      await loadStatus(s);
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

  const acceptWaiver = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) throw new Error('not authenticated');
    const { error } = await supabase.from('waiver_acceptances').insert({
      user_id: s.user.id,
      waiver_version: WAIVER_VERSION,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
    // 23505 = unique/duplicate; treat an existing acceptance as success.
    if (error && error.code !== '23505') throw error;
    setWaiverAccepted(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setApproved(false);
    setWaiverAccepted(false);
  };

  const refreshStatus = async () => { await loadStatus(session); };

  return (
    <AuthContext.Provider
      value={{ session, approved, waiverAccepted, loadingAuth, signUp, signIn, redeemInvite, acceptWaiver, signOut, refreshStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
