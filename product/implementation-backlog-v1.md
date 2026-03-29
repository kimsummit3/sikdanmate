# implementation-backlog-v1.md

## 목적
이 문서는 식단메이트의 하네스 설계를 실제 구현 단위로 분해한 1차 백로그다.

원칙:
- 큰 기능보다 운영 루프 우선
- 추천 품질보다 실행/복귀 루프 우선
- 복잡한 최적화보다 계측과 적응 우선

---

## Epic 1. Core User State

### 1-1. onboarding profile schema 정의
- 목표, 식단 스타일, 조리 가능 여부, 예산감, 기피 음식 저장
- acceptance:
  - 필수 상태가 DB 또는 로컬 스토리지에 저장됨
  - 이후 추천 호출에서 재사용 가능

### 1-2. profile state aggregation 로직
- 최근 기록, 실패 reason, 현재 context를 합쳐 state 객체 생성
- acceptance:
  - profile state contract 형식으로 응답
  - time_slot / location_mode / known_failure_patterns 포함

### 1-3. current context capture
- 현재 위치/상황/에너지 수준 간단 입력
- acceptance:
  - 추천 요청 전에 context를 최소 탭으로 수집 가능

---

## Epic 2. Recommendation Flow MVP

### 2-1. strategy planner v1
- low friction / convenience first / high satiety 등 규칙 기반 전략 생성
- acceptance:
  - profile + recent events 입력 시 strategy object 반환

### 2-2. option generator v1
- ideal / realistic / emergency 옵션 생성
- acceptance:
  - 최소 2개 이상 옵션 반환
  - 각 옵션에 title / tier / prep_time / budget_band 포함

### 2-3. constraint validator v1
- 금지 음식, 시간, 예산, 맥락 위반 옵션 제거
- acceptance:
  - invalid option이 사용자에게 노출되지 않음

### 2-4. adherence evaluator v1
- 실행 가능성 점수 계산 및 옵션 재정렬
- acceptance:
  - recommendation response에 adherence_score 포함
  - realistic가 실제 기본 추천이 될 수 있음

### 2-5. recommendation response renderer
- 기본 추천 1개 + 대안 1~2개 출력
- acceptance:
  - decision fatigue를 유발하지 않는 UI 구조 제공

---

## Epic 3. Logging & Deviation Loop

### 3-1. lightweight meal logging
- 버튼형 기록: exact / similar / deviated
- acceptance:
  - 3탭 이내 기록 완료 가능

### 3-2. photo log attachment stub
- 사진 첨부 여부만 우선 저장
- acceptance:
  - 이미지 자체 분석은 후순위, attachment 흐름만 확보

### 3-3. deviation event creation
- 선택 후 미실행 또는 계획과 다른 섭취 기록
- acceptance:
  - meal_deviation_reported 이벤트 저장

### 3-4. failure reason capture UI
- reason code 선택 UI
- acceptance:
  - primary reason 필수 저장
  - 최소 8개 핵심 reason code 지원

---

## Epic 4. Recovery System

### 4-1. recovery eligibility check
- 어떤 이탈에서 recovery flow를 띄울지 규칙 정의
- acceptance:
  - deviation + guilt signal 시 recovery 진입 가능

### 4-2. recovery planner v1
- no-guilt 문구 + 다음 끼니 복귀 옵션 2~3개 생성
- acceptance:
  - 일반 추천과 별도 response 구조 제공

### 4-3. recovery success tracking
- 다음 끼니 내 복귀 성공 판정
- acceptance:
  - recovery_success_marked 이벤트 저장

---

## Epic 5. Event Instrumentation

### 5-1. event schema implementation
- event-schema-v1 기준 payload 적용
- acceptance:
  - recommendation_id / option_set_id / recovery_session_id 연결 가능

### 5-2. analytics pipeline storage
- 최소 JSON event 저장소 구성
- acceptance:
  - 핵심 이벤트 조회 가능
  - KPI 계산에 필요한 필드 누락 없음

### 5-3. session/event correlation
- 한 세션 내 추천-선택-기록 흐름 연결
- acceptance:
  - recommendation_to_execution 계산 가능

---

## Epic 6. Weekly Learning Loop

### 6-1. weekly aggregation job
- 추천→선택률, 선택→기록률, next meal recovery rate 집계
- acceptance:
  - 주간 단위 summary 생성

### 6-2. failure reason distribution summary
- 최근 7일 reason code 분포 계산
- acceptance:
  - primary reason top list 산출

### 6-3. policy update rules v1
- energy_low / decision_fatigue / guilt_spiral 등 반영
- acceptance:
  - rule trigger 시 policy_update_applied 이벤트 저장

### 6-4. weekly summary UI/copy
- 죄책감 없는 요약 화면
- acceptance:
  - 지난주 유지/복귀 현황과 다음 주 한 줄 제안 표시

---

## Epic 7. Runtime & Architecture

### 7-1. recommendation service boundary 정의
- UI와 판단 엔진 호출 경계 분리
- acceptance:
  - conversation/UI가 직접 판단 로직을 가지지 않음

### 7-2. policy state storage
- 사용자별 active policy 저장
- acceptance:
  - 추천 시 policy overlay 적용 가능

### 7-3. fallback templates
- generator/evaluator 실패 시 기본 추천 세트 반환
- acceptance:
  - 서비스 중단 없이 최소 추천 가능

---

## Epic 8. MVP QA

### 8-1. event integrity QA
- 이벤트 누락/연결 키 누락 점검

### 8-2. recommendation scenario QA
- 집/밖/편의점/배달/저에너지 상황 테스트

### 8-3. recovery scenario QA
- 야식/회식/죄책감 흐름 테스트

### 8-4. metrics dashboard smoke test
- 핵심 KPI 계산 가능 여부 확인

---

## 추천 구현 순서

### Phase 1
- onboarding profile schema
- profile state aggregation
- strategy planner v1
- option generator v1
- lightweight meal logging
- event schema implementation

### Phase 2
- constraint validator
- adherence evaluator
- failure reason capture
- deviation event creation
- recommendation renderer 개선

### Phase 3
- recovery eligibility check
- recovery planner v1
- recovery success tracking
- weekly aggregation

### Phase 4
- policy update rules
- weekly summary UI
- fallback templates
- metrics dashboard

---

## 최종 한 문장
초기 구현의 우선순위는 더 똑똑한 추천이 아니라,
**추천 → 기록 → 이탈 → 복귀 → 학습** 루프를 실제로 닫는 것이다.
