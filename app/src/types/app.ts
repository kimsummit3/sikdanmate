export type Goal = '감량' | '유지' | '건강 식습관';
export type EatingStyle = '일반식 중심' | '간편식 중심' | '외식 많음';
export type Constraint = '편의점 가능' | '배달 자주 씀' | '요리 가능' | '예산 민감';
export type Screen = 'onboarding' | 'home' | 'log' | 'summary' | 'settings' | 'history' | 'checkin';
export type LogResult = '잘 지켰어요' | '비슷해요' | '벗어났어요';
export type CheckInPlace = '집' | '밖';
export type HungerLevel = '가벼움' | '보통' | '많이 배고픔';
export type BudgetLevel = '절약' | '보통' | '여유 있음';
export type AdjustmentMode = '기본' | '더 가볍게' | '더 든든하게' | '더 저렴하게' | '외식 중심';

export type MealOption = {
  title: string;
  description: string;
  tag: string;
  context: string;
};

export type MealLog = {
  id: string;
  mealTitle: string;
  result: LogResult;
  createdAt: string;
};

export type CheckInState = {
  place: CheckInPlace;
  hunger: HungerLevel;
  budget: BudgetLevel;
  craving: string;
  adjustmentMode: AdjustmentMode;
};

export type WeeklyStats = {
  recordRate: number;
  consistencyRate: number;
  recoveryRate: number;
  weeklyPoint: string;
  suggestion: string;
};

export type UserProfile = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
};
