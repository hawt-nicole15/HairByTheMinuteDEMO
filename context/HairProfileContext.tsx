import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HairProfileData,
  HairProfileContextType,
  UserAnswers,
  AccountInfo,
} from '@/types';

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
  completeOnboarding: () => {},
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
  const [profile, setProfile] = useState<HairProfileData>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const updateProfile = (patch: Partial<HairProfileData>) => {
    const next = { ...profile, ...patch };
    persist(next);
    setProfile(next);
  };

  const setQuestionnaireAnswers = (answers: UserAnswers) =>
    updateProfile({ questionnaireAnswers: answers });

  const setHairGoals = (goals: string[]) =>
    updateProfile({ hairGoals: goals });

  const completeOnboarding = (accountInfo: AccountInfo) =>
    updateProfile({ isOnboarded: true, accountInfo });

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

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  porosity: {
    high_porosity: 'High porosity (absorbs quickly)',
    medium_porosity: 'Medium porosity',
    low_porosity: 'Low porosity (products sit on top)',
  },
  elasticity: {
    low_elasticity: 'Low elasticity (snaps immediately)',
    good_elasticity: 'Good elasticity (stretches and bounces back)',
    damaged_elasticity: 'Damaged elasticity (stretches but stays limp)',
  },
  thickness: {
    fine: 'Fine strands',
    medium: 'Medium strands',
    coarse: 'Coarse strands',
  },
  curl_pattern: {
    type_3: 'Type 3 — soft S-shaped coils',
    type_4ab: 'Type 4A/4B — tight Z-coils',
    type_4c: 'Type 4C — dense, minimal definition',
  },
  styling_goal: {
    wash_and_go: 'Defined wash-and-gos',
    twist_braid_out: 'Twist-outs or braid-outs',
    stretched: 'Stretched styles (blowouts, banding)',
    protective: 'Protective styles (braids, wigs, weaves)',
  },
  scalp: {
    dry_scalp: 'Dry and flaky scalp',
    oily_scalp: 'Oily scalp',
    balanced_scalp: 'Balanced scalp',
    sensitive_scalp: 'Sensitive/easily irritated scalp',
  },
};

const GOAL_LABELS: Record<string, string> = {
  moisture: 'Moisture & Hydration',
  growth: 'Healthy Growth',
  curl_definition: 'Curl Definition',
  protective_maintenance: 'Protective Style Maintenance',
  strength: 'Strength & Breakage Reduction',
  scalp_health: 'Scalp Health',
};

export function buildGeminiPrompt(profile: HairProfileData): string {
  const { questionnaireAnswers, hairGoals, accountInfo } = profile;

  const lines = [
    'USER HAIR PROFILE:',
    accountInfo ? `- Name: ${accountInfo.firstName} ${accountInfo.lastName}` : null,
    `- Porosity: ${ANSWER_LABELS.porosity[questionnaireAnswers.porosity] ?? 'Not answered'}`,
    `- Elasticity: ${ANSWER_LABELS.elasticity[questionnaireAnswers.elasticity] ?? 'Not answered'}`,
    `- Strand thickness: ${ANSWER_LABELS.thickness[questionnaireAnswers.thickness] ?? 'Not answered'}`,
    `- Curl pattern: ${ANSWER_LABELS.curl_pattern[questionnaireAnswers.curl_pattern] ?? 'Not answered'}`,
    `- Preferred style: ${ANSWER_LABELS.styling_goal[questionnaireAnswers.styling_goal] ?? 'Not answered'}`,
    `- Scalp type: ${ANSWER_LABELS.scalp[questionnaireAnswers.scalp] ?? 'Not answered'}`,
    `- Hair goals: ${hairGoals.map((g) => GOAL_LABELS[g] ?? g).join(', ') || 'None selected'}`,
  ].filter((l): l is string => l !== null);

  return lines.join('\n');
}
