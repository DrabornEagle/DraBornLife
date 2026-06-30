import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CleanMetricCard } from '../components/CleanMetricCard';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { HomeFinalSummaryCard } from '../components/HomeFinalSummaryCard';
import { YearFinancePanel } from '../components/YearFinancePanel';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatTRY, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const selectedYear = lifeData?.settings?.selectedYear || 2026;
  const targetAreasText = summary.targetAreas || 'Muratpaşa • Lara • Konyaaltı';

  const focusItems = [
    { label: 'Birikim', value: `${summary.savingPercent}%`, hint: 'Taşınma hedefi', color: theme.colors.aqua },
    { label: 'Borç', value: `${summary.debtPercent}%`, hint: 'Azaltma ilerlemesi', color: theme.colors.miamiPink },
    { label: 'Liste', value: `${summary.shoppingReady}/${summary.shoppingCount}`, hint: 'Parası hazır', color: theme.colors.palm },
  ];

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.screen}>
      <View style={styles.oceanTop} />
      <View style={styles.sunGlow} />
      <View style={styles.waveOne} />
      <View style={styles.waveTwo} />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.eyebrow}>{APP_VERSION_LABEL} • Expo Go</Text>
            <Text style={styles.heroTitle}>Yeni hayat paneli</Text>
            <Text style={styles.heroSubtitle}>Antalya'ya taşınma, aile hedefleri, borç ve birikim durumunu tek nefeslik sade ekranda takip et.</Text>
          </View>
          <View style={styles.palmBadge}>
            <Text style={styles.palmIcon}>🌴</Text>
          </View>
        </View>

        <View style={styles.destinationCard}>
          <Text style={styles.destinationLabel}>Hedef bölge</Text>
          <Text style={styles.destinationTitle}>{targetAreasText}</Text>
          <Text style={styles.destinationDate}>{summary.targetDateText} • {summary.daysLeft} gün kaldı</Text>
        </View>

        <View style={styles.heroStatsRow}>
          <HeroStat label="Kalan" value={`${summary.daysLeft}`} hint="gün" />
          <HeroStat label="Birikim" value={formatTRY(summary.savedAmount)} hint="net" />
          <HeroStat label="Kalan" value={formatTRY(summary.targetRemaining)} hint="bütçe" />
        </View>
      </View>

      <View style={styles.vibeCard}>
        <View style={styles.vibeHeaderRow}>
          <View>
            <Text style={styles.sectionMini}>SAHİL MODU</Text>
            <Text style={styles.vibeTitle}>Miami / Antalya temiz tasarım</Text>
          </View>
          <Text style={styles.vibeIcon}>🌊</Text>
        </View>
        <Text style={styles.vibeText}>Bu ana sayfa v1.0 tasarım yenilemesinin ilk parçasıdır. APK yok; sadece Expo Go ile görünüm ve okunabilirlik test edilecek.</Text>
        <View style={styles.focusGrid}>
          {focusItems.map((item) => (
            <FocusPill key={item.label} {...item} />
          ))}
        </View>
      </View>

      <HomeFinalSummaryCard lifeData={lifeData} />

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionMini}>HEDEF ÖZETİ</Text>
        <Text style={styles.sectionTitle}>Taşınma yol haritası</Text>
        <Text style={styles.sectionHint}>{summary.preferredDeadlineText} • GTA 6 için {summary.gta6DaysLeft} gün</Text>
      </View>

      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Kalan gün" value={`${summary.daysLeft}`} hint={summary.targetDate} accent={theme.colors.aqua} />
        <CleanMetricCard label="Kalan bütçe" value={formatTRY(summary.targetRemaining)} hint="Hedefe kalan" accent={theme.colors.miamiPink} />
      </View>
      <View style={styles.metricsGrid}>
        <CleanMetricCard label="Hedef bütçe" value={formatTRY(summary.targetBudget)} hint="Toplam hedef" accent={theme.colors.palm} />
        <CleanMetricCard label="Mevcut" value={formatTRY(summary.savedAmount)} hint="Net birikim" accent={theme.colors.sunset} />
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Büyük ilerleme kartları</Text>
        <Text style={styles.progressHint}>Birikim, borç, alınacaklar ve motosiklet hedefi tek ritimde.</Text>
      </View>

      <CleanProgressCard title="Taşınma bütçesi" subtitle="Hedef bütçeye giden yol" percent={summary.savingPercent} leftLabel={formatTRY(summary.savedAmount)} rightLabel={formatTRY(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Borç azaltma" subtitle={`Kalan borç: ${formatTRY(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={formatTRY(summary.paidDebt)} rightLabel={formatTRY(summary.totalDebt)} color={theme.colors.miamiPink} />
      <CleanProgressCard title="Alınacaklar bütçesi" subtitle={`Kalan alınacak bütçesi: ${formatTRY(summary.shoppingRemaining)}`} percent={summary.shoppingPercent} leftLabel={formatTRY(summary.shoppingSaved)} rightLabel={formatTRY(summary.shoppingTotal)} color={theme.colors.palm} />
      <CleanProgressCard title="Motosiklet hedefi" subtitle={`Eski motor satış hedefi: ${formatTRY(summary.motorcycleOldSale)}`} percent={summary.motorcyclePercent} leftLabel={formatTRY(summary.motorcycleSaved)} rightLabel={formatTRY(summary.motorcyclePrice)} color={theme.colors.sunset} />

      <View style={styles.yearWrap}>
        <YearFinancePanel lifeData={lifeData} selectedYear={selectedYear} compact />
      </View>

      <View style={styles.periodCard}>
        <View style={styles.periodHeaderRow}>
          <View>
            <Text style={styles.sectionMini}>NAKİT AKIŞI</Text>
            <Text style={styles.periodTitle}>Haftalık / aylık özet</Text>
          </View>
          <Text style={styles.periodEmoji}>☀️</Text>
        </View>
        <View style={styles.periodRow}><Text style={styles.periodLabel}>Son 7 gün net</Text><Text style={styles.periodValue}>{formatTRY(summary.weekSummary.net)}</Text></View>
        <View style={styles.periodRow}><Text style={styles.periodLabel}>Son 30 gün net</Text><Text style={styles.periodValue}>{formatTRY(summary.monthSummary.net)}</Text></View>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.nextMini}>SIRADAKİ TASARIM ADIMI</Text>
        <Text style={styles.nextTitle}>v1.0.5 • Para / Borç / Liste ekranları</Text>
        <Text style={styles.nextText}>Ana sayfa, alt menü ve yıl ekranı yeni sahil temasına alındı. Sıradaki adımda para, borç ve liste ekranları daha sade ve okunur hale getirilecek.</Text>
      </View>
    </ScrollView>
  );
}

