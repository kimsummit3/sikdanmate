# FINANCE_DISCORD_MIGRATION_V1.md

## 목적
금융조직(finance)을 Telegram/혼합 상태에서 분리해,
Discord 기반 운영 조직으로 옮기기 위한 1차 마이그레이션 문서.

## 기본 원칙
- Jarvis 본체는 Telegram에 둔다.
- finance 실무 운영은 Discord에서 진행한다.
- Telegram에는 최종 요약/중요 경보만 올린다.
- 로그, 리뷰, 개발, QA는 Discord 채널에 누적한다.

---

## 1. 권장 Discord 구조
### 카테고리: FINANCE
- `#finance-ops`
  - 일일 운영 상태
  - 루프 상태
  - 배치/잡 상태

- `#finance-alerts`
  - 이상 징후
  - 실패 알림
  - 중요한 시스템 이벤트

- `#finance-reviews`
  - 일간/주간 운용 리뷰
  - 전략 개선 메모
  - 성과 분석

- `#finance-dev`
  - 코드 수정
  - 구현 계획
  - 레포 변경 사항

- `#finance-qa`
  - 테스트 체크
  - 회귀 검증
  - 배포 전 확인

---

## 2. 운영 흐름
### ops
- 루프/실행 상태 기록
- 스케줄 정상 여부
- 인프라/프로세스 상태

### alerts
- 실패 즉시 보고
- 임계치 초과
- 거래/로그/데이터 이상징후

### reviews
- 당일 결과 요약
- 손익/전략/품질 분석
- 다음 개선 포인트

### dev
- 수정 필요사항
- 코드 변경 제안
- GitHub 연결 작업

### qa
- 테스트 시나리오
- 수정 후 검증
- 운영 반영 전 체크

---

## 3. Telegram과의 역할 분리
### Telegram (Jarvis)
- summit님과 직접 대화
- 중요한 최종 요약
- 즉시 확인이 필요한 알림

### Discord (finance)
- 실무 운영 로그
- 분석 누적
- 개발/QA 협업
- 운영 기록 저장소

---

## 4. 1차 이전 순서
1. Discord에 FINANCE 카테고리 생성
2. 위 5개 채널 생성
3. AI_invest 레포 운영 구조 매핑
4. 어떤 알림이 어느 채널로 갈지 정의
5. 이후 cron/heartbeat/보고 연결

---

## 5. 성공 기준
- finance 관련 운영 대화가 Telegram에서 줄어든다
- Discord 채널만 봐도 현재 운영 상태가 보인다
- alerts / reviews / dev / qa가 분리된다
- Jarvis는 Telegram에서 요약만 전달한다
