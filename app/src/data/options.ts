import {
  CheckInState,
  Constraint,
  EatingStyle,
  Goal,
  LogResult,
  MealLog,
  MealOption,
  ShoppingItem,
  UserProfile,
  WeeklyPlanItem,
  WeeklyStats,
} from '../types/app';

export const goalOptions: Goal[] = ['감량', '유지', '건강 식습관'];
export const styleOptions: EatingStyle[] = ['일반식 중심', '간편식 중심', '외식 많음'];
export const constraintOptions: Constraint[] = ['편의점 가능', '배달 자주 씀', '요리 가능', '예산 민감'];

export function getMealOptions(eatingStyle: EatingStyle, checkIn?: CheckInState): MealOption[] {
  const place = checkIn?.place ?? '밖';
  const budget = checkIn?.budget ?? '보통';
  const hunger = checkIn?.hunger ?? '보통';
  const craving = checkIn?.craving ?? '';
  const adjustment = checkIn?.adjustmentMode ?? '기본';

  if (adjustment === '더 저렴하게') {
    return [
      { title: '김밥 + 삶은계란 + 무가당 두유', description: '가격 부담을 낮추면서도 흐름을 크게 무너뜨리지 않는 절약형 선택입니다.', tag: '절약 우선', context: '보정 · 더 저렴하게' },
      { title: '편의점 닭가슴살 + 바나나', description: '최소 비용으로 단백질과 포만감을 어느 정도 챙기는 대체안입니다.', tag: '가성비 대체', context: '보정 · 저예산' },
    ];
  }
  if (adjustment === '더 가볍게') {
    return [
      { title: '그릭요거트 + 바나나 + 견과류', description: '소화 부담을 줄이면서도 허기를 과하게 남기지 않는 가벼운 선택입니다.', tag: '가벼움 우선', context: '보정 · 더 가볍게' },
      { title: '연두부 + 샐러드 + 작은 밥', description: '과식 없이 흐름만 유지하는 쪽에 맞춘 조정안입니다.', tag: '조절 중심', context: '보정 · 부담 낮춤' },
    ];
  }
  if (adjustment === '더 든든하게') {
    return [
      { title: '닭가슴살 덮밥 + 된장국', description: '포만감을 높이되 식단 흐름을 완전히 벗어나지 않는 든든한 선택입니다.', tag: '든든함 우선', context: '보정 · 더 든든하게' },
      { title: '순두부찌개 + 밥 1공기 + 계란추가', description: '배고픔이 큰 날에도 만족감을 주는 현실적인 한식 옵션입니다.', tag: '포만감 강화', context: '보정 · 한식' },
    ];
  }
  if (adjustment === '외식 중심') {
    return [
      { title: '샤브샤브 1인 세트', description: '외식이지만 채소와 단백질을 챙기기 쉬운 안정적인 선택입니다.', tag: '외식 보정', context: '보정 · 외식 중심' },
      { title: '국밥 대신 순두부찌개 + 밥 조절', description: '외식 메뉴를 유지하되 더 가볍게 조정한 선택안입니다.', tag: '외식 대체', context: '보정 · 한식 외식' },
    ];
  }
  if (place === '집' && hunger === '많이 배고픔') {
    return [
      { title: craving === '한식' ? '계란말이 + 두부부침 + 밥 1공기' : '닭가슴살 덮밥 + 된장국', description: '집에서 빠르게 만들 수 있고 포만감이 충분한 구성입니다.', tag: '집밥 포만감', context: '집 · 많이 배고픔' },
      { title: budget === '절약' ? '참치김치볶음 + 밥 + 계란후라이' : '소불고기 덮밥 + 샐러드', description: '예산과 배고픔을 같이 고려한 현실적인 집밥 옵션입니다.', tag: '현실 조정', context: '집 · 예산 반영' },
    ];
  }
  if (place === '밖' && budget === '절약') {
    return [
      { title: '김밥 + 삶은계란 + 무가당 두유', description: '밖에서도 비용 부담을 줄이면서 흐름을 크게 무너뜨리지 않는 조합입니다.', tag: '절약 모드', context: '밖 · 저예산' },
      { title: '편의점 닭가슴살 + 컵샐러드 + 바나나', description: '간단하지만 단백질과 포만감을 어느 정도 챙길 수 있는 선택입니다.', tag: '편의점 대응', context: '밖 · 빠른 한 끼' },
    ];
  }
  if (craving === '가벼운 것') {
    return [
      { title: '그릭요거트 + 바나나 + 견과류', description: '부담을 줄이면서도 허기를 과하게 남기지 않는 가벼운 선택입니다.', tag: '가벼움 우선', context: '소화 부담 낮춤' },
      { title: '연두부 + 샐러드 + 작은 밥', description: '과식 없이 흐름만 유지하는 쪽에 맞춘 구성입니다.', tag: '가벼운 일반식', context: '조절 중심' },
    ];
  }
  if (eatingStyle === '외식 많음') {
    return [
      { title: '닭가슴살 샐러드 + 현미김밥 1줄', description: '밖에서 빠르게 먹기 좋고, 과하게 무겁지 않은 점심 구성입니다.', tag: '외식 최적', context: '점심 전 · 밖에서 식사' },
      { title: '순두부찌개 + 밥 2/3 공기', description: '한식 위주로 가되 과식 가능성을 낮춘 현실적인 선택지입니다.', tag: '한식 선택', context: '국물/밥 메뉴 대응' },
    ];
  }
  if (eatingStyle === '간편식 중심') {
    return [
      { title: '그릭요거트 + 바나나 + 견과류', description: '준비 부담이 적고, 바쁜 날에도 끊기지 않게 돕는 구성입니다.', tag: '초간편', context: '아침 또는 가벼운 점심' },
      { title: '편의점 닭가슴살 + 삶은계란 + 컵샐러드', description: '실행 난이도를 낮추면서도 목표를 크게 벗어나지 않는 선택입니다.', tag: '편의점 대응', context: '빠른 한 끼' },
    ];
  }
  return [
    { title: '닭가슴살 구이 + 현미밥 + 데친 채소', description: '집밥 기준으로 가장 안정적으로 이어가기 좋은 기본 구성입니다.', tag: '집밥 기본', context: '저녁 식사' },
    { title: '연두부 + 계란말이 + 작은 밥', description: '부담 없이 먹되 과식을 줄이는 일반식 중심 선택지입니다.', tag: '부담 적음', context: '무난한 일반식' },
  ];
}

