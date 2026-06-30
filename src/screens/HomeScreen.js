import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CleanMetricCard } from '../components/CleanMetricCard';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatTRY, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);

  return (
    <View style={styles.screen}>
      <View style={styles.oceanBand} />
      <View style={styles.sunDot} />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>{APP_VERSION_LABEL}</Text>
            <Text style={styles.title}>Antalya planı</Text>
          </View>
          <View style={styles.palmCircle}>
            <Text style={styles.palm}>🌴</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Deniz havasında, sade ve anlaşılır yeni hayat paneli.</Text>

        <View style={styles.destinationCard}>
          <Text style={styles.destinationLabel}>Hedef bölge</Text>
          <Text style={styles.destinationTitle}>{summary.targetAreas}</Text>
          <Text style={styles.destinationDate}>{summary.targetDateText}</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Özet</Text>
        <Text style={styles.sectionHint}>Birikim, borç ve alınacaklar lokal veriden okunur.</Text>
      </View>

      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Birikim" value={formatTRY(summary.savedAmount)} hint="Mevcut net" accent={theme.colors.aqua} />
        <CleanMetricCard label="Borç" value={formatTRY(summary.debtLeft)} hint="Kalan tutar" accent={theme.colors.miamiPink} />
      </View>

      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Alınacak" value={`${summary.shoppingCount} kalem`} hint="Ev kurulum" accent={theme.colors.palm} />
        <CleanMetricCard label="Motor" value={formatTRY(summary.motorcyclePrice)} hint="Düzenlenebilir" accent={theme.colors.sunset} />
      </View>

      <CleanProgressCard
        title="Taşınma bütçesi"
        subtitle="Birikim ilerlemesi"
        percent={summary.savingPercent}
        leftLabel={formatTRY(summary.savedAmount)}
        rightLabel={formatTRY(summary.targetBudget)}
        color={theme.colors.aqua}
      />

      <CleanProgressCard
        title="Motosiklet hedefi"
        subtitle="Sıfır motosiklet için ayrılan tutar"
        percent={summary.motorcyclePercent}
        leftLabel={formatTRY(summary.motorcycleSaved)}
        rightLabel={formatTRY(summary.motorcyclePrice)}
        color={theme.colors.sunset}
      />

      <View style={styles.nextCard}>
        <Text style={styles.nextTitle}>v0.1 öncesi temizlik</Text>
        <Text style={styles.nextText}>v0.0.11 ile sürüm kodları merkezi hale getirildi. Bundan sonra tüm ekranlar aynı sürümü gösterir.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: 900,
    paddingTop: 18,
    paddingBottom: 34,
    backgroundColor: '#DFF5F6',
    overflow: 'hidden',
  },
  oceanBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 210,
    backgroundColor: '#073B4C',
  },
  sunDot: {
    position: 'absolute',
    top: 62,
    right: -18,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 179, 71, 0.25)',
  },
  header: {
    margin: 18,
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(6, 32, 42, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(200, 251, 255, 0.16)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    color: theme.colors.aquaSoft,
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
  },
  palmCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(45, 226, 230, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  palm: {
    fontSize: 28,
  },
  subtitle: {
    marginTop: 14,
    color: '#DDF8FA',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  destinationCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#ECFBFB',
    borderWidth: 1,
    borderColor: '#BEEDEF',
  },
  destinationLabel: {
    color: theme.colors.slate,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  destinationTitle: {
    marginTop: 6,
    color: theme.colors.textDark,
    fontSize: 18,
    fontWeight: '900',
  },
  destinationDate: {
    marginTop: 8,
    color: theme.colors.coral,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionBlock: {
    marginHorizontal: 18,
    marginTop: 4,
    marginBottom: 6,
  },
  sectionTitle: {
    color: theme.colors.textDark,
    fontSize: 24,
    fontWeight: '900',
  },
  sectionHint: {
    marginTop: 4,
    color: '#315661',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: 13,
    marginTop: 4,
  },
  nextCard: {
    marginHorizontal: 18,
    marginTop: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#FFF1D6',
    borderWidth: 1,
    borderColor: '#FFDCA0',
  },
  nextTitle: {
    color: theme.colors.textDark,
    fontSize: 18,
    fontWeight: '900',
  },
  nextText: {
    marginTop: 8,
    color: theme.colors.slate,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
});
