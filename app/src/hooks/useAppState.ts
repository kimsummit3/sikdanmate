import { useMemo, useState } from 'react';
import { createMealLog, getMealOptions, getWeeklyStats } from '../data/options';
import {
  Constraint,
  EatingStyle,
  Goal,
  LogResult,
  MealLog,
  MealOption,
  Screen,
  UserProfile,
} from '../types/app';

const initialLogs: MealLog[] = [
  {
    id: 'seed-1',
    mealTitle: '닭가슴살 샐러드 + 현미김밥 1줄',
    result: '잘 지켰어요',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'seed-2',
    mealTitle: '순두부찌개 + 밥 2/3 공기',
    result: '비슷해요',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function useAppState() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(initialLogs);

  const profile: UserProfile = { goal, eatingStyle, constraints };
  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);
  const weeklyStats = useMemo(() => getWeeklyStats(profile, mealLogs), [profile, mealLogs]);

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

  const saveMealLog = (meal: MealOption | null, result: LogResult | null) => {
    if (!meal || !result) return false;
    const log = createMealLog(meal.title, result);
    setMealLogs((prev) => [log, ...prev].slice(0, 20));
    return true;
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
      mealLogs,
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
      saveMealLog,
    },
  };
}
