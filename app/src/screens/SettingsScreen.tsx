import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectableChip } from '../components/SelectableChip';
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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>설정</Text>
        <Text style={styles.title}>내 식단 기준을{`\n`}조정합니다.</Text>
        <Text style={styles.subtitle}>앱 전체 추천은 여기서 바꾼 기준을 따라갑니다.</Text>
      </View>

      <View style={styles.card}>
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
      </View>

      <View style={styles.card}>
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
      </View>

      <View style={styles.card}>
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
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onBackHome}>
        <Text style={styles.primaryButtonText}>설정 저장하고 돌아가기</Text>
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: colors.greenButton,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#17301B',
    fontSize: 16,
    fontWeight: '700',
  },
});
