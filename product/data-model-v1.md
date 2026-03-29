# data-model-v1.md

## 목적
이 문서는 식단메이트 MVP에서 필요한 최소 데이터 모델을 정의한다.

핵심 원칙은 다음과 같다.
- 완벽한 도메인 모델보다 운영 루프에 필요한 최소 구조 우선
- 추천/기록/복귀/정책을 연결할 수 있어야 함
- analytics와 product logic이 모두 활용 가능해야 함

---

## 1. 상위 엔티티

MVP에서 핵심 엔티티는 6개다.

1. `user_profile`
2. `recommendation`
3. `meal_log`
4. `failure_reason`
5. `recovery_session`
6. `active_policy`

보조 엔티티:
- `weekly_summary`
- `event_log`

---

## 2. user_profile

### 목적
추천의 기본 제약과 선호를 담는다.

### 필드
- `user_id`
- `goal_mode`
- `meal_style`
- `cooking_capacity`
- `budget_level`
- `avoid_foods` (json/array)
- `preferred_categories` (json/array, optional)
- `created_at`
- `updated_at`

### 비고
- MVP에서는 BMI, 체성분 등 복잡한 건강 프로필은 제외 가능

---

## 3. recommendation

### 목적
한 번의 추천 세션과 그 옵션 세트를 저장한다.

### 필드
- `recommendation_id`
- `user_id`
- `option_set_id`
- `time_slot`
- `location_mode`
- `context_type`
- `state_mode` (`stable | fragile | recovery | stabilizing`)
- `strategy_json`
- `default_option_json`
- `alternatives_json`
- `created_at`

### 비고
- options를 별도 테이블로 나눌 수도 있지만 MVP에서는 json으로 시작 가능

---

## 4. meal_log

### 목적
실제 식사 실행 또는 기록 결과를 저장한다.

### 필드
- `meal_log_id`
- `user_id`
- `recommendation_id` (nullable)
- `selected_option_id` (nullable)
- `match_level` (`exact | similar | deviated`)
- `log_method` (`button | photo | voice | manual_text`)
- `photo_attached` (bool)
- `logged_at`

### 비고
- 추천 없이 직접 기록하는 경우 recommendation_id nullable 허용 가능

---

## 5. failure_reason

### 목적
이탈 원인을 구조화해 저장한다.

### 필드
- `failure_reason_id`
- `user_id`
- `recommendation_id` (nullable)
- `deviation_id` (nullable)
- `primary_reason`
- `secondary_reasons_json`
- `captured_from` (`user_tap | inferred`)
- `confidence`
- `created_at`

### 비고
- 반드시 primary_reason은 있어야 함

---

## 6. recovery_session

### 목적
복귀 플로우 단위를 저장한다.

### 필드
- `recovery_session_id`
- `user_id`
- `trigger_event_id`
- `trigger_reason`
- `mode` (`no_guilt` 등)
- `recovery_options_json`
- `selected_recovery_option_id` (nullable)
- `success_window` (`next_meal | within_24h`)
- `success_marked` (bool)
- `started_at`
- `updated_at`

---

## 7. active_policy

### 목적
현재 사용자에게 적용 중인 정책 오버레이를 저장한다.

### 필드
- `policy_id`
- `user_id`
- `active_rules_json`
- `effective_from`
- `updated_at`

### 비고
- 사용자의 기본 프로필과 분리해야 정책 업데이트 rollback이 쉬움

---

## 8. weekly_summary

### 목적
주간 성과 및 요약 뷰에 필요한 집계값 저장

### 필드
- `summary_id`
- `user_id`
- `summary_week`
- `executed_meals`
- `recommendation_to_execution_rate`
- `next_meal_recovery_rate`
- `top_failure_reasons_json`
- `next_week_hint`
- `generated_at`

---

## 9. event_log

### 목적
운영 계측과 디버깅용 원천 이벤트 저장

### 필드
- `event_id`
- `event_name`
- `user_id`
- `session_id`
- `occurred_at`
- `payload_json`

### 비고
- 정규화보다 유연성을 우선
- KPI 계산, 문제 재현, 정책 업데이트 근거로 사용

---

## 10. 엔티티 관계

```text
user_profile (1)
  ├─ recommendation (N)
  │    └─ meal_log (N)
  │    └─ failure_reason (N)
  ├─ recovery_session (N)
  ├─ active_policy (1 or N history)
  ├─ weekly_summary (N)
  └─ event_log (N)
```

---

## 11. MVP에서 JSON 필드로 시작해도 되는 부분

아래는 초기에는 JSON 저장으로 충분하다.
- `avoid_foods`
- `preferred_categories`
- `strategy_json`
- `default_option_json`
- `alternatives_json`
- `secondary_reasons_json`
- `recovery_options_json`
- `active_rules_json`
- `top_failure_reasons_json`
- `payload_json`

이유:
초기에는 스키마 완벽성보다 실험 속도가 더 중요하다.

---

## 12. 인덱스 권장

최소 권장 인덱스:
- `recommendation.user_id + created_at`
- `meal_log.user_id + logged_at`
- `failure_reason.user_id + created_at`
- `recovery_session.user_id + started_at`
- `event_log.user_id + occurred_at`

---

## 13. 데이터 모델 설계 주의점

1. 추천과 실행을 연결하는 키가 빠지면 안 된다
2. 정책(active_policy)과 기본 프로필(user_profile)을 섞지 않는다
3. recovery_session은 recommendation과 별도 단위로 관리한다
4. analytics용 event_log를 생략하지 않는다

---

## 최종 한 문장
식단메이트의 데이터 모델은 복잡한 영양 데이터베이스가 아니라,
**추천 → 실행 → 이탈 → 복귀 → 정책 적응**을 연결하는 운영 데이터 구조가 먼저다.
