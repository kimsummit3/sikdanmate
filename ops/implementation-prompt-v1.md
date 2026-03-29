# implementation-prompt-v1.md

## 목적
이 문서는 Codex / Claude Code / ACP 세션에 바로 투입할 수 있는
식단메이트 MVP 1차 구현 지시안이다.

핵심 목표는:
- 문서 정리가 아니라 실제 코드 진입
- 첫 추천-기록 루프 구현
- 이후 recovery와 policy update를 붙일 수 있는 기반 확보

---

## 1. 작업 목표

이번 구현 범위는 **식단메이트 MVP의 1차 운영 루프**다.

반드시 포함할 것:
1. onboarding profile schema
2. profile state aggregation
3. strategy planner v1
4. option generator v1
5. lightweight meal logging
6. event schema v1의 최소 핵심 이벤트 저장

이번 라운드에서 제외 가능:
- 정교한 nutrition 계산
- price engine 고도화
- store finder
- full recovery planner 완성
- weekly summary UI 완성
- policy updater 완성

---

## 2. 참고 문서

작업 시작 전에 반드시 아래 문서를 읽고 기준으로 삼을 것.

### 제품/하네스 문서
- `product/harness-review-v1.md`
- `product/orchestration-flow-v1.md`
- `product/runtime-architecture-v1.md`

### 계약/스키마 문서
- `product/api-contract-v1.md`
- `product/data-model-v1.md`
- `product/service-interfaces-v1.md`
- `ops/event-schema-v1.md`
- `product/decision-contracts/profile-state.md`
- `product/decision-contracts/strategy-planner.md`
- `product/decision-contracts/option-generator.md`
- `product/decision-contracts/adherence-evaluator.md`

### 우선순위 문서
- `product/implementation-backlog-v1.md`
- `ops/github-issues-seed-v1.md`

---

## 3. 이번 라운드의 진짜 성공 기준

이 라운드의 목적은 "똑똑한 식단 AI"를 완성하는 것이 아니다.

진짜 성공 기준은 아래다.

1. 사용자가 기본 프로필을 입력할 수 있다
2. 현재 컨텍스트를 바탕으로 추천 요청을 보낼 수 있다
3. 시스템이 기본 추천 1개 + 대안 1~2개를 반환할 수 있다
4. 사용자가 선택한 식사를 가볍게 기록할 수 있다
5. 추천 → 선택 → 기록 이벤트 흐름이 저장된다

즉,
**첫 추천-기록 루프가 실제로 닫히는가**가 핵심이다.

---

## 4. 구현 범위 상세

### A. onboarding profile schema
구현 항목:
- goal_mode
- meal_style
- cooking_capacity
- budget_level
- avoid_foods

완료 기준:
- profile 저장 가능
- 이후 recommendation 요청에서 읽을 수 있음

### B. profile state aggregation
구현 항목:
- user profile 읽기
- 현재 요청 context 병합
- 최소한의 state object 생성

state 예시:
- goal_mode
- meal_style
- cooking_capacity
- budget_level
- avoid_foods
- current_context(time_slot/location_mode/context_type/energy_level)

### C. strategy planner v1
구현 방식:
- 규칙 기반으로 충분
- low_friction / convenience_first / high_satiety 정도만 우선 지원

완료 기준:
- state 입력 시 strategy object 반환

### D. option generator v1
구현 방식:
- 템플릿 기반으로 시작 가능
- ideal / realistic / emergency tier 지원
- 현재 맥락에 맞는 옵션만 생성

완료 기준:
- default option 1개 + alternatives 0~2개 반환

### E. lightweight meal logging
구현 항목:
- exact / similar / deviated 버튼형 기록
- recommendation_id / selected_option_id 연결

완료 기준:
- recommendation_to_execution 계산 가능한 데이터 저장

### F. event schema 최소 구현
최소 이벤트:
- `meal_recommendation_requested`
- `meal_options_presented`
- `meal_option_selected`
- `meal_logged`

가능하면 추가:
- `meal_deviation_reported`

완료 기준:
- event_log 또는 동등 구조에 저장 가능

---

## 5. 권장 구현 순서

1. 데이터 모델 최소 구현
   - user_profile
   - recommendation
   - meal_log
   - event_log

2. API 최소 구현
   - `POST /recommendations`
   - `POST /recommendations/select`
   - `POST /meals/log`

3. service layer 구현
   - ProfileStateService
   - StrategyPlannerService
   - OptionGeneratorService

4. orchestrator 구현
   - RecommendationOrchestrator

5. UI 또는 테스트 호출 경로 연결

6. event tracking 연결

---

## 6. 기술 원칙

### 반드시 지킬 것
1. UI에 추천 판단 로직 넣지 말 것
2. conversation/UI와 decision layer를 분리할 것
3. recommendation_id / option_set_id / selected_option_id 연결 키를 유지할 것
4. 추후 recovery와 policy update가 붙을 수 있게 service boundary를 유지할 것

### 이번 라운드에서 괜히 하지 말 것
1. 과도한 LLM 의존 추천 로직
2. 영양 계산 고도화
3. 가격 엔진 붙이기
4. voice-first 구조 선행
5. 너무 복잡한 DB 정규화

---

## 7. 산출물 기대값

최소 산출물:
- 동작하는 recommendation request 흐름
- 동작하는 meal logging 흐름
- 기본 state/strategy/options 생성 코드
- event 저장
- README 또는 간단한 실행/테스트 메모

가능하면 좋은 산출물:
- mock data / seed data
- 기본 시나리오 테스트
- fallback option templates

---

## 8. acceptance criteria

아래 시나리오가 재현되면 성공으로 본다.

### 시나리오 1
- 사용자가 onboarding을 완료한다
- 저녁 / 밖 / 편의점 / 에너지 낮음 상태로 추천 요청
- 시스템이 realistic 중심 기본 추천 1개와 대안 1개를 반환한다

### 시나리오 2
- 사용자가 추천 옵션을 선택한다
- similar로 기록한다
- selection/log 이벤트가 저장된다

### 시나리오 3
- 기록 데이터를 기준으로 recommendation과 meal_log가 연결된다
- recommendation_to_execution 계산이 가능하다

---

## 9. 최종 구현 톤

이번 라운드는 제품 완성도가 아니라,
**운영 루프의 첫 닫힘**이 중요하다.

즉 이렇게 접근할 것:
- simple
- explicit
- testable
- extendable

"좋아 보이는 데모"보다
"다음 라운드에서 recovery를 붙일 수 있는 구조"가 더 중요하다.

---

## 10. 에이전트에게 줄 한 문장 요약

> 식단메이트 MVP 1차 구현에서는 똑똑한 추천 완성보다,
> onboarding → recommendation → selection → logging → event tracking까지 이어지는
> 첫 실행 루프를 안정적으로 닫는 데 집중하라.
