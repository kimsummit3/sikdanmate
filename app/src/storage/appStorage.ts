import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEvent, Constraint, EatingStyle, Goal, MealLog, RecommendationSet } from '../types/app';

const STORAGE_KEY = 'sikdanmate-app-state-v2';

export type PersistedAppState = {
  hasCompletedOnboarding: boolean;
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  mealLogs: MealLog[];
  eventLogs: AppEvent[];
  lastRecommendation: RecommendationSet | null;
};

export async function loadAppState(): Promise<PersistedAppState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PersistedAppState;
  } catch {
    return null;
  }
}

export async function saveAppState(state: PersistedAppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
