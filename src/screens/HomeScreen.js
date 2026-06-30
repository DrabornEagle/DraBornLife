import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatMoney, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const targetAreasText = summary.targetAreas || 'Muratpaşa • Lara • Konyaaltı';
  const money = (value) => formatMoney(value, lifeData);
  const moveUrgency = urgencyText(summary.daysLeft);
  const gtaUrgency = urgencyText(summary.gta6DaysLeft);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.brand}>DraBornLife</Text>
            <Text style={styles.version}>{APP_VERSION_LABEL} • Expo Go</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>APK YOK</Text></View>
        </View>
        <Text style={styles.heroTitle}>Taşınma komuta merkezi</Text>
        <Text style={styles.heroText}>Öncelik: Antalya düzenini GTA 6 çıkmadan önce tamamlamak.</Text>
      </View>

      <View style={styles.priorityWrap}>
        <PriorityCard
          label="ANTALYA TAŞINMA"
          title={`${summary.daysLeft} gün kaldı`}
          subtitle={`${summary.targetDateText} • ${targetAreasText}`}
          footer={moveUrgency}
          color="#2DE2E6"
          dark
        />
        <PriorityCard
          label="GTA 6 GERİ SAYIM"
          title={`${summary.gta6DaysLeft} gün kaldı`}
          subtitle="Taşınma hedefi GTA 6 çıkmadan önce tamamlanmalı."
          footer={gtaUrgency}
          color="#FFB347"
        />
      </View>

      <View style={styles.moneyHero}>
        <Text style={styles.sectionKicker}>BÜTÇE DURUMU</Text>
        <Text style={styles.moneyTitle}>{money(summary.targetRemaining)}</Text>
        <Text style={styles.moneySub}>Antalya hedef bütçesine kalan tutar</Text>
        <View style={styles.moneyGrid}>
          <MoneyMini label="Hedef" value={money(summary.targetBudget)} />
          <MoneyMini label="Birikim" value={money(summary.savedAmount)} />
          <MoneyMini label="Borç" value={money(summary.debtLeft)} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hızlı kontrol</Text>
        <Text style={styles.sectionSubtitle}>En önemli karar noktaları. Detaylar alt menüde ilgili ekranlarda.</Text>
      </View>

      <View style={styles.controlCard}>
        <ControlLine title="Alınacaklar" value={`${summary.shoppingBought}/${summary.shoppingCount}`} note={`${summary.shoppingReady} kalemin parası hazır`} />
        <ControlLine title="Motosiklet" value={money(summary.motorcyclePrice)} note="Tahmini fiyat düzenlenebilir" />
        <ControlLine title="Son 30 gün net" value={money(summary.monthSummary.net)} note="Nakit akışı kontrolü" />
        <ControlLine title="Son 7 gün net" value={money(summary.weekSummary.net)} note="Haftalık gidişat" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>İlerleme</Text>
        <Text style={styles.sectionSubtitle}>Kalan ana hedefler sade ilerleme kartlarıyla takip edilir.</Text>
      </View>

      <CleanProgressCard title="Taşınma bütçesi" subtitle="Hedef bütçeye giden yol" percent={summary.savingPercent} leftLabel={money(summary.savedAmount)} rightLabel={money(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Borç azaltma" subtitle={`Kalan borç: ${money(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={money(summary.paidDebt)} rightLabel={money(summary.totalDebt)} color={theme.colors.miamiPink} />
      <CleanProgressCard title="Alınacaklar bütçesi" subtitle={`Kalan: ${money(summary.shoppingRemaining)}`} percent={summary.shoppingPercent} leftLabel={money(summary.shoppingSaved)} rightLabel={money(summary.shoppingTotal)} color={theme.colors.palm} />
    </ScrollView>
  );
}

function urgencyText(days) {
  if (days <= 30) return 'Çok kritik dönem';
  if (days <= 90) return 'Yaklaşıyor, hızlanma zamanı';
  if (days <= 180) return 'Planlı takip gerekli';
  return 'Uzun vadeli takip';
}

