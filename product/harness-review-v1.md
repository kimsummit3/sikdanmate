# 식단메이트 하네스 구조 리뷰 v1

## 한 줄 결론
식단메이트의 문제는 제품 방향이 아니라 **하네스 잠금 부족**이다.

지금 문서상 방향은 맞다.
- 식단 정보 앱이 아니라 실행 도구
- 죄책감이 아니라 복귀 중심
- 숫자보다 흐름
- 기록보다 지속

하지만 현재 구조는 아직 **엔진 목록**에 가깝고,
실제 서비스 하네스로 보려면 **결정 책임, 검증 계약, 학습 루프**가 더 명확해야 한다.

---

## 1. 현재 구조 평가

현재 문서상 핵심 구성:
- Conversation / Voice Agent
- Planner Engine
- Nutrition Calculator
- Price Engine
- Store Finder
- Memory
- Feedback Loop

이 구성의 장점:
1. 문제 정의가 정확하다
   - 사용자는 정보 부족이 아니라 지속 실패가 문제라는 관점이 맞다.
2. 복귀 UX를 제품 중심에 둔 점이 좋다
   - 식단 앱의 차별점이 추천이 아니라 복귀 설계라는 점을 잡고 있다.
3. Memory / Feedback Loop를 이미 상정하고 있다
   - 일회성 추천 앱이 아니라 운영 시스템 방향이다.

하지만 현재 구조의 약점:
1. 각 엔진의 **입력/출력 계약**이 느슨하다.
2. 대화 에이전트가 판단까지 먹을 위험이 있다.
3. 실행 가능성을 평가하는 독립 계층이 약하다.
4. 실패 데이터가 쌓여도 다음 정책을 바꾸는 구조가 약하다.

---

## 2. 핵심 진단

### 진단 1. Conversation Agent와 Decision Engine이 충분히 분리되지 않았다
대화는 사용자 경험 레이어이고,
추천/검증/우선순위 결정은 판단 레이어다.

이 둘이 섞이면 다시 단일 에이전트 구조 문제가 생긴다.
- 컨텍스트가 길어질수록 불안정
- 자기합리화
- 설명과 판단이 뒤섞임
- 테스트 가능한 결정 계약 부재

### 진단 2. Nutrition 정합성과 실제 실행 가능성은 다른 문제다
식단메이트의 승부처는 영양 정답이 아니라 **실행 지속성**이다.

즉 다음 질문을 별도로 평가해야 한다.
- 이 사용자가 오늘 이걸 실제로 먹을 가능성이 높은가?
- 이 선택지가 지금 상황에서 귀찮지 않은가?
- 시간, 예산, 장소, 감정 상태와 충돌하지 않는가?

현재 구조에는 이 질문을 전담하는 **Adherence Evaluator**가 없다.

### 진단 3. Recovery는 일반 추천의 하위 기능이 아니라 별도 모드다
정상 상태 추천과,
식단이 깨진 뒤 복귀시키는 추천은 목표 자체가 다르다.

복귀 모드의 목표:
- 죄책감 제거
- 가장 쉬운 다음 행동 제시
- 흐름 복원
- 실패의 연쇄 차단

따라서 Recovery Planner를 별도 모드 또는 별도 엔진으로 분리해야 한다.

### 진단 4. Feedback Loop가 정책 변경까지 연결되어야 한다
로그 수집만으로는 의미가 약하다.

예:
- 아침 선택률이 낮다 → 아침은 고정 템플릿으로 전환
- 평일 저녁 이탈이 많다 → 저녁 조리 난이도 하향
- 배달 상황 실패가 많다 → 배달 fallback 세트 강화

즉 Feedback는 기록 저장이 아니라 **정책 업데이트 입력**이 되어야 한다.

---

## 3. 권장 하네스 구조

### A. Interface Layer
역할:
- 사용자 입력 수집
- 제안 결과 표시
- 체크인/기록/복귀 인터랙션

구성:
- Conversation / Voice Agent
- Mobile UI
- Quick action buttons

원칙:
- 여기서는 판단하지 않는다.
- 의도 파악, 설명, 유도만 담당한다.

---

### B. Decision Layer

#### 1) Profile State Manager
역할:
- 사용자 고정 조건과 변동 상태 관리

