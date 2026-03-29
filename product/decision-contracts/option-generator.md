# option-generator.md

## 목적
Meal Option Generator는 전략과 상태를 바탕으로,
사용자가 실제로 선택 가능한 식사 옵션을 생성한다.

---

## 책임
- 끼니별 옵션 생성
- ideal / realistic / emergency 레이어 제공
- 각 옵션의 실행 정보 함께 반환

---

## 입력
- profile state
- strategy
- optional support signals (nutrition/price/store)

---

## 출력 예시
```json
{
  "options": [
    {
      "tier": "ideal",
      "title": "닭가슴살 샐러드 + 삶은 계란",
      "prep_time_min": 12,
      "budget_band": "medium"
    },
    {
      "tier": "realistic",
      "title": "편의점 닭가슴살 + 삼각김밥 + 샐러드",
      "prep_time_min": 3,
      "budget_band": "medium"
    },
    {
      "tier": "emergency",
      "title": "배달 포케 볼 반 공기 옵션",
      "prep_time_min": 1,
      "budget_band": "high"
    }
  ]
}
```

---

## 규칙
1. 단일안만 반환하지 않는다
2. 설명보다 선택 가능성이 높은 옵션 우선
3. 불필요하게 옵션 수를 늘리지 않는다
4. option 수가 많을수록 decision fatigue 리스크가 커진다
