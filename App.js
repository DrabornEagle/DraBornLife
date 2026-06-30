import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from './src/theme';
import { DebtScreen } from './src/screens/DebtScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { MoneyScreen } from './src/screens/MoneyScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ShoppingScreen } from './src/screens/ShoppingScreen';
import { useLifeData } from './src/hooks/useLifeData';

const tabs = [
  { key: 'home', label: 'Ana Sayfa', icon: '🌴' },
  { key: 'money', label: 'Gelir-Gider', icon: '💸' },
  { key: 'shopping', label: 'Alınacaklar', icon: '🛋️' },
  { key: 'debt', label: 'Borç', icon: '📉' },
  { key: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { lifeData, isLoading, updateLifeData, resetLocalData } = useLifeData();

  const screen = useMemo(() => {
    if (isLoading || !lifeData) {
      return <LoadingScreen />;
    }

    if (activeTab === 'home') {
      return <HomeScreen lifeData={lifeData} />;
    }

    if (activeTab === 'money') {
      return <MoneyScreen lifeData={lifeData} onSave={updateLifeData} />;
    }

    if (activeTab === 'shopping') {
      return <ShoppingScreen lifeData={lifeData} onSave={updateLifeData} />;
    }

    if (activeTab === 'debt') {
      return <DebtScreen lifeData={lifeData} onSave={updateLifeData} />;
    }

    return <SettingsScreen onReset={resetLocalData} />;
  }, [activeTab, isLoading, lifeData, resetLocalData, updateLifeData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.oceanDeep} />
      <View style={styles.appShell}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {screen}
        </ScrollView>

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.82}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.oceanDeep,
  },
  appShell: {
    flex: 1,
    backgroundColor: theme.colors.oceanDeep,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 8,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#06202A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 22,
  },
  tabItemActive: {
    backgroundColor: theme.colors.aqua,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    color: theme.colors.slate,
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: theme.colors.oceanDeep,
  },
});
