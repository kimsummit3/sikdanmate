import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { LogResult, MealOption } from '../types/app';

type Props = {
  selectedMeal: MealOption | null;
  selectedResult: LogResult | null;
  onSelectResult: (result: LogResult) => void;
  onBack: () => void;
  onComplete: () => void;
  onOpenSummary: () => void;
};

const resultOptions: { label: LogResult; helper: string }[] = [
  { label: '잘 지켰어요', helper: '추천한 흐름대로 잘 이어간 상태입니다.' },
  { label: '비슷해요', helper: '조금 달랐지만 전체적으로는 크게 벗어나지 않았습니다.' },
  { label: '벗어났어요', helper: '야식, 과식, 다른 메뉴 선택 등으로 흐름이 무너진 상태입니다.' },
];

export function LogScreen({ selectedMeal, selectedResult, onSelectResult, onBack, onComplete, onOpenSummary }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="식사 기록"
        title={`이번 식사는\n어땠나요?`}
        subtitle="정확한 칼로리보다, 흐름이 이어졌는지 빠르게 체크하는 것이 먼저입니다."
        actionLabel="추천으로 돌아가기"
        onPressAction={onBack}
      />

      <SurfaceCard style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>선택한 식단</Text>
        <Text style={styles.mealTitle}>{selectedMeal?.title ?? '선택한 식단 없음'}</Text>
        <Text style={styles.mealDescription}>{selectedMeal?.description ?? '먼저 홈 화면에서 식단을 선택해 주세요.'}</Text>
      </SurfaceCard>

      <Text style={styles.sectionTitle}>기록 상태 선택</Text>

      {resultOptions.map((option) => {
        const selected = selectedResult === option.label;
        return (
          <SurfaceCard key={option.label} style={[styles.resultCard, selected ? styles.resultCardSelected : undefined]}>
            <Text style={[styles.resultTitle, selected && styles.resultTitleSelected]} onPress={() => onSelectResult(option.label)}>
              {option.label}
            </Text>
            <Text style={[styles.resultHelper, selected && styles.resultHelperSelected]} onPress={() => onSelectResult(option.label)}>
              {option.helper}
            </Text>
          </SurfaceCard>
        );
      })}

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>다음 한 끼 복귀</Text>
        <Text style={styles.recoveryTitle}>
          {selectedResult === '벗어났어요'
            ? '괜찮습니다. 다음 한 끼는 더 가볍고 단순하게 다시 잡으면 됩니다.'
            : '좋습니다. 다음 한 끼도 같은 흐름으로 이어가면 됩니다.'}
        </Text>
        <Text style={styles.recoveryDescription}>
          실패를 크게 분석하기보다, 다음 선택을 쉽게 만드는 것이 식단메이트의 기본 원칙입니다.
        </Text>
      </SurfaceCard>

      <AppButton label="기록 완료하고 홈으로" onPress={onComplete} disabled={!selectedResult} />
      <AppButton label="주간 요약 보기" onPress={onOpenSummary} disabled={!selectedResult} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 10,
  },
  cardSpacing: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.greenDeep,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  resultCard: {
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  resultCardSelected: {
    borderColor: colors.greenButton,
    backgroundColor: '#F7FCF6',
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  resultTitleSelected: {
    color: colors.greenStrong,
  },
  resultHelper: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  resultHelperSelected: {
    color: '#35523A',
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
  },
});
