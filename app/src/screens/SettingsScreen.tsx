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
  onBackHome: () => void;
};

export function SettingsScreen({
  goal,
  eatingStyle,
  constraints,
  onSelectGoal,
  onSelectStyle,
  onToggleConstraint,
  onBackHome,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="설정"
        title={`내 식단 기준을\n조정합니다.`}
        subtitle="앱 전체 추천은 여기서 바꾼 기준을 따라갑니다."
      />

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>목표</Text>
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
        <Text style={styles.cardLabel}>식단 스타일</Text>
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
        <Text style={styles.cardLabel}>현실 조건</Text>
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

      <AppButton label="설정 저장하고 돌아가기" onPress={onBackHome} />
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
