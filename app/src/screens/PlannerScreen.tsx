import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { WeeklyPlanItem } from '../types/app';

type Props = {
  weeklyPlan: WeeklyPlanItem[];
  onBack: () => void;
  onRegenerate: () => void;
  onToggleFixed: (day: string) => void;
};

export function PlannerScreen({ weeklyPlan, onBack, onRegenerate, onToggleFixed }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="플래너 모드"
        title={`이번 주 식단 초안을\n먼저 깔아드립니다.`}
        subtitle="월간 운영의 시작은 주간 실행입니다. 먼저 유지 가능한 7일 패턴부터 봅니다."
        actionLabel="뒤로"
        onPressAction={onBack}
      />

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>플래너 원칙</Text>
        <Text style={styles.heroTitle}>완벽한 한 달보다, 유지 가능한 한 주가 먼저입니다.</Text>
        <Text style={styles.heroDescription}>고정/교체/재생성을 통해 주간 루틴을 다듬고, 이후 4주 플래너로 확장합니다.</Text>
      </SurfaceCard>

      {weeklyPlan.map((item) => (
        <SurfaceCard key={item.day} style={styles.cardSpacing}>
          <View style={styles.rowTop}>
            <Text style={styles.day}>{item.day}요일</Text>
            <Text style={styles.fixed}>{item.fixed ? '고정됨' : '변경 가능'}</Text>
          </View>
          <Text style={styles.mealTitle}>{item.mealTitle}</Text>
          <Text style={styles.note}>{item.note}</Text>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <AppButton label={item.fixed ? '고정 해제' : '고정'} onPress={() => onToggleFixed(item.day)} variant="secondary" />
            </View>
            <View style={styles.buttonHalf}>
              <AppButton label="다시 생성" onPress={onRegenerate} />
            </View>
          </View>
        </SurfaceCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30, marginBottom: 8 },
  heroDescription: { fontSize: 15, lineHeight: 22, color: colors.textMuted },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  day: { fontSize: 18, fontWeight: '700', color: colors.text },
  fixed: { fontSize: 13, fontWeight: '700', color: colors.greenStrong },
  mealTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  note: { fontSize: 14, lineHeight: 20, color: colors.textMuted, marginBottom: 14 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  buttonHalf: { flex: 1 },
});
