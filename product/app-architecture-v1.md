# app-architecture-v1.md

## 목적
이 문서는 식단메이트 MVP를 실제로 구현하기 위한 1차 앱 구조 문서입니다.
초기 목표는 복잡한 기술 최적화가 아니라,
**빠르게 만들고 검증 가능한 모바일 앱 구조**를 정하는 것입니다.

---

## 1. 제품 구현 원칙

### 원칙 1. 모바일 앱 우선
식단메이트는 앱스토어에 올라갈 소비자용 앱이므로,
초기부터 모바일 UX를 기준으로 설계합니다.

### 원칙 2. 빠른 검증 우선
정교한 엔진보다,
- 오늘의 식단 제안
- 초저마찰 기록
- 다음 끼니 복귀
이 3개를 빠르게 검증할 수 있어야 합니다.

### 원칙 3. 입력보다 선택
초기 화면/데이터 구조는 사용자가 많이 입력하게 하지 말고,
선택하고 반응하게 만들어야 합니다.

---

## 2. MVP 핵심 화면 구조

## Screen 1. 온보딩
### 목적
사용자 목표와 기본 제약을 빠르게 수집

### 입력 항목
- 목표: 감량 / 유지 / 건강 식습관
- 식단 스타일: 일반식 / 간편식 / 외식 많음
- 기피 음식
- 예산감
- 요리 가능 여부

### 원칙
- 1분 내 끝나야 함
- 페이지 수 최소화
- 강제 입력 최소화

---

## Screen 2. 홈 / 오늘의 식단
### 목적
앱의 가장 중요한 화면

### 보여줄 것
- 오늘의 추천 끼니
- 현재 상황 질문
- 빠른 선택 버튼
- 다음 행동 CTA

### 핵심 UX
사용자가 앱을 열고 30초 안에
“오늘 뭘 먹을지”를 결정할 수 있어야 함

---

## Screen 3. 기록
### 목적
귀찮지 않게 식사 결과를 남김

### 방식
- 사진 업로드
- 버튼 선택
  - 잘 지켰음
  - 비슷함
  - 벗어남

### 원칙
- 숫자 입력 최소화
- 칼로리 강박 금지
- 기록 성공 경험 우선

---

## Screen 4. 복귀
### 목적
식단 이탈 후 다음 끼니를 다시 연결

### 보여줄 것
- 현재 상황 요약
- 다음 끼니 추천
- 죄책감 없는 카피

### 핵심 UX
실패한 날에도 앱을 다시 열 수 있게 해야 함

---

## Screen 5. 주간 요약
### 목적
사용자에게 통제감과 지속 동기를 줌

### 보여줄 것
- 기록률
- 유지율
- 복귀율
- 이번 주 한 줄 코멘트

### 원칙
정밀 분석보다,
"내가 계속하고 있다"는 감각을 줘야 함

---

## 3. MVP 기능 모듈

### A. User Profile
- 목표
- 식단 스타일
- 기피 음식
- 예산감
- 요리 가능 여부

### B. Meal Suggestion Engine (초기 경량)
- 현재 상황 기반 추천
- 외식/편의점/배달 상황 포함
- 템플릿 기반 제안 우선

### C. Meal Logging
- 사진/버튼 기록
- 식사별 상태 저장

### D. Recovery Logic
- 이탈 후 다음 끼니 추천
- 복귀 카피와 흐름

### E. Weekly Summary
- 행동 데이터 기반 주간 요약

---

## 4. 데이터 구조 초안

## User
- id
- goal
- eating_style
- dislikes
- budget_sensitivity
- can_cook
- created_at

## MealPlanEntry
- id
- user_id
- date
- meal_type (breakfast/lunch/dinner/snack)
- suggested_option
- context_type (home/outside/convenience/delivery)
- status (suggested/accepted/skipped)

## MealLog
- id
- user_id
- date
- meal_type
- log_type (photo/button)
- result (on_track/similar/off_track)
- note

## RecoveryEvent
- id
- user_id
- triggered_from_meal_log_id
- next_recommendation
- recovered (bool)

## WeeklySummary
- id
- user_id
- week_start
- record_rate
- consistency_rate
- recovery_rate
- summary_text

---

## 5. 추천 로직 초안

초기에는 AI가 모든 걸 계산하게 하지 않습니다.

### v1 원칙
- 룰 기반 템플릿 추천
- 사용자 프로필 + 현재 상황 + 이전 끼니 상태 반영
- 정교한 영양 엔진은 후순위

### 입력 요소
- 목표
- 식단 스타일
- 집/밖 여부
- 외식/편의점/배달 여부
- 직전 식사 상태

### 출력
- 오늘 끼니 선택지 1~3개
- 짧은 이유
- 다음 액션

---

## 6. 기술 스택 판단 (초기 추천)

### 추천 방향
**React Native / Expo** 기반 MVP가 가장 현실적입니다.

### 이유
- iOS 중심 테스트 빠름
- 앱스토어 대응 쉬움
- UI 반복 개발 속도 빠름
- 후속 Android 확장 가능

### 초기 구조 제안
- `app/` : Expo/React Native 앱
- 상태관리: 가벼운 구조 우선 (Zustand 또는 Context)
- API: 초기엔 mock/data layer 또는 간단한 backend 연결
- DB: 초기엔 Supabase 또는 Firebase 계열도 검토 가능

### 초기 목표
복잡한 백엔드보다,
프론트에서 핵심 흐름을 빠르게 검증하는 것이 우선

---

## 7. 개발 우선순위

### Phase 1
- 온보딩
- 홈/오늘의 식단
- 버튼형 기록
- 복귀 플로우

### Phase 2
- 주간 요약
- 사진 기록
- 프로필 수정

### Phase 3
- 장보기/가격 모드 v1
- 음성 UX 실험
- 플래너 확장

---

## 8. 비개발 원칙
- 의료 서비스처럼 보이지 않기
- 과장된 건강 효능 약속 금지
- 최저가 보장 같은 검증 어려운 약속 금지
- 초기엔 완벽함보다 반복 사용성 우선

---

## 9. 한 줄 결론
식단메이트 MVP는 **모바일 앱으로, 오늘의 식단 제안 → 가벼운 기록 → 다음 끼니 복귀** 루프를 가장 먼저 구현해야 합니다.
