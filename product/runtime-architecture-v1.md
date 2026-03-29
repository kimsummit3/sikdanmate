# runtime-architecture-v1.md

## 목적
이 문서는 식단메이트 MVP 구현 시,
프론트엔드 / 상태 저장 / 추천 판단 / 이벤트 수집의 런타임 경계를 정의한다.

핵심은 다음 두 가지다.

1. UI/대화 레이어와 판단 엔진을 분리한다
2. 추천 흐름과 계측 흐름을 함께 설계한다

---

## 1. 상위 구조

```text
[Mobile App / UI]
  ├─ onboarding
  ├─ recommendation request
  ├─ meal logging
  └─ recovery interaction
        ↓
[Application Layer / API]
  ├─ session handling
  ├─ request validation
  ├─ orchestration
  └─ response shaping
        ↓
[Decision Layer]
  ├─ Profile State Manager
  ├─ Strategy Planner
  ├─ Meal Option Generator
  ├─ Constraint Validator
  ├─ Adherence Evaluator
  └─ Recovery Planner
        ↓
[Support Layer]
  ├─ Nutrition support
  ├─ Price support
  ├─ Context resolver
  └─ Template library
        ↓
[Data Layer]
  ├─ user profile store
  ├─ meal/recovery event store
  ├─ active policy store
  └─ weekly aggregates
```

---

## 2. 레이어별 책임

### A. Mobile App / UI
책임:
- 입력 수집
- 추천 결과 노출
- 식사 기록
- recovery 진입 UI

하지 말아야 할 것:
- 추천 우선순위 계산
- policy update 판단
- adherence scoring

즉 앱은 똑똑한 판단자가 아니라,
운영 흐름을 쉽게 만드는 인터페이스여야 한다.

---

### B. Application Layer / API
책임:
- 요청 검증
- orchestration flow 실행
- recommendation_id / session_id 발급
- response payload 생성
- 이벤트 기록 트리거

예상 엔드포인트 예:
- `POST /recommendations`
- `POST /meals/log`
- `POST /meals/deviation`
- `POST /recovery/start`
- `POST /recovery/select`
- `GET /weekly-summary`

---

### C. Decision Layer
책임:
- 실제 추천 판단
- 실행 가능성 평가
- recovery 분기 판단

원칙:
- UI 독립적이어야 함
- 함수/서비스 단위로 테스트 가능해야 함

---

### D. Support Layer
책임:
- Nutrition / Price / Context / Template 보조 신호 제공

원칙:
- 지원 레이어는 근거를 제공하지만 최종 추천 순위는 정하지 않음

---

### E. Data Layer
저장 대상:
- onboarding profile
- event logs
- active policy
- weekly summary materialized data

MVP에서는 단순한 저장 구조로 시작해도 된다.
중요한 것은 정교한 DB보다 이벤트 연결 가능성이다.

---

## 3. 핵심 런타임 흐름

### 추천 요청
1. 앱이 `/recommendations` 호출
2. API가 profile state load
3. strategy planner 호출
4. option generator 호출
5. constraint validator 적용
6. adherence evaluator 적용
7. 응답 반환 + `meal_options_presented` 저장

### 기록 요청
1. 앱이 `/meals/log` 호출
2. API가 recommendation / option 연결 확인
3. `meal_logged` 저장
4. 필요 시 deviation 판단 후 후속 플로우 트리거

### recovery 요청
1. deviation 또는 유저 표현 기반 진입
2. recovery planner 호출
3. recovery session 발급
4. 복귀 옵션 응답
5. recovery 선택/성공 이벤트 저장

---

## 4. 상태 저장 권장 구조

### user_profile
- user_id
- goal_mode
- meal_style
- cooking_capacity
- budget_level
- avoid_foods
- created_at
- updated_at

### active_policy
- user_id
- policy_id
- active_rules
- effective_from
- updated_at

### event_log
- event_id
- event_name
- user_id
- occurred_at
- payload(json)

### weekly_summary
- user_id
- summary_week
- executed_meals
- recovery_rate
- top_failure_reasons
- generated_at

---

## 5. 추천 응답 payload 예시

```json
{
  "recommendation_id": "rec_001",
  "state_mode": "stable",
  "strategy": {
    "day_strategy": "low_friction"
  },
  "default_option": {
    "option_id": "opt_002",
    "title": "편의점 닭가슴살 + 삼각김밥 + 샐러드",
    "tier": "realistic",
    "adherence_score": 0.84
  },
  "alternatives": [
    {
      "option_id": "opt_003",
      "title": "배달 포케 볼 반 공기 옵션",
      "tier": "emergency",
      "adherence_score": 0.76
    }
  ]
}
```

---

## 6. recovery 응답 payload 예시

```json
{
  "recovery_session_id": "rcv_001",
  "mode": "no_guilt",
  "message": "오늘을 만회하려 하지 말고, 다음 끼니만 가볍게 복귀해요.",
  "recovery_options": [
    "단백질 음료 + 바나나",
    "샐러드 + 계란 2개"
  ]
}
```

---

## 7. 초기 기술 선택 원칙

### 우선해야 할 것
- 빠른 iteration 가능 구조
- event logging 명확성
- 테스트 가능한 decision modules

### 나중에 해도 되는 것
- 복잡한 마이크로서비스 분리
- 과도한 실시간 음성 우선 구조
- 고정밀 영양 계산 파이프라인

초기 MVP는 하나의 앱 + 얇은 API + 명확한 decision modules로 충분하다.

---

## 8. 장애 대비 fallback

### 추천 엔진 실패
- 템플릿 추천 세트 반환

### event logging 실패
- 사용자 경험은 유지하고 로컬 큐 또는 재시도 고려

### policy read 실패
- 기본 정책으로 degrade

### recovery planner 실패
- 기본 recovery copy + emergency set 반환

---

## 9. 권장 구현 전략

### Step 1
- 단일 backend boundary에서 모든 decision modules 호출

### Step 2
- 이벤트 수집 완성
- KPI 계산 가능 상태 확보

### Step 3
- policy updater 연결
- weekly summary 생성

### Step 4
- 필요 시 nutrition / price / context 고도화

---

## 최종 한 문장
식단메이트의 런타임 아키텍처는
복잡한 분산 시스템보다,
**UI와 판단 엔진을 분리하고 추천/복귀/학습 흐름을 안정적으로 계측하는 구조**가 먼저다.
