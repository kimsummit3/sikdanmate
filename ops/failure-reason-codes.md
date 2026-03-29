# failure-reason-codes.md

## 목적
식단메이트의 실패 로그는 감정적 서술이 아니라, 다음 추천 정책을 바꾸는 **구조화된 신호**여야 한다.

이 문서는:
- 어떤 상황을 실패/이탈로 볼지 정의하고
- 이탈 이유를 일관된 코드 체계로 분류하며
- 이후 Recovery Planner, Adherence Evaluator, Policy Updater가 공통으로 사용할 기준을 제공한다.

---

## 1. 설계 원칙

### 원칙 1. 실패는 도덕이 아니라 운영 이벤트다
- "의지가 약함" 같은 표현은 금지
- 실패는 다음 설계를 위한 데이터로 본다

### 원칙 2. 한 번에 하나의 주원인(primary reason)을 반드시 남긴다
- 보조 원인(secondary reasons)은 추가 가능
- 분석과 정책 반영은 primary reason을 중심으로 수행

### 원칙 3. 사용자가 직접 선택할 수 있을 만큼 단순해야 한다
- 분류 체계는 내부적으로는 정교하되
- 사용자 입력 UX에서는 1~2탭 내 선택 가능해야 한다

### 원칙 4. 정책 변경 가능한 코드만 남긴다
- 코드를 기록했을 때 실제 추천 로직이 바뀔 수 있어야 한다

---

## 2. 실패/이탈 이벤트 정의

식단메이트에서 아래 이벤트는 실패 분석 대상이다.

### A. recommendation_rejected
추천 옵션이 제시되었으나 사용자가 선택하지 않음

### B. plan_not_executed
선택한 식단/옵션을 실제로 실행하지 않음

### C. meal_deviation
실행했지만 계획과 크게 달라짐
예:
- 샐러드 대신 치킨/피자 선택
- 간단식 대신 과식

### D. recovery_not_started
이탈 이후 다음 끼니 복귀 제안을 받았지만 행동으로 이어지지 않음

### E. streak_broken
일정 기간 유지 흐름이 끊김

---

## 3. reason code taxonomy

## 3.1 시간/에너지 제약

### `TIME_SHORTAGE`
설명:
- 식사 준비 또는 선택에 쓸 시간이 부족함

대표 신호:
- "바빠서 못 챙김"
- "회의 때문에 급하게 먹음"
- "준비할 시간이 없었음"

정책 반영 예:
- prep time 상한 축소
- quick-select 옵션 우선 노출
- 아침/점심 고정 템플릿화

### `ENERGY_LOW`
설명:
- 피곤하거나 귀찮아서 실행 불가

대표 신호:
- "너무 피곤했음"
- "귀찮아서 배달시킴"
- "요리할 힘이 없었음"

정책 반영 예:
- realistic/emergency 비중 확대
- 저녁 조리 난이도 하향
- 배달 fallback 강화

---

## 3.2 접근성/환경 제약

### `NO_INGREDIENTS`
설명:
- 필요한 재료가 없었음

정책 반영 예:
- pantry-aware 추천 강화
- 장보기 전/후 모드 분리
- 재료 의존도 낮은 옵션 우선

### `LOCATION_CONSTRAINT`
설명:
- 집/회사/이동 중 등 현재 위치에서 옵션 실행 불가

대표 신호:
- "밖이라 불가능"
- "회사 근처에 그런 메뉴가 없음"

정책 반영 예:
- context resolver 개선
- 위치 기반 외식/편의점 옵션 우선

### `SCHEDULE_DISRUPTION`
설명:
- 회식, 약속, 갑작스러운 일정 변경 등 외부 스케줄 영향

정책 반영 예:
- 일정 충돌 시 recovery-first 제안
- 사전 free-choice 허용 규칙 반영

---

## 3.3 비용/가용 자원 제약

### `BUDGET_HIGH`
설명:
- 추천이 체감상 비싸거나 예산을 초과함

정책 반영 예:
- low-cost 후보 우선
- price engine 가중치 상향
- emergency 옵션 중 저비용 세트 추가

### `AVAILABILITY_LOW`
설명:
- 주변에서 쉽게 구할 수 없는 메뉴/상품임

정책 반영 예:
- store finder 보정
- 접근성 낮은 옵션 제외

---

## 3.4 기호/만족도 문제

### `TASTE_MISMATCH`
설명:
- 추천이 입맛에 맞지 않음

정책 반영 예:
- 선호 프로필 업데이트
- 유사 메뉴군 가중치 하향

### `LOW_SATIETY`
설명:
- 포만감이 낮아 추가 섭취/폭식으로 이어짐

정책 반영 예:
- 단백질/식이섬유/탄수 보완
- high-satiety 태그 우선

### `MENU_FATIGUE`
설명:
- 비슷한 메뉴 반복으로 지침

정책 반영 예:
- 다양성 규칙 강화
- 동일 단백질/동일 카테고리 반복 제한

---

## 3.5 심리/의사결정 문제

### `DECISION_FATIGUE`
설명:
- 선택지가 많거나 판단 피로가 큼

정책 반영 예:
- 옵션 수 축소
- 기본 추천 1개 + 대안 1개 구조
- 아침 자동 추천 고정