function PriorityCard({ label, title, subtitle, footer, color, dark }) {
  return (
    <View style={[styles.priorityCard, dark && styles.priorityCardDark]}>
      <View style={[styles.priorityBar, { backgroundColor: color }]} />
      <Text style={[styles.priorityLabel, dark && styles.lightText]}>{label}</Text>
      <Text style={[styles.priorityTitle, dark && styles.lightTitle]}>{title}</Text>
      <Text style={[styles.prioritySub, dark && styles.lightSub]}>{subtitle}</Text>
      <View style={[styles.priorityFooter, dark && styles.priorityFooterDark]}>
        <Text style={[styles.priorityFooterText, dark && styles.lightFooter]}>{footer}</Text>
      </View>
    </View>
  );
}

function MoneyMini({ label, value }) {
  return (
    <View style={styles.moneyMini}>
      <Text style={styles.moneyMiniLabel}>{label}</Text>
      <Text style={styles.moneyMiniValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function ControlLine({ title, value, note }) {
  return (
    <View style={styles.controlLine}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.controlTitle}>{title}</Text>
        <Text style={styles.controlNote}>{note}</Text>
      </View>
      <Text style={styles.controlValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F3F6F8' },
  screen: { paddingBottom: 150, backgroundColor: '#F3F6F8' },
  header: { paddingTop: 20, paddingHorizontal: 18, paddingBottom: 26, backgroundColor: '#071A24', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { color: '#FFFFFF', fontSize: 23, lineHeight: 28, fontWeight: '900' },
  version: { marginTop: 4, color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  badge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  badgeText: { color: '#C8FBFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  heroTitle: { marginTop: 22, color: '#FFFFFF', fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -0.4 },
  heroText: { marginTop: 9, color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  priorityWrap: { paddingHorizontal: 18, marginTop: 16 },
  priorityCard: { marginBottom: 10, padding: 16, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 4, overflow: 'hidden' },
  priorityCardDark: { backgroundColor: '#102A35', borderColor: '#102A35' },
  priorityBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  priorityLabel: { color: '#52616B', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  priorityTitle: { marginTop: 8, color: '#102A35', fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -0.6 },
  prioritySub: { marginTop: 7, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '800' },
  priorityFooter: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: '#F1FAFB', borderWidth: 1, borderColor: '#BEEDEF' },
  priorityFooterDark: { backgroundColor: 'rgba(45,226,230,0.12)', borderColor: 'rgba(200,251,255,0.18)' },
  priorityFooterText: { color: '#073B4C', fontSize: 11, fontWeight: '900' },
  lightText: { color: 'rgba(255,255,255,0.68)' },
  lightTitle: { color: '#FFFFFF' },
  lightSub: { color: 'rgba(255,255,255,0.72)' },
  lightFooter: { color: '#C8FBFF' },
  moneyHero: { marginHorizontal: 18, marginTop: 8, padding: 18, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 3 },
  sectionKicker: { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  moneyTitle: { marginTop: 7, color: '#102A35', fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -0.8 },
  moneySub: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '800' },
  moneyGrid: { flexDirection: 'row', marginTop: 14 },
  moneyMini: { flex: 1, marginRight: 7, padding: 11, minHeight: 78, borderRadius: 18, backgroundColor: '#F6FAFB', borderWidth: 1, borderColor: '#E4F2F1' },
  moneyMiniLabel: { color: '#52616B', fontSize: 10, fontWeight: '900' },
  moneyMiniValue: { marginTop: 6, color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' },
  sectionHeader: { marginHorizontal: 18, marginTop: 22, marginBottom: 4 },
  sectionTitle: { color: '#102A35', fontSize: 23, lineHeight: 29, fontWeight: '900', letterSpacing: -0.2 },
  sectionSubtitle: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  controlCard: { marginHorizontal: 18, marginTop: 8, padding: 16, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 2 },
  controlLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#EEF2F4' },
  controlTitle: { color: '#102A35', fontSize: 14, lineHeight: 19, fontWeight: '900' },
  controlNote: { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  controlValue: { maxWidth: 130, color: '#102A35', textAlign: 'right', fontSize: 14, lineHeight: 18, fontWeight: '900' },
});
