import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { CookingStep } from '../types/app';

type Props = {
  mealTitle?: string;
  steps: CookingStep[];
  currentStep: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function CookingScreen({ mealTitle, steps, currentStep, onBack, onPrev, onNext }: Props) {
  const step = steps[currentStep] ?? steps[0];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="요리 모드"
        title={`핸즈프리로\n요리를 진행합니다.`}
        subtitle="다음 / 반복 / 타이머 같은 음성 명령이 들어갈 자리를 먼저 잡았습니다."
        actionLabel="뒤로"
        onPressAction={onBack}
      />

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>현재 메뉴</Text>
        <Text style={styles.mealTitle}>{mealTitle ?? '선택한 메뉴 없음'}</Text>
        <Text style={styles.mealDesc}>요리 모드는 단계별 안내와 음성 명령 중심으로 확장될 예정입니다.</Text>
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>현재 단계</Text>
        <Text style={styles.stepIndex}>STEP {step.step}</Text>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.description}</Text>
        {step.timerHint ? <Text style={styles.timerHint}>권장 타이머: {step.timerHint}</Text> : null}
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>음성 명령 자리</Text>
        <View style={styles.commandWrap}>
          {['다음', '반복', '타이머 5분', '불 줄여'].map((cmd) => (
            <View key={cmd} style={styles.commandChip}><Text style={styles.commandText}>{cmd}</Text></View>
          ))}
        </View>
      </SurfaceCard>

      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}><AppButton label="이전" onPress={onPrev} variant="secondary" /></View>
        <View style={styles.buttonHalf}><AppButton label="다음" onPress={onNext} /></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  mealTitle: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30, marginBottom: 8 },
  mealDesc: { fontSize: 15, lineHeight: 22, color: colors.textMuted },
  stepIndex: { fontSize: 12, fontWeight: '700', color: colors.greenStrong, marginBottom: 8 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  stepDesc: { fontSize: 15, lineHeight: 22, color: colors.textMuted, marginBottom: 10 },
  timerHint: { fontSize: 14, fontWeight: '700', color: colors.greenStrong },
  commandWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  commandChip: { backgroundColor: colors.greenSurface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  commandText: { color: colors.greenStrong, fontWeight: '700', fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  buttonHalf: { flex: 1 },
});
