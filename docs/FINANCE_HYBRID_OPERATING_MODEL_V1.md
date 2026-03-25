# FINANCE_HYBRID_OPERATING_MODEL_V1.md

## 목적
finance 조직을 Telegram과 Discord 사이에서 어떻게 역할 분리해 운영할지 고정하는 문서.

핵심은 기존 Telegram 자산을 버리지 않으면서,
Discord를 조직형 운영 공간으로 확장하는 것이다.

---

## 1. 기본 구조
### Telegram = 운영 인터페이스
finance 관련 Telegram 봇/채널은 유지한다.

역할:
- 실시간 알림
- 빠른 상태 질의응답
- 긴급 이벤트 확인
- 즉시 봐야 하는 경고

### Discord = 조직 워크스페이스
finance 조직의 실무 운영은 Discord에 누적한다.

역할:
- 로그 축적
- 리뷰 축적
- 개발 논의
- QA 검수
- 개선안 기록

---

## 2. 권장 역할 분리
### Telegram에 남길 것
- 거래/루프/시스템 이상 알림
- 빠른 요약
- 즉시 대응이 필요한 이벤트
- Jarvis 또는 기존 finance bot 질의응답

### Discord로 보낼 것
- 일간 운영 정리
- 주간 리뷰
- 전략 개선 포인트
- 코드 수정 논의
- QA / 테스트 결과
- 장기 누적 기록

---

## 3. finance Discord 권장 채널
### FINANCE 카테고리
- `#finance-ops`
- `#finance-alerts`
- `#finance-reviews`
- `#finance-dev`
- `#finance-qa`

### 채널별 역할
#### finance-ops
- 배치/루프 상태
- 운영 점검
- 프로세스 상태

#### finance-alerts
- 실패 알림
- 경고
- 임계치 초과

#### finance-reviews
- 일간/주간 리뷰
- 전략 회고
- 개선 아이디어

#### finance-dev
- 코드 수정
- 레포 이슈
- 구현 논의

#### finance-qa
- 테스트 시나리오
- 검증 결과
- 운영 반영 전 체크

---

## 4. Jarvis 역할
Jarvis는 finance 실무를 다 들고 있지 않는다.
대신 아래를 담당한다.
- 중요한 결과 요약 회수
- summit님에게 최종 보고
- finance 조직 이슈의 우선순위 판단
- 다른 조직과의 충돌 조정

즉,
Jarvis는 finance 조직의 운영자가 아니라,
finance 조직 위에 있는 본사/오케스트레이터다.

---

## 5. 운영 원칙
1. 기존 Telegram 봇은 유지한다
2. Discord는 조직 운영 기록 공간으로 추가한다
3. 동일 내용을 양쪽에 무분별하게 중복하지 않는다
4. 실시간성은 Telegram, 누적성은 Discord에 둔다
5. Jarvis는 Telegram에서 최종 요약만 전달한다

---

## 6. 1차 실행 순서
1. FINANCE Discord 카테고리 생성
2. 5개 채널 생성
3. 어떤 알림이 Telegram에 남고 Discord에 복제될지 구분
4. AI_invest 운영/리뷰 흐름을 채널별로 매핑
5. 이후 cron/heartbeat/report를 분배

---

## 7. 한 줄 결론
finance 조직은 Telegram을 버리는 것이 아니라 유지하고,
Discord를 추가해 **실시간 운영 인터페이스 + 조직형 워크스페이스**의 하이브리드 구조로 가는 것이 가장 현실적이다.
