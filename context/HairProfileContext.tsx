import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HairProfileData,
  HairProfileContextType,
  UserAnswers,
  AccountInfo,
} from '@/types';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'hbtm_hair_profile';

const defaultProfile: HairProfileData = {
  questionnaireAnswers: {},
  hairGoals: [],
  isOnboarded: false,
};

const HairProfileContext = createContext<HairProfileContextType>({
  profile: defaultProfile,
  isLoaded: false,
  setQuestionnaireAnswers: () => {},
  setHairGoals: () => {},
  completeOnboarding: async () => {},
  clearProfile: async () => {},
});

async function persist(data: HairProfileData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — fail silently
  }
}

export function HairProfileProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [profile, setProfile] = useState<HairProfileData>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Local cache load — allows the onboarding questionnaire to work before an
  // account exists (pre-auth), and gives an offline snapshot afterwards.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {
        // use default
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // When a session appears (login on this or another device), hydrate the
  // authoritative profile from the database.
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, questionnaire_answers, hair_goals, is_onboarded')
        .eq('id', session.user.id)
        .maybeSingle();
      if (data && data.is_onboarded) {
        const hydrated: HairProfileData = {
          questionnaireAnswers: (data.questionnaire_answers as UserAnswers) ?? {},
          hairGoals: (data.hair_goals as string[]) ?? [],
          isOnboarded: true,
          accountInfo: {
            firstName: data.first_name ?? '',
            lastName: data.last_name ?? '',
            email: data.email ?? '',
          },
        };
        setProfile(hydrated);
        persist(hydrated);
      }
    })();
  }, [session?.user.id]);

  // Writes the profile to Postgres when a user is authenticated. Reads the
  // session fresh from the Supabase client (not React state) so it works even
  // immediately after signUp, before onAuthStateChange has propagated.
  const persistToDb = async (data: HairProfileData) => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return; // pre-auth onboarding — local cache only
    await supabase
      .from('profiles')
      .update({
        first_name: data.accountInfo?.firstName ?? null,
        last_name: data.accountInfo?.lastName ?? null,
        questionnaire_answers: data.questionnaireAnswers,
        hair_goals: data.hairGoals,
        is_onboarded: data.isOnboarded,
        updated_at: new Date().toISOString(),
      })
      .eq('id', s.user.id);
  };

  const updateLocal = (patch: Partial<HairProfileData>): HairProfileData => {
    const next = { ...profile, ...patch };
    persist(next);
    setProfile(next);
    return next;
  };

  const setQuestionnaireAnswers = (answers: UserAnswers) => {
    const next = updateLocal({ questionnaireAnswers: answers });
    void persistToDb(next);
  };

  const setHairGoals = (goals: string[]) => {
    const next = updateLocal({ hairGoals: goals });
    void persistToDb(next);
  };

  // Called at the end of signup — writes the full profile to the database.
  const completeOnboarding = async (accountInfo: AccountInfo) => {
    const next = updateLocal({ isOnboarded: true, accountInfo });
    await persistToDb(next);
  };

  const clearProfile = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
  };

  return (
    <HairProfileContext.Provider
      value={{ profile, isLoaded, setQuestionnaireAnswers, setHairGoals, completeOnboarding, clearProfile }}
    >
      {children}
    </HairProfileContext.Provider>
  );
}

export function useHairProfile() {
  return useContext(HairProfileContext);
}
