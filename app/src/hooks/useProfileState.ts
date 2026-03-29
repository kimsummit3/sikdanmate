import { useEffect, useMemo, useState } from 'react';
import {
  createEvent,
  createMealLog,
  createRecommendationSet,
  generateShoppingList,
  generateWeeklyPlan,
  getCookingSteps,
  getWeeklyStats,
} from '../data/options';
import { loadAppState, saveAppState } from '../storage/appStorage';
import {
  AdjustmentMode,
  AppEvent,
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
  RecommendationSet,
  UserProfile,
  WeeklyPlanItem,
} from '../types/app';

const initialLogs: MealLog[] = [
  { id: 'seed-1', recommendationId: 'seed-rec-1', selectedOptionId: 'seed-opt-1', mealTitle: '닭가슴살 샐러드 + 현미김밥 1줄', result: '잘 지켰어요', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: 'seed-2', recommendationId: 'seed-rec-2', selectedOptionId: 'seed-opt-2', mealTitle: '순두부찌개 + 밥 2/3 공기', result: '비슷해요', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const initialCheckIn: CheckInState = {
  place: '밖',
  hunger: '보통',
  budget: '보통',
  craving: '한식',
  adjustmentMode: '기본',
};

export function useProfileState() {
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(initialLogs);
  const [eventLogs, setEventLogs] = useState<AppEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckInState>(initialCheckIn);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanItem[]>([]);
  const [currentCookingStep, setCurrentCookingStep] = useState(0);
  const [recommendation, setRecommendation] = useState<RecommendationSet | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadAppState();
      if (saved) {
        setGoal(saved.goal);
        setEatingStyle(saved.eatingStyle);
        setConstraints(saved.constraints);
        setMealLogs(saved.mealLogs.length > 0 ? saved.mealLogs : initialLogs);
        setEventLogs(saved.eventLogs ?? []);
        setRecommendation(saved.lastRecommendation ?? null);
        setHasCompletedOnboarding(saved.hasCompletedOnboarding ?? false);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveAppState({
      hasCompletedOnboarding,
      goal,
      eatingStyle,
      constraints,
      mealLogs,
      eventLogs,
      lastRecommendation: recommendation,
    });
  }, [goal, eatingStyle, constraints, mealLogs, eventLogs, recommendation, hydrated, hasCompletedOnboarding]);

  useEffect(() => {
    setWeeklyPlan((prev) => {
      const regenerated = generateWeeklyPlan(eatingStyle, checkIn);
      if (prev.length === 0) return regenerated;
      return regenerated.map((item) => {
        const found = prev.find((p) => p.day === item.day && p.fixed);
        return found ?? item;
      });
    });
  }, [eatingStyle, checkIn]);

  useEffect(() => {
    if (!recommendation) {
      setRecommendation(createRecommendationSet(eatingStyle, checkIn));
    }
  }, [recommendation, eatingStyle, checkIn]);

  const profile: UserProfile = { goal, eatingStyle, constraints };
  const weeklyStats = useMemo(() => getWeeklyStats(profile, mealLogs), [profile, mealLogs]);
  const shoppingItems = useMemo(() => generateShoppingList(weeklyPlan), [weeklyPlan]);
  const mealOptions = recommendation ? [recommendation.defaultOption, ...recommendation.alternatives] : [];

  const pushEvent = (event: AppEvent) => {
    setEventLogs((prev) => [event, ...prev].slice(0, 50));
  };

  const refreshRecommendation = () => {
    const nextRecommendation = createRecommendationSet(eatingStyle, checkIn);
    setRecommendation(nextRecommendation);
    pushEvent(
      createEvent({
        eventName: 'meal_recommendation_requested',
        recommendationId: nextRecommendation.recommendationId,
        optionSetId: nextRecommendation.optionSetId,
        payload: {
          place: checkIn.place,
          hunger: checkIn.hunger,
          budget: checkIn.budget,
          adjustmentMode: checkIn.adjustmentMode,
        },
      })
    );
    pushEvent(
      createEvent({
        eventName: 'meal_options_presented',
        recommendationId: nextRecommendation.recommendationId,
        optionSetId: nextRecommendation.optionSetId,
        selectedOptionId: nextRecommendation.defaultOption.id,
        payload: {
          defaultTitle: nextRecommendation.defaultOption.title,
          alternativesCount: nextRecommendation.alternatives.length,
        },
      })
    );
    return nextRecommendation;
  };

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
  };

  const saveMealLogEntry = (meal: MealOption | null, result: LogResult | null) => {
    if (!meal || !result) return false;
    const log = createMealLog(meal, result, recommendation?.recommendationId);
    setMealLogs((prev) => [log, ...prev].slice(0, 20));
    pushEvent(
      createEvent({
        eventName: 'meal_logged',
        recommendationId: recommendation?.recommendationId,
        optionSetId: recommendation?.optionSetId,
        selectedOptionId: meal.id,
        payload: { result },
      })
    );
    if (result === '벗어났어요') {
      pushEvent(
        createEvent({
          eventName: 'meal_deviation_reported',
          recommendationId: recommendation?.recommendationId,
          optionSetId: recommendation?.optionSetId,
          selectedOptionId: meal.id,
          payload: { severity: 'medium' },
        })
      );
    }
    return true;
  };

  const selectMeal = (meal: MealOption) => {
    setSelectedResult(null);
    pushEvent(
      createEvent({
        eventName: 'meal_option_selected',
        recommendationId: recommendation?.recommendationId,
        optionSetId: recommendation?.optionSetId,
        selectedOptionId: meal.id,
        payload: { tier: meal.tier, adherenceScore: meal.adherenceScore },
      })
    );
    return meal;
  };

  const updateCheckIn = {
    setPlace: (place: CheckInPlace) => setCheckIn((prev) => ({ ...prev, place, adjustmentMode: '기본' })),
    setHunger: (hunger: HungerLevel) => setCheckIn((prev) => ({ ...prev, hunger, adjustmentMode: '기본' })),
    setBudget: (budget: BudgetLevel) => setCheckIn((prev) => ({ ...prev, budget, adjustmentMode: '기본' })),
    setCraving: (craving: string) => setCheckIn((prev) => ({ ...prev, craving, adjustmentMode: '기본' })),
    setAdjustmentMode: (adjustmentMode: AdjustmentMode) => {
      setCheckIn((prev) => ({ ...prev, adjustmentMode }));
      setTimeout(() => refreshRecommendation(), 0);
    },
  };

  const regenerateWeeklyPlan = () => {
    setWeeklyPlan((prev) => {
      const regenerated = generateWeeklyPlan(eatingStyle, checkIn);
      return regenerated.map((item) => {
        const found = prev.find((p) => p.day === item.day && p.fixed);
        return found ?? item;
      });
    });
  };

  const toggleWeeklyPlanFixed = (day: string) => {
    setWeeklyPlan((prev) => prev.map((item) => (item.day === day ? { ...item, fixed: !item.fixed } : item)));
  };

  const getCookingState = (mealTitle?: string) => {
    const steps = getCookingSteps(mealTitle);
    return {
      steps,
      currentCookingStep,
      currentStepData: steps[currentCookingStep] ?? steps[0],
    };
  };

  const nextCookingStep = (mealTitle?: string) => {
    const steps = getCookingSteps(mealTitle);
    setCurrentCookingStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevCookingStep = () => {
    setCurrentCookingStep((prev) => Math.max(prev - 1, 0));
  };

  const resetCookingStep = () => setCurrentCookingStep(0);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    refreshRecommendation();
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
    weeklyPlan,
    shoppingItems,
    recommendation,
    eventLogs,
    hasCompletedOnboarding,
    getCookingState,
    actions: {
      setGoal,
      setEatingStyle,
      toggleConstraint,
      setSelectedResult,
      saveMealLog: saveMealLogEntry,
      regenerateRecommendation: refreshRecommendation,
      selectMeal,
      completeOnboarding,
      regenerateWeeklyPlan,
      toggleWeeklyPlanFixed,
      nextCookingStep,
      prevCookingStep,
      resetCookingStep,
      ...updateCheckIn,
    },
  };
}
