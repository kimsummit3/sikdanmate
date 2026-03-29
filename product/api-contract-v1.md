# api-contract-v1.md

## 목적
이 문서는 식단메이트 MVP에서 프론트엔드와 애플리케이션 레이어가 주고받는 API 계약을 정의한다.

핵심은 다음 3가지다.
- 추천 요청/응답 구조 통일
- 기록/이탈/복귀 플로우 API 정리
- 이벤트 계측에 필요한 연결 키 포함

---

## 1. 설계 원칙

### 원칙 1. UI는 판단을 직접 하지 않는다
API는 단순 데이터 조회가 아니라,
추천/복귀/정책 흐름을 orchestration한 결과를 반환한다.

### 원칙 2. 모든 핵심 응답에는 연결 키가 포함되어야 한다
- `recommendation_id`
- `option_set_id`
- `selected_option_id`
- `recovery_session_id`

### 원칙 3. MVP는 읽기 쉬운 JSON 중심으로 간다
복잡한 그래프 구조보다,
명확한 request/response shape가 우선이다.

---

## 2. 추천 API

## `POST /recommendations`
현재 컨텍스트를 기준으로 끼니 추천을 요청한다.

### request
```json
{
  "user_id": "u_123",
  "time_slot": "dinner",
  "location_mode": "outside",
  "context_type": "convenience",
  "energy_level": "low",
  "request_source": "user_manual"
}
```

### response
```json
{
  "recommendation_id": "rec_001",
  "option_set_id": "set_001",
  "state_mode": "stable",
  "strategy": {
    "day_strategy": "low_friction"
  },
  "default_option": {
    "option_id": "opt_002",
    "title": "편의점 닭가슴살 + 삼각김밥 + 샐러드",
    "tier": "realistic",
    "adherence_score": 0.84,
    "prep_time_min": 3,
    "budget_band": "medium"
  },
  "alternatives": [
    {
      "option_id": "opt_003",
      "title": "배달 포케 볼 반 공기 옵션",
      "tier": "emergency",
      "adherence_score": 0.76,
      "prep_time_min": 1,
      "budget_band": "high"
    }
  ],
  "rendering_hints": {
    "default_emphasis": true,
    "show_alternatives_collapsed": false
  }
}
```

### acceptance
- recommendation_id, option_set_id가 반드시 반환됨
- default_option은 항상 1개 존재
- alternatives는 0~2개 허용

---

## 3. 식사 선택 API

## `POST /recommendations/select`
추천 옵션 선택을 기록한다.

### request
```json
{
  "user_id": "u_123",
  "recommendation_id": "rec_001",
  "option_set_id": "set_001",
  "selected_option_id": "opt_002"
}
```

### response
```json
{
  "ok": true,
  "selection_id": "sel_001",
  "selected_tier": "realistic"
}
```

### acceptance
- selection 이벤트와 recommendation이 연결 가능해야 함

---

## 4. 식사 기록 API

## `POST /meals/log`
사용자가 실제 식사를 기록한다.

### request
```json
{
  "user_id": "u_123",
  "recommendation_id": "rec_001",
  "selected_option_id": "opt_002",
  "match_level": "similar",
  "log_method": "button",
  "photo_attached": false
}
```

### response
```json
{
  "ok": true,
  "meal_log_id": "log_001",
  "deviation_check_required": false
}
```

### acceptance
- 기록 후 recommendation_to_execution 계산 가능해야 함

---

## 5. 이탈 보고 API

## `POST /meals/deviation`
추천/선택과 다른 식사로 이탈했음을 기록한다.

### request
```json
{
  "user_id": "u_123",
  "recommendation_id": "rec_001",
  "selected_option_id": "opt_002",
  "deviation_type": "ate_other_food",
  "severity": "medium"
}
```

### response
```json
{
  "ok": true,
  "deviation_id": "dev_001",
  "recovery_candidate": true
}
```

---

## 6. failure reason 저장 API

## `POST /meals/failure-reason`
이탈 원인을 구조화된 reason code로 저장한다.

### request
```json
{
  "user_id": "u_123",
  "deviation_id": "dev_001",
  "primary_reason": "ENERGY_LOW",
  "secondary_reasons": ["TIME_SHORTAGE"],
  "captured_from": "user_tap"
}
```

### response
```json
{
  "ok": true,
  "reason_saved": true
}
```

---

## 7. recovery 시작 API

## `POST /recovery/start`
복귀 플로우를 시작한다.

### request
```json
{
  "user_id": "u_123",
  "trigger_event_id": "dev_001",
  "primary_reason": "GUILT_SPIRAL"
}
```

### response
```json
{
  "recovery_session_id": "rcv_001",
  "mode": "no_guilt",
  "message": "오늘을 만회하려 하지 말고, 다음 끼니만 가볍게 복귀해요.",
  "recovery_options": [
    {
      "option_id": "rcv_opt_001",
      "title": "단백질 음료 + 바나나"
    },
    {
      "option_id": "rcv_opt_002",
      "title": "샐러드 + 계란 2개"
    }
  ]
}
```

---

## 8. recovery 선택 API

## `POST /recovery/select`
복귀 옵션 선택을 기록한다.

### request
```json
{
  "user_id": "u_123",
  "recovery_session_id": "rcv_001",
  "selected_recovery_option_id": "rcv_opt_001"
}
```

### response
```json
{
  "ok": true,
  "recovery_selected": true
}
```

---

## 9. 주간 요약 API

## `GET /weekly-summary?user_id=u_123&week=2026-W14`

### response
```json
{
  "user_id": "u_123",
  "summary_week": "2026-W14",
  "executed_meals": 8,
  "recommendation_to_execution_rate": 0.41,
  "next_meal_recovery_rate": 0.29,
  "top_failure_reasons": ["ENERGY_LOW", "DECISION_FATIGUE"],
  "next_week_hint": "평일 저녁은 더 가벼운 복귀형으로 가는 게 좋겠어요."
}
```

---

## 10. 정책 조회 API

## `GET /policies/active?user_id=u_123`

### response
```json
{
  "user_id": "u_123",
  "policy_id": "pol_001",
  "active_rules": [
    "weekday_dinner_emergency_priority_up",
    "decision_fatigue_reduce_options"
  ],
  "effective_from": "2026-03-30T00:00:00+09:00"
}
```

---

## 11. 공통 에러 응답

```json
{
  "ok": false,
  "error_code": "INVALID_REQUEST",
  "message": "time_slot is required"
}
```

권장 error_code:
- `INVALID_REQUEST`
- `NOT_FOUND`
- `POLICY_READ_FAILED`
- `RECOMMENDATION_GENERATION_FAILED`
- `RECOVERY_PLANNER_FAILED`

---

## 12. 최종 권고

MVP에서는 엔드포인트 수를 과하게 늘리지 말고,
위 핵심 흐름만 안정적으로 닫는 것이 중요하다.

핵심은 API 개수가 아니라,
**추천 → 선택 → 기록 → 이탈 → 복귀 → 요약**이 연결되도록 만드는 것이다.
