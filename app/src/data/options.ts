import { Constraint, EatingStyle, Goal, MealOption } from '../types/app';

export const goalOptions: Goal[] = ['감량', '유지', '건강 식습관'];
export const styleOptions: EatingStyle[] = ['일반식 중심', '간편식 중심', '외식 많음'];
export const constraintOptions: Constraint[] = ['편의점 가능', '배달 자주 씀', '요리 가능', '예산 민감'];

export function getMealOptions(eatingStyle: EatingStyle): MealOption[] {
  if (eatingStyle === '외식 많음') {
    return [
      {
        title: '닭가슴살 샐러드 + 현미김밥 1줄',
        description: '밖에서 빠르게 먹기 좋고, 과하게 무겁지 않은 점심 구성입니다.',
      },
      {
        title: '순두부찌개 + 밥 2/3 공기',
        description: '한식 위주로 가되 과식 가능성을 낮춘 현실적인 선택지입니다.',
      },
    ];
  }

  if (eatingStyle === '간편식 중심') {
    return [
      {
        title: '그릭요거트 + 바나나 + 견과류',
        description: '준비 부담이 적고, 바쁜 날에도 끊기지 않게 돕는 구성입니다.',
      },
      {
        title: '편의점 닭가슴살 + 삶은계란 + 컵샐러드',
        description: '실행 난이도를 낮추면서도 목표를 크게 벗어나지 않는 선택입니다.',
      },
    ];
  }

  return [
    {
      title: '닭가슴살 구이 + 현미밥 + 데친 채소',
      description: '집밥 기준으로 가장 안정적으로 이어가기 좋은 기본 구성입니다.',
    },
    {
      title: '연두부 + 계란말이 + 작은 밥',
      description: '부담 없이 먹되 과식을 줄이는 일반식 중심 선택지입니다.',
    },
  ];
}
