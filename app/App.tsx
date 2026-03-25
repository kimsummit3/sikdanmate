import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { getMealOptions } from './src/data/options';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogScreen } from './src/screens/LogScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { colors } from './src/styles/theme';
import { Constraint, EatingStyle, Goal, LogResult, MealOption, Screen } from './src/types/app';

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [goal, setGoal] = useState<Goal>('감량');
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>('외식 많음');
  const [constraints, setConstraints] = useState<Constraint[]>(['편의점 가능', '예산 민감']);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [selectedResult, setSelectedResult] = useState<LogResult | null>(null);

  const mealOptions = useMemo(() => getMealOptions(eatingStyle), [eatingStyle]);

  const toggleConstraint = (item: Constraint) => {
    setConstraints((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  const handleSelectMeal = (meal: MealOption) => {
    setSelectedMeal(meal);
    setSelectedResult(null);
    setScreen('log');
  };

  const handleCompleteLog = () => {
    setScreen('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === 'onboarding' && (
        <OnboardingScreen
          goal={goal}
          eatingStyle={eatingStyle}
          constraints={constraints}
          onSelectGoal={setGoal}
          onSelectStyle={setEatingStyle}
          onToggleConstraint={toggleConstraint}
          onContinue={() => setScreen('home')}
        />
      )}

      {screen === 'home' && (
        <HomeScreen
          goal={goal}
          eatingStyle={eatingStyle}
          constraints={constraints}
          mealOptions={mealOptions}
          onOpenSettings={() => setScreen('onboarding')}
          onSelectMeal={handleSelectMeal}
        />
      )}

      {screen === 'log' && (
        <LogScreen
          selectedMeal={selectedMeal}
          selectedResult={selectedResult}
          onSelectResult={setSelectedResult}
          onBack={() => setScreen('home')}
          onComplete={handleCompleteLog}
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
