import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constraint, EatingStyle, Goal, MealLog } from '../types/app';

const STORAGE_KEY = 'sikdanmate-app-state-v1';

export type PersistedAppState = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  mealLogs: MealLog[];
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
