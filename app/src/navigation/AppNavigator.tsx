import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { LogScreen } from '../screens/LogScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { BottomTabBar } from '../components/BottomTabBar';
import { useProfileState } from '../hooks/useProfileState';
import { MealOption } from '../types/app';
import { MainTabKey, RootStackParamList } from '../types/navigation';
import { View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs({
  currentTab,
  onChangeTab,
  goal,
  eatingStyle,
  constraints,
  mealOptions,
  weeklyStats,
  selectedResult,
  onOpenSettings,
  onSelectMeal,
  onSelectGoal,
  onSelectStyle,
  onToggleConstraint,
  onBackHome,
}: {
  currentTab: MainTabKey;
  onChangeTab: (tab: MainTabKey) => void;
  goal: any;
  eatingStyle: any;
  constraints: any;
  mealOptions: any;
  weeklyStats: any;
  selectedResult: any;
  onOpenSettings: () => void;
  onSelectMeal: (meal: MealOption) => void;
  onSelectGoal: (goal: any) => void;
  onSelectStyle: (style: any) => void;
  onToggleConstraint: (constraint: any) => void;
  onBackHome: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomeScreen
            goal={goal}
            eatingStyle={eatingStyle}
            constraints={constraints}
            mealOptions={mealOptions}
            onOpenSettings={onOpenSettings}
            onSelectMeal={onSelectMeal}
          />
        )}
        {currentTab === 'summary' && (
          <SummaryScreen goal={goal} lastResult={selectedResult} weeklyStats={weeklyStats} onBackHome={onBackHome} />
        )}
        {currentTab === 'settings' && (
          <SettingsScreen
            goal={goal}
            eatingStyle={eatingStyle}
            constraints={constraints}
            onSelectGoal={onSelectGoal}
            onSelectStyle={onSelectStyle}
            onToggleConstraint={onToggleConstraint}
            onBackHome={onBackHome}
          />
        )}
      </View>
      <BottomTabBar currentTab={currentTab} onChangeTab={onChangeTab} />
    </View>
  );
}

export function AppNavigator() {
  const [currentTab, setCurrentTab] = useState<MainTabKey>('home');
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const { goal, eatingStyle, constraints, selectedResult, mealOptions, weeklyStats, actions } = useProfileState();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen
              goal={goal}
              eatingStyle={eatingStyle}
              constraints={constraints}
              onSelectGoal={actions.setGoal}
              onSelectStyle={actions.setEatingStyle}
              onToggleConstraint={actions.toggleConstraint}
              onContinue={() => navigation.replace('MainTabs')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MainTabs">
          {({ navigation }) => (
            <MainTabs
              currentTab={currentTab}
              onChangeTab={setCurrentTab}
              goal={goal}
              eatingStyle={eatingStyle}
              constraints={constraints}
              mealOptions={mealOptions}
              weeklyStats={weeklyStats}
              selectedResult={selectedResult}
              onOpenSettings={() => setCurrentTab('settings')}
              onSelectMeal={(meal) => {
                setSelectedMeal(meal);
                actions.setSelectedResult(null);
                navigation.navigate('Log', { meal });
              }}
              onSelectGoal={actions.setGoal}
              onSelectStyle={actions.setEatingStyle}
              onToggleConstraint={actions.toggleConstraint}
              onBackHome={() => setCurrentTab('home')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Log">
          {({ navigation, route }) => (
            <LogScreen
              selectedMeal={route.params?.meal ?? selectedMeal}
              selectedResult={selectedResult}
              onSelectResult={actions.setSelectedResult}
              onBack={() => navigation.goBack()}
              onComplete={() => navigation.goBack()}
              onOpenSummary={() => {
                setCurrentTab('summary');
                navigation.replace('MainTabs');
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