입력 예:
- 목표(감량/유지/습관 개선)
- 예산
- 조리 가능 여부
- 선호/기피 음식
- 외식 빈도
- 직전 실패 패턴

출력 예:
- 현재 의사결정에 필요한 사용자 상태 객체

#### 2) Strategy Planner
역할:
- 일간/주간 식단 전략 수립
- 메뉴 세부안이 아니라 전략 결정

출력 예:
- 이번 주 아침은 고정형
- 평일 점심은 외식 대응형
- 저녁은 조리 15분 이하
- 주말 1회 자유식 허용

#### 3) Meal Option Generator
역할:
- 실제 끼니 옵션 생성

원칙:
- 항상 단일안이 아니라 복수안 생성
- 최소 3개 레이어 권장
  - ideal
  - realistic
  - emergency

#### 4) Constraint Validator
역할:
- 하드 제약조건 검사

검사 항목 예:
- 금지 음식 포함 여부
- 예산 초과 여부
- 준비 시간 초과 여부
- 기본 목표 범위 위반 여부

#### 5) Adherence Evaluator
역할:
- 사용자가 실제로 따를 가능성 평가

평가 항목 예:
- 현재 상황 적합성
- 귀찮음 수준
- 과거 실패 패턴 충돌 여부
- 대체재 접근성
- 포만감/만족도 리스크

출력:
- 실행 가능성 점수
- 실패 리스크 요약
- 추천 우선순위 재정렬

#### 6) Recovery Planner
역할:
- 이탈 이후 다음 끼니 중심 복귀안 생성

원칙:
- 손실 만회보다 흐름 복원이 우선
- 죄책감 유발 문구 금지
- 가장 쉬운 다음 행동 제시

---

### C. Intelligence Support Layer
역할:
- 판단 엔진에 필요한 계산/검색 지원

구성:
- Nutrition Calculator
- Price Engine
- Store Finder
- Context Resolver (편의점/배달/외식/집밥 상황 판별)

원칙:
- 이 레이어는 결정을 내리지 않는다.
- 근거 데이터와 보조 계산만 제공한다.

---

### D. Learning Layer

#### 1) Memory
저장 항목:
- 선호/기피
- 성공률 높은 조합
- 자주 무너지는 시간대
- 배달/외식/편의점 패턴

#### 2) Failure Reason Classifier
실패 분류 예:
- 시간 부족
- 재료 부족
- 외부 일정
- 맛 불만
- 포만감 부족
- 비용 부담
- 선택 피로
- 죄책감/멘탈 이탈

#### 3) Policy Updater
역할:
- 누적 피드백을 다음 추천 정책으로 반영

출력 예:
- 아침은 설명형 추천 대신 고정 템플릿
- 평일 저녁은 emergency 우선 제시
- 월요일 점심은 외식 최적화 우선

---

### E. Control Layer
역할:
- 전체 흐름 제어
- 실패 시 fallback 관리
- 비용/지연/반복 횟수 통제
- 사람 승인 필요 지점 관리

구성:
- Orchestrator
- Retry / timeout policy
- Human override point

---

## 4. 모듈별 I/O 계약 초안

### 4.1 Profile State Manager
입력:
- onboarding profile
- 최근 식사 기록
- 최근 이탈 이벤트
- 현재 시간/장소/상황

출력:
```json
{
  "goal_mode": "fat_loss",
  "meal_style": "convenience_first",
  "cooking_capacity": "low",
  "budget_level": "medium",
  "avoid_foods": ["가지"],
  "known_failure_patterns": ["weekday_dinner_skip", "late_night_delivery"],
  "current_context": {
    "time_slot": "dinner",
    "location_mode": "outside",
    "energy_level": "low"
  }
}
```

### 4.2 Strategy Planner
입력:
- profile state
- 최근 7일 adherence summary

출력:
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

### 4.3 Meal Option Generator
입력:
- profile state
- strategy

출력:
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

### 4.4 Constraint Validator
출력:
```json
{
  "passed": true,
  "violations": [],
  "notes": ["budget_ok", "avoid_foods_ok", "time_ok"]
}
```

### 4.5 Adherence Evaluator
출력:
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

