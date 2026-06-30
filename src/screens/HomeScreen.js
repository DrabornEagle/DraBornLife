import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { HomeFinalSummaryCard } from '../components/HomeFinalSummaryCard';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatMoney, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const selectedYear = lifeData?.settings?.selectedYear || 2026;
  const targetAreasText = summary.targetAreas || 'Muratpaşa • Lara • Konyaaltı';
  const money = (value) => formatMoney(value, lifeData);
  const readiness = Math.round((summary.savingPercent + Math.min(100, summary.debtPercent) + Math.min(100, summary.shoppingPercent)) / 3);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.screen}>
      <View style={styles.premiumHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brand}>DraBornLife</Text>
            <Text style={styles.version}>{APP_VERSION_LABEL} • Expo Go</Text>
          </View>
          <View style={styles.statusBadge}><Text style={styles.statusText}>APK YOK</Text></View>
        </View>

        <Text style={styles.heroTitle}>Antalya yeni hayat kontrol merkezi</Text>
        <Text style={styles.heroText}>Taşınma bütçesi, borç azaltma, alınacaklar ve aile hedefleri tek profesyonel panelde.</Text>

        <View style={styles.mainKpiCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kpiLabel}>Hazırlık skoru</Text>
            <Text style={styles.kpiValue}>%{readiness}</Text>
            <Text style={styles.kpiHint}>{summary.targetDateText} • {summary.daysLeft} gün kaldı</Text>
          </View>
          <View style={styles.kpiRing}><Text style={styles.kpiRingText}>{selectedYear}</Text></View>
        </View>
      </View>

      <View style={styles.overlapBlock}>
        <View style={styles.goalCard}>
          <Text style={styles.sectionKicker}>ANA HEDEF</Text>
          <Text style={styles.goalTitle}>Antalya yaşam kurulumu</Text>
          <Text style={styles.goalMeta}>{targetAreasText}</Text>
          <View style={styles.goalDivider} />
          <View style={styles.goalRow}>
            <PremiumStat label="Kalan bütçe" value={money(summary.targetRemaining)} />
            <PremiumStat label="Mevcut birikim" value={money(summary.savedAmount)} />
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Finans görünümü</Text>
        <Text style={styles.sectionSubtitle}>Gelir, gider, borç ve liste durumunun sade özeti.</Text>
      </View>

      <View style={styles.dashboardGrid}>
        <DashCard label="Hedef bütçe" value={money(summary.targetBudget)} note="Toplam plan" tone="dark" />
        <DashCard label="Borç kalan" value={money(summary.debtLeft)} note={`%${summary.debtPercent} ödendi`} />
      </View>
      <View style={styles.dashboardGrid}>
        <DashCard label="Alınacaklar" value={`${summary.shoppingBought}/${summary.shoppingCount}`} note={`${summary.shoppingReady} kalem hazır`} />
        <DashCard label="Motosiklet" value={money(summary.motorcyclePrice)} note="Fiyat düzenlenebilir" />
      </View>

      <View style={styles.executiveCard}>
        <Text style={styles.sectionKicker}>YÖNETİM ÖZETİ</Text>
        <ExecutiveLine title="Taşınma" value={`${summary.daysLeft} gün kaldı`} state="Aktif" />
        <ExecutiveLine title="GTA 6 hedefi" value={`${summary.gta6DaysLeft} gün`} state="Takip" />
        <ExecutiveLine title="Son 30 gün net" value={money(summary.monthSummary.net)} state="Nakit" />
        <ExecutiveLine title="Son 7 gün net" value={money(summary.weekSummary.net)} state="Hafta" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>İlerleme planı</Text>
        <Text style={styles.sectionSubtitle}>Ana hedefler kısa, okunur ve karar verilebilir kartlara ayrıldı.</Text>
      </View>

      <CleanProgressCard title="Taşınma bütçesi" subtitle="Hedef bütçeye giden yol" percent={summary.savingPercent} leftLabel={money(summary.savedAmount)} rightLabel={money(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Borç azaltma" subtitle={`Kalan borç: ${money(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={money(summary.paidDebt)} rightLabel={money(summary.totalDebt)} color={theme.colors.miamiPink} />
      <CleanProgressCard title="Alınacaklar bütçesi" subtitle={`Kalan: ${money(summary.shoppingRemaining)}`} percent={summary.shoppingPercent} leftLabel={money(summary.shoppingSaved)} rightLabel={money(summary.shoppingTotal)} color={theme.colors.palm} />
      <CleanProgressCard title="Motosiklet hedefi" subtitle={`Eski motor satış hedefi: ${money(summary.motorcycleOldSale)}`} percent={summary.motorcyclePercent} leftLabel={money(summary.motorcycleSaved)} rightLabel={money(summary.motorcyclePrice)} color={theme.colors.sunset} />

      <HomeFinalSummaryCard lifeData={lifeData} />

      <View style={styles.nextCard}>
        <Text style={styles.nextMini}>SIRADAKİ KONTROL</Text>
        <Text style={styles.nextTitle}>v1.0.9 • Premium ana sayfa final düzeltmeleri</Text>
        <Text style={styles.nextText}>Ana sayfa sıfırdan premium mobil dashboard mantığıyla yenilendi. Expo Go üzerinde görsel testten sonra son rötuşlar yapılacak.</Text>
      </View>
    </ScrollView>
  );
}

