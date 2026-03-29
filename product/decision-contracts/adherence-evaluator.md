# adherence-evaluator.md

## 목적
Adherence Evaluator는 추천 옵션의 영양 적합성이 아니라,
**실제 실행 가능성**을 평가한다.

식단메이트에서 가장 중요한 차별화 계층 중 하나다.

---

## 책임
- 옵션별 실행 가능성 점수화
- 실패 리스크 태깅
- 추천 우선순위 재정렬

---

## 입력
- generated meal options
- profile state
- recent failure reasons
- current context

---

## 출력 예시
```json
{
  "ranked_options": [
    {
      "title": "편의점 닭가슴살 + 삼각김밥 + 샐러드",
      "adherence_score": 0.84,
      "risk_flags": ["taste_fatigue"]
    },
    {
      "title": "배달 포케 볼 반 공기 옵션",
      "adherence_score": 0.76,
      "risk_flags": ["cost_high"]
    }
  ],
  "recommended_mode": "realistic"
}
```

---

## 평가 기준 예
- 현재 위치/상황 적합성
- 준비 시간 적합성
- 예산 적합성
- 포만감 리스크
- 과거 실패 패턴 충돌 여부
- 반복 피로 가능성

---

## 규칙
1. nutrition score와 혼동하지 않는다
2. 고득점 옵션이 항상 이상적인 식단일 필요는 없다
3. 이 모듈의 목적은 완벽함이 아니라 실행률 개선이다
