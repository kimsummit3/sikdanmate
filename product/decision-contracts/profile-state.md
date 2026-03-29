# profile-state.md

## 목적
Profile State Manager는 식단메이트의 모든 추천 판단에 들어가는 **사용자 상태의 단일 진실 공급원**이다.

이 모듈은 추천을 만들지 않는다.
오직 현재 시점에 필요한 사용자 상태를 정리해서 제공한다.

---

## 책임
- 고정 프로필 관리
- 변동 컨텍스트 관리
- 최근 행동/실패 패턴 요약
- 추천 판단에 필요한 상태 객체 생성

---

## 입력
- onboarding profile
- 최근 7일 식사/기록 이벤트
- 최근 이탈 및 복귀 이벤트
- 시간대
- 위치/상황 정보
- 수동 설정 변경

---

## 출력 예시
```json
{
  "user_id": "u_123",
  "goal_mode": "fat_loss",
  "meal_style": "convenience_first",
  "cooking_capacity": "low",
  "budget_level": "medium",
  "avoid_foods": ["가지"],
  "preferred_categories": ["한식", "덮밥"],
  "known_failure_patterns": ["weekday_dinner_skip", "late_night_delivery"],
  "current_context": {
    "time_slot": "dinner",
    "location_mode": "outside",
    "energy_level": "low"
  }
}
```

---

## 규칙
1. 추천 생성 로직 포함 금지
2. 추론된 값은 source/confidence 표시 권장
3. 상태 객체는 경량이어야 함
4. 최신성 우선: 오래된 선호보다 최근 행동 패턴을 우선 반영 가능
