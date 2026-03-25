export type Goal = '감량' | '유지' | '건강 식습관';
export type EatingStyle = '일반식 중심' | '간편식 중심' | '외식 많음';
export type Constraint = '편의점 가능' | '배달 자주 씀' | '요리 가능' | '예산 민감';
export type Screen = 'onboarding' | 'home' | 'log' | 'summary' | 'settings';
export type LogResult = '잘 지켰어요' | '비슷해요' | '벗어났어요';

export type MealOption = {
  title: string;
  description: string;
};
