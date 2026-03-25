import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/theme';
import { Constraint, Goal, MealOption, EatingStyle } from '../types/app';

type Props = {
  goal: Goal;
  eatingStyle: EatingStyle;
  constraints: Constraint[];
  mealOptions: MealOption[];
  onOpenSettings: () => void;
  onSelectMeal: (meal: MealOption) => void;
};

export function HomeScreen({ goal, eatingStyle, constraints, mealOptions, onOpenSettings, onSelectMeal }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>식단메이트</Text>
          <Text style={styles.title}>오늘 뭐 먹지?</Text>
          <Text style={styles.subtitle}>바로 정하고, 가볍게 기록하고, 다음 한 끼로 다시 이어가세요.</Text>
        </View>
        <TouchableOpacity style={styles.badge} onPress={onOpenSettings}>
          <Text style={styles.badgeText}>설정 수정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>현재 상태</Text>
        <Text style={styles.cardTitle}>점심 전 · {eatingStyle} · {goal}</Text>
        <Text style={styles.cardDescription}>지금 상황에 맞는 식단 선택지를 바로 제안합니다.</Text>
        <View style={styles.optionRow}>
          {constraints.map((option) => (
            <View key={option} style={styles.optionChip}>
              <Text style={styles.optionChipText}>{option}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘의 추천</Text>
        <Text style={styles.sectionMeta}>{mealOptions.length} options</Text>
      </View>

      {mealOptions.map((meal, index) => (
        <View key={meal.title} style={styles.mealCard}>
          <Text style={styles.mealIndex}>Option {index + 1}</Text>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => onSelectMeal(meal)}>
            <Text style={styles.primaryButtonText}>이걸로 갈게요</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.recoveryCard}>
        <Text style={styles.recoveryLabel}>복귀 UX</Text>
        <Text style={styles.recoveryTitle}>망쳐도 괜찮아요. 다음 한 끼부터 다시 가면 됩니다.</Text>
        <Text style={styles.recoveryDescription}>
          식단메이트는 실패를 기록하는 앱이 아니라, 복귀를 설계하는 앱입니다.
        </Text>
        <View style={styles.recoveryActions}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>잘 지켰어요</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>조금 벗어났어요</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.greenLight,
  },
  badgeText: {
    color: '#335339',
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
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
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionChipText: {
    color: '#335339',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  sectionMeta: {
    color: colors.textSoft,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    shadowColor: colors.greenDeep,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  mealIndex: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: 16,
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
  recoveryCard: {
    backgroundColor: colors.greenSurface,
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  recoveryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 8,
  },
  recoveryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3221',
    lineHeight: 30,
    marginBottom: 10,
  },
  recoveryDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4E6151',
    marginBottom: 16,
  },
  recoveryActions: {
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#29422E',
    fontSize: 15,
    fontWeight: '700',
  },
});
