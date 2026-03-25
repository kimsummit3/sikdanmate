import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { constraintOptions, goalOptions, styleOptions } from '../data/options';
import { colors } from '../styles/theme';
import { Constraint, EatingStyle, Goal } from '../types/app';
import { SelectableChip } from '../components/SelectableChip';

type Props = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  onSelectGoal: (goal: Goal) => void;
  onSelectStyle: (style: EatingStyle) => void;
  onToggleConstraint: (constraint: Constraint) => void;
  onContinue: () => void;
};

export function OnboardingScreen({
  goal,
  eatingStyle,
  constraints,
  onSelectGoal,
  onSelectStyle,
  onToggleConstraint,
  onContinue,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>식단메이트 온보딩</Text>
        <Text style={styles.title}>식단을 계속하게 만드는{`\n`}기본 설정부터 시작합니다.</Text>
        <Text style={styles.subtitle}>
          1분 안에 끝나는 설정으로, 오늘 식단 추천을 바로 시작할 수 있게 만듭니다.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>1. 목표 선택</Text>
        <View style={styles.optionGrid}>
          {goalOptions.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              selected={goal === item}
              onPress={() => onSelectGoal(item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>2. 식단 스타일</Text>
        <View style={styles.optionGrid}>
          {styleOptions.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              selected={eatingStyle === item}
              onPress={() => onSelectStyle(item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>3. 현실 조건</Text>
        <Text style={styles.cardDescription}>자주 있는 상황을 고르면 추천이 더 현실적으로 바뀝니다.</Text>
        <View style={styles.optionGrid}>
          {constraintOptions.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              selected={constraints.includes(item)}
              onPress={() => onToggleConstraint(item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>설정 요약</Text>
        <Text style={styles.summaryText}>목표: {goal}</Text>
        <Text style={styles.summaryText}>식단 스타일: {eatingStyle}</Text>
        <Text style={styles.summaryText}>현실 조건: {constraints.join(', ') || '없음'}</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>오늘 식단 추천 받기</Text>
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
  headerBlock: {
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
    maxWidth: 300,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.greenDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: 14,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    backgroundColor: colors.greenSurface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#29422E',
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: colors.greenButton,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#17301B',
    fontSize: 16,
    fontWeight: '700',
  },
});
