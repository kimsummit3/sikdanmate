import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BottomTabBar } from './src/components/BottomTabBar';
import { getMealOptions } from './src/data/options';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogScreen } from './src/screens/LogScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
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

  const showTabs = screen !== 'onboarding' && screen !== 'log';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
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
            onOpenSettings={() => setScreen('settings')}
            onSelectMeal={handleSelectMeal}
          />
        )}

        {screen === 'log' && (
          <LogScreen
            selectedMeal={selectedMeal}
            selectedResult={selectedResult}
            onSelectResult={setSelectedResult}
            onBack={() => setScreen('home')}
            onComplete={() => setScreen('home')}
            onOpenSummary={() => setScreen('summary')}
          />
        )}

        {screen === 'summary' && (
          <SummaryScreen
            goal={goal}
            lastResult={selectedResult}
            onBackHome={() => setScreen('home')}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            goal={goal}
            eatingStyle={eatingStyle}
            constraints={constraints}
            onSelectGoal={setGoal}
            onSelectStyle={setEatingStyle}
            onToggleConstraint={toggleConstraint}
            onBackHome={() => setScreen('home')}
          />
        )}
      </View>

      {showTabs && (
        <BottomTabBar
          currentTab={screen === 'settings' ? 'settings' : screen === 'summary' ? 'summary' : 'home'}
          onChangeTab={(tab) => {
            if (tab === 'home') setScreen('home');
            if (tab === 'summary') setScreen('summary');
            if (tab === 'settings') setScreen('settings');
          }}
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
  content: {
    flex: 1,
  },
});