### `GUILT_SPIRAL`
설명:
- 한 번 무너진 뒤 죄책감으로 연쇄 이탈

정책 반영 예:
- recovery planner 우선 호출
- no-guilt messaging 적용
- 다음 끼니 기준 리셋 UX 강화

### `MOTIVATION_DROP`
설명:
- 이유는 뚜렷하지 않지만 전반적 의욕 하락

정책 반영 예:
- 목표 상기보다 마찰 감소 우선
- 작은 성공 경험 중심으로 재설계

---

## 3.6 사회/외부 유혹

### `SOCIAL_EATING`
설명:
- 회식/약속/가족 식사 등 사회적 식사 상황

정책 반영 예:
- social mode 도입
- 손실 최소화형 선택지 제안
- 사후 recovery flow 연결

### `CRAVING_HIGH`
설명:
- 특정 음식 갈망이 강해 계획 이탈

정책 반영 예:
- controlled indulgence 허용
- 대체재 추천
- 완전 금지 대신 제한 허용

---

## 3.7 시스템 문제

### `RECOMMENDATION_UNFIT`
설명:
- 추천 자체가 현재 맥락과 맞지 않음

대표 신호:
- "지금 상황을 전혀 반영 안 함"
- "이 시간대/장소에 말이 안 됨"

정책 반영 예:
- context resolver 개선
- adherence evaluator 가중치 조정

### `TOO_MUCH_FRICTION`
설명:
- 기록/선택/실행 단계 UX가 번거로움

정책 반영 예:
- 입력 단계 축소
- 버튼형 기록 강화
- quick actions 재설계

### `UNCLEAR_RECOMMENDATION`
설명:
- 추천 설명이 모호해서 행동으로 이어지지 않음

정책 반영 예:
- 추천 카피 단순화
- 한 줄 액션 중심 표현

---

## 4. primary / secondary reason 저장 규칙

권장 저장 형식:

```json
{
  "primary_reason": "ENERGY_LOW",
  "secondary_reasons": ["TIME_SHORTAGE"],
  "confidence": 0.82,
  "captured_from": "user_tap"
}
```

### primary reason 선정 기준
1. 다음 추천 정책을 바꾸는 데 가장 영향이 큰 원인
2. 사용자가 직접 언급한 원인 우선
3. 시스템 추론만 있는 경우 confidence 기록 필수

---

## 5. 수집 방법

### 사용자 직접 입력
권장 UI 예:
- 시간이 없었어요
- 너무 피곤했어요
- 재료가 없었어요
- 밖이라 어려웠어요
- 너무 비쌌어요
- 먹고 싶은 게 따로 있었어요
- 그냥 흐름이 끊겼어요

### 시스템 추론
가능한 입력:
- 선택 후 미실행 시간 초과
- 위치/시간/재고 불일치
- 동일 패턴 반복

주의:
- 시스템 추론은 보조 수단
- 가능하면 사용자 직접 선택을 우선

---

## 6. reason code → 정책 반영 맵

| reason code | 즉시 반응 | 다음 추천 정책 변화 |
|---|---|---|
| TIME_SHORTAGE | quick option 제시 | prep time 상한 하향 |
| ENERGY_LOW | emergency 우선 | 저녁 조리 난이도 하향 |
| NO_INGREDIENTS | 대체안 제시 | pantry-aware 가중치 상향 |
| LOCATION_CONSTRAINT | 주변 옵션 제시 | location mode 분기 강화 |
| BUDGET_HIGH | 저비용 옵션 제시 | price weight 상향 |
| TASTE_MISMATCH | 유사 대안 제시 | 선호도 업데이트 |
| LOW_SATIETY | 고포만 대안 제시 | satiety weight 상향 |
| MENU_FATIGUE | 다른 카테고리 제시 | 다양성 규칙 강화 |
| DECISION_FATIGUE | 옵션 수 축소 | default-first 전략 적용 |
| GUILT_SPIRAL | no-guilt recovery | recovery flow 우선화 |
| SOCIAL_EATING | damage-control 제안 | social mode 분기 추가 |
| RECOMMENDATION_UNFIT | 재추천 | context scoring 조정 |
| TOO_MUCH_FRICTION | 최소 입력 모드 | UX 단계 축소 |

---

## 7. 금지 사항

다음 코드는 reason code로 사용하지 않는다.
- `LAZY`
- `WEAK_WILLPOWER`
- `BAD_USER`
- `CHEAT`

이런 표현은 제품 철학과 맞지 않으며,
정책 개선에도 도움이 되지 않는다.

---

## 8. 초기 MVP 권장 운영 방식

초기에는 모든 세부 코드를 다 쓰지 말고,
아래 8개를 핵심 reason code로 시작해도 충분하다.

1. `TIME_SHORTAGE`
2. `ENERGY_LOW`
3. `NO_INGREDIENTS`
4. `LOCATION_CONSTRAINT`
5. `BUDGET_HIGH`
6. `TASTE_MISMATCH`
7. `DECISION_FATIGUE`
8. `GUILT_SPIRAL`

이후 데이터가 쌓이면 세분화한다.

---

## 최종 한 문장
식단메이트의 실패 reason code는 회고용 라벨이 아니라,
**다음 끼니 추천 정책을 바꾸는 운영 레버**여야 한다.
