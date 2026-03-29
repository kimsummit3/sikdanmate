# policy-update-rules-v1.md

## 목적
이 문서는 식단메이트에서 누적된 실패/실행 데이터를 기반으로,
어떻게 다음 추천 정책을 자동 또는 반자동으로 바꿀지 정의한다.

핵심 질문은 이것이다.

> 로그를 쌓는 것에서 끝내지 말고,
> 어떤 조건에서 실제 추천 정책을 변경할 것인가?

---

## 1. 정책 업데이트 원칙

### 원칙 1. 단일 이벤트보다 반복 패턴을 본다
한 번의 실패로 정책을 바꾸지 않는다.
반복되는 패턴이 있을 때 조정한다.

### 원칙 2. 큰 구조보다 작은 마찰부터 줄인다
정책 업데이트는 거대한 재설계보다,
다음 행동을 쉽게 만드는 방향이어야 한다.

### 원칙 3. punishment가 아니라 adaptation이다
실패했으니 더 엄격하게가 아니라,
실패했으니 더 현실적으로 조정한다.

### 원칙 4. 설명 가능한 규칙부터 시작한다
초기 MVP는 복잡한 ML보다,
명시적 규칙 기반 업데이트가 적합하다.

---

## 2. 정책 업데이트 대상

정책 업데이트가 영향을 줄 수 있는 대상:

1. 옵션 수
2. 기본 추천 tier
3. prep time 상한
4. budget weight
5. satiety weight
6. variety rule 강도
7. recovery flow 진입 민감도
8. 특정 시간대 기본 템플릿 사용 여부
9. 특정 컨텍스트(편의점/배달/외식) 우선순위

---

## 3. 핵심 규칙

### Rule A. `DECISION_FATIGUE` 반복
조건:
- 최근 7일 내 `DECISION_FATIGUE` 3회 이상

조치:
- 옵션 수 3개 → 2개 축소
- 기본 추천 1개를 먼저 보여주고 대안은 접기
- 아침은 고정 템플릿 후보로 전환 검토

기대 효과:
- 선택 피로 감소

---

### Rule B. `ENERGY_LOW`가 평일 저녁에 반복
조건:
- 최근 7일 평일 저녁 `ENERGY_LOW` 2회 이상

조치:
- 저녁 기본 추천 tier를 `realistic` 또는 `emergency` 중심으로 전환
- prep time 상한 하향
- 배달/편의점 fallback 가중치 상향

기대 효과:
- 저녁 실행률 상승

---

### Rule C. `TIME_SHORTAGE`가 특정 시간대에 집중
조건:
- 동일 time_slot에서 `TIME_SHORTAGE` 비중 40% 이상

조치:
- 해당 시간대 quick-select 모드 활성화
- 추천 설명 길이 축소
- 원탭 선택 세트 제공

---

### Rule D. `BUDGET_HIGH` 증가
조건:
- 최근 10회 추천 중 `BUDGET_HIGH` 3회 이상

조치:
- price weight 상향
- low-cost 옵션을 기본 추천 후보에 포함
- emergency 옵션에서도 고비용 메뉴 비중 축소

---

### Rule E. `LOW_SATIETY` 반복
조건:
- 최근 7일 `LOW_SATIETY` 2회 이상

조치:
- satiety weight 상향
- 고단백/고포만 옵션 우선
- 샐러드 단독 추천 비중 하향

---

### Rule F. `MENU_FATIGUE` 증가
조건:
- 최근 14일 `MENU_FATIGUE` 2회 이상

조치:
- 동일 카테고리 반복 제한 강화
- 단백질/조리 방식 다양성 룰 상향

---

### Rule G. `GUILT_SPIRAL` 발생
조건:
- 최근 7일 `GUILT_SPIRAL` 1회 이상

조치:
- recovery 민감도 상향
- 일반 추천보다 recovery flow 먼저 제안 가능
- 메시지 톤을 no-guilt 모드로 전환

