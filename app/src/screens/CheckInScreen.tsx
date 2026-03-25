import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SelectableChip } from '../components/SelectableChip';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { BudgetLevel, CheckInPlace, CheckInState, HungerLevel } from '../types/app';

type Props = {
  checkIn: CheckInState;
  onSelectPlace: (value: CheckInPlace) => void;
  onSelectHunger: (value: HungerLevel) => void;
  onSelectBudget: (value: BudgetLevel) => void;
  onSetCravingPreset: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

const placeOptions: CheckInPlace[] = ['집', '밖'];
const hungerOptions: HungerLevel[] = ['가벼움', '보통', '많이 배고픔'];
const budgetOptions: BudgetLevel[] = ['절약', '보통', '여유 있음'];
const cravingPresets = ['한식', '가벼운 것', '든든한 것', '편의점 가능'];

export function CheckInScreen({
  checkIn,
  onSelectPlace,
  onSelectHunger,
  onSelectBudget,
  onSetCravingPreset,
  onContinue,
  onBack,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="대화 모드 체크인"
        title={`지금 상황을\n빠르게 맞춰볼게요.`}
        subtitle="집/밖, 배고픔, 예산, 땡기는 음식만 잡아도 오늘 식단은 훨씬 현실적으로 바뀝니다."
        actionLabel="뒤로"
        onPressAction={onBack}
      />

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>1. 지금 어디서 드시나요?</Text>
        <View style={styles.optionGrid}>
          {placeOptions.map((item) => (
            <SelectableChip key={item} label={item} selected={checkIn.place === item} onPress={() => onSelectPlace(item)} />
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>2. 지금 얼마나 배고프신가요?</Text>
        <View style={styles.optionGrid}>
          {hungerOptions.map((item) => (
            <SelectableChip key={item} label={item} selected={checkIn.hunger === item} onPress={() => onSelectHunger(item)} />
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>3. 오늘 예산감은 어느 정도인가요?</Text>
        <View style={styles.optionGrid}>
          {budgetOptions.map((item) => (
            <SelectableChip key={item} label={item} selected={checkIn.budget === item} onPress={() => onSelectBudget(item)} />
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>4. 지금 땡기는 방향이 있나요?</Text>
        <View style={styles.optionGrid}>
          {cravingPresets.map((item) => (
            <SelectableChip key={item} label={item} selected={checkIn.craving === item} onPress={() => onSetCravingPreset(item)} />
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>현재 체크인 요약</Text>
        <Text style={styles.summaryText}>장소: {checkIn.place}</Text>
        <Text style={styles.summaryText}>배고픔: {checkIn.hunger}</Text>
        <Text style={styles.summaryText}>예산감: {checkIn.budget}</Text>
        <Text style={styles.summaryText}>땡기는 방향: {checkIn.craving || '아직 없음'}</Text>
      </SurfaceCard>

      <AppButton label="이 기준으로 오늘 식단 보기" onPress={onContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryText: { fontSize: 15, lineHeight: 22, color: '#29422E', marginBottom: 4 },
});
