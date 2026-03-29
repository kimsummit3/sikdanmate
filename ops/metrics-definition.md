# metrics-definition.md

## 목적
식단메이트의 KPI는 영양 정답률이 아니라 **행동 전환과 복귀 품질**을 측정해야 한다.

이 문서는:
- 북극성 지표를 정의하고
- 초기 MVP에서 반드시 볼 핵심 지표를 정리하며
- 이벤트 기반 계산 방식을 명시한다.

---

## 1. 측정 원칙

### 원칙 1. 추천 생성보다 행동 전환을 본다
추천이 많이 나가는 것은 의미가 약하다.
중요한 것은 사용자가 실제로
- 선택했는지
- 기록했는지
- 복귀했는지
다.

### 원칙 2. 완벽한 식단보다 복귀율이 더 중요하다
식단메이트의 차별점은 실패를 없애는 것이 아니라,
실패 후 다시 이어가게 만드는 데 있다.

### 원칙 3. 입력 효율도 측정한다
좋은 추천이라도 입력 마찰이 크면 유지되지 않는다.

### 원칙 4. ideal보다 realistic/emergency 채택률을 중시한다
초기에는 이상적 식단보다 실제 채택 가능한 식단이 중요하다.

---

## 2. 북극성 지표

## `weekly_executed_meals_per_wau`
정의:
주간 활성 사용자 1명당, 추천/선택/기록/복귀 행동으로 이어진 실행 식사 수

해석:
- 단순 사용량이 아니라 행동 실행량을 본다.
- 식단메이트가 실제로 끼니 단위 행동을 얼마나 움직였는지 보여준다.

권장 계산:

```text
weekly_executed_meals_per_wau
= 주간 실행 식사 수 / WAU
```

실행 식사 수 포함 조건 예:
- 추천 옵션 선택 후 기록됨
- recovery flow 후 다음 끼니 기록됨
- quick log로라도 실제 섭취가 확인됨

---

## 3. 핵심 KPI

### 3.1 첫 가치 도달 지표

#### `first_meal_selection_rate`
정의:
첫 세션에서 첫 끼니 선택까지 간 사용자 비율

공식:
```text
첫 끼니 선택 유저 수 / 첫 세션 시작 유저 수
```

의미:
- 온보딩과 첫 추천 경험의 품질

#### `time_to_first_value`
정의:
앱 진입부터 첫 끼니 선택 또는 첫 추천 수락까지 걸린 시간

목표 해석:
- 90초 이내면 매우 좋음
- 길어질수록 결정 피로/입력 마찰 가능성

---

### 3.2 추천 전환 지표

#### `recommendation_to_selection_rate`
정의:
추천 제시 후 사용자가 옵션을 선택한 비율

공식:
```text
meal_option_selected / meal_options_presented
```

#### `selection_to_log_rate`
정의:
선택한 식사가 실제 기록으로 이어진 비율

공식:
```text
meal_logged / meal_option_selected
```

#### `recommendation_to_execution_rate`
정의:
추천 제시 후 실제 실행까지 이어진 비율

공식:
```text
실행 식사 수 / meal_options_presented
```

의미:
- 추천 품질과 실행 가능성의 합성 지표

---

### 3.3 복귀 지표

#### `next_meal_recovery_rate`
정의:
이탈 후 다음 끼니 안에 복귀한 비율

공식:
```text
다음 끼니 내 복귀 수 / meal_deviation 또는 recovery_flow_started 수
```

이 지표는 식단메이트의 핵심이다.

#### `recovery_flow_entry_rate`
정의:
이탈 이벤트 이후 recovery flow에 진입한 비율

#### `recovery_option_selection_rate`
정의:
복귀 옵션 제시 후 실제 선택한 비율

#### `recovery_within_24h_rate`
정의:
이탈 후 24시간 내 다시 기록/선택 행동으로 복귀한 비율

---

### 3.4 지속성 지표

#### `3plus_executions_within_7d_rate`
정의:
7일 내 3회 이상 실행 행동이 발생한 사용자 비율

의미:
- 초반 습관 형성 여부

#### `d7_retention`
정의:
첫 사용 후 7일차에 다시 돌아온 사용자 비율

#### `d30_retention`
정의:
첫 사용 후 30일차에 다시 돌아온 사용자 비율

주의:
리텐션은 중요하지만,
식단메이트에서는 **실행 리텐션**을 같이 봐야 한다.

#### `execution_retention_d7`
정의:
첫 주에 실행 행동을 했고, 7일차에도 실행 행동을 한 사용자 비율

---

### 3.5 입력 마찰 지표

#### `log_completion_time`
정의:
식사 기록을 마치는 데 걸리는 시간

