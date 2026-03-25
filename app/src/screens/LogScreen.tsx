import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>식사 기록</Text>
          <Text style={styles.title}>이번 식사는{`\n`}어땠나요?</Text>
          <Text style={styles.subtitle}>정확한 칼로리보다, 흐름이 이어졌는지 빠르게 체크하는 것이 먼저입니다.</Text>
        </View>
        <TouchableOpacity style={styles.badge} onPress={onBack}>
          <Text style={styles.badgeText}>추천으로 돌아가기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mealCard}>
        <Text style={styles.cardLabel}>선택한 식단</Text>
        <Text style={styles.mealTitle}>{selectedMeal?.title ?? '선택한 식단 없음'}</Text>
        <Text style={styles.mealDescription}>{selectedMeal?.description ?? '먼저 홈 화면에서 식단을 선택해 주세요.'}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>기록 상태 선택</Text>
        <Text style={styles.sectionMeta}>1 tap</Text>
      </View>

      {resultOptions.map((option) => {
        const selected = selectedResult === option.label;
        return (
          <TouchableOpacity
            key={option.label}
            style={[styles.resultCard, selected && styles.resultCardSelected]}
            onPress={() => onSelectResult(option.label)}
          >
            <Text style={[styles.resultTitle, selected && styles.resultTitleSelected]}>{option.label}</Text>
            <Text style={[styles.resultHelper, selected && styles.resultHelperSelected]}>{option.helper}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.recoveryCard}>
        <Text style={styles.cardLabel}>다음 한 끼 복귀</Text>
        <Text style={styles.recoveryTitle}>
          {selectedResult === '벗어났어요'
            ? '괜찮습니다. 다음 한 끼는 더 가볍고 단순하게 다시 잡으면 됩니다.'
            : '좋습니다. 다음 한 끼도 같은 흐름으로 이어가면 됩니다.'}
        </Text>
        <Text style={styles.recoveryDescription}>
          실패를 크게 분석하기보다, 다음 선택을 쉽게 만드는 것이 식단메이트의 기본 원칙입니다.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !selectedResult && styles.primaryButtonDisabled]}
        disabled={!selectedResult}
        onPress={onComplete}
      >
        <Text style={styles.primaryButtonText}>기록 완료하고 홈으로</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryCta, !selectedResult && styles.primaryButtonDisabled]}
        disabled={!selectedResult}
        onPress={onOpenSummary}
      >
        <Text style={styles.secondaryCtaText}>주간 요약 보기</Text>
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
    gap: 14,
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.greenLight,
  },
  badgeText: {
    color: '#335339',
    fontWeight: '700',
  },
  mealCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
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
  recoveryCard: {
    backgroundColor: colors.greenSurface,
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
    marginBottom: 18,
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
  primaryButton: {
    backgroundColor: colors.greenButton,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#17301B',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryCta: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  secondaryCtaText: {
    color: colors.greenStrong,
    fontSize: 16,
    fontWeight: '700',
  },
});
