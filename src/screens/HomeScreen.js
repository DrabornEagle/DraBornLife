import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CleanMetricCard } from '../components/CleanMetricCard';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { theme } from '../theme';
import { formatTRY, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>DraBornLife • v0.0.5</Text>
            <Text style={styles.title}>Antalya planı</Text>
          </View>
          <View style={styles.palmCircle}>
            <Text style={styles.palm}>🌴</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Taşınma, birikim, borç ve yeni hayat hedeflerini tek yerden takip et.</Text>

        <View style={styles.destinationCard}>
          <View>
            <Text style={styles.destinationLabel}>Hedef bölge</Text>
            <Text style={styles.destinationTitle}>{summary.targetAreas}</Text>
          </View>
          <Text style={styles.destinationDate}>{summary.targetDateText}</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Özet</Text>
        <Text style={styles.sectionHint}>Lokal veriler cihaz içinde saklanıyor.</Text>
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
        <Text style={styles.nextTitle}>Sıradaki odak</Text>
        <Text style={styles.nextText}>v0.0.6 ile gelir-gider ekleme ekranları açılacak. Bu dashboard daha sonra gerçek girişlerle otomatik dolacak.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: 900,
    paddingTop: 18,
    paddingBottom: 34,
    backgroundColor: '#F4FBFC',
  },
  header: {
    margin: 18,
    padding: 20,
    borderRadius: 30,
    backgroundColor: theme.colors.oceanDeep,
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
    fontWeight: '600',
  },
  destinationCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
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
    color: theme.colors.slate,
    fontSize: 13,
    fontWeight: '600',
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
