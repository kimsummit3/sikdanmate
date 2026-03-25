import { MealOption } from './app';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  CheckIn: undefined;
  Planner: undefined;
  Log: { meal: MealOption };
  History: undefined;
};

export type MainTabKey = 'home' | 'summary' | 'settings';
