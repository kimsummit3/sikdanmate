import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { MealLog } from '../types/app';

type Props = {
  mealLogs: MealLog[];
  onBack: () => void;
};

export function HistoryScreen({ mealLogs, onBack }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="기록 히스토리"
        title={`최근 식사 기록을\n확인합니다.`}
        subtitle="지금은 최근 기록을 빠르게 점검하는 MVP 형태입니다."
      />

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>전체 기록</Text>
        {mealLogs.length === 0 ? (
          <Text style={styles.emptyText}>아직 저장된 기록이 없습니다.</Text>
        ) : (
          mealLogs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View style={styles.logMain}>
                <Text style={styles.logMeal}>{log.mealTitle}</Text>
                <Text style={styles.logDate}>{new Date(log.createdAt).toLocaleString('ko-KR')}</Text>
              </View>
              <Text style={styles.logResult}>{log.result}</Text>
            </View>
          ))
        )}
      </SurfaceCard>

      <AppButton label="홈으로 돌아가기" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 18 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  emptyText: { fontSize: 15, color: colors.textMuted },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEF1EA' },
  logMain: { flex: 1, paddingRight: 10 },
  logMeal: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  logDate: { fontSize: 12, color: colors.textSoft },
  logResult: { fontSize: 13, fontWeight: '700', color: colors.greenStrong },
});
