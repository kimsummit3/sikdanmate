import { LogResult, MealOption } from './app';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Log: { meal: MealOption };
};

export type MainTabKey = 'home' | 'summary' | 'settings';

export type AppSessionState = {
  selectedMeal: MealOption | null;
  selectedResult: LogResult | null;
};
