import { useEffect, useMemo, useState } from 'react';
import { createMealLog, getMealOptions, getWeeklyStats } from '../data/options';
import { loadAppState, saveAppState } from '../storage/appStorage';
import {
  BudgetLevel,
  CheckInPlace,
  CheckInState,
  Constraint,
  EatingStyle,
  Goal,
  HungerLevel,
  LogResult,
  MealLog,
  MealOption,
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

const initialCheckIn: CheckInState = {
  place: '밖',
  hunger: '보통',
  budget: '보통',
  craving: '한식',
};

export function useProfileState() {
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(initialLogs);
  const [hydrated, setHydrated] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckInState>(initialCheckIn);

  useEffect(() => {
    (async () => {
      const saved = await loadAppState();
      if (saved) {
        setGoal(saved.goal);
        setEatingStyle(saved.eatingStyle);
        setConstraints(saved.constraints);
        setMealLogs(saved.mealLogs.length > 0 ? saved.mealLogs : initialLogs);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveAppState({ goal, eatingStyle, constraints, mealLogs });
  }, [goal, eatingStyle, constraints, mealLogs, hydrated]);

  const profile: UserProfile = { goal, eatingStyle, constraints };
  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);
  const weeklyStats = useMemo(() => getWeeklyStats(profile, mealLogs), [profile, mealLogs]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  const saveMealLogEntry = (meal: MealOption | null, result: LogResult | null) => {
    if (!meal || !result) return false;
    const log = createMealLog(meal.title, result);
    setMealLogs((prev) => [log, ...prev].slice(0, 20));
    return true;
  };

  const updateCheckIn = {
    setPlace: (place: CheckInPlace) => setCheckIn((prev) => ({ ...prev, place })),
    setHunger: (hunger: HungerLevel) => setCheckIn((prev) => ({ ...prev, hunger })),
    setBudget: (budget: BudgetLevel) => setCheckIn((prev) => ({ ...prev, budget })),
    setCraving: (craving: string) => setCheckIn((prev) => ({ ...prev, craving })),
  };

  return {
    profile,
    goal,
    eatingStyle,
    constraints,
    selectedResult,
    mealOptions,
    weeklyStats,
    mealLogs,
    hydrated,
    checkIn,
    actions: {
      setGoal,
      setEatingStyle,
      toggleConstraint,
      setSelectedResult,
      saveMealLog: saveMealLogEntry,
      ...updateCheckIn,
    },
  };
}
