import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { Goal, LogResult, MealLog, WeeklyStats } from '../types/app';

type Props = {
  goal: Goal;
  lastResult: LogResult | null;
  weeklyStats: WeeklyStats;
  mealLogs: MealLog[];
  onBackHome: () => void;
};

export function SummaryScreen({ goal, lastResult, weeklyStats, mealLogs, onBackHome }: Props) {
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
          <Text style={styles.metricHelper}>최근 7회 목표 기준</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>유지율</Text>
          <Text style={styles.metricValue}>{weeklyStats.consistencyRate}%</Text>
          <Text style={styles.metricHelper}>잘 지킴 + 비슷함 반영</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>복귀율</Text>
          <Text style={styles.metricValue}>{weeklyStats.recoveryRate}%</Text>
          <Text style={styles.metricHelper}>벗어난 뒤 다시 복귀한 비율</Text>
        </SurfaceCard>
        <SurfaceCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>이번 주 포인트</Text>
          <Text style={styles.metricValueText}>{weeklyStats.weeklyPoint}</Text>
        </SurfaceCard>
      </View>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>최근 기록</Text>
        {mealLogs.length === 0 ? (
          <Text style={styles.emptyText}>아직 기록이 없습니다.</Text>
        ) : (
          mealLogs.slice(0, 4).map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View style={styles.logMain}>
                <Text style={styles.logMeal}>{log.mealTitle}</Text>
                <Text style={styles.logDate}>{new Date(log.createdAt).toLocaleDateString('ko-KR')}</Text>
              </View>
              <Text style={styles.logResult}>{log.result}</Text>
            </View>
          ))
        )}
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>다음 주 제안</Text>
        <Text style={styles.noteTitle}>{weeklyStats.suggestion}</Text>
      </SurfaceCard>

      <AppButton label="다시 오늘 추천 보기" onPress={onBackHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 18 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  highlightTitle: { fontSize: 24, fontWeight: '800', color: '#1E3221', lineHeight: 32, marginBottom: 8 },
  highlightDescription: { fontSize: 15, lineHeight: 22, color: '#4E6151' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  metricCard: { width: '48%' },
  metricLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  metricValue: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
  metricValueText: { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 25 },
  metricHelper: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  emptyText: { fontSize: 15, color: colors.textMuted },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEF1EA' },
  logMain: { flex: 1, paddingRight: 10 },
  logMeal: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  logDate: { fontSize: 12, color: colors.textSoft },
  logResult: { fontSize: 13, fontWeight: '700', color: colors.greenStrong },
  noteTitle: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30 },
});
