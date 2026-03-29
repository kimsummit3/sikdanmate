# strategy-planner.md

## 목적
Strategy Planner는 메뉴를 직접 길게 생성하는 엔진이 아니라,
현재 하루/주간 운영 방식을 정하는 **전략 레이어**다.

---

## 책임
- 하루/주간 식사 운영 전략 수립
- friction 최소화 방향 결정
- free-choice / recovery 우선순위 설정

---

## 입력
- profile state
- 최근 7일 adherence summary
- 실패 reason code 분포

---

## 출력 예시
```json
{
  "day_strategy": "low_friction_recovery",
  "meal_rules": [
    "dinner_prep_under_15m",
    "allow_convenience_store",
    "high_satiety_priority"
  ],
  "flex_rules": ["one_free_choice_allowed"]
}
```

---

## 규칙
1. 기술 구현 세부안 생성 금지
2. 메뉴명 나열보다 운영 규칙 중심
3. Recovery mode 필요 시 명시적으로 플래그 설정
4. 전략은 사람이 읽어도 이해 가능한 수준이어야 함
