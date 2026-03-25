import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
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
      <AppHeader
        eyebrow="식단메이트"
        title="오늘 뭐 먹지?"
        subtitle="바로 정하고, 가볍게 기록하고, 다음 한 끼로 다시 이어가세요."
        actionLabel="설정 수정"
        onPressAction={onOpenSettings}
      />

      <SurfaceCard style={styles.spacedCard}>
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
      </SurfaceCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘의 추천</Text>
        <Text style={styles.sectionMeta}>{mealOptions.length} options</Text>
      </View>

      {mealOptions.map((meal, index) => (
        <SurfaceCard key={meal.title} style={styles.mealCard}>
          <View style={styles.mealMetaRow}>
            <Text style={styles.mealIndex}>Option {index + 1}</Text>
            <View style={styles.mealTag}><Text style={styles.mealTagText}>{meal.tag}</Text></View>
          </View>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealContext}>{meal.context}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          <AppButton label="이걸로 갈게요" onPress={() => onSelectMeal(meal)} />
        </SurfaceCard>
      ))}

      <SurfaceCard tone="soft" style={styles.recoveryCard}>
        <Text style={styles.recoveryLabel}>복귀 UX</Text>
        <Text style={styles.recoveryTitle}>망쳐도 괜찮아요. 다음 한 끼부터 다시 가면 됩니다.</Text>
        <Text style={styles.recoveryDescription}>
          식단메이트는 실패를 기록하는 앱이 아니라, 복귀를 설계하는 앱입니다.
        </Text>
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  spacedCard: { marginBottom: 24 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30, marginBottom: 8 },
  cardDescription: { fontSize: 15, lineHeight: 22, color: colors.textMuted, marginBottom: 14 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { backgroundColor: colors.chip, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  optionChipText: { color: '#335339', fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  sectionMeta: { color: colors.textSoft, fontWeight: '600' },
  mealCard: { marginBottom: 14 },
  mealMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealIndex: { fontSize: 12, fontWeight: '700', color: colors.accent },
  mealTag: { backgroundColor: colors.greenSurface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  mealTagText: { color: colors.greenStrong, fontSize: 12, fontWeight: '700' },
  mealTitle: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 28, marginBottom: 6 },
  mealContext: { fontSize: 13, color: colors.greenDeep, fontWeight: '600', marginBottom: 8 },
  mealDescription: { fontSize: 15, lineHeight: 22, color: colors.textMuted, marginBottom: 16 },
  recoveryCard: { marginTop: 8 },
  recoveryLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 8 },
  recoveryTitle: { fontSize: 22, fontWeight: '800', color: '#1E3221', lineHeight: 30, marginBottom: 10 },
  recoveryDescription: { fontSize: 15, lineHeight: 22, color: '#4E6151' },
});
