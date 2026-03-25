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
import { PlannerScreen } from '../screens/PlannerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ShoppingScreen } from '../screens/ShoppingScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { colors } from '../styles/theme';
import { MealOption } from '../types/app';
import { MainTabKey, RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs({ currentTab, onChangeTab, goal, eatingStyle, constraints, mealOptions, mealLogs, checkIn, weeklyStats, selectedResult, onOpenSettings, onSelectMeal, onOpenHistory, onOpenCheckIn, onOpenPlanner, onAdjustRecommendation, onSelectGoal, onSelectStyle, onToggleConstraint, onBackHome }: any) {
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
            checkIn={checkIn}
            onOpenSettings={onOpenSettings}
            onSelectMeal={onSelectMeal}
            onOpenHistory={onOpenHistory}
            onOpenCheckIn={onOpenCheckIn}
            onOpenPlanner={onOpenPlanner}
            onAdjustRecommendation={onAdjustRecommendation}
          />
        )}
        {currentTab === 'summary' && <SummaryScreen goal={goal} lastResult={selectedResult} weeklyStats={weeklyStats} mealLogs={mealLogs} onBackHome={onBackHome} />}
        {currentTab === 'settings' && <SettingsScreen goal={goal} eatingStyle={eatingStyle} constraints={constraints} onSelectGoal={onSelectGoal} onSelectStyle={onSelectStyle} onToggleConstraint={onToggleConstraint} onBackHome={onBackHome} />}
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
  const { goal, eatingStyle, constraints, selectedResult, mealOptions, weeklyStats, mealLogs, hydrated, checkIn, weeklyPlan, shoppingItems, actions } = useProfileState();

  if (!hydrated) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding">
          {({ navigation }) => <OnboardingScreen goal={goal} eatingStyle={eatingStyle} constraints={constraints} onSelectGoal={actions.setGoal} onSelectStyle={actions.setEatingStyle} onToggleConstraint={actions.toggleConstraint} onContinue={() => navigation.replace('MainTabs')} />}
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
              mealLogs={mealLogs}
              checkIn={checkIn}
              weeklyStats={weeklyStats}
              selectedResult={selectedResult}
              onOpenSettings={() => setCurrentTab('settings')}
              onSelectMeal={(meal: MealOption) => {
                setSelectedMeal(meal);
                actions.setSelectedResult(null);
                navigation.navigate('Log', { meal });
              }}
              onOpenHistory={() => navigation.navigate('History')}
              onOpenCheckIn={() => navigation.navigate('CheckIn')}
              onOpenPlanner={() => navigation.navigate('Planner')}
              onAdjustRecommendation={actions.setAdjustmentMode}
              onSelectGoal={actions.setGoal}
              onSelectStyle={actions.setEatingStyle}
              onToggleConstraint={actions.toggleConstraint}
              onBackHome={() => setCurrentTab('home')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CheckIn">
          {({ navigation }) => <CheckInScreen checkIn={checkIn} onSelectPlace={actions.setPlace} onSelectHunger={actions.setHunger} onSelectBudget={actions.setBudget} onSetCravingPreset={actions.setCraving} onContinue={() => { setSelectedMeal(mealOptions[0]); navigation.navigate('Log', { meal: mealOptions[0] }); }} onBack={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Planner">
          {({ navigation }) => <PlannerScreen weeklyPlan={weeklyPlan} onBack={() => navigation.goBack()} onRegenerate={actions.regenerateWeeklyPlan} onToggleFixed={actions.toggleWeeklyPlanFixed} onOpenShopping={() => navigation.navigate('Shopping')} />}
        </Stack.Screen>
        <Stack.Screen name="Shopping">
          {({ navigation }) => <ShoppingScreen shoppingItems={shoppingItems} onBack={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Log">
          {({ navigation, route }) => <LogScreen selectedMeal={route.params?.meal ?? selectedMeal} selectedResult={selectedResult} onSelectResult={actions.setSelectedResult} onBack={() => navigation.goBack()} onComplete={() => { const saved = actions.saveMealLog(route.params?.meal ?? selectedMeal, selectedResult); if (saved) navigation.goBack(); }} onOpenSummary={() => { const saved = actions.saveMealLog(route.params?.meal ?? selectedMeal, selectedResult); if (saved) { setCurrentTab('summary'); navigation.replace('MainTabs'); } }} />}
        </Stack.Screen>
        <Stack.Screen name="History">
          {({ navigation }) => <HistoryScreen mealLogs={mealLogs} onBack={() => navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
