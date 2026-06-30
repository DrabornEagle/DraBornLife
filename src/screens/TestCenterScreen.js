import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { APP_STATUS_CODE, APP_VERSION_LABEL } from '../config/appVersion';
import { BACKUP_SCOPE } from '../utils/backupUtils';

export function TestCenterScreen({ lifeData }) {
  const report = useMemo(() => buildTestReport(lifeData), [lifeData]);
  const okCount = report.items.filter((item) => item.status === 'ok').length;
  const warnCount = report.items.filter((item) => item.status === 'warn').length;
  const failCount = report.items.filter((item) => item.status === 'fail').length;
  const score = report.items.length ? Math.round((okCount / report.items.length) * 100) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={hero}>
        <Text style={heroMini}>{APP_VERSION_LABEL}</Text>
        <Text style={heroTitle}>Test Merkezi</Text>
        <Text style={heroText}>v1.0 APK oncesi uygulama sagligini, veri alanlarini ve yedek kapsamını hizli kontrol et.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <Mini title="Skor" value={`%${score}`} text="Genel saglik" />
        <Mini title="Kontrol" value={`${report.items.length}`} text="Toplam test" />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Mini title="Tamam" value={`${okCount}`} text="Sorunsuz" />
        <Mini title="Uyari" value={`${warnCount + failCount}`} text="Bakilacak" />
      </View>

      <Panel title="Ozet" note="Bu ekran otomatik test gibi davranir; kirmizi hata gorursen v1.0 oncesi duzeltmek iyi olur.">
        <Line label="Uygulama surumu" value={APP_STATUS_CODE} status="ok" />
        <Line label="Secili yil" value={String(lifeData?.settings?.selectedYear || 'yok')} status={lifeData?.settings?.selectedYear ? 'ok' : 'warn'} />
        <Line label="Yedek kapsam alani" value={`${BACKUP_SCOPE.length} alan`} status="ok" />
      </Panel>

      <Panel title="Kontrol listesi" note="Veri alani, yedek, yil sistemi ve finans akisi kontrol edilir.">
        {report.items.map((item) => <Line key={item.key} label={item.label} value={item.value} status={item.status} />)}
      </Panel>

      <Panel title="Uyari listesi" note="Burada yazanlar v1.0 APK oncesi bakilacak maddelerdir.">
        {report.warnings.length === 0 ? <Text style={okText}>Su an kritik uyari yok. Mis gibi gidiyoruz.</Text> : report.warnings.map((item) => <Text key={item} style={warnText}>• {item}</Text>)}
      </Panel>
    </ScrollView>
  );
}

