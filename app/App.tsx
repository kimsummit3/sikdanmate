import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { getMealOptions } from './src/data/options';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { colors } from './src/styles/theme';
import { Constraint, EatingStyle, Goal } from './src/types/app';

export default function App() {
  const [screen, setScreen] = useState<'onboarding' | 'home'>('onboarding');
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);

  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === 'onboarding' ? (
        <OnboardingScreen
          goal={goal}
          eatingStyle={eatingStyle}
          constraints={constraints}
          onSelectGoal={setGoal}
          onSelectStyle={setEatingStyle}
          onToggleConstraint={toggleConstraint}
          onContinue={() => setScreen('home')}
        />
      ) : (
        <HomeScreen
          goal={goal}
          eatingStyle={eatingStyle}
          constraints={constraints}
          mealOptions={mealOptions}
          onOpenSettings={() => setScreen('onboarding')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
