# AI_COMPANY_ORG_V1.md

## 목적
이 문서는 AI-native 회사 운영을 위해,
각 agent/session을 실제 회사 조직처럼 분리하는 기준을 정의한다.

핵심은 여러 agent를 두는 것이 아니라,
**역할 / 책임 / 산출물 / 핸드오프**가 분리된 구조를 만드는 것이다.

---

## 1. 최상위 구조
### Jarvis = 오케스트레이터
Jarvis는 회사의 front door이자 control tower다.

역할:
- 모든 입력 접수
- 우선순위 판단
- 지금 필요한 회의 단계 결정
- specialist에게 라우팅
- 결과 회수 및 최종 정리
- 운영체계 유지

Jarvis는 모든 실무를 직접 다 하지 않는다.
Jarvis의 핵심은 **판단과 조정**이다.

---

### Stark = 전략 브레인 (ai-company)
Stark는 사업/전략/제품 상위 판단을 담당한다.

역할:
- 제품 정의
- 시장/경쟁 판단
- 사업성 검토
- MVP 우선순위
- 수익화 구조
- 의사결정 논리 정리

즉,
Jarvis가 오케스트레이터라면,
Stark는 **전략과 제품 방향의 핵심 specialist**다.

---

## 2. 기능 조직 구조
### 1) research
역할:
- 시장 조사
- 경쟁사 조사
- 사용자 문제 조사
- 데이터 수집

산출물:
- research brief
- competitor map
- interview insight
- fact sheet

### 2) product / planner
역할:
- 제품 정의
- PRD
- IA
- 기능 구조
- 정책 설계

산출물:
- PRD
- screen list
- feature scope
- logic spec

### 3) design
역할:
- UX 흐름
- 와이어프레임
- Figma 기준 설계
- 디자인 시스템

산출물:
- flow doc
- wireframe spec
- ui principles
- figma-ready screen brief

### 4) frontend
역할:
- 웹 프론트 구현
- UI 컴포넌트
- 상태/UI 연결

산출물:
- frontend code
- component structure
- interaction implementation

### 5) backend
역할:
- API
- DB
- auth
- logic orchestration
- integration layer

산출물:
- API spec
- schema
- backend tasks
- service implementation

### 6) app
역할:
- 모바일 앱 전담
- Expo / React Native
- 모바일 UX 구현
- 기기별 인터랙션

산출물:
- app code
- mobile flow
- native integration plan

### 7) QA
역할:
- 테스트 시나리오
- 버그 검수
- 출시 체크
- 회귀 테스트

산출물:
- qa checklist
- test cases
- bug list
- release readiness

---

## 3. 운영 원칙
### 원칙 1. main은 직접 생산보다 조정
Jarvis가 전부 직접 생산하면 조직 분리가 무너진다.

### 원칙 2. specialist는 자기 산출물을 남긴다
각 역할은 반드시 자기 산출물을 파일/문서/체크리스트로 남긴다.

### 원칙 3. 핸드오프가 있어야 회사처럼 작동한다
예:
- research → product
- product → design
- design → frontend/app
- backend/app → QA
- QA → Jarvis

### 원칙 4. 역할 놀이가 아니라 책임 분리
한 agent가 상황 따라 이름만 바꾸는 것이 아니라,
실제 책임과 문맥이 분리되어야 한다.

---

## 4. Jarvis와 Stark의 관계
### Jarvis
- 회사 운영체계
- 회의 진행자
- 오케스트레이터
- 최종 정리자

### Stark
- 전략적 판단의 핵심 specialist
- ai-company 대표 브레인
- 제품/사업 방향 책임자

즉:
- Jarvis = operating system
- Stark = strategy brain

이 구조가 현재 가장 안정적이다.

---

## 5. 한 줄 결론
AI company는 "여러 agent가 있는 상태"가 아니라,
**Jarvis가 조정하고, Stark를 포함한 specialist 조직이 책임별로 움직이는 구조**가 되어야 한다.