function HeroStat({ label, value, hint }) {
  return (
    <View style={styles.heroStatCard}>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={styles.heroStatValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.heroStatHint}>{hint}</Text>
    </View>
  );
}

function FocusPill({ label, value, hint, color }) {
  return (
    <View style={styles.focusPill}>
      <View style={[styles.focusDot, { backgroundColor: color }]} />
      <Text style={styles.focusLabel}>{label}</Text>
      <Text style={styles.focusValue}>{value}</Text>
      <Text style={styles.focusHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F4FBF9' },
  screen: { paddingTop: 18, paddingBottom: 150, backgroundColor: '#F4FBF9', overflow: 'hidden' },
  oceanTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 285, backgroundColor: theme.colors.oceanDeep },
  sunGlow: { position: 'absolute', top: 38, right: -42, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,179,71,0.22)' },
  waveOne: { position: 'absolute', top: 218, left: -28, width: 260, height: 92, borderRadius: 80, backgroundColor: 'rgba(45,226,230,0.16)' },
  waveTwo: { position: 'absolute', top: 248, right: -48, width: 260, height: 96, borderRadius: 80, backgroundColor: 'rgba(255,241,214,0.92)' },
  heroCard: { marginHorizontal: 16, padding: 18, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: 'rgba(200,251,255,0.35)', elevation: 8 },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroTextWrap: { flex: 1, paddingRight: 12 },
  eyebrow: { color: theme.colors.coral, fontSize: 11, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
  heroTitle: { marginTop: 8, color: theme.colors.textDark, fontSize: 34, lineHeight: 38, fontWeight: '900' },
  heroSubtitle: { marginTop: 10, color: '#315661', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  palmBadge: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#E3FAF2', borderWidth: 1, borderColor: '#BEEFE1', alignItems: 'center', justifyContent: 'center' },
  palmIcon: { fontSize: 30 },
  destinationCard: { marginTop: 18, padding: 16, borderRadius: 24, backgroundColor: '#073B4C', borderWidth: 1, borderColor: 'rgba(200,251,255,0.22)' },
  destinationLabel: { color: theme.colors.aquaSoft, fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  destinationTitle: { marginTop: 7, color: theme.colors.white, fontSize: 20, lineHeight: 25, fontWeight: '900' },
  destinationDate: { marginTop: 8, color: '#FFF1D6', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  heroStatsRow: { flexDirection: 'row', marginTop: 12 },
  heroStatCard: { flex: 1, marginRight: 8, padding: 12, borderRadius: 20, backgroundColor: '#F4FBF9', borderWidth: 1, borderColor: '#D9F1F2' },
  heroStatLabel: { color: '#52616B', fontSize: 10, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  heroStatValue: { marginTop: 5, color: theme.colors.textDark, fontSize: 17, fontWeight: '900' },
  heroStatHint: { marginTop: 3, color: '#315661', fontSize: 11, fontWeight: '700' },
  vibeCard: { marginHorizontal: 16, marginTop: 14, padding: 18, borderRadius: 28, backgroundColor: '#FFF8E8', borderWidth: 1, borderColor: '#FFE2AA' },
  vibeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionMini: { color: theme.colors.coral, fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  vibeTitle: { marginTop: 5, color: theme.colors.textDark, fontSize: 20, lineHeight: 25, fontWeight: '900' },
  vibeIcon: { fontSize: 30 },
  vibeText: { marginTop: 10, color: '#315661', fontSize: 13, lineHeight: 20, fontWeight: '700' },
  focusGrid: { flexDirection: 'row', marginTop: 14 },
  focusPill: { flex: 1, marginRight: 8, padding: 12, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.74)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  focusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  focusLabel: { color: '#52616B', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  focusValue: { marginTop: 4, color: theme.colors.textDark, fontSize: 18, fontWeight: '900' },
  focusHint: { marginTop: 3, color: '#315661', fontSize: 10, lineHeight: 14, fontWeight: '700' },
  sectionBlock: { marginHorizontal: 18, marginTop: 18, marginBottom: 6 },
  sectionTitle: { marginTop: 5, color: theme.colors.textDark, fontSize: 25, lineHeight: 30, fontWeight: '900' },
  sectionHint: { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', marginHorizontal: 13, marginTop: 4 },
  progressSection: { marginHorizontal: 18, marginTop: 18, marginBottom: 2 },
  progressTitle: { color: theme.colors.textDark, fontSize: 21, fontWeight: '900' },
  progressHint: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  yearWrap: { marginHorizontal: 4, marginTop: 2 },
  periodCard: { marginHorizontal: 18, marginTop: 14, padding: 18, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' },
  periodHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  periodTitle: { marginTop: 5, color: theme.colors.textDark, fontSize: 20, fontWeight: '900' },
  periodEmoji: { fontSize: 26 },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#EEF6F6' },
  periodLabel: { color: '#315661', fontSize: 13, fontWeight: '800' },
  periodValue: { color: theme.colors.textDark, fontSize: 15, fontWeight: '900' },
  nextCard: { marginHorizontal: 18, marginTop: 14, padding: 18, borderRadius: 26, backgroundColor: '#E7FBFC', borderWidth: 1, borderColor: '#BEEDEF' },
  nextMini: { color: theme.colors.coral, fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  nextTitle: { marginTop: 6, color: theme.colors.textDark, fontSize: 19, lineHeight: 24, fontWeight: '900' },
  nextText: { marginTop: 8, color: theme.colors.slate, fontSize: 14, lineHeight: 21, fontWeight: '700' },
});