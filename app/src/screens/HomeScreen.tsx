import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { AdjustmentMode, CheckInState, Constraint, Goal, MealLog, MealOption, EatingStyle, RecommendationSet } from '../types/app';

type Props = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  mealOptions: MealOption[];
  recentLogs: MealLog[];
  checkIn: CheckInState;
  recommendation: RecommendationSet | null;
  onOpenSettings: () => void;
  onSelectMeal: (meal: MealOption) => void;
  onOpenHistory: () => void;
  onOpenCheckIn: () => void;
  onOpenPlanner: () => void;
  onOpenCooking: () => void;
  onRefreshRecommendation: () => void;
  onAdjustRecommendation: (mode: AdjustmentMode) => void;
};

const adjustmentModes: AdjustmentMode[] = ['더 가볍게', '더 든든하게', '더 저렴하게', '외식 중심'];

export function HomeScreen({ goal, eatingStyle, constraints, mealOptions, recentLogs, checkIn, recommendation, onOpenSettings, onSelectMeal, onOpenHistory, onOpenCheckIn, onOpenPlanner, onOpenCooking, onRefreshRecommendation, onAdjustRecommendation }: Props) {
  const latest = recentLogs[0];
  const defaultMeal = recommendation?.defaultOption;
  const alternatives = recommendation?.alternatives ?? [];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="식단메이트 · 실행 루프"
        title="오늘 식단 운영을\n시작해볼까요?"
        subtitle="지금은 추천보다 실행이 중요합니다. 오늘 한 끼 선택부터 기록까지 바로 이어가면 됩니다."
        actionLabel="설정 수정"
        onPressAction={onOpenSettings}
      />

      <SurfaceCard tone="soft" style={styles.spacedCard}>
        <Text style={styles.cardLabel}>프로필 상태</Text>
        <Text style={styles.checkinTitle}>{goal} · {eatingStyle}</Text>
        <Text style={styles.checkinSubtitle}>현실 조건: {constraints.join(', ') || '없음'}</Text>
      </SurfaceCard>

      <SurfaceCard tone="soft" style={styles.spacedCard}>
        <Text style={styles.cardLabel}>오늘 체크인</Text>
        <Text style={styles.checkinTitle}>지금 어떤 상황인가요?</Text>
        <Text style={styles.checkinSubtitle}>현재 체크인 기준으로 추천 세트가 새로 생성됩니다.</Text>
        <View style={styles.chipRow}>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.place}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.hunger}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.budget}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.craving}</Text></View>
        </View>
        <View style={styles.actionGap}><AppButton label="체크인 수정" onPress={onOpenCheckIn} /></View>
        <AppButton label="이 기준으로 추천 다시 받기" onPress={onRefreshRecommendation} variant="secondary" />
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <View style={styles.inlineHeader}>
          <Text style={styles.sectionTitle}>오늘의 기본 추천</Text>
          <Text style={styles.sectionMeta}>{recommendation ? '기본 1 + 대안 2' : '로딩 중'}</Text>
        </View>
        {defaultMeal ? (
          <>
            <View style={styles.defaultCard}>
              <Text style={styles.defaultBadge}>기본 추천</Text>
              <Text style={styles.mealTitle}>{defaultMeal.title}</Text>
              <Text style={styles.mealMeta}>{defaultMeal.context} · {defaultMeal.tag}</Text>
              <Text style={styles.defaultInfo}>티어 {defaultMeal.tier} · 실행가능성 {Math.round(defaultMeal.adherenceScore * 100)}점 · 준비 {defaultMeal.prepTimeMin}분</Text>
              <Text style={styles.cardDescription}>{defaultMeal.description}</Text>
              <AppButton label="이 식단으로 기록 시작" onPress={() => onSelectMeal(defaultMeal)} />
            </View>
            {alternatives.length > 0 && (
              <View style={styles.altSection}>
                <Text style={styles.altTitle}>대안 옵션</Text>
                {alternatives.map((meal) => (
                  <View key={meal.id} style={styles.mealRow}>
                    <View style={styles.mealMain}>
                      <Text style={styles.mealTitle}>{meal.title}</Text>
                      <Text style={styles.mealMeta}>{meal.tier} · {meal.context}</Text>
                    </View>
                    <View style={styles.inlineAction}><AppButton label="선택" onPress={() => onSelectMeal(meal)} variant="secondary" /></View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.latestDescription}>추천을 생성해 주세요.</Text>
        )}
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <Text style={styles.cardLabel}>빠른 보정</Text>
        <Text style={styles.cardDescription}>{checkIn.place} · {checkIn.hunger} · {checkIn.budget} · {checkIn.craving} 기준으로 추천을 다시 좁힐 수 있습니다.</Text>
        <View style={styles.adjustmentWrap}>
          {adjustmentModes.map((mode) => (
            <View key={mode} style={styles.adjustmentButton}><AppButton label={mode} onPress={() => onAdjustRecommendation(mode)} variant="secondary" /></View>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <View style={styles.inlineHeader}>
          <Text style={styles.sectionTitle}>플래너 · 장보기 · 요리</Text>
          <Text style={styles.sectionMeta}>운영 3축</Text>
        </View>
        <Text style={styles.cardDescription}>오늘 추천을 넘어, 주간 계획-장보기-요리 실행까지 이어지는 구조입니다.</Text>
        <View style={styles.utilityRow}>
          <View style={styles.utilityButton}><AppButton label="주간 플래너" onPress={onOpenPlanner} /></View>
          <View style={styles.utilityButton}><AppButton label="요리 모드" onPress={onOpenCooking} variant="secondary" /></View>
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <View style={styles.inlineHeader}>
          <Text style={styles.sectionTitle}>최근 운영 상태</Text>
          <Text style={styles.sectionMeta}>{recentLogs.length}개 기록</Text>
        </View>
        {latest ? (
          <>
            <Text style={styles.latestTitle}>{latest.mealTitle}</Text>
            <Text style={styles.latestMeta}>최근 결과: {latest.result} · {new Date(latest.createdAt).toLocaleDateString('ko-KR')}</Text>
            <Text style={styles.latestDescription}>이 결과를 기준으로 다음 추천과 복귀 흐름이 조정됩니다.</Text>
          </>
        ) : (
          <Text style={styles.latestDescription}>아직 기록이 없습니다. 오늘 첫 추천을 고르고 가볍게 기록해 보세요.</Text>
        )}
        <View style={styles.actionGap}><AppButton label="전체 기록 보기" onPress={onOpenHistory} variant="secondary" /></View>
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  spacedCard: { marginBottom: 20 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  cardDescription: { fontSize: 15, lineHeight: 22, color: colors.textMuted, marginBottom: 10 },
  checkinTitle: { fontSize: 24, fontWeight: '800', color: colors.text, lineHeight: 32, marginBottom: 8 },
  checkinSubtitle: { fontSize: 15, lineHeight: 22, color: colors.textMuted, marginBottom: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  contextChip: { backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  contextChipText: { color: colors.greenStrong, fontSize: 13, fontWeight: '700' },
  actionGap: { marginBottom: 10 },
  utilityRow: { flexDirection: 'row', gap: 10 },
  utilityButton: { flex: 1 },
  adjustmentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  adjustmentButton: { minWidth: '47%' },
  defaultCard: { gap: 8 },
  defaultBadge: { alignSelf: 'flex-start', backgroundColor: '#EEF8EE', color: colors.greenStrong, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontSize: 12, fontWeight: '700' },
  defaultInfo: { fontSize: 13, color: colors.greenDeep, fontWeight: '600' },
  altSection: { marginTop: 16, gap: 12 },
  altTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  mealMain: { flex: 1, paddingRight: 12 },
  mealTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  mealMeta: { fontSize: 13, color: colors.textMuted },
  inlineAction: { width: 84 },
  inlineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  sectionMeta: { color: colors.textSoft, fontWeight: '600' },
  latestTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  latestMeta: { fontSize: 13, color: colors.greenDeep, fontWeight: '600', marginBottom: 8 },
  latestDescription: { fontSize: 15, lineHeight: 22, color: colors.textMuted },
});
