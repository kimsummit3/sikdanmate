# event-schema-v1.md

## 목적
이 문서는 식단메이트 MVP의 이벤트 수집 기준을 정의한다.

핵심은 단순 로그 적재가 아니라,
아래 3가지를 측정 가능하게 만드는 것이다.

1. 추천이 실제 선택으로 이어졌는가
2. 선택이 실제 실행/기록으로 이어졌는가
3. 이탈 후 얼마나 빨리 복귀했는가

---

## 1. 공통 설계 원칙

### 원칙 1. 모든 이벤트는 행동 기준으로 정의한다
- 화면 조회보다 행동 이벤트 우선
- 식단메이트는 실행형 제품이므로 행동 데이터가 핵심

### 원칙 2. 모든 핵심 이벤트에는 context가 있어야 한다
최소 포함:
- user_id
- occurred_at
- time_slot
- location_mode
- context_type

### 원칙 3. 추천 이벤트와 결과 이벤트를 연결 가능해야 한다
- recommendation_id
- option_set_id
- selected_option_id
- recovery_session_id

이 연결이 있어야 전환율 계산이 가능하다.

---

## 2. 공통 필드

모든 핵심 이벤트는 가능한 한 아래 필드를 공통으로 가진다.

```json
{
  "event_name": "meal_option_selected",
  "event_version": "v1",
  "user_id": "u_123",
  "occurred_at": "2026-03-30T12:30:00+09:00",
  "session_id": "s_456",
  "time_slot": "lunch",
  "location_mode": "outside",
  "context_type": "convenience",
  "goal_mode": "fat_loss"
}
```

---

## 3. 핵심 이벤트 정의

### 3.1 `meal_recommendation_requested`
추천 요청이 발생했을 때

추가 필드:
```json
{
  "trigger_source": "user_request",
  "needs_recovery_check": false
}
```

---

### 3.2 `meal_options_presented`
추천 옵션 세트가 사용자에게 제시되었을 때

추가 필드:
```json
{
  "recommendation_id": "rec_001",
  "option_set_id": "set_001",
  "options_count": 3,
  "default_option_id": "opt_002",
  "default_tier": "realistic",
  "adherence_scores": [0.62, 0.84, 0.76]
}
```

---

### 3.3 `meal_option_selected`
사용자가 추천 옵션 중 하나를 선택했을 때

추가 필드:
```json
{
  "recommendation_id": "rec_001",
  "option_set_id": "set_001",
  "selected_option_id": "opt_002",
  "selected_tier": "realistic",
  "adherence_score": 0.84
}
```

---

### 3.4 `meal_logged`
식사가 실제로 기록되었을 때

추가 필드:
```json
{
  "selected_option_id": "opt_002",
  "log_method": "button",
  "match_level": "similar",
  "photo_attached": false
}
```

설명:
- `match_level`은 `exact | similar | deviated`

---

### 3.5 `meal_deviation_reported`
계획 대비 이탈이 보고되었을 때

추가 필드:
```json
{
  "selected_option_id": "opt_002",
  "deviation_type": "ate_other_food",
  "severity": "medium"
}
```

---

### 3.6 `failure_reason_saved`
이탈 원인이 저장되었을 때

추가 필드:
```json
{
  "primary_reason": "ENERGY_LOW",
  "secondary_reasons": ["TIME_SHORTAGE"],
  "captured_from": "user_tap",
  "confidence": 0.92
}
```

---

### 3.7 `recovery_flow_started`
복귀 플로우가 시작되었을 때

추가 필드:
```json
{
  "recovery_session_id": "rcv_001",
  "trigger_reason": "GUILT_SPIRAL",
  "trigger_event": "meal_deviation_reported"
}
```

---

### 3.8 `recovery_option_selected`
복귀 옵션이 선택되었을 때

추가 필드:
```json
{
  "recovery_session_id": "rcv_001",
  "selected_recovery_option": "protein_drink_banana"
}
```

---

### 3.9 `recovery_success_marked`
복귀가 성공으로 간주되었을 때

추가 필드:
```json
{
  "recovery_session_id": "rcv_001",
  "success_window": "next_meal"
}
```

---

### 3.10 `weekly_summary_generated`
주간 요약이 생성되었을 때

추가 필드:
```json
{
  "summary_week": "2026-W14",
  "executed_meals": 8,
  "recovery_rate": 0.29
}
```

---

### 3.11 `policy_update_applied`
정책 업데이트가 실제 반영되었을 때

추가 필드:
```json
{
  "policy_id": "pol_001",
  "update_reason": "ENERGY_LOW_cluster",
  "changes": ["dinner_emergency_priority_up"]
}
```

---

## 4. 권장 enum 값

### `time_slot`
- `breakfast`
- `lunch`
- `dinner`
- `snack`

### `location_mode`
- `home`
- `outside`
- `office`
- `transit`

### `context_type`
- `home_cooking`
- `convenience`
- `delivery`
- `dine_out`
- `unknown`

### `selected_tier`
- `ideal`
- `realistic`
- `emergency`

### `log_method`
- `button`
- `photo`
- `voice`
- `manual_text`

### `match_level`
- `exact`
- `similar`
- `deviated`

---

## 5. KPI 계산에 필요한 연결 키

아래 키는 MVP 초기에 반드시 있어야 한다.

- `recommendation_id`
- `option_set_id`
- `selected_option_id`
- `recovery_session_id`
- `policy_id`

이 키가 없으면:
- 추천→선택 전환율
- 선택→실행 전환율
- recovery 성공률
- 정책 업데이트 효과
를 정확히 보기 어렵다.

---

## 6. 최소 구현 세트

MVP 초기에는 아래 이벤트만 먼저 잡아도 된다.

1. `meal_recommendation_requested`
2. `meal_options_presented`
3. `meal_option_selected`
4. `meal_logged`
5. `meal_deviation_reported`
6. `failure_reason_saved`
7. `recovery_flow_started`
8. `recovery_option_selected`
9. `recovery_success_marked`

---

## 7. 안티패턴

다음은 피해야 한다.

1. 추천은 기록하지만 option_set 연결 키가 없음
2. deviation은 기록하지만 reason code가 없음
3. recovery flow는 있지만 success 기준이 없음
4. 이벤트 이름은 있는데 business definition이 없음
5. 화면 조회 이벤트만 많고 행동 이벤트가 약함

---

## 최종 한 문장
식단메이트의 이벤트 스키마는 단순 사용 로그가 아니라,
**추천 → 선택 → 실행 → 이탈 → 복귀** 흐름을 끝까지 추적하기 위한 운영 계측 체계여야 한다.
