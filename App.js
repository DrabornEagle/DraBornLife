import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from './src/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';

const tabs = [
  { key: 'home', label: 'Ana Sayfa', icon: '🌴' },
  { key: 'money', label: 'Gelir-Gider', icon: '💸' },
  { key: 'shopping', label: 'Alınacaklar', icon: '🛋️' },
  { key: 'debt', label: 'Borç', icon: '📉' },
  { key: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const screen = useMemo(() => {
    if (activeTab === 'home') {
      return <HomeScreen />;
    }

    const titles = {
      money: 'Gelir-Gider',
      shopping: 'Alınacaklar',
      debt: 'Borç Takibi',
      settings: 'Ayarlar',
    };

    const subtitles = {
      money: 'v0.0.6 içinde gelir, gider ve birikime ayrılan tutarlar burada yönetilecek.',
      shopping: 'v0.0.7 içinde ev, beyaz eşya, mobilya, GTA 6 seti ve motosiklet hedefleri burada olacak.',
      debt: 'v0.0.8 içinde toplam borç, ödenen borç ve Antalya hedefli borç azaltma barı burada olacak.',
      settings: 'v0.0.4 sonrası hedef tarih, para birimi, yedekleme ve lokal veri ayarları burada olacak.',
    };

    return <PlaceholderScreen title={titles[activeTab]} subtitle={subtitles[activeTab]} />;
  }, [activeTab]);

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
