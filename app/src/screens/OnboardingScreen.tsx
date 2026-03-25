import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SelectableChip } from '../components/SelectableChip';
import { SurfaceCard } from '../components/SurfaceCard';
import { constraintOptions, goalOptions, styleOptions } from '../data/options';
import { colors } from '../styles/theme';
import { Constraint, EatingStyle, Goal } from '../types/app';

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
      <AppHeader
        eyebrow="식단메이트 온보딩"
        title={`식단을 계속하게 만드는\n기본 설정부터 시작합니다.`}
        subtitle="1분 안에 끝나는 설정으로, 오늘 식단 추천을 바로 시작할 수 있게 만듭니다."
      />

      <SurfaceCard style={styles.cardSpacing}>
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
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
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
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
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
      </SurfaceCard>

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>설정 요약</Text>
        <Text style={styles.summaryText}>목표: {goal}</Text>
        <Text style={styles.summaryText}>식단 스타일: {eatingStyle}</Text>
        <Text style={styles.summaryText}>현실 조건: {constraints.join(', ') || '없음'}</Text>
      </SurfaceCard>

      <AppButton label="오늘 식단 추천 받기" onPress={onContinue} />
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
    marginBottom: 16,
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
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#29422E',
    marginBottom: 4,
  },
});
