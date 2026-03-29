# recovery-planner.md

## 목적
Recovery Planner는 식단이 깨진 이후,
다음 끼니 기준으로 가장 쉽게 흐름을 복원하는 선택지를 만든다.

이 모듈은 일반 추천의 하위 기능이 아니라,
별도 운영 모드로 보는 것이 맞다.

---

## 책임
- 이탈 직후 recovery mode 진입 판단 지원
- no-guilt 방식의 복귀 옵션 생성
- 다음 끼니 중심의 최소 마찰 행동 제안

---

## 입력
- latest deviation event
- primary failure reason
- current context
- profile state

---

## 출력 예시
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

## 규칙
1. 손실 만회보다 흐름 복원을 우선한다
2. 죄책감 유발 카피 금지
3. 옵션은 가볍고 즉시 실행 가능해야 한다
4. recovery 이후 일반 전략 모드 복귀 조건을 분리해 관리할 수 있어야 한다