기대 효과:
- 장기 이탈 방지

---

### Rule H. `LOCATION_CONSTRAINT` 반복
조건:
- 동일 location_mode에서 3회 이상 발생

조치:
- 해당 맥락 전용 옵션 세트 강화
- store/context resolver 우선도 상향
- 실행 불가능한 집밥형 옵션 기본 제외

---

### Rule I. `TASTE_MISMATCH` 반복
조건:
- 동일 카테고리 또는 유사 메뉴군에서 2회 이상 발생

조치:
- 선호 프로필 업데이트
- 유사 메뉴 가중치 하향
- flavor variety 증가

---

## 4. 정책 업데이트 우선순위

정책이 여러 개 동시에 트리거되면 아래 우선순위 적용:

1. 복귀 관련 (`GUILT_SPIRAL`, recovery rules)
2. 실행 가능성 관련 (`ENERGY_LOW`, `TIME_SHORTAGE`, `LOCATION_CONSTRAINT`)
3. 비용/포만감 관련 (`BUDGET_HIGH`, `LOW_SATIETY`)
4. 기호/다양성 관련 (`TASTE_MISMATCH`, `MENU_FATIGUE`)
5. 선택 구조 관련 (`DECISION_FATIGUE`)

이유:
초기 MVP에서는 완벽한 최적화보다
**당장 다음 끼니를 실행 가능하게 만드는 것**이 우선이다.

---

## 5. 정책 저장 형식 예시

```json
{
  "policy_id": "pol_001",
  "user_id": "u_123",
  "active_rules": [
    {
      "rule": "weekday_dinner_energy_low",
      "applied_change": "dinner_emergency_priority_up"
    },
    {
      "rule": "decision_fatigue_reduce_options",
      "applied_change": "option_count_3_to_2"
    }
  ],
  "effective_from": "2026-03-30T00:00:00+09:00"
}
```

---

## 6. 자동 vs 반자동 적용 기준

### 자동 적용해도 되는 것
- 옵션 수 축소
- prep time 상한 하향
- emergency tier 우선순위 상향
- satiety weight 조정
- budget weight 조정

### 반자동 또는 사용자 고지 권장
- meal style 전면 변경
- 아침/점심/저녁 구조 전면 변경
- free-choice 규칙 대폭 변경

이유:
사용자의 인지 없이 전체 전략이 크게 바뀌면 혼란이 생긴다.

---

## 7. 정책 효과 검증

정책 업데이트 후 확인할 핵심 지표:

- recommendation_to_execution_rate
- next_meal_recovery_rate
- failure_reason 재발률
- log_completion_time
- realistic/emergency option selection share

검증 원칙:
- 정책 적용 후 7일 또는 10회 추천 기준으로 재평가
- 개선이 없으면 rule weight를 되돌리거나 수정

---

## 8. 안티패턴

1. 실패가 많다고 더 엄격한 식단을 제시
2. 한 번의 이탈로 대규모 전략 전환
3. reason code는 쌓이는데 추천 정책이 그대로임
4. 사용자가 이해 못하는 자동 변경 누적
5. 복귀 문제를 영양 정밀도로 해결하려 함

---

## 9. MVP 최소 규칙 세트

초기에는 아래 규칙만 먼저 구현해도 충분하다.

1. `DECISION_FATIGUE` → 옵션 수 축소
2. `ENERGY_LOW` → 저녁 emergency 우선
3. `TIME_SHORTAGE` → quick-select 강화
4. `GUILT_SPIRAL` → recovery 우선 진입
5. `LOW_SATIETY` → 고포만 가중치 상향

---

## 최종 한 문장
식단메이트의 policy updater는 똑똑한 추천기를 만드는 장치가 아니라,
**반복되는 실패 패턴을 더 실행 가능한 다음 행동으로 바꾸는 적응 엔진**이어야 한다.
