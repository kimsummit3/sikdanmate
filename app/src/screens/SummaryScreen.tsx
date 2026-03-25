import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { Goal, LogResult, WeeklyStats } from '../types/app';

type Props = {
  goal: Goal;
  lastResult: LogResult | null;
  weeklyStats: WeeklyStats;
  onBackHome: () => void;
};

export function SummaryScreen({ goal, lastResult, weeklyStats, onBackHome }: Props) {
  const recoveryCopy =
    lastResult === '벗어났어요'
      ? '이번 주엔 흔들린 끼니가 있었지만, 다시 돌아오는 흐름이 더 중요합니다.'
      : '이번 주 흐름은 안정적입니다. 같은 패턴을 조금만 더 유지하면 됩니다.';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="주간 요약"
        title={`숫자보다 중요한 건,\n계속 이어지고 있다는 감각입니다.`}
        subtitle="초기 식단메이트는 정밀 분석보다, 유지율과 복귀율을 먼저 보여주는 방향으로 갑니다."
      />

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>이번 주 한 줄</Text>
        <Text style={styles.highlightTitle}>{goal} 목표는 아직 유효합니다.</Text>
        <Text style={styles.highlightDescription}>{recoveryCopy}</Text>
      </SurfaceCard>

      <View style={styles.grid}>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>기록률</Text>
          <Text style={styles.metricValue}>{weeklyStats.recordRate}%</Text>
          <Text style={styles.metricHelper}>반복 사용 기반 기록 흐름</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>유지율</Text>
          <Text style={styles.metricValue}>{weeklyStats.consistencyRate}%</Text>
          <Text style={styles.metricHelper}>추천 흐름 유지 기준</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>복귀율</Text>
          <Text style={styles.metricValue}>{weeklyStats.recoveryRate}%</Text>
          <Text style={styles.metricHelper}>무너진 뒤 다음 끼니 복귀</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>이번 주 포인트</Text>
          <Text style={styles.metricValueText}>{weeklyStats.weeklyPoint}</Text>
        </SurfaceCard>
      </View>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>다음 주 제안</Text>
        <Text style={styles.noteTitle}>{weeklyStats.suggestion}</Text>
      </SurfaceCard>

      <AppButton label="다시 오늘 추천 보기" onPress={onBackHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  cardSpacing: {
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  highlightTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3221',
    lineHeight: 32,
    marginBottom: 8,
  },
  highlightDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4E6151',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    width: '48%',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  metricValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 25,
  },
  metricHelper: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  noteTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
});
