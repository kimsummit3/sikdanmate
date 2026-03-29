# service-interfaces-v1.md

## 목적
이 문서는 식단메이트 MVP의 핵심 서비스 경계를 정의한다.

목표는 다음과 같다.
- UI와 판단 엔진 사이의 구현 책임 분리
- 각 엔진을 테스트 가능한 인터페이스로 고정
- 이후 실제 코드 구현 시 module boundary를 흔들리지 않게 함

---

## 1. 핵심 서비스 목록

1. `ProfileStateService`
2. `StrategyPlannerService`
3. `OptionGeneratorService`
4. `ConstraintValidatorService`
5. `AdherenceEvaluatorService`
6. `RecoveryPlannerService`
7. `PolicyUpdaterService`
8. `AnalyticsEventService`
9. `WeeklySummaryService`

---

## 2. ProfileStateService

### 책임
- 프로필 + 최근 이벤트 + 현재 컨텍스트를 합쳐 recommendation input state 생성

### interface 예시
```ts
interface ProfileStateService {
  buildState(input: {
    userId: string;
    timeSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    locationMode: 'home' | 'outside' | 'office' | 'transit';
    contextType: 'home_cooking' | 'convenience' | 'delivery' | 'dine_out' | 'unknown';
    energyLevel?: 'low' | 'medium' | 'high';
  }): Promise<ProfileState>;
}
```

---

## 3. StrategyPlannerService

### 책임
- 현재 상태를 기반으로 하루/끼니 운영 전략 결정

### interface 예시
```ts
interface StrategyPlannerService {
  plan(state: ProfileState): Promise<MealStrategy>;
}
```

---

## 4. OptionGeneratorService

### 책임
- ideal / realistic / emergency 옵션 생성

### interface 예시
```ts
interface OptionGeneratorService {
  generate(input: {
    state: ProfileState;
    strategy: MealStrategy;
  }): Promise<GeneratedMealOptions>;
}
```

---

## 5. ConstraintValidatorService

### 책임
- 하드 제약 위반 옵션 제거

### interface 예시
```ts
interface ConstraintValidatorService {
  validate(input: {
    state: ProfileState;
    options: GeneratedMealOptions;
  }): Promise<ValidatedMealOptions>;
}
```

---

## 6. AdherenceEvaluatorService

### 책임
- 실행 가능성 점수 계산
- 옵션 재정렬

### interface 예시
```ts
interface AdherenceEvaluatorService {
  rank(input: {
    state: ProfileState;
    options: ValidatedMealOptions;
  }): Promise<RankedMealOptions>;
}
```

---

## 7. RecoveryPlannerService

### 책임
- 복귀 모드 판단 후 recovery options 생성

### interface 예시
```ts
interface RecoveryPlannerService {
  createPlan(input: {
    userId: string;
    triggerEventId: string;
    primaryReason: string;
    state: ProfileState;
  }): Promise<RecoveryPlan>;
}
```

---

## 8. PolicyUpdaterService

### 책임
- failure reason과 행동 데이터를 기반으로 active policy 갱신

### interface 예시
```ts
interface PolicyUpdaterService {
  update(userId: string): Promise<ActivePolicy>;
}
```

### 비고
- 초기에는 배치/주간 실행으로 충분
- 이후 실시간 또는 반실시간 전환 가능

---

## 9. AnalyticsEventService

### 책임
- 핵심 운영 이벤트 저장

### interface 예시
```ts
interface AnalyticsEventService {
  track(event: {
    eventName: string;
    userId: string;
    occurredAt?: string;
    payload: Record<string, unknown>;
  }): Promise<void>;
}
```

---

## 10. WeeklySummaryService

### 책임
- 주간 KPI/패턴 집계 및 summary payload 생성

### interface 예시
```ts
interface WeeklySummaryService {
  generate(input: {
    userId: string;
    week: string;
  }): Promise<WeeklySummary>;
}
```

---

## 11. Application Orchestrator

실제 API 레이어에서는 위 서비스들을 조합하는 오케스트레이터가 필요하다.

### RecommendationOrchestrator 예시
```ts
interface RecommendationOrchestrator {
  recommend(input: RecommendationRequest): Promise<RecommendationResponse>;
}
```

처리 순서:
1. state build
2. strategy plan
3. option generate
4. constraint validate
5. adherence rank
6. response shape
7. analytics track

### RecoveryOrchestrator 예시
```ts
interface RecoveryOrchestrator {
  start(input: RecoveryStartRequest): Promise<RecoveryResponse>;
}
```

---

## 12. fallback interface 원칙

각 서비스는 실패 시 fallback을 가질 수 있어야 한다.

예:
- OptionGenerator 실패 → template options 반환
- AdherenceEvaluator 실패 → realistic 우선 정렬 기본값 사용
- RecoveryPlanner 실패 → no-guilt 기본 copy + emergency set

즉 서비스 인터페이스는 완벽한 결과만 가정하면 안 된다.

---

## 13. 테스트 관점 권장

각 서비스는 최소 아래 테스트가 가능해야 한다.

- deterministic input → deterministic output
- edge case 처리
- fallback 동작
- invalid input rejection

특히 MVP 초기에 중요한 것은 모델 정교함보다
**서비스 경계가 테스트 가능하게 유지되는 것**이다.

---

## 최종 한 문장
식단메이트의 서비스 인터페이스 설계 핵심은,
하나의 똑똑한 추천기가 아니라
**여러 결정 모듈이 명확한 계약으로 협력하는 구조**를 만드는 것이다.
