import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { BottomTabBar } from '../components/BottomTabBar';
import { useProfileState } from '../hooks/useProfileState';
import { CheckInScreen } from '../screens/CheckInScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LogScreen } from '../screens/LogScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { colors } from '../styles/theme';
import { MealOption } from '../types/app';
import { MainTabKey, RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs({
  currentTab,
  onChangeTab,
  goal,
  eatingStyle,
  constraints,
  mealOptions,
  weeklyStats,
  mealLogs,
  selectedResult,
  onOpenSettings,
  onSelectMeal,
  onOpenHistory,
  onOpenCheckIn,
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
  mealLogs: any;
  selectedResult: any;
  onOpenSettings: () => void;
  onSelectMeal: (meal: MealOption) => void;
  onOpenHistory: () => void;
  onOpenCheckIn: () => void;
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
            recentLogs={mealLogs}
            onOpenSettings={onOpenSettings}
            onSelectMeal={onSelectMeal}
            onOpenHistory={onOpenHistory}
            onOpenCheckIn={onOpenCheckIn}
          />
        )}
        {currentTab === 'summary' && (
          <SummaryScreen
            goal={goal}
            lastResult={selectedResult}
            weeklyStats={weeklyStats}
            mealLogs={mealLogs}
            onBackHome={onBackHome}
          />
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

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12 }}>
      <ActivityIndicator size="large" color={colors.greenStrong} />
      <Text style={{ color: colors.textMuted, fontSize: 15 }}>식단메이트 데이터를 불러오는 중입니다.</Text>
    </View>
  );
}

export function AppNavigator() {
  const [currentTab, setCurrentTab] = useState<MainTabKey>('home');
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const { goal, eatingStyle, constraints, selectedResult, mealOptions, weeklyStats, mealLogs, hydrated, checkIn, actions } = useProfileState();

  if (!hydrated) {
    return <SplashScreen />;
  }

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
              mealLogs={mealLogs}
              selectedResult={selectedResult}
              onOpenSettings={() => setCurrentTab('settings')}
              onSelectMeal={(meal) => {
                setSelectedMeal(meal);
                actions.setSelectedResult(null);
                navigation.navigate('Log', { meal });
              }}
              onOpenHistory={() => navigation.navigate('History')}
              onOpenCheckIn={() => navigation.navigate('CheckIn')}
              onSelectGoal={actions.setGoal}
              onSelectStyle={actions.setEatingStyle}
              onToggleConstraint={actions.toggleConstraint}
              onBackHome={() => setCurrentTab('home')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CheckIn">
          {({ navigation }) => (
            <CheckInScreen
              checkIn={checkIn}
              onSelectPlace={actions.setPlace}
              onSelectHunger={actions.setHunger}
              onSelectBudget={actions.setBudget}
              onSetCravingPreset={actions.setCraving}
              onContinue={() => {
                setSelectedMeal(mealOptions[0]);
                navigation.navigate('Log', { meal: mealOptions[0] });
              }}
              onBack={() => navigation.goBack()}
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
              onComplete={() => {
                const saved = actions.saveMealLog(route.params?.meal ?? selectedMeal, selectedResult);
                if (saved) navigation.goBack();
              }}
              onOpenSummary={() => {
                const saved = actions.saveMealLog(route.params?.meal ?? selectedMeal, selectedResult);
                if (saved) {
                  setCurrentTab('summary');
                  navigation.replace('MainTabs');
                }
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="History">
          {({ navigation }) => <HistoryScreen mealLogs={mealLogs} onBack={() => navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