export function generateWeeklyPlan(eatingStyle: EatingStyle, checkIn?: CheckInState): WeeklyPlanItem[] {
  const baseMeals = getMealOptions(eatingStyle, checkIn);
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.map((day, index) => ({ day, mealTitle: baseMeals[index % baseMeals.length].title, note: index < 5 ? '기본 추천 루틴' : '주말 변주/외식 대응', fixed: false }));
}

export function generateShoppingList(plan: WeeklyPlanItem[]): ShoppingItem[] {
  const joined = plan.map((item) => item.mealTitle).join(' ');
  const list: ShoppingItem[] = [];
  const push = (item: ShoppingItem) => list.push(item);

  if (joined.includes('닭가슴살')) push({ id: 'protein-1', category: '단백질', name: '닭가슴살', quantity: '5팩', substitute: '두부/계란', storageTip: '냉장 2일, 나머지는 냉동' });
  if (joined.includes('두부')) push({ id: 'protein-2', category: '단백질', name: '두부', quantity: '3모', substitute: '연두부', storageTip: '냉장 보관, 개봉 후 빠르게 사용' });
  if (joined.includes('계란')) push({ id: 'protein-3', category: '단백질', name: '계란', quantity: '10구', substitute: '삶은계란팩', storageTip: '냉장 보관' });
  if (joined.includes('샐러드')) push({ id: 'veg-1', category: '채소', name: '샐러드 채소 믹스', quantity: '3봉', substitute: '양배추/상추', storageTip: '2~3일 단위 리필 추천' });
  if (joined.includes('바나나')) push({ id: 'etc-1', category: '기타', name: '바나나', quantity: '1송이', substitute: '사과', storageTip: '실온 후숙' });
  if (joined.includes('현미')) push({ id: 'carb-1', category: '탄수화물', name: '현미밥/현미', quantity: '7공기 분량', substitute: '잡곡밥', storageTip: '소분 냉동 가능' });
  if (joined.includes('김밥') || joined.includes('밥')) push({ id: 'carb-2', category: '탄수화물', name: '쌀/즉석밥', quantity: '5~7식 분량', substitute: '고구마', storageTip: '주간 단위 보충' });

  if (list.length === 0) {
    push({ id: 'fallback-1', category: '기타', name: '기본 장보기 묶음', quantity: '1세트', substitute: '주간 계획 재생성', storageTip: '계획에 맞춰 품목 보정' });
  }

  return list;
}

