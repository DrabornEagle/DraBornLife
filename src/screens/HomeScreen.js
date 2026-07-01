import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CleanProgressCard } from '../components/CleanProgressCard';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { theme } from '../theme';
import { formatMoney, getLifeSummary } from '../utils/lifeSummary';

export function HomeScreen({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const money = (value) => formatMoney(value, lifeData);
  const areas = summary.targetAreas || 'Muratpaşa • Lara • Konyaaltı';
  const weeks = Math.max(1, Math.ceil(summary.daysLeft / 7));
  const months = Math.max(1, Math.ceil(summary.daysLeft / 30));
  const weeklyNeed = Math.ceil(summary.targetRemaining / weeks);
  const monthlyNeed = Math.ceil(summary.targetRemaining / months);
  const decision = getTodayDecision(summary, money);
  const alerts = getMissingAlerts(summary);

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
        <Text style={styles.heroTitle}>Antalya için geri sayım</Text>
        <Text style={styles.heroText}>Önce tarihleri kaçırma: taşınma ve GTA 6 hedefi ana öncelik.</Text>
      </View>

      <View style={styles.panelCritical}>
        <Text style={styles.kicker}>EN KRİTİK İKİ TARİH</Text>
        <InfoLine title="Antalya taşınma" value={`${summary.daysLeft} gün`} note={`${summary.targetDateText} • ${areas}`} dark />
        <InfoLine title="GTA 6 hedefi" value={`${summary.gta6DaysLeft} gün`} note="Taşınma bu tarihten önce tamamlanmalı." />
      </View>

      <View style={styles.decisionCard}>
        <Text style={styles.decisionKicker}>BUGÜNÜN ÖNCELİĞİ</Text>
        <Text style={styles.decisionTitle}>{decision.title}</Text>
        <Text style={styles.decisionText}>{decision.text}</Text>
        <View style={styles.decisionPill}><Text style={styles.decisionPillText}>{decision.action}</Text></View>
      </View>

      {alerts.length > 0 && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>Eksik veri / kontrol</Text>
          {alerts.map((item) => <Text key={item} style={styles.alertText}>• {item}</Text>)}
        </View>
      )}

      <View style={styles.moneyHero}>
        <Text style={styles.kicker}>KALAN ANA BÜTÇE</Text>
        <Text style={styles.moneyTitle}>{money(summary.targetRemaining)}</Text>
        <Text style={styles.moneySub}>Antalya hedef bütçesine kalan tutar</Text>
        <View style={styles.moneyGrid}>
          <Mini label="Hedef" value={money(summary.targetBudget)} />
          <Mini label="Birikim" value={money(summary.savedAmount)} />
          <Mini label="Borç" value={money(summary.debtLeft)} />
        </View>
        <View style={styles.moneyGrid}>
          <Mini label="Haftalık" value={money(weeklyNeed)} />
          <Mini label="Aylık" value={money(monthlyNeed)} />
          <Mini label="Kalan hafta" value={`${weeks}`} />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>HIZLI DURUM</Text>
        <InfoLine title="Ev kurulumu" value={money(summary.homeSetupRemaining)} note={`${summary.homeSetupDoneCount}/${summary.homeSetupCount} eşya tamam`} />
        <InfoLine title="Alınacaklar" value={`${summary.shoppingBought}/${summary.shoppingCount}`} note={`${summary.shoppingReady} kalemin parası hazır`} />
        <InfoLine title="Aile aktivite" value={money(summary.activityRemaining)} note={`${summary.activityDone}/${summary.activityCount} aktivite tamam`} />
        <InfoLine title="Motosiklet" value={money(summary.motorcyclePrice)} note="Tahmini fiyat düzenlenebilir" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>İlerleme</Text>
        <Text style={styles.sectionSubtitle}>Detay kartları aşağıda; ana kararlar yukarıda.</Text>
      </View>

      <CleanProgressCard title="Taşınma bütçesi" subtitle="Hedef bütçeye giden yol" percent={summary.savingPercent} leftLabel={money(summary.savedAmount)} rightLabel={money(summary.targetBudget)} color={theme.colors.aqua} />
      <CleanProgressCard title="Ev kurulum bütçesi" subtitle={`Kalan ev kurulum bütçesi: ${money(summary.homeSetupRemaining)}`} percent={summary.homeSetupPercent} leftLabel={money(summary.homeSetupDoneBudget)} rightLabel={money(summary.homeSetupTotal)} color={theme.colors.palm} />
      <CleanProgressCard title="Aile aktivite bütçesi" subtitle={`Kalan aktivite bütçesi: ${money(summary.activityRemaining)}`} percent={summary.activityPercent} leftLabel={money(summary.activitySaved)} rightLabel={money(summary.activityTotal)} color={theme.colors.sunset} />
      <CleanProgressCard title="Borç azaltma" subtitle={`Kalan borç: ${money(summary.debtLeft)}`} percent={summary.debtPercent} leftLabel={money(summary.paidDebt)} rightLabel={money(summary.totalDebt)} color={theme.colors.miamiPink} />
    </ScrollView>
  );
}

