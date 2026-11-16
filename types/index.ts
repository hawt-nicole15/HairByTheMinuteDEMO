export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  value: string;
}

export interface Question {
  id: string;
  stepNumber: number;
  category: string;
  title: string;
  question: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface UserAnswers {
  [questionId: string]: string;
}

export interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export interface HairProfileData {
  questionnaireAnswers: UserAnswers;
  hairGoals: string[];
  isOnboarded: boolean;
  accountInfo?: AccountInfo;
}

export interface HairProfileContextType {
  profile: HairProfileData;
  isLoaded: boolean;
  setQuestionnaireAnswers: (answers: UserAnswers) => void;
  setHairGoals: (goals: string[]) => void;
  completeOnboarding: (accountInfo: AccountInfo) => Promise<void>;
  clearProfile: () => Promise<void>;
}

export interface RoutineStep {
  name: string;
  description: string;
  tip: string;
}

export interface WeeklyTreatment {
  name: string;
  description: string;
  frequency: string;
}

export interface ProductRecommendation {
  type: string;
  suggestions: string[];
  why: string;
}

export interface WashSchedule {
  lastWashDate: string; // YYYY-MM-DD
  frequencyDays: number; // 5 | 7 | 10 | 14
}

export interface GoalCheckIn {
  date: string; // YYYY-MM-DD
  ratings: Record<string, -1 | 0 | 1>; // -1 worse, 0 same, 1 better
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedSteps: string[];
  completedTreatments: string[];
  washedToday: boolean;
}

export interface TreatmentEntry {
  date: string; // YYYY-MM-DD
  names: string[];
}

export interface HairRoutine {
  washDayFrequency: string;
  washDaySteps: RoutineStep[];
  dailySteps: RoutineStep[];
  weeklyTreatments: WeeklyTreatment[];
  productRecommendations: ProductRecommendation[];
  tips: string[];
}