export function getWeeklyStats(profile: UserProfile, logs: MealLog[]): WeeklyStats {
  const totalTargetMeals = 7;
  const recordRate = Math.min(100, Math.round((logs.length / totalTargetMeals) * 100));
  const onTrackCount = logs.filter((log) => log.result === '잘 지켰어요').length;
  const similarCount = logs.filter((log) => log.result === '비슷해요').length;
  const offTrackCount = logs.filter((log) => log.result === '벗어났어요').length;
  const consistencyScore = logs.length === 0 ? 0 : Math.round(((onTrackCount * 1 + similarCount * 0.7) / logs.length) * 100);
  const recoveryOpportunities = Math.max(offTrackCount, 1);
  const recoverySuccess = Math.max(similarCount + onTrackCount - 1, 0);
  const recoveryRate = logs.length === 0 ? 0 : Math.min(100, Math.round((recoverySuccess / recoveryOpportunities) * 100));
  let weeklyPoint = '기록이 아직 적습니다. 먼저 3회 이상 기록을 만드는 것이 중요합니다.';
  let suggestion = '이번 주에는 최소 3번만 기록하는 것을 목표로 잡아 보세요.';
  if (profile.eatingStyle === '외식 많음') {
    weeklyPoint = '외식 상황에서도 무너지지 않는 점심 선택이 핵심입니다.';
    suggestion = offTrackCount > 0 ? '다음 주엔 점심 한 끼만이라도 반복 가능한 메뉴 2개를 고정해 보세요.' : '잘 맞는 외식 메뉴를 2~3개로 좁혀서 결정 피로를 더 줄여보세요.';
  } else if (profile.eatingStyle === '간편식 중심') {
    weeklyPoint = '준비 없는 끼니를 얼마나 안정적으로 넘기느냐가 중요합니다.';
    suggestion = offTrackCount > 0 ? '다음 주엔 편의점/간편식 안전 메뉴를 미리 정해 두는 것이 좋습니다.' : '지금 잘 맞는 간편식을 아침과 점심 루틴으로 고정해 보세요.';
  } else if (logs.length > 0) {
    weeklyPoint = '집밥 기반 루틴은 안정적이지만, 지루함 관리가 중요합니다.';
    suggestion = offTrackCount > 0 ? '다음 주엔 저녁 루틴을 더 단순하게 줄여 복귀 난이도를 낮추세요.' : '기본 식단 루틴은 유지하고, 한 끼만 변주를 넣는 식으로 지루함을 관리하세요.';
  }
  return { recordRate, consistencyRate: consistencyScore, recoveryRate, weeklyPoint, suggestion };
}

export function createMealLog(mealTitle: string, result: LogResult): MealLog {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, mealTitle, result, createdAt: new Date().toISOString() };
}
