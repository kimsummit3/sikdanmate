import { useMemo, useState } from 'react';
import { getMealOptions, getWeeklyStats } from '../data/options';
import { Constraint, EatingStyle, Goal, LogResult, UserProfile } from '../types/app';

export function useProfileState() {
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);

  const profile: UserProfile = { goal, eatingStyle, constraints };
  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);
  const weeklyStats = useMemo(() => getWeeklyStats(profile, selectedResult), [profile, selectedResult]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  return {
    profile,
    goal,
    eatingStyle,
    constraints,
    selectedResult,
    mealOptions,
    weeklyStats,
    actions: {
      setGoal,
      setEatingStyle,
      toggleConstraint,
      setSelectedResult,
    },
  };
}
