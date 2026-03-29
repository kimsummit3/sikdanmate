# github-issues-seed-v1.md

## 목적
이 문서는 식단메이트 MVP 구현을 위해 GitHub Issues로 바로 옮길 수 있는 1차 시드 목록이다.

형식:
- 제목
- 목적
- 핵심 작업
- 완료 기준

---

## Issue 1. Define onboarding profile schema
**목적**
추천 판단에 필요한 최소 사용자 상태를 정의한다.

**핵심 작업**
- goal_mode / meal_style / cooking_capacity / budget_level / avoid_foods 정의
- 저장 구조 결정
- 기본값 정책 정의

**완료 기준**
- profile-state contract에 필요한 필드가 저장 가능

---

## Issue 2. Implement profile state aggregation
**목적**
프로필 + 최근 이벤트 + 현재 컨텍스트를 합쳐 recommendation input state를 만든다.

**핵심 작업**
- 최근 7일 이벤트 읽기
- known_failure_patterns 계산
- current_context merge

**완료 기준**
- state object를 API 또는 함수로 반환 가능

---

## Issue 3. Build strategy planner v1
**목적**
하루/끼니 단위 운영 전략을 규칙 기반으로 생성한다.

**핵심 작업**
- low friction / convenience first / high satiety 규칙 정의
- strategy output schema 구현

**완료 기준**
- profile state 입력 시 strategy object 반환

---

## Issue 4. Build meal option generator v1
**목적**
ideal / realistic / emergency 옵션 세트를 생성한다.

**핵심 작업**
- 기본 옵션 템플릿 설계
- context별 옵션 분기

**완료 기준**
- 최소 2~3개 옵션 반환 가능

---

## Issue 5. Add constraint validator
**목적**
금지 조건 위반 옵션이 노출되지 않게 한다.

**핵심 작업**
- avoid foods
- prep time ceiling
- budget band
- location/context mismatch

**완료 기준**
- invalid option이 응답에서 제거됨

---

## Issue 6. Add adherence evaluator v1
**목적**
실제 실행 가능성 기준으로 옵션을 재정렬한다.

**핵심 작업**
- adherence score 계산 규칙 정의
- risk flags 출력

**완료 기준**
- recommendation response에 ranked options 포함

---

## Issue 7. Build lightweight meal logging
**목적**
초저마찰 기록 루프를 구현한다.

**핵심 작업**
- exact / similar / deviated 버튼형 기록
- recommendation과 로그 연결

**완료 기준**
- 3탭 이내 기록 완료

---

## Issue 8. Add deviation event handling
**목적**
계획 이탈을 이벤트로 기록한다.

**핵심 작업**
- meal_deviation_reported 생성
- severity / deviation_type 정의

**완료 기준**
- 이탈 이벤트를 analytics에서 조회 가능

---

## Issue 9. Add failure reason code capture
**목적**
이탈 원인을 구조화된 reason code로 저장한다.

**핵심 작업**
- 핵심 8개 reason code UI 제공
- primary reason 필수 저장

**완료 기준**
- failure_reason_saved 이벤트 기록 가능

---

## Issue 10. Build recovery planner v1
**목적**
이탈 후 다음 끼니 복귀 플로우를 구현한다.

**핵심 작업**
- recovery eligibility check
- no-guilt recovery options 생성

**완료 기준**
- recovery flow 시작 및 옵션 선택 가능

---

## Issue 11. Track recovery success
**목적**
복귀 플로우가 실제 행동으로 이어졌는지 측정한다.

**핵심 작업**
- next meal window 정의
- recovery_success_marked 이벤트 구현

**완료 기준**
- next_meal_recovery_rate 계산 가능

---

## Issue 12. Implement event schema v1
**목적**
추천→선택→실행→복귀 흐름 전체를 계측한다.

**핵심 작업**
- recommendation_id / option_set_id / recovery_session_id 도입
- 핵심 이벤트 9종 저장

**완료 기준**
- KPI 계산에 필요한 이벤트 키 누락 없음

---

## Issue 13. Build weekly aggregation job
**목적**
핵심 KPI와 reason code 분포를 주간 단위 집계한다.

**핵심 작업**
- recommendation_to_execution
- next_meal_recovery
- failure reason distribution

**완료 기준**
- weekly summary payload 생성 가능

---

## Issue 14. Implement policy updater v1
**목적**
반복 실패 패턴을 다음 추천 정책에 반영한다.

**핵심 작업**
- decision_fatigue / energy_low / guilt_spiral rule 반영
- active policy 저장

**완료 기준**
- policy_update_applied 이벤트 저장 가능

---

## Issue 15. Build weekly summary experience
**목적**
사용자에게 죄책감 없는 주간 회고를 제공한다.

**핵심 작업**
- 유지/복귀/실행 중심 카피 설계
- 다음 주 한 줄 제안 표시

**완료 기준**
- weekly summary UI 또는 응답 생성 가능

---

## Issue 16. Add fallback recommendation templates
**목적**
추천 엔진 일부 실패 시에도 서비스가 끊기지 않게 한다.

**핵심 작업**
- 기본 breakfast/lunch/dinner templates
- emergency fallback set

**완료 기준**
- generator/evaluator 실패 시 기본 추천 가능

---

## Issue 17. QA recommendation and recovery scenarios
**목적**
핵심 맥락에서 추천/복귀 흐름이 깨지지 않는지 검증한다.

**핵심 작업**
- 집/밖/편의점/배달/회식 시나리오 테스트
- 저에너지/시간부족/죄책감 흐름 테스트

**완료 기준**
- 주요 시나리오에서 blocker 없음

---

## 최종 한 문장
이 이슈 시드는 기능 나열이 아니라,
식단메이트의 **운영 루프를 실제 구현 가능한 단위로 쪼갠 실행 목록**이다.