function getTodayDecision(summary, money) {
  if (summary.daysLeft <= 90 && summary.targetRemaining > 0) return { title: 'Bütçeyi hızlandır', text: `Taşınmaya ${summary.daysLeft} gün kaldı. Kalan ana bütçe ${money(summary.targetRemaining)}.`, action: 'Bugün gelir / gider gir ve haftalık hedefi kontrol et' };
  if (summary.debtLeft > 0 && summary.debtPercent < 50) return { title: 'Borç azaltmaya odaklan', text: `Borç ilerlemesi %${summary.debtPercent}. Antalya öncesi borç yükünü azaltmak en kritik aksiyon.`, action: 'Borç ekranında ödeme planını güncelle' };
  if (summary.homeSetupCount === 0 || summary.homeSetupPercent < 25) return { title: 'Ev kurulum listesini netleştir', text: 'Antalya’da sıfırdan ev kurulacağı için oda oda eşya planı erken netleşmeli.', action: 'Yaşam ekranında oda eşyalarını ekle' };
  if (summary.shoppingCount === 0 || summary.shoppingReady === 0) return { title: 'Alınacakları önceliklendir', text: 'Liste ve hazır para bilgisi ana bütçe kararlarını daha doğru yapar.', action: 'Liste ekranında ilk satın alma kalemlerini işaretle' };
  return { title: 'Planı dengede tut', text: 'Ana hedefler takipte. Bugün kısa bir veri girişi yapıp özetleri güncel tutmak yeterli.', action: 'Gelir / gider veya aktivite durumunu güncelle' };
}
function getMissingAlerts(summary) {
  const list = [];
  if (summary.savedAmount <= 0) list.push('Henüz birikim görünmüyor; gerçek gelir kaydı eklenmeli.');
  if (summary.shoppingCount <= 0) list.push('Alınacaklar listesi boş görünüyor.');
  if (summary.homeSetupCount <= 0) list.push('Ev kurulum odaları için eşya girilmemiş.');
  if (summary.debtLeft <= 0 && summary.totalDebt <= 0) list.push('Borç durumu girilmemiş; borç yoksa sorun değil.');
  return list.slice(0, 3);
}
function Mini({ label, value }) { return <View style={styles.mini}><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue} numberOfLines={2}>{value}</Text></View>; }
function InfoLine({ title, value, note, dark }) { return <View style={[styles.infoLine, dark && styles.infoDark]}><View style={{ flex: 1, paddingRight: 10 }}><Text style={[styles.infoTitle, dark && styles.white]}>{title}</Text><Text style={[styles.infoNote, dark && styles.whiteSoft]}>{note}</Text></View><Text style={[styles.infoValue, dark && styles.white]} numberOfLines={2}>{value}</Text></View>; }

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#EEF4F5' },
  screen: { paddingBottom: 150, backgroundColor: '#EEF4F5' },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 30, backgroundColor: '#071A24', borderBottomLeftRadius: 34, borderBottomRightRadius: 34 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { color: '#FFFFFF', fontSize: 25, lineHeight: 30, fontWeight: '900' },
  version: { marginTop: 4, color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  badge: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  badgeText: { color: '#C8FBFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  heroTitle: { marginTop: 24, color: '#FFFFFF', fontSize: 36, lineHeight: 40, fontWeight: '900', letterSpacing: -0.7 },
  heroText: { marginTop: 10, color: 'rgba(255,255,255,0.76)', fontSize: 15, lineHeight: 22, fontWeight: '800' },
  panelCritical: { marginHorizontal: 18, marginTop: -18, padding: 16, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA', elevation: 6 },
  panel: { marginHorizontal: 18, marginTop: 12, padding: 16, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA', elevation: 2 },
  kicker: { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  decisionCard: { marginHorizontal: 18, marginTop: 12, padding: 18, borderRadius: 30, backgroundColor: '#102A35', borderWidth: 1, borderColor: '#163F4F', elevation: 4 },
  decisionKicker: { color: '#FFB347', fontSize: 11, fontWeight: '900', letterSpacing: 0.9 },
  decisionTitle: { marginTop: 8, color: '#FFFFFF', fontSize: 25, lineHeight: 30, fontWeight: '900' },
  decisionText: { marginTop: 8, color: 'rgba(255,255,255,0.76)', fontSize: 14, lineHeight: 20, fontWeight: '800' },
  decisionPill: { alignSelf: 'flex-start', marginTop: 13, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, backgroundColor: '#2DE2E6' },
  decisionPillText: { color: '#06202A', fontSize: 12, fontWeight: '900' },
  alertCard: { marginHorizontal: 18, marginTop: 10, padding: 15, borderRadius: 24, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' },
  alertTitle: { color: '#102A35', fontSize: 15, fontWeight: '900' },
  alertText: { marginTop: 5, color: '#7A4D00', fontSize: 12, lineHeight: 17, fontWeight: '800' },
  infoLine: { marginTop: 11, padding: 16, minHeight: 92, borderRadius: 26, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#DDE8EA', flexDirection: 'row', alignItems: 'center' },
  infoDark: { minHeight: 112, backgroundColor: '#102A35', borderColor: '#102A35' },
  infoTitle: { color: '#102A35', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  infoNote: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  infoValue: { maxWidth: 150, color: '#102A35', textAlign: 'right', fontSize: 25, lineHeight: 31, fontWeight: '900' },
  white: { color: '#FFFFFF' },
  whiteSoft: { color: 'rgba(255,255,255,0.74)' },
  moneyHero: { marginHorizontal: 18, marginTop: 12, padding: 20, borderRadius: 30, backgroundColor: '#071A24', borderWidth: 1, borderColor: '#102F3D', elevation: 4 },
  moneyTitle: { marginTop: 8, color: '#FFFFFF', fontSize: 40, lineHeight: 45, fontWeight: '900', letterSpacing: -0.8 },
  moneySub: { marginTop: 6, color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 19, fontWeight: '800' },
  moneyGrid: { flexDirection: 'row', marginTop: 16 },
  mini: { flex: 1, marginRight: 7, padding: 12, minHeight: 82, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  miniLabel: { color: 'rgba(255,255,255,0.62)', fontSize: 10, fontWeight: '900' },
  miniValue: { marginTop: 6, color: '#FFFFFF', fontSize: 14, lineHeight: 18, fontWeight: '900' },
  sectionHeader: { marginHorizontal: 18, marginTop: 22, marginBottom: 4 },
  sectionTitle: { color: '#102A35', fontSize: 23, lineHeight: 29, fontWeight: '900' },
  sectionSubtitle: { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 19, fontWeight: '700' },
});
