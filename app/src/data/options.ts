import { Constraint, EatingStyle, Goal, LogResult, MealOption, UserProfile, WeeklyStats } from '../types/app';

export const goalOptions: Goal[] = ['감량', '유지', '건강 식습관'];
export const styleOptions: EatingStyle[] = ['일반식 중심', '간편식 중심', '외식 많음'];
export const constraintOptions: Constraint[] = ['편의점 가능', '배달 자주 씀', '요리 가능', '예산 민감'];

export function getMealOptions(eatingStyle: EatingStyle): MealOption[] {
  if (eatingStyle === '외식 많음') {
    return [
      {
        title: '닭가슴살 샐러드 + 현미김밥 1줄',
        description: '밖에서 빠르게 먹기 좋고, 과하게 무겁지 않은 점심 구성입니다.',
        tag: '외식 최적',
        context: '점심 전 · 밖에서 식사',
      },
      {
        title: '순두부찌개 + 밥 2/3 공기',
        description: '한식 위주로 가되 과식 가능성을 낮춘 현실적인 선택지입니다.',
        tag: '한식 선택',
        context: '국물/밥 메뉴 대응',
      },
    ];
  }

  if (eatingStyle === '간편식 중심') {
    return [
      {
        title: '그릭요거트 + 바나나 + 견과류',
        description: '준비 부담이 적고, 바쁜 날에도 끊기지 않게 돕는 구성입니다.',
        tag: '초간편',
        context: '아침 또는 가벼운 점심',
      },
      {
        title: '편의점 닭가슴살 + 삶은계란 + 컵샐러드',
        description: '실행 난이도를 낮추면서도 목표를 크게 벗어나지 않는 선택입니다.',
        tag: '편의점 대응',
        context: '빠른 한 끼',
      },
    ];
  }

  return [
    {
      title: '닭가슴살 구이 + 현미밥 + 데친 채소',
      description: '집밥 기준으로 가장 안정적으로 이어가기 좋은 기본 구성입니다.',
      tag: '집밥 기본',
      context: '저녁 식사',
    },
    {
      title: '연두부 + 계란말이 + 작은 밥',
      description: '부담 없이 먹되 과식을 줄이는 일반식 중심 선택지입니다.',
      tag: '부담 적음',
      context: '무난한 일반식',
    },
  ];
}

export function getWeeklyStats(profile: UserProfile, lastResult: LogResult | null): WeeklyStats {
  const base = {
    recordRate: 71,
    consistencyRate: profile.goal === '감량' ? 64 : 68,
    recoveryRate: 80,
  };

  if (profile.eatingStyle === '외식 많음') {
    return {
      ...base,
      weeklyPoint: '외식 상황에서도 무너지지 않는 점심 선택이 핵심입니다.',
      suggestion:
        lastResult === '벗어났어요'
          ? '다음 주엔 점심 한 끼만이라도 반복 가능한 메뉴 2개를 고정해 보세요.'
          : '잘 맞는 외식 메뉴를 2~3개로 좁혀서 결정 피로를 더 줄여보세요.',
    };
  }

  if (profile.eatingStyle === '간편식 중심') {
    return {
      ...base,
      recordRate: 76,
      consistencyRate: 69,
      weeklyPoint: '준비 없는 끼니를 얼마나 안정적으로 넘기느냐가 중요합니다.',
      suggestion:
        lastResult === '벗어났어요'
          ? '다음 주엔 편의점/간편식 안전 메뉴를 미리 정해 두는 것이 좋습니다.'
          : '지금 잘 맞는 간편식을 아침과 점심 루틴으로 고정해 보세요.',
    };
  }

  return {
    ...base,
    recordRate: 74,
    consistencyRate: 72,
    weeklyPoint: '집밥 기반 루틴은 안정적이지만, 지루함 관리가 중요합니다.',
    suggestion:
      lastResult === '벗어났어요'
        ? '다음 주엔 저녁 루틴을 더 단순하게 줄여 복귀 난이도를 낮추세요.'
        : '기본 식단 루틴은 유지하고, 한 끼만 변주를 넣는 식으로 지루함을 관리하세요.',
  };
}
