import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { theme } from './src/theme';
import { AntalyaLifeScreen } from './src/screens/AntalyaLifeScreen';
import { CustomGoalsScreen } from './src/screens/CustomGoalsScreen';
import { DebtScreenSafe } from './src/screens/DebtScreenSafe';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { MoneyScreenSafe } from './src/screens/MoneyScreenSafe';
import { SettingsScreenFixed } from './src/screens/SettingsScreenFixed';
import { ShoppingScreenSafe } from './src/screens/ShoppingScreenSafe';
import { TestCenterScreen } from './src/screens/TestCenterScreen';
import { YearPlanScreen } from './src/screens/YearPlanScreen';
import { useLifeData } from './src/hooks/useLifeData';

const tabs = [
  { key: 'home', label: 'Ana', icon: '🌴' },
  { key: 'life', label: 'Yaşam', icon: '🌊' },
  { key: 'year', label: 'Yıl', icon: '📅' },
  { key: 'test', label: 'Test', icon: '🧪' },
  { key: 'goals', label: 'Hedef', icon: '🎯' },
  { key: 'money', label: 'Para', icon: '💸' },
  { key: 'shopping', label: 'Liste', icon: '🛋️' },
  { key: 'debt', label: 'Borç', icon: '📉' },
  { key: 'settings', label: 'Ayar', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { lifeData, isLoading, updateLifeData, resetLocalData } = useLifeData();
  const activeTabInfo = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  const screen = useMemo(() => {
    if (isLoading || !lifeData) return <LoadingScreen />;
    if (activeTab === 'home') return <HomeScreen lifeData={lifeData} />;
    if (activeTab === 'life') return <AntalyaLifeScreen lifeData={lifeData} onSave={updateLifeData} />;
    if (activeTab === 'year') return <YearPlanScreen lifeData={lifeData} onSave={updateLifeData} />;
    if (activeTab === 'test') return <TestCenterScreen lifeData={lifeData} />;
    if (activeTab === 'goals') return <CustomGoalsScreen lifeData={lifeData} onSave={updateLifeData} />;
    if (activeTab === 'money') return <MoneyScreenSafe lifeData={lifeData} onSave={updateLifeData} />;
    if (activeTab === 'shopping') return <ShoppingScreenSafe lifeData={lifeData} onSave={updateLifeData} />;
    if (activeTab === 'debt') return <DebtScreenSafe lifeData={lifeData} onSave={updateLifeData} />;
    return <SettingsScreenFixed lifeData={lifeData} onReset={resetLocalData} onRestore={updateLifeData} />;
  }, [activeTab, isLoading, lifeData, resetLocalData, updateLifeData]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.oceanDeep} />
        <View style={styles.appShell}>
          <View style={styles.content}>{screen}</View>
          <View style={styles.tabWrap}>
            <View style={styles.navHeader}>
              <Text style={styles.navTitle}>DraBornLife Menü</Text>
              <Text style={styles.navHint}>Aktif: {activeTabInfo.label} • 9 bölüm</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.tabBarContent}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity key={tab.key} style={[styles.tabItem, isActive && styles.tabItemActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.82}>
                    <View style={[styles.iconBubble, isActive && styles.iconBubbleActive]}>
                      <Text style={styles.tabIcon}>{tab.icon}</Text>
                    </View>
                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.oceanDeep },
  appShell: { flex: 1, backgroundColor: theme.colors.oceanDeep },
  content: { flex: 1, backgroundColor: '#F4FBF9' },
  tabWrap: {
    backgroundColor: theme.colors.oceanDeep,
    paddingTop: 9,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,251,255,0.12)',
    elevation: 12,
  },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 },
  navTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 0.3 },
  navHint: { color: 'rgba(221,248,250,0.78)', fontSize: 10, fontWeight: '800' },
  tabBarContent: { paddingLeft: 12, paddingRight: 28 },
  tabItem: {
    width: 64,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  tabItemActive: {
    width: 88,
    backgroundColor: theme.colors.aqua,
    borderColor: 'rgba(255,255,255,0.55)',
    elevation: 8,
  },
  iconBubble: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  iconBubbleActive: { backgroundColor: 'rgba(255,255,255,0.96)' },
  tabIcon: { fontSize: 17 },
  tabLabel: { marginTop: 4, color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: '900' },
  tabLabelActive: { color: theme.colors.oceanDeep },
});