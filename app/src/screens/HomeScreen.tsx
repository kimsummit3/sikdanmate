import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { AdjustmentMode, CheckInState, Constraint, Goal, MealLog, MealOption, EatingStyle } from '../types/app';

type Props = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  mealOptions: MealOption[];
  recentLogs: MealLog[];
  checkIn: CheckInState;
  onOpenSettings: () => void;
  onSelectMeal: (meal: MealOption) => void;
  onOpenHistory: () => void;
  onOpenCheckIn: () => void;
  onAdjustRecommendation: (mode: AdjustmentMode) => void;
};

const adjustmentModes: AdjustmentMode[] = ['더 가볍게', '더 든든하게', '더 저렴하게', '외식 중심'];

export function HomeScreen({
  goal,
  eatingStyle,
  constraints,
  mealOptions,
  recentLogs,
  checkIn,
  onOpenSettings,
  onSelectMeal,
  onOpenHistory,
  onOpenCheckIn,
  onAdjustRecommendation,
}: Props) {
  const latest = recentLogs[0];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="식단메이트 · 대화 모드"
        title="오늘 식단 운영을\n시작해볼까요?"
        subtitle="폼보다 대화로 시작하고, 오늘 식단 결정부터 다음 끼니 보정까지 이어갑니다."
        actionLabel="설정 수정"
        onPressAction={onOpenSettings}
      />

      <SurfaceCard tone="soft" style={styles.spacedCard}>
        <Text style={styles.cardLabel}>오늘 체크인</Text>
        <Text style={styles.checkinTitle}>지금 어떤 상황인가요?</Text>
        <Text style={styles.checkinSubtitle}>현재 체크인 기준으로 추천이 바로 달라집니다.</Text>
        <View style={styles.chipRow}>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.place}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.hunger}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.budget}</Text></View>
          <View style={styles.contextChip}><Text style={styles.contextChipText}>{checkIn.craving}</Text></View>
        </View>
        <View style={styles.actionGap}>
          <AppButton label="음성으로 체크인 시작" onPress={onOpenCheckIn} />
        </View>
        <AppButton label="텍스트로 빠르게 시작" onPress={onOpenCheckIn} variant="secondary" />
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <Text style={styles.cardLabel}>지금 기준으로 조정된 추천</Text>
        <Text style={styles.cardDescription}>
          {checkIn.place} · {checkIn.hunger} · {checkIn.budget} · {checkIn.craving} 기준으로 추천을 조정했습니다.
        </Text>
        <View style={styles.adjustmentWrap}>
          {adjustmentModes.map((mode) => (
            <View key={mode} style={styles.adjustmentButton}>
              <AppButton label={mode} onPress={() => onAdjustRecommendation(mode)} variant="secondary" />
            </View>
          ))}
        </View>
        {mealOptions.map((meal, index) => (
          <View key={meal.title} style={[styles.mealRow, index !== mealOptions.length - 1 && styles.rowBorder]}>
            <View style={styles.mealMain}>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealMeta}>{meal.context} · {meal.tag}</Text>
            </View>
            <View style={styles.inlineAction}>
              <AppButton label="선택" onPress={() => onSelectMeal(meal)} variant="secondary" />
            </View>
          </View>
        ))}
      </SurfaceCard>

      <SurfaceCard style={styles.spacedCard}>
        <View style={styles.inlineHeader}>
          <Text style={styles.sectionTitle}>최근 운영 상태</Text>
          <Text style={styles.sectionMeta}>{recentLogs.length}개 기록</Text>
        </View>
        {latest ? (
          <>
            <Text style={styles.latestTitle}>{latest.mealTitle}</Text>
            <Text style={styles.latestMeta}>
              최근 결과: {latest.result} · {new Date(latest.createdAt).toLocaleDateString('ko-KR')}
            </Text>
            <Text style={styles.latestDescription}>
              이 결과를 기준으로 다음 끼니와 주간 요약이 자동 보정됩니다.
            </Text>
          </>
        ) : (
          <Text style={styles.latestDescription}>아직 기록이 없습니다. 오늘 첫 체크인부터 시작하면 됩니다.</Text>
        )}
        <View style={styles.actionGap}>
          <AppButton label="전체 기록 보기" onPress={onOpenHistory} variant="secondary" />
        </View>
      </SurfaceCard>

      <SurfaceCard tone="soft" style={styles.spacedCard}>
        <Text style={styles.cardLabel}>운영 원칙</Text>
        <Text style={styles.principleTitle}>추천보다 중요한 건, 계속 맞춰지는 운영입니다.</Text>
        <Text style={styles.principleDescription}>
          식단메이트는 단순 추천 앱이 아니라, 사용자의 현실 변수에 맞춰 식단·기록·복귀를 계속 조정하는 운영체제를 지향합니다.
        </Text>
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
  adjustmentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  adjustmentButton: { minWidth: '47%' },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEF1EA' },
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
  principleTitle: { fontSize: 22, fontWeight: '800', color: '#1E3221', lineHeight: 30, marginBottom: 10 },
  principleDescription: { fontSize: 15, lineHeight: 22, color: '#4E6151' },
});
