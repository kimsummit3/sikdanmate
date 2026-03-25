import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Goal = '감량' | '유지' | '건강 식습관';
type EatingStyle = '일반식 중심' | '간편식 중심' | '외식 많음';
type Constraint = '편의점 가능' | '배달 자주 씀' | '요리 가능' | '예산 민감';

const goalOptions: Goal[] = ['감량', '유지', '건강 식습관'];
const styleOptions: EatingStyle[] = ['일반식 중심', '간편식 중심', '외식 많음'];
const constraintOptions: Constraint[] = ['편의점 가능', '배달 자주 씀', '요리 가능', '예산 민감'];

export default function App() {
  const [screen, setScreen] = useState<'onboarding' | 'home'>('onboarding');
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);

  const mealOptions = useMemo(() => {
    if (eatingStyle === '외식 많음') {
      return [
        {
          title: '닭가슴살 샐러드 + 현미김밥 1줄',
          description: '밖에서 빠르게 먹기 좋고, 과하게 무겁지 않은 점심 구성입니다.',
        },
        {
          title: '순두부찌개 + 밥 2/3 공기',
          description: '한식 위주로 가되 과식 가능성을 낮춘 현실적인 선택지입니다.',
        },
      ];
    }

    if (eatingStyle === '간편식 중심') {
      return [
        {
          title: '그릭요거트 + 바나나 + 견과류',
          description: '준비 부담이 적고, 바쁜 날에도 끊기지 않게 돕는 구성입니다.',
        },
        {
          title: '편의점 닭가슴살 + 삶은계란 + 컵샐러드',
          description: '실행 난이도를 낮추면서도 목표를 크게 벗어나지 않는 선택입니다.',
        },
      ];
    }

    return [
      {
        title: '닭가슴살 구이 + 현미밥 + 데친 채소',
        description: '집밥 기준으로 가장 안정적으로 이어가기 좋은 기본 구성입니다.',
      },
      {
        title: '연두부 + 계란말이 + 작은 밥',
        description: '부담 없이 먹되 과식을 줄이는 일반식 중심 선택지입니다.',
      },
    ];
  }, [eatingStyle]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === 'onboarding' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>식단메이트 온보딩</Text>
            <Text style={styles.title}>식단을 계속하게 만드는{`\n`}기본 설정부터 시작합니다.</Text>
            <Text style={styles.subtitle}>
              1분 안에 끝나는 설정으로, 오늘 식단 추천을 바로 시작할 수 있게 만듭니다.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>1. 목표 선택</Text>
            <View style={styles.optionGrid}>
              {goalOptions.map((item) => (
                <SelectableChip
                  key={item}
                  label={item}
                  selected={goal === item}
                  onPress={() => setGoal(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>2. 식단 스타일</Text>
            <View style={styles.optionGrid}>
              {styleOptions.map((item) => (
                <SelectableChip
                  key={item}
                  label={item}
                  selected={eatingStyle === item}
                  onPress={() => setEatingStyle(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>3. 현실 조건</Text>
            <Text style={styles.cardDescription}>자주 있는 상황을 고르면 추천이 더 현실적으로 바뀝니다.</Text>
            <View style={styles.optionGrid}>
              {constraintOptions.map((item) => (
                <SelectableChip
                  key={item}
                  label={item}
                  selected={constraints.includes(item)}
                  onPress={() => toggleConstraint(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>설정 요약</Text>
            <Text style={styles.summaryText}>목표: {goal}</Text>
            <Text style={styles.summaryText}>식단 스타일: {eatingStyle}</Text>
            <Text style={styles.summaryText}>현실 조건: {constraints.join(', ') || '없음'}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen('home')}>
            <Text style={styles.primaryButtonText}>오늘 식단 추천 받기</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>식단메이트</Text>
              <Text style={styles.title}>오늘 뭐 먹지?</Text>
              <Text style={styles.subtitle}>바로 정하고, 가볍게 기록하고, 다음 한 끼로 다시 이어가세요.</Text>
            </View>
            <TouchableOpacity style={styles.badge} onPress={() => setScreen('onboarding')}>
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
              <TouchableOpacity style={styles.primaryButton}>
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
      )}
    </SafeAreaView>
  );
}

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.selectableChip, selected && styles.selectableChipSelected]}>
      <Text style={[styles.selectableChipText, selected && styles.selectableChipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F1',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerBlock: {
    marginBottom: 24,
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
    color: '#4B6B4F',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#182119',
    marginBottom: 8,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5F6B61',
    maxWidth: 300,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E3F1DE',
  },
  badgeText: {
    color: '#335339',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4B6B4F',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B6B4F',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#182119',
    lineHeight: 30,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5F6B61',
    marginBottom: 14,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectableChip: {
    backgroundColor: '#F2F4EF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectableChipSelected: {
    backgroundColor: '#DFF0DC',
  },
  selectableChipText: {
    color: '#445244',
    fontWeight: '600',
  },
  selectableChipTextSelected: {
    color: '#234128',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#EAF4E6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B6B4F',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#29422E',
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#F1F6EE',
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
    color: '#182119',
  },
  sectionMeta: {
    color: '#6B756C',
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#4B6B4F',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  mealIndex: {
    fontSize: 12,
    fontWeight: '700',
    color: '#84A06D',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#182119',
    lineHeight: 28,
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5F6B61',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#8BC48E',
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
    backgroundColor: '#EAF4E6',
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  recoveryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B6B4F',
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
    backgroundColor: '#FFFFFF',
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
