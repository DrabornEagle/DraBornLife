import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { ProgressCard } from '../components/ProgressCard';
import { mockSummary, theme } from '../theme';

export function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.sunGlow} />
      <View style={styles.aquaGlow} />

      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.badge}>v0.0.3 • Expo Go</Text>
          <Text style={styles.palm}>🌴</Text>
        </View>

        <Text style={styles.heroTitle}>Antalya’ya Yeni Hayat</Text>
        <Text style={styles.heroSubtitle}>Palmiye, deniz ve yepyeni başlangıç için aile hedef panelin.</Text>

        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>Hedef Bölge</Text>
          <Text style={styles.locationValue}>{mockSummary.targetAreas}</Text>
          <Text style={styles.locationHint}>{mockSummary.targetDateText} plan aralığı</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bugünkü tablo</Text>
        <Text style={styles.sectionSubtitle}>Şimdilik demo değerler. v0.0.4 ile lokal veri bağlanacak.</Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard label="Birikim" value={mockSummary.savedAmount} hint="Hedef bütçeye giden yol" accent={theme.colors.aqua} />
        <MetricCard label="Borç" value={mockSummary.debtLeft} hint="Antalya’ya kadar azalt" accent={theme.colors.miamiPink} />
      </View>

      <ProgressCard
        title="Taşınma Hedefi"
        subtitle="Yeni ev, yeni düzen, yeni başlangıç"
        percent={0}
        leftLabel="Başlangıç"
        rightLabel="v0.1 hedef"
        color={theme.colors.aqua}
      />

      <ProgressCard
        title="Motosiklet Hedefi"
        subtitle={`Sıfır motosiklet tahmini: ${mockSummary.motorcyclePrice}`}
        percent={0}
        leftLabel="Planlandı"
        rightLabel="Fiyat düzenlenebilir"
        color={theme.colors.sunset}
      />

      <View style={styles.wideCard}>
        <Text style={styles.wideTitle}>Ana modüller</Text>
        <View style={styles.moduleRow}>
          <Text style={styles.moduleIcon}>🏠</Text>
          <Text style={styles.moduleText}>Ev kurulum listesi</Text>
        </View>
        <View style={styles.moduleRow}>
          <Text style={styles.moduleIcon}>💰</Text>
          <Text style={styles.moduleText}>Gelir, gider ve birikim</Text>
        </View>
        <View style={styles.moduleRow}>
          <Text style={styles.moduleIcon}>🎮</Text>
          <Text style={styles.moduleText}>GTA 6 öncesi taşınma hedefi</Text>
        </View>
        <View style={styles.moduleRow}>
          <Text style={styles.moduleIcon}>🏍️</Text>
          <Text style={styles.moduleText}>Yeni motosiklet hedefi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: 980,
    paddingTop: 22,
    paddingBottom: 36,
    backgroundColor: theme.colors.oceanDeep,
    overflow: 'hidden',
  },
  sunGlow: {
    position: 'absolute',
    top: -90,
    right: -95,
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: theme.colors.sunset,
    opacity: 0.36,
  },
  aquaGlow: {
    position: 'absolute',
    top: 145,
    left: -110,
    width: 260,
    height: 260,
    borderRadius: 150,
    backgroundColor: theme.colors.aqua,
    opacity: 0.2,
  },
  hero: {
    margin: 20,
    padding: 24,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: theme.colors.aquaSoft,
    fontSize: 12,
    fontWeight: '900',
  },
  palm: {
    fontSize: 34,
  },
  heroTitle: {
    marginTop: 24,
    color: theme.colors.white,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    marginTop: 12,
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  locationCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  locationLabel: {
    color: theme.colors.slate,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  locationValue: {
    marginTop: 8,
    color: theme.colors.textDark,
    fontSize: 18,
    fontWeight: '900',
  },
  locationHint: {
    marginTop: 6,
    color: theme.colors.coral,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 2,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
  sectionSubtitle: {
    marginTop: 5,
    color: theme.colors.aquaSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 14,
  },
  wideCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 22,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.sand,
  },
  wideTitle: {
    color: theme.colors.textDark,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  moduleIcon: {
    fontSize: 22,
    width: 34,
  },
  moduleText: {
    flex: 1,
    color: theme.colors.textDark,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
});