#### `tap_count_to_log`
정의:
한 번 기록 완료까지 필요한 탭 수

#### `dropoff_before_selection_rate`
정의:
추천 제시 전 또는 직후 이탈한 비율

의미:
- 추천 품질이 아니라 UX 마찰을 보여줌

---

### 3.6 추천 구조 지표

#### `realistic_option_share`
정의:
실제 선택된 옵션 중 realistic tier 비중

#### `emergency_option_share`
정의:
실제 선택된 옵션 중 emergency tier 비중

해석:
- 높다고 무조건 나쁜 것은 아님
- 실제 맥락 적합성을 보여주는 신호일 수 있음

#### `adherence_score_vs_execution_correlation`
정의:
예측된 adherence score와 실제 실행 간 상관성

의미:
- Adherence Evaluator의 품질 검증

---

## 4. 보조 KPI

### `weekly_summary_view_rate`
주간 요약을 실제로 본 사용자 비율

### `failure_reason_capture_rate`
이탈 이벤트 중 reason code가 남은 비율

### `policy_update_hit_rate`
정책 업데이트 이후 행동 지표가 개선된 비율

### `repeat_recovery_usage_rate`
복귀 플로우를 2회 이상 사용한 사용자 비율

---

## 5. KPI 해석 프레임

### 좋은 상황
- recommendation_to_selection_rate 상승
- next_meal_recovery_rate 상승
- log_completion_time 하락
- realistic/emergency 선택은 유지되거나 소폭 증가

의미:
- 이상적인 추천이 아니라 실제 채택 가능한 구조가 잘 작동 중

### 나쁜 상황 A
- 추천 선택률은 높은데 실행률이 낮음

의미:
- 카피는 설득력 있지만 실제 실행 가능성이 낮음
- Adherence Evaluator가 약하거나 추천이 낙관적

### 나쁜 상황 B
- recovery flow 진입률은 높은데 복귀율이 낮음

의미:
- 복귀 UX는 열리지만 행동으로 이어지지 않음
- Recovery Planner 재설계 필요

### 나쁜 상황 C
- 기록 시간/탭 수가 높고 dropoff가 큼

의미:
- 추천보다 UX 마찰이 문제

---

## 6. 이벤트 매핑

| KPI | 필요한 이벤트 |
|---|---|
| first_meal_selection_rate | app_opened, onboarding_completed, meal_option_selected |
| recommendation_to_selection_rate | meal_options_presented, meal_option_selected |
| selection_to_log_rate | meal_option_selected, meal_logged |
| next_meal_recovery_rate | meal_deviation_reported, recovery_option_selected, meal_logged |
| 3plus_executions_within_7d_rate | meal_logged |
| failure_reason_capture_rate | meal_deviation_reported, failure_reason_saved |
| realistic_option_share | meal_option_selected(selected_tier) |
| adherence_score_vs_execution_correlation | meal_options_presented(adherence_score), meal_logged |

---

## 7. 초기 목표값 제안

초기 MVP 기준 권장 초안:

- `first_meal_selection_rate`: **65%+**
- `time_to_first_value`: **90초 이내**
- `recommendation_to_selection_rate`: **45%+**
- `selection_to_log_rate`: **55%+**
- `next_meal_recovery_rate`: **25%+**
- `3plus_executions_within_7d_rate`: **40%+**
- `d7_retention`: **35%+**
- `d30_retention`: **20%+**
- `failure_reason_capture_rate`: **60%+**

주의:
초기 목표는 절대값보다 추세가 중요하다.
특히 복귀율이 오르는지, 입력 시간이 줄어드는지 봐야 한다.

---

## 8. MVP에서 과감히 안 봐도 되는 지표

초기에는 아래를 전면 KPI로 두지 않는다.

- 칼로리 정확도
- 매크로 정확도
- 영양 점수 정교화
- 레시피 열람 수
- 콘텐츠 체류 시간

이 지표들은 실행형 제품의 핵심 가치와 직접 연결되지 않는다.

---

## 9. 최종 권고

초기 대시보드는 복잡하게 만들 필요 없다.
먼저 아래 5개만 일관되게 보면 된다.

1. `first_meal_selection_rate`
2. `recommendation_to_execution_rate`
3. `next_meal_recovery_rate`
4. `3plus_executions_within_7d_rate`
5. `failure_reason_capture_rate`

이 5개가 식단메이트의 초기 제품-시장 적합성 방향을 가장 잘 보여준다.

---

## 최종 한 문장
식단메이트의 KPI는 "얼마나 정확히 추천했는가"보다,
**"얼마나 자주 실제 행동을 만들고, 얼마나 빨리 다시 복귀시켰는가"**를 측정해야 한다.
