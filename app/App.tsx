import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BottomTabBar } from './src/components/BottomTabBar';
import { useAppState } from './src/hooks/useAppState';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogScreen } from './src/screens/LogScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { colors } from './src/styles/theme';

export default function App() {
  const { state, actions } = useAppState();
  const {
    screen,
    goal,
    eatingStyle,
    constraints,
    selectedMeal,
    selectedResult,
    mealOptions,
    weeklyStats,
  } = state;

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
            onSelectGoal={actions.setGoal}
            onSelectStyle={actions.setEatingStyle}
            onToggleConstraint={actions.toggleConstraint}
            onContinue={actions.completeOnboarding}
          />
        )}

        {screen === 'home' && (
          <HomeScreen
            goal={goal}
            eatingStyle={eatingStyle}
            constraints={constraints}
            mealOptions={mealOptions}
            onOpenSettings={actions.openSettings}
            onSelectMeal={actions.selectMeal}
          />
        )}

        {screen === 'log' && (
          <LogScreen
            selectedMeal={selectedMeal}
            selectedResult={selectedResult}
            onSelectResult={actions.setSelectedResult}
            onBack={actions.goHome}
            onComplete={actions.goHome}
            onOpenSummary={actions.goSummary}
          />
        )}

        {screen === 'summary' && (
          <SummaryScreen
            goal={goal}
            lastResult={selectedResult}
            weeklyStats={weeklyStats}
            onBackHome={actions.goHome}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            goal={goal}
            eatingStyle={eatingStyle}
            constraints={constraints}
            onSelectGoal={actions.setGoal}
            onSelectStyle={actions.setEatingStyle}
            onToggleConstraint={actions.toggleConstraint}
            onBackHome={actions.goHome}
          />
        )}
      </View>

      {showTabs && (
        <BottomTabBar
          currentTab={screen === 'settings' ? 'settings' : screen === 'summary' ? 'summary' : 'home'}
          onChangeTab={(tab) => {
            if (tab === 'home') actions.goHome();
            if (tab === 'summary') actions.goSummary();
            if (tab === 'settings') actions.openSettings();
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
