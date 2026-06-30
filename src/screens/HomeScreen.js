import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CleanMetricCard } from '../components/CleanMetricCard';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { YearFinancePanel } from '../components/YearFinancePanel';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatTRY, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const selectedYear = lifeData?.settings?.selectedYear || 2026;

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.screen}>
      <View style={styles.oceanBand} />
      <View style={styles.sunDot} />
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.eyebrow}>{APP_VERSION_LABEL}</Text>
            <Text style={styles.title}>Antalya plani</Text>
          </View>
          <View style={styles.palmCircle}><Text style={styles.palm}>🌴</Text></View>
        </View>
        <Text style={styles.subtitle}>Hedefe kalan gun, butce ve borc durumunu tek ekranda takip et.</Text>
        <View style={styles.destinationCard}>
          <Text style={styles.destinationLabel}>Hedef bolge</Text>
          <Text style={styles.destinationTitle}>{summary.targetAreas}</Text>
          <Text style={styles.destinationDate}>{summary.targetDateText} - {summary.daysLeft} gun kaldi</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Hedef ozeti</Text>
        <Text style={styles.sectionHint}>{summary.preferredDeadlineText} - GTA 6 icin {summary.gta6DaysLeft} gun</Text>
      </View>

      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Kalan gun" value={`${summary.daysLeft}`} hint={summary.targetDate} accent={theme.colors.aqua} />
        <CleanMetricCard label="Kalan butce" value={formatTRY(summary.targetRemaining)} hint="Hedefe kalan" accent={theme.colors.miamiPink} />
      </View>
      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Hedef butce" value={formatTRY(summary.targetBudget)} hint="Toplam hedef" accent={theme.colors.palm} />
        <CleanMetricCard label="Mevcut" value={formatTRY(summary.savedAmount)} hint="Net birikim" accent={theme.colors.sunset} />
      </View>

      <CleanProgressCard title="Tasinma butcesi" subtitle="Hedef butceye giden yol" percent={summary.savingPercent} leftLabel={formatTRY(summary.savedAmount)} rightLabel={formatTRY(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Borc azaltma" subtitle={`Kalan borc: ${formatTRY(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={formatTRY(summary.paidDebt)} rightLabel={formatTRY(summary.totalDebt)} color={theme.colors.miamiPink} />
      <CleanProgressCard title="Alinacaklar butcesi" subtitle={`Kalan alinacak butcesi: ${formatTRY(summary.shoppingRemaining)}`} percent={summary.shoppingPercent} leftLabel={formatTRY(summary.shoppingSaved)} rightLabel={formatTRY(summary.shoppingTotal)} color={theme.colors.palm} />
      <CleanProgressCard title="Motosiklet hedefi" subtitle={`Eski motor satis hedefi: ${formatTRY(summary.motorcycleOldSale)}`} percent={summary.motorcyclePercent} leftLabel={formatTRY(summary.motorcycleSaved)} rightLabel={formatTRY(summary.motorcyclePrice)} color={theme.colors.sunset} />

      <View style={styles.yearWrap}><YearFinancePanel lifeData={lifeData} selectedYear={selectedYear} compact /></View>

      <View style={styles.periodCard}>
        <Text style={styles.periodTitle}>Haftalik / aylik ozet</Text>
        <View style={styles.periodRow}><Text style={styles.periodLabel}>Son 7 gun</Text><Text style={styles.periodValue}>{formatTRY(summary.weekSummary.net)}</Text></View>
        <View style={styles.periodRow}><Text style={styles.periodLabel}>Son 30 gun</Text><Text style={styles.periodValue}>{formatTRY(summary.monthSummary.net)}</Text></View>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.nextTitle}>Yillik hedef sistemi</Text>
        <Text style={styles.nextText}>v0.4 ile secili yil, yillik hedef butcesi, finans ozeti ve buyuk hayat hedefleri ayni akista takip edilir.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#DFF5F6' },
  screen: { paddingTop: 18, paddingBottom: 150, backgroundColor: '#DFF5F6', overflow: 'hidden' },
  oceanBand: { position: 'absolute', top: 0, left: 0, right: 0, height: 210, backgroundColor: '#073B4C' },
  sunDot: { position: 'absolute', top: 62, right: -18, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 179, 71, 0.25)' },
  header: { margin: 18, padding: 20, borderRadius: 30, backgroundColor: 'rgba(6, 32, 42, 0.96)', borderWidth: 1, borderColor: 'rgba(200, 251, 255, 0.16)' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { color: theme.colors.aquaSoft, fontSize: 12, fontWeight: '900' },
  title: { marginTop: 8, color: theme.colors.white, fontSize: 31, lineHeight: 36, fontWeight: '900' },
  palmCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(45, 226, 230, 0.14)', alignItems: 'center', justifyContent: 'center' },
  palm: { fontSize: 28 },
  subtitle: { marginTop: 14, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' },
  destinationCard: { marginTop: 18, padding: 16, borderRadius: 22, backgroundColor: '#ECFBFB', borderWidth: 1, borderColor: '#BEEDEF' },
  destinationLabel: { color: theme.colors.slate, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  destinationTitle: { marginTop: 6, color: theme.colors.textDark, fontSize: 18, fontWeight: '900' },
  destinationDate: { marginTop: 8, color: theme.colors.coral, fontSize: 13, fontWeight: '800' },
  sectionBlock: { marginHorizontal: 18, marginTop: 4, marginBottom: 6 },
  sectionTitle: { color: theme.colors.textDark, fontSize: 24, fontWeight: '900' },
  sectionHint: { marginTop: 4, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', marginHorizontal: 13, marginTop: 4 },
  yearWrap: { marginHorizontal: 4 },
  periodCard: { marginHorizontal: 18, marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' },
  periodTitle: { color: theme.colors.textDark, fontSize: 18, fontWeight: '900', marginBottom: 10 },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  periodLabel: { color: '#315661', fontSize: 13, fontWeight: '800' },
  periodValue: { color: theme.colors.textDark, fontSize: 14, fontWeight: '900' },
  nextCard: { marginHorizontal: 18, marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' },
  nextTitle: { color: theme.colors.textDark, fontSize: 18, fontWeight: '900' },
  nextText: { marginTop: 8, color: theme.colors.slate, fontSize: 14, lineHeight: 21, fontWeight: '700' },
});