function PremiumStat({ label, value }) {
  return (
    <View style={styles.premiumStat}>
      <Text style={styles.premiumStatLabel}>{label}</Text>
      <Text style={styles.premiumStatValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function DashCard({ label, value, note, tone }) {
  const dark = tone === 'dark';
  return (
    <View style={[styles.dashCard, dark && styles.dashCardDark]}>
      <Text style={[styles.dashLabel, dark && styles.dashLabelDark]}>{label}</Text>
      <Text style={[styles.dashValue, dark && styles.dashValueDark]} numberOfLines={2}>{value}</Text>
      <Text style={[styles.dashNote, dark && styles.dashNoteDark]}>{note}</Text>
    </View>
  );
}

function ExecutiveLine({ title, value, state }) {
  return (
    <View style={styles.executiveLine}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.executiveTitle}>{title}</Text>
        <Text style={styles.executiveValue}>{value}</Text>
      </View>
      <View style={styles.executiveBadge}><Text style={styles.executiveBadgeText}>{state}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F3F6F8' },
  screen: { paddingBottom: 160, backgroundColor: '#F3F6F8' },
  premiumHeader: { paddingTop: 22, paddingHorizontal: 18, paddingBottom: 72, backgroundColor: '#071A24', borderBottomLeftRadius: 34, borderBottomRightRadius: 34 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { color: '#FFFFFF', fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: 0.2 },
  version: { marginTop: 4, color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  statusText: { color: '#C8FBFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  heroTitle: { marginTop: 28, color: '#FFFFFF', fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -0.5 },
  heroText: { marginTop: 10, color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  mainKpiCard: { marginTop: 20, padding: 18, borderRadius: 28, backgroundColor: '#102F3D', borderWidth: 1, borderColor: 'rgba(200,251,255,0.16)', flexDirection: 'row', alignItems: 'center' },
  kpiLabel: { color: '#C8FBFF', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  kpiValue: { marginTop: 4, color: '#FFFFFF', fontSize: 46, lineHeight: 52, fontWeight: '900', letterSpacing: -1.5 },
  kpiHint: { marginTop: 4, color: 'rgba(255,255,255,0.66)', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  kpiRing: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2DE2E6', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: 'rgba(255,255,255,0.14)' },
  kpiRingText: { color: '#06202A', fontSize: 18, fontWeight: '900' },
  overlapBlock: { marginTop: -48, paddingHorizontal: 18 },
  goalCard: { padding: 18, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 8 },
  sectionKicker: { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  goalTitle: { marginTop: 7, color: '#102A35', fontSize: 24, lineHeight: 30, fontWeight: '900', letterSpacing: -0.2 },
  goalMeta: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  goalDivider: { height: 1, marginTop: 16, marginBottom: 12, backgroundColor: '#EEF2F4' },
  goalRow: { flexDirection: 'row' },
  premiumStat: { flex: 1, marginRight: 8, padding: 13, borderRadius: 20, backgroundColor: '#F6FAFB', borderWidth: 1, borderColor: '#E4F2F1' },
  premiumStatLabel: { color: '#52616B', fontSize: 11, fontWeight: '900' },
  premiumStatValue: { marginTop: 6, color: '#102A35', fontSize: 18, lineHeight: 23, fontWeight: '900' },
  sectionHeader: { marginHorizontal: 18, marginTop: 22, marginBottom: 4 },
  sectionTitle: { color: '#102A35', fontSize: 24, lineHeight: 30, fontWeight: '900', letterSpacing: -0.2 },
  sectionSubtitle: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  dashboardGrid: { flexDirection: 'row', paddingHorizontal: 13, marginTop: 8 },
  dashCard: { flex: 1, marginHorizontal: 5, padding: 16, minHeight: 132, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 2 },
  dashCardDark: { backgroundColor: '#102A35', borderColor: '#102A35' },
  dashLabel: { color: '#52616B', fontSize: 11, lineHeight: 16, fontWeight: '900', letterSpacing: 0.3 },
  dashLabelDark: { color: 'rgba(255,255,255,0.62)' },
  dashValue: { marginTop: 10, color: '#102A35', fontSize: 22, lineHeight: 28, fontWeight: '900', letterSpacing: -0.3 },
  dashValueDark: { color: '#FFFFFF' },
  dashNote: { marginTop: 7, color: '#52616B', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  dashNoteDark: { color: '#C8FBFF' },
  executiveCard: { marginHorizontal: 18, marginTop: 18, padding: 18, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 2 },
  executiveLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginTop: 8, borderTopWidth: 1, borderTopColor: '#EEF2F4' },
  executiveTitle: { color: '#102A35', fontSize: 14, lineHeight: 19, fontWeight: '900' },
  executiveValue: { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  executiveBadge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: '#E7FBFC', borderWidth: 1, borderColor: '#BEEDEF' },
  executiveBadgeText: { color: '#073B4C', fontSize: 11, fontWeight: '900' },
  nextCard: { marginHorizontal: 18, marginTop: 16, padding: 18, borderRadius: 26, backgroundColor: '#071A24', borderWidth: 1, borderColor: '#102F3D' },
  nextMini: { color: '#2DE2E6', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  nextTitle: { marginTop: 6, color: '#FFFFFF', fontSize: 19, lineHeight: 24, fontWeight: '900' },
  nextText: { marginTop: 8, color: 'rgba(255,255,255,0.70)', fontSize: 13, lineHeight: 20, fontWeight: '700' },
});
