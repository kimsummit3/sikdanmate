import { useMemo, useState } from 'react';
import { getMealOptions, getWeeklyStats } from '../data/options';
import {
  Constraint,
  EatingStyle,
  Goal,
  LogResult,
  MealOption,
  Screen,
  UserProfile,
} from '../types/app';

export function useAppState() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);

  const profile: UserProfile = { goal, eatingStyle, constraints };
  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);
  const weeklyStats = useMemo(() => getWeeklyStats(profile, selectedResult), [profile, selectedResult]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  const completeOnboarding = () => setScreen('home');
  const openSettings = () => setScreen('settings');
  const goHome = () => setScreen('home');
  const goSummary = () => setScreen('summary');
  const goOnboarding = () => setScreen('onboarding');

  const selectMeal = (meal: MealOption) => {
    setSelectedMeal(meal);
    setSelectedResult(null);
    setScreen('log');
  };

  return {
    state: {
      screen,
      goal,
      eatingStyle,
      constraints,
      selectedMeal,
      selectedResult,
      mealOptions,
      weeklyStats,
    },
    actions: {
      setGoal,
      setEatingStyle,
      setSelectedResult,
      toggleConstraint,
      completeOnboarding,
      openSettings,
      goHome,
      goSummary,
      goOnboarding,
      selectMeal,
      setScreen,
    },
  };
}
