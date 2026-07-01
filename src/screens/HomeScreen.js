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
        <Text style={styles.heroText}>Öncelik net: Antalya düzenini GTA 6 çıkmadan önce tamamlamak.</Text>
      </View>

      <View style={styles.criticalPanel}>
        <Text style={styles.criticalKicker}>KRİTİK GERİ SAYIM</Text>
        <Text style={styles.criticalTitle}>Bugün odaklanman gereken iki büyük tarih</Text>
        <PriorityCard
          label="ANTALYA TAŞINMA"
          title={`${summary.daysLeft} gün`}
          subtitle={`${summary.targetDateText} • ${targetAreasText}`}
          footer={moveUrgency}
          color="#2DE2E6"
          dark
        />
        <PriorityCard
          label="GTA 6 ÇIKIŞINA KALAN"
          title={`${summary.gta6DaysLeft} gün`}
          subtitle="Taşınma hedefi bu tarihten önce tamamlanmalı."
          footer={gtaUrgency}
          color="#FFB347"
        />
      </View>

      <View style={styles.moneyHero}>
        <Text style={styles.sectionKicker}>BÜTÇE ALARMI</Text>
        <Text style={styles.moneyTitle}>{money(summary.targetRemaining)}</Text>
        <Text style={styles.moneySub}>Antalya hedef bütçesine kalan tutar</Text>
        <View style={styles.moneyGrid}>
          <MoneyMini label="Hedef" value={money(summary.targetBudget)} />
          <MoneyMini label="Birikim" value={money(summary.savedAmount)} />
          <MoneyMini label="Borç" value={money(summary.debtLeft)} />
        </View>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.sectionKicker}>HIZLI KARARLAR</Text>
        <ControlLine title="Alınacaklar" value={`${summary.shoppingBought}/${summary.shoppingCount}`} note={`${summary.shoppingReady} kalemin parası hazır`} />
        <ControlLine title="Aile aktivite" value={money(summary.activityRemaining)} note={`${summary.activityDone}/${summary.activityCount} aktivite tamam`} />
        <ControlLine title="Motosiklet" value={money(summary.motorcyclePrice)} note="Tahmini fiyat düzenlenebilir" />
        <ControlLine title="Son 30 gün net" value={money(summary.monthSummary.net)} note="Aylık nakit akışı" />
        <ControlLine title="Son 7 gün net" value={money(summary.weekSummary.net)} note="Haftalık gidişat" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>İlerleme</Text>
        <Text style={styles.sectionSubtitle}>Ana hedefleri burada kısa ve okunur şekilde gör.</Text>
      </View>

      <CleanProgressCard title="Taşınma bütçesi" subtitle="Hedef bütçeye giden yol" percent={summary.savingPercent} leftLabel={money(summary.savedAmount)} rightLabel={money(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Aile aktivite bütçesi" subtitle={`Kalan aktivite bütçesi: ${money(summary.activityRemaining)}`} percent={summary.activityPercent} leftLabel={money(summary.activitySaved)} rightLabel={money(summary.activityTotal)} color={theme.colors.sunset} />
      <CleanProgressCard title="Borç azaltma" subtitle={`Kalan borç: ${money(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={money(summary.paidDebt)} rightLabel={money(summary.totalDebt)} color={theme.colors.miamiPink} />
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
      <View style={{ flex: 1 }}>
        <Text style={[styles.priorityLabel, dark && styles.lightText]}>{label}</Text>
        <Text style={[styles.priorityTitle, dark && styles.lightTitle]}>{title}</Text>
        <Text style={[styles.prioritySub, dark && styles.lightSub]}>{subtitle}</Text>
      </View>
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
  header: { paddingTop: 20, paddingHorizontal: 18, paddingBottom: 24, backgroundColor: '#071A24', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { color: '#FFFFFF', fontSize: 23, lineHeight: 28, fontWeight: '900' },
  version: { marginTop: 4, color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  badge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  badgeText: { color: '#C8FBFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  heroTitle: { marginTop: 21, color: '#FFFFFF', fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -0.4 },
  heroText: { marginTop: 9, color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  criticalPanel: { marginHorizontal: 18, marginTop: 14, padding: 15, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 5 },
  criticalKicker: { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  criticalTitle: { marginTop: 5, marginBottom: 12, color: '#102A35', fontSize: 19, lineHeight: 24, fontWeight: '900' },
  priorityCard: { marginBottom: 10, padding: 15, borderRadius: 24, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0', overflow: 'hidden' },
  priorityCardDark: { backgroundColor: '#102A35', borderColor: '#102A35' },
  priorityBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  priorityLabel: { color: '#52616B', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  priorityTitle: { marginTop: 6, color: '#102A35', fontSize: 38, lineHeight: 43, fontWeight: '900', letterSpacing: -1.0 },
  prioritySub: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  priorityFooter: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' },
  priorityFooterDark: { backgroundColor: 'rgba(45,226,230,0.12)', borderColor: 'rgba(200,251,255,0.18)' },
  priorityFooterText: { color: '#7A4D00', fontSize: 11, fontWeight: '900' },
  lightText: { color: 'rgba(255,255,255,0.68)' },
  lightTitle: { color: '#FFFFFF' },
  lightSub: { color: 'rgba(255,255,255,0.72)' },
  lightFooter: { color: '#C8FBFF' },
  moneyHero: { marginHorizontal: 18, marginTop: 12, padding: 18, borderRadius: 28, backgroundColor: '#071A24', borderWidth: 1, borderColor: '#102F3D', elevation: 4 },
  sectionKicker: { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  moneyTitle: { marginTop: 7, color: '#FFFFFF', fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -0.8 },
  moneySub: { marginTop: 5, color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 19, fontWeight: '800' },
  moneyGrid: { flexDirection: 'row', marginTop: 14 },
  moneyMini: { flex: 1, marginRight: 7, padding: 11, minHeight: 78, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  moneyMiniLabel: { color: 'rgba(255,255,255,0.62)', fontSize: 10, fontWeight: '900' },
  moneyMiniValue: { marginTop: 6, color: '#FFFFFF', fontSize: 14, lineHeight: 18, fontWeight: '900' },
  actionCard: { marginHorizontal: 18, marginTop: 12, padding: 16, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0', elevation: 2 },
  controlLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#EEF2F4' },
  controlTitle: { color: '#102A35', fontSize: 14, lineHeight: 19, fontWeight: '900' },
  controlNote: { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  controlValue: { maxWidth: 130, color: '#102A35', textAlign: 'right', fontSize: 14, lineHeight: 18, fontWeight: '900' },
  sectionHeader: { marginHorizontal: 18, marginTop: 22, marginBottom: 4 },
  sectionTitle: { color: '#102A35', fontSize: 23, lineHeight: 29, fontWeight: '900', letterSpacing: -0.2 },
  sectionSubtitle: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '700' },
});
