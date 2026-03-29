# orchestration-flow-v1.md

## 목적
이 문서는 식단메이트 MVP에서 각 엔진이 **어떤 순서로 호출되고**, 어떤 조건에서 분기하며,
어디서 복귀/학습/재추천이 일어나는지 정의한다.

핵심 목표는 하나다.

> 대화는 부드럽게 유지하되,
> 실제 추천 판단은 재현 가능한 결정 흐름으로 고정한다.

---

## 1. 오케스트레이션 원칙

### 원칙 1. Conversation은 입구이자 출력창이다
- 사용자 의도 파악
- 상황 수집
- 추천 결과 전달
- 복귀 유도

하지만 실제 추천 판단은 뒤의 결정 엔진이 맡는다.

### 원칙 2. 추천과 복귀는 다른 플로우다
- 정상 추천 플로우
- recovery 플로우

두 흐름은 진입 조건과 목표가 다르다.

### 원칙 3. 계산 엔진은 결정 엔진을 보조한다
- Nutrition
- Price
- Store

이 레이어는 근거를 제공할 뿐, 최종 추천 순위를 정하지 않는다.

### 원칙 4. 모든 이탈 이벤트는 학습 이벤트다
- 실패는 종료가 아니라 입력이다.
- reason code를 남기고 다음 정책에 반영한다.

---

## 2. 핵심 플로우 개요

식단메이트 MVP의 주요 플로우는 4개다.

1. 오늘 한 끼 추천 플로우
2. 식사 기록 플로우
3. 이탈 후 recovery 플로우
4. 주간 요약 및 정책 업데이트 플로우

---

## 3. 플로우 A — 오늘 한 끼 추천

### 트리거
- 사용자가 앱 진입
- "오늘 뭐 먹지" 요청
- 특정 끼니 시간대 자동 리마인드

### 단계

#### Step A1. Intent / Context Capture
Conversation/UI가 수집:
- 지금 끼니 (아침/점심/저녁/간식)
- 현재 위치 (집/밖/회사/이동 중)
- 시간 여유
- 현재 에너지 수준
- 특별 상황 (외식/편의점/배달)

#### Step A2. Profile State Load
호출:
- `Profile State Manager`

출력:
- 현재 추천 판단에 필요한 상태 객체

#### Step A3. Strategy Selection
호출:
- `Strategy Planner`

출력:
- 오늘/이번 끼니의 운영 전략
예:
- low friction
- convenience first
- high satiety
- recovery-sensitive

#### Step A4. Option Generation
호출:
- `Meal Option Generator`

출력:
- ideal / realistic / emergency 옵션 세트

#### Step A5. Hard Constraint Validation
호출:
- `Constraint Validator`

처리:
- 금지 음식 제거
- 시간/예산/상황 위반 옵션 제거

#### Step A6. Adherence Scoring
호출:
- `Adherence Evaluator`

처리:
- 실행 가능성 점수 계산
- 실패 리스크 태깅
- 옵션 우선순위 재정렬

#### Step A7. Response Rendering
Conversation/UI가 출력:
- 기본 추천 1개
- 대안 1~2개
- 너무 많은 설명 없이 바로 선택 가능하게 제시

### 산출 이벤트
- `meal_recommendation_requested`
- `meal_options_presented`

---

## 4. 플로우 B — 식사 선택 및 기록

### 트리거
- 사용자가 추천 옵션 선택
- 사용자가 직접 먹은 것을 기록

### 단계

#### Step B1. Selection Capture
이벤트 저장:
- `meal_option_selected`

속성:
- selected_tier
- adherence_score
- context_type

#### Step B2. Lightweight Logging
입력 방식:
- 버튼형 기록
- 사진 기반 기록
- 잘 지켰음 / 비슷함 / 벗어남

이벤트 저장:
- `meal_logged`

#### Step B3. Deviation Detection
조건:
- 계획과 크게 다른 섭취
- 선택 후 미실행
- 과식/외식/야식 등 이탈 발생

이벤트 저장:
- `meal_deviation_reported`

#### Step B4. Failure Reason Capture
호출:
- reason code selector 또는 추론 로직

이벤트 저장:
- `failure_reason_saved`

---

## 5. 플로우 C — recovery 플로우

### 진입 조건
아래 중 하나라도 만족하면 recovery flow 검토:
- `meal_deviation_reported`
- 선택 후 장시간 미실행
- 사용자가 "망했다", "오늘 끝났다"류 표현
- 야식/회식/폭식 후 자기 보고

