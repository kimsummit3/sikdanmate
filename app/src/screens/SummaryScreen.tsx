import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/theme';
import { Goal, LogResult } from '../types/app';

type Props = {
  goal: Goal;
  lastResult: LogResult | null;
  onBackHome: () => void;
};

export function SummaryScreen({ goal, lastResult, onBackHome }: Props) {
  const recoveryCopy =
    lastResult === '벗어났어요'
      ? '이번 주엔 흔들린 끼니가 있었지만, 다시 돌아오는 흐름이 더 중요합니다.'
      : '이번 주 흐름은 안정적입니다. 같은 패턴을 조금만 더 유지하면 됩니다.';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>주간 요약</Text>
        <Text style={styles.title}>숫자보다 중요한 건,{`\n`}계속 이어지고 있다는 감각입니다.</Text>
        <Text style={styles.subtitle}>
          초기 식단메이트는 정밀 분석보다, 유지율과 복귀율을 먼저 보여주는 방향으로 갑니다.
        </Text>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightLabel}>이번 주 한 줄</Text>
        <Text style={styles.highlightTitle}>{goal} 목표는 아직 유효합니다.</Text>
        <Text style={styles.highlightDescription}>{recoveryCopy}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>기록률</Text>
          <Text style={styles.metricValue}>71%</Text>
          <Text style={styles.metricHelper}>7번 중 5번 기록 완료</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>유지율</Text>
          <Text style={styles.metricValue}>64%</Text>
          <Text style={styles.metricHelper}>추천 흐름 유지 기준</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>복귀율</Text>
          <Text style={styles.metricValue}>80%</Text>
          <Text style={styles.metricHelper}>무너진 뒤 다음 끼니 복귀</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>이번 주 포인트</Text>
          <Text style={styles.metricValue}>외식 대응</Text>
          <Text style={styles.metricHelper}>현실적인 선택이 유지에 도움</Text>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteLabel}>다음 주 제안</Text>
        <Text style={styles.noteTitle}>점심 한 끼만이라도 계속 같은 패턴으로 고정해 보세요.</Text>
        <Text style={styles.noteDescription}>
          초기 단계에서는 완벽한 식단보다, 반복 가능한 한 끼 루틴을 먼저 만드는 것이 중요합니다.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onBackHome}>
        <Text style={styles.primaryButtonText}>다시 오늘 추천 보기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.greenDeep,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 320,
  },
  highlightCard: {
    backgroundColor: colors.greenSurface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  highlightLabel: {
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
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    shadowColor: colors.greenDeep,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
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
  metricHelper: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  noteCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  noteDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  primaryButton: {
    backgroundColor: colors.greenButton,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#17301B',
    fontSize: 16,
    fontWeight: '700',
  },
});