### 4.6 Recovery Planner
출력:
```json
{
  "recovery_message_mode": "no_guilt",
  "next_best_action": "다음 끼니는 편의점 기본 세트로 바로 복귀",
  "recovery_options": [
    "단백질 음료 + 바나나",
    "샐러드 + 계란 2개",
    "김밥 반줄 + 닭가슴살"
  ]
}
```

---

## 5. MVP에서 반드시 남길 것

### 남겨야 할 것
1. 오늘 한 끼 빠른 결정
2. 초저마찰 기록
3. 실패 후 다음 끼니 복귀
4. 최소한의 개인화 상태 관리
5. failure reason 분류
6. realistic/emergency 중심 추천

### 있어야 하지만 가볍게 시작할 것
1. Memory
2. Recovery Planner
3. Adherence Evaluator
4. 주간 피드백 요약

---

## 6. MVP에서 과감히 미뤄도 되는 것

1. 고정밀 영양 최적화
2. 고도화된 가격 비교
3. 정교한 매장 추천
4. 풀 보이스 우선 설계
5. 복잡한 주간/월간 식단 자동 생성
6. 대규모 레시피 허브

이 기능들은 가치가 없어서가 아니라,
초기 검증 질문이 아니기 때문에 미루는 게 맞다.

초기 핵심 질문은 이것이다.

> 사용자가 식단을 더 잘 아는가가 아니라,
> **실제로 다음 끼니를 더 잘 고르고, 더 빨리 복귀하는가?**

---

## 7. 권장 이벤트 모델

### 핵심 이벤트
- `meal_recommendation_requested`
- `meal_options_presented`
- `meal_option_selected`
- `meal_logged`
- `meal_deviation_reported`
- `recovery_flow_started`
- `recovery_option_selected`
- `weekly_summary_generated`

### 필수 속성
- user_id
- time_slot
- location_mode
- context_type (home / outside / convenience / delivery)
- selected_tier (ideal / realistic / emergency)
- adherence_score
- failure_reason_code
- resumed_within_next_meal (bool)

이 이벤트 모델이 있어야
추천 품질보다 **행동 전환 품질**을 볼 수 있다.

---

## 8. KPI 재정렬 제안

현재 방향과 맞는 KPI는 아래다.

### 핵심 KPI
1. 첫 세션에서 첫 끼니 선택 완료율
2. 추천 후 실제 기록 전환율
3. 다음 끼니 복귀율
4. 7일 내 3회 이상 실행 비율
5. emergency 옵션 사용 비율
6. 실패 후 24시간 내 복귀율

### 보조 KPI
1. 추천 생성 시간
2. 기록 입력 시간
3. 반복 사용 주기
4. recovery flow 진입률

주의:
칼로리 정확도나 복잡한 영양 점수는 초기 KPI 중심이 되면 안 된다.

---

## 9. GitHub / 디렉토리 구조 권장안

```text
product/
  prd.md
  system-architecture-v2.md
  harness-review-v1.md
  decision-contracts/
    profile-state.md
    strategy-planner.md
    option-generator.md
    adherence-evaluator.md
    recovery-planner.md

ops/
  experiment-log.md
  launch-checklist.md
  metrics-definition.md
  failure-reason-codes.md

data/
  personas/
  meal-scenarios/
  recovery-scenarios/
```

특히 아래 문서는 바로 필요하다.
- `ops/failure-reason-codes.md`
- `ops/metrics-definition.md`
- `product/decision-contracts/*`

---

## 10. 최종 권고

### 지금 바로 해야 할 것
1. Conversation Agent와 Decision Engine 책임 분리
2. Adherence Evaluator 추가
3. Recovery Planner 별도 모드화
4. Failure reason code 정의
5. Feedback → Policy update 경로 명시

### 하지 말아야 할 것
1. 음성 UX를 먼저 과하게 밀기
2. 영양 엔진 정확도를 초기에 과하게 약속하기
3. 주간/월간 자동 플래너를 먼저 무겁게 만들기
4. 추천 품질을 설명력으로 착각하기

---

## 최종 한 문장
식단메이트는 **식단 추천 앱**으로 가면 약해지고,
**식단 복귀율을 올리는 실행 운영 시스템**으로 가면 강해진다.

그 차이를 만드는 것은 모델의 똑똑함이 아니라,
**Profile → Plan → Generate → Validate → Adherence → Recover → Learn** 하네스 구조다.