### 단계

#### Step C1. Recovery Eligibility Check
오케스트레이터 판단:
- 지금 일반 추천보다 recovery가 맞는가?

우선 조건 예:
- guilt signal 존재
- deviation severity 높음
- 연속 실패 패턴 존재

#### Step C2. Recovery Planning
호출:
- `Recovery Planner`

출력:
- no-guilt 메시지 모드
- 가장 쉬운 다음 끼니 액션
- recovery 옵션 2~3개

#### Step C3. Recovery Delivery
Conversation/UI 출력 원칙:
- 죄책감 유발 금지
- 칼로리 보상/과한 통제 권유 금지
- 다음 끼니 기준 리셋 제안

예:
- "오늘 망한 걸 만회하려 하지 말고, 다음 끼니만 가볍게 복귀해요"

#### Step C4. Recovery Action Capture
이벤트 저장:
- `recovery_flow_started`
- `recovery_option_selected`

#### Step C5. Recovery Success Check
조건:
- 다음 끼니 내 기록/선택이 발생

이벤트 저장:
- `recovery_success_marked`

---

## 6. 플로우 D — 주간 요약 및 정책 업데이트

### 트리거
- 주간 요약 시점 도달
- 특정 실행/이탈 데이터 충분히 누적

### 단계

#### Step D1. Weekly Aggregation
집계:
- 추천→선택률
- 선택→기록률
- 다음 끼니 복귀율
- reason code 분포
- tier 선택 분포

#### Step D2. Pattern Detection
탐지 예:
- 평일 저녁 `ENERGY_LOW` 반복
- 아침 선택률 지속 하락
- `DECISION_FATIGUE` 비중 높음
- `GUILT_SPIRAL` 이후 장기 이탈 발생

#### Step D3. Policy Update Proposal
호출:
- `Policy Updater` 또는 rule engine

출력 예:
- 아침 고정형 전환
- 평일 저녁 emergency 우선 제시
- 옵션 수 3개 → 2개 축소
- high satiety 가중치 상향

#### Step D4. Weekly Summary Rendering
사용자에게 보여주는 것:
- 죄책감 없는 요약
- 다음 주 한 줄 조정 제안

이벤트 저장:
- `weekly_summary_generated`
- `policy_update_applied`

---

## 7. 상태 전이 관점

### 정상 상태
`stable`
- 일반 추천 루프 중심

### 주의 상태
`fragile`
- 최근 실패 증가
- recovery 민감 상태

### 복귀 상태
`recovery`
- 일반 최적화보다 흐름 복원 우선

### 재안정화 상태
`stabilizing`
- recovery 성공 이후 normal로 복귀하는 중

오케스트레이터는 이 상태를 기반으로
추천 강도, 옵션 수, 메시지 톤을 조정할 수 있다.

---

## 8. MVP 의사결정 우선순위

추천 생성 시 우선순위:

1. 금지 조건 미위반
2. 현재 맥락 적합성
3. 실행 가능성
4. 낮은 입력 마찰
5. 포만감/만족도
6. 영양 정합성
7. 다양성
8. 비용 최적화

주의:
초기 MVP에서는 영양/비용 최적화가 1순위가 아니다.

---

## 9. 실패 시 fallback 정책

### Generator 실패
- 템플릿 기반 기본 옵션 세트 반환

### Adherence Evaluator 실패
- realistic tier를 기본 추천으로 설정

### Recovery Planner 실패
- 기본 recovery script 사용
  - 예: "다음 끼니는 가장 쉬운 기본 세트로 바로 복귀"

### Failure reason 미수집
- `UNKNOWN`으로 저장하되,
- 다음 상호작용에서 재수집 시도

---

## 10. 구현 체크리스트

### MVP에서 반드시 필요한 것
- Profile State Load
- Strategy Planner
- Option Generator
- Constraint Validator
- Adherence Evaluator
- Recovery Planner
- failure reason capture
- weekly policy update

### 나중에 붙여도 되는 것
- 고정밀 nutrition optimizer
- 정교한 price comparison
- full voice-first experience
- 장기 월간 자동 플래너

---

## 최종 한 문장
식단메이트의 오케스트레이션은
**"추천을 만드는 흐름"**이 아니라,
**"사용자가 다음 끼니를 고르고, 무너져도 다시 복귀하게 만드는 운영 흐름"**이어야 한다.