function buildTestReport(data) {
  const settings = data?.settings || {};
  const goals = data?.goals || {};
  const yearlyPlans = arr(data?.yearlyPlans);
  const moneyEntries = arr(data?.moneyEntries);
  const shoppingItems = arr(data?.shoppingItems);
  const debtEntries = arr(data?.debtEntries);
  const customGoals = arr(data?.customGoals);
  const homeSetupRooms = arr(data?.homeSetupRooms);
  const activities = arr(data?.activities);
  const beaches = arr(data?.beaches);

  const items = [
    test('settings', 'settings alani', settings.appName ? 'ok' : 'fail', settings.appName || 'eksik'),
    test('version', 'currentVersionCode', settings.currentVersionCode ? 'ok' : 'warn', settings.currentVersionCode || 'eksik'),
    test('selectedYear', 'selectedYear', settings.selectedYear ? 'ok' : 'fail', String(settings.selectedYear || 'eksik')),
    test('goals', 'goals alani', goals.antalyaMove && goals.motorcycle ? 'ok' : 'fail', goals.antalyaMove && goals.motorcycle ? 'var' : 'eksik'),
    test('yearlyPlans', 'yearlyPlans', yearlyPlans.length > 0 ? 'ok' : 'fail', `${yearlyPlans.length} hedef`),
    test('year2026', '2026 Antalya plani', yearlyPlans.some((p) => Number(p.year) === 2026) ? 'ok' : 'warn', '2026 kontrol'),
    test('moneyEntries', 'moneyEntries', Array.isArray(data?.moneyEntries) ? 'ok' : 'warn', `${moneyEntries.length} kayit`),
    test('shoppingItems', 'shoppingItems', shoppingItems.length > 0 ? 'ok' : 'warn', `${shoppingItems.length} kalem`),
    test('debtEntries', 'debtEntries', Array.isArray(data?.debtEntries) ? 'ok' : 'warn', `${debtEntries.length} borc`),
    test('customGoals', 'customGoals', Array.isArray(data?.customGoals) ? 'ok' : 'warn', `${customGoals.length} hedef`),
    test('homeSetupRooms', 'homeSetupRooms', homeSetupRooms.length > 0 ? 'ok' : 'warn', `${homeSetupRooms.length} oda`),
    test('activities', 'activities', Array.isArray(data?.activities) ? 'ok' : 'warn', `${activities.length} aktivite`),
    test('beaches', 'beaches', Array.isArray(data?.beaches) ? 'ok' : 'warn', `${beaches.length} yer`),
    test('backupScopeYear', 'yedek yearlyPlans', BACKUP_SCOPE.includes('yearlyPlans') ? 'ok' : 'fail', BACKUP_SCOPE.includes('yearlyPlans') ? 'var' : 'yok'),
    test('backupScopeMoney', 'yedek moneyEntries', BACKUP_SCOPE.includes('moneyEntries') ? 'ok' : 'fail', BACKUP_SCOPE.includes('moneyEntries') ? 'var' : 'yok'),
  ];

  const warnings = [];
  if (!settings.selectedYear) warnings.push('Secili yil eksik. Ayar ekranindan varsayilan aktif yil girilmeli.');
  if (yearlyPlans.length === 0) warnings.push('Yillik hedef listesi bos. Yil ekraninda en az 2026 hedefi olmali.');
  if (!BACKUP_SCOPE.includes('yearlyPlans')) warnings.push('Yedek kapsaminda yearlyPlans yok. Yedek uyumlulugu eksik olur.');
  yearlyPlans.forEach((plan) => {
    if (!plan.title) warnings.push('Basligi bos bir yillik hedef var.');
    if (n(plan.estimatedBudget) < 0 || n(plan.savedAmount) < 0) warnings.push(`${plan.title || 'Hedef'} icinde negatif tutar var.`);
  });
  moneyEntries.forEach((entry) => { if (n(entry.amount) < 0) warnings.push('Para kayitlarinda negatif tutar var.'); });
  shoppingItems.forEach((item) => { if (!item.title) warnings.push('Alinacaklar listesinde basligi bos kalem var.'); });

  return { items, warnings };
}

function test(key, label, status, value) { return { key, label, status, value }; }
function arr(value) { return Array.isArray(value) ? value : []; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

function Panel({ title, note, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text><Text style={panelNote}>{note}</Text>{children}</View>; }
function Mini({ title, value, text }) { return <View style={mini}><Text style={miniT}>{title}</Text><Text style={miniV}>{value}</Text><Text style={miniD}>{text}</Text></View>; }
function Line({ label, value, status }) { const color = status === 'ok' ? '#128C7E' : status === 'fail' ? '#C6283C' : '#FF7A59'; const emoji = status === 'ok' ? '✅' : status === 'fail' ? '⛔' : '⚠️'; return <View style={line}><Text style={lineLeft}>{emoji} {label}</Text><Text style={[lineRight, { color }]} numberOfLines={2}>{value}</Text></View>; }

const hero = { padding: 20, borderRadius: 30, backgroundColor: '#06202A' };
const heroMini = { color: '#C8FBFF', fontSize: 12, fontWeight: '900' };
const heroTitle = { marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' };
const heroText = { marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' };
const panel = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const panelTitle = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const panelNote = { marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginHorizontal: 4, padding: 14, minHeight: 108, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniT = { color: '#315661', fontSize: 12, fontWeight: '900' };
const miniV = { marginTop: 8, color: '#102A35', fontSize: 23, fontWeight: '900' };
const miniD = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const line = { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#D9F1F2' };
const lineLeft = { flex: 1, paddingRight: 12, color: '#102A35', fontSize: 13, lineHeight: 18, fontWeight: '900' };
const lineRight = { maxWidth: 130, textAlign: 'right', fontSize: 12, lineHeight: 17, fontWeight: '900' };
const okText = { color: '#128C7E', fontSize: 14, lineHeight: 20, fontWeight: '900' };
const warnText = { marginTop: 7, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '800' };
