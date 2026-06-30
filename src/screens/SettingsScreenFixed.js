import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { APP_STATUS_CODE } from '../config/appVersion';
import { BACKUP_SCOPE, createBackupText, parseBackupText } from '../utils/backupUtils';

export function SettingsScreenFixed({ lifeData, onReset, onRestore }) {
  const settings = lifeData?.settings || {};
  const goals = lifeData?.goals || {};
  const moveGoal = goals.antalyaMove || {};
  const motorcycle = goals.motorcycle || {};
  const backupStats = useMemo(() => getBackupStats(lifeData), [lifeData]);
  const [activeYear, setActiveYear] = useState(String(settings.selectedYear || 2026));
  const [targetDate, setTargetDate] = useState(moveGoal.targetDate || '2026-10-31');
  const [targetMonthText, setTargetMonthText] = useState(settings.targetMoveMonthText || 'Ekim / Kasim 2026');
  const [targetAreasText, setTargetAreasText] = useState((settings.targetAreas || []).join(', '));
  const [targetAmount, setTargetAmount] = useState(String(moveGoal.targetAmount || ''));
  const [motorcyclePrice, setMotorcyclePrice] = useState(String(motorcycle.estimatedPrice || 130000));
  const [oldMotorcycleSaleAmount, setOldMotorcycleSaleAmount] = useState(String(motorcycle.oldMotorcycleSaleAmount || ''));
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  function showInfo(text) { setMessageType('info'); setMessage(text); }
  function showError(text) { setMessageType('error'); setMessage(text); }

  function saveTargets() {
    const year = toYear(activeYear, dateYear(targetDate) || 2026);
    const nextMotorcyclePrice = toNumber(motorcyclePrice);
    const nextTargetAmount = toNumber(targetAmount);
    const nextOldSale = toNumber(oldMotorcycleSaleAmount);
    if (!year) return showError('Aktif yil hatali. Ornek: 2026');
    if (targetAmount.trim() && nextTargetAmount <= 0) return showError('Toplam hedef butce hatali olamaz.');
    if (motorcyclePrice.trim() && nextMotorcyclePrice <= 0) return showError('Motosiklet fiyati hatali olamaz.');
    if (oldMotorcycleSaleAmount.trim() && nextOldSale < 0) return showError('Eski motosiklet satis tutari negatif olamaz.');

    const areas = targetAreasText.split(',').map((x) => x.trim()).filter(Boolean);
    const nextAreas = areas.length ? areas : ['Muratpasa', 'Lara', 'Konyaalti'];
    const nextYearlyPlans = syncYearPlans({ plans: lifeData?.yearlyPlans || [], year, targetDate: targetDate.trim() || '2026-10-31', targetMonth: targetMonthText.trim() || 'Ekim / Kasim 2026', targetAreas: nextAreas, moveBudget: nextTargetAmount, moveSaved: moveGoal.savedAmount || 0, motorcyclePrice: nextMotorcyclePrice || 130000, motorcycleSaved: motorcycle.savedAmount || 0 });

    const nextData = {
      ...lifeData,
      settings: { ...settings, selectedYear: year, targetAreas: nextAreas, targetMoveMonthText: targetMonthText.trim() || 'Ekim / Kasim 2026', currency: 'TRY' },
      goals: { ...goals, antalyaMove: { ...moveGoal, targetDate: targetDate.trim() || '2026-10-31', targetAmount: nextTargetAmount }, motorcycle: { ...motorcycle, estimatedPrice: nextMotorcyclePrice || 130000, oldMotorcycleSaleAmount: nextOldSale, isPriceEditable: true } },
      yearlyPlans: nextYearlyPlans,
      shoppingItems: (lifeData?.shoppingItems || []).map((item) => item.id === 'motorcycle' ? { ...item, estimatedPrice: nextMotorcyclePrice || 130000 } : item),
    };
    onRestore(nextData);
    showInfo('Ayarlar kaydedildi. Yil ekrani, Antalya hedefi ve motosiklet baglantisi guncellendi.');
  }

  function handleExport() {
    setExportText(createBackupText(lifeData));
    showInfo(`v0.5 yedek metni hazir. ${backupStats.totalRecords} kayit ve ${BACKUP_SCOPE.length} veri alani dahil. Metnin tamamini kopyalayip guvenli bir yere kaydet.`);
  }

  function handleImport() {
    if (!importText.trim()) return showError('Ice aktarim icin once yedek metnini kutuya yapistirmalisin.');
    const result = parseBackupText(importText);
    if (!result.ok) return showError(result.error);
    const scopeCount = result.scope?.length || 0;
    const warning = result.versionWarning ? ` ${result.versionWarning}` : '';
    const scopeText = scopeCount ? ` Gelen yedekte ${scopeCount} veri alani var.` : ' Eski yedek algilandi; eksik v0.5 alanlari otomatik tamamlanacak.';
    onRestore(result.data);
    showInfo(`Veriler geri yuklendi. Yedek surumu: ${result.backupVersion}.${scopeText}${warning}`);
  }

  function confirmReset() {
    Alert.alert('Demo veriyi sifirla?', 'Bu islem mevcut lokal demo verinin ustune yazar. Devam etmeden once yedek alman onerilir.', [
      { text: 'Vazgec', style: 'cancel' },
      { text: 'Sifirla', style: 'destructive', onPress: () => { onReset(); showInfo('Demo veri sifirlandi. Ana ekrandan kontrol edebilirsin.'); } },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#06202A' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={hero}><Text style={eyebrow}>HEDEF AYARLARI</Text><Text style={title}>Ayarlar</Text><Text style={line}>Uygulama surumu: {APP_STATUS_CODE}</Text><Text style={line}>Para birimi: TRY</Text></View>
      <NoticeBox message={message} type={messageType} />
      <Panel title="Yillik sistem"><Input label="Varsayilan aktif yil" value={activeYear} onChangeText={setActiveYear} placeholder="2026" keyboardType="numeric" /><Text style={hint}>Bu yil Ana Sayfa ve Yil ekrani icin varsayilan secim olur.</Text></Panel>
      <Panel title="Antalya hedefi"><Input label="Hedef tarih" value={targetDate} onChangeText={setTargetDate} placeholder="2026-10-31" /><Input label="Hedef ay metni" value={targetMonthText} onChangeText={setTargetMonthText} placeholder="Ekim / Kasim 2026" /><Input label="Hedef bolgeler" value={targetAreasText} onChangeText={setTargetAreasText} placeholder="Muratpasa, Lara, Konyaalti" /><Input label="Toplam hedef butce" value={targetAmount} onChangeText={setTargetAmount} placeholder="Orn: 500000" keyboardType="numeric" /></Panel>
      <Panel title="Motosiklet hedefi"><Input label="Sifir motosiklet tahmini fiyat" value={motorcyclePrice} onChangeText={setMotorcyclePrice} placeholder="130000" keyboardType="numeric" /><Input label="Eski motosiklet satis tutari" value={oldMotorcycleSaleAmount} onChangeText={setOldMotorcycleSaleAmount} placeholder="Orn: 60000" keyboardType="numeric" /><Button label="Hedef ayarlarini kaydet" onPress={saveTargets} color="#FFB347" /></Panel>
      <Panel title="v0.5 yedek ozeti"><CountLine label="Toplam kayit" value={backupStats.totalRecords} /><CountLine label="Yillik hedef" value={backupStats.yearlyPlans} /><CountLine label="Para kaydi" value={backupStats.moneyEntries} /><CountLine label="Alinacak kalem" value={backupStats.shoppingItems} /><CountLine label="Borc kaydi" value={backupStats.debtEntries} /><CountLine label="Ozel hedef" value={backupStats.customGoals} /><Text style={hint}>Yedek alani: {BACKUP_SCOPE.length}. Kapsam: {BACKUP_SCOPE.join(', ')}</Text></Panel>
      <Panel title="Disa aktar"><Text style={hint}>Yedek metni tum lokal verileri kapsar. Olusan metnin tamamini kopyala; parca eksik kalirsa geri yukleme calismaz.</Text><Button label="Yedek metni olustur" onPress={handleExport} color="#2DE2E6" /><Box value={exportText} onChangeText={setExportText} placeholder="Disa aktarim metni burada gorunecek" /></Panel>
      <Panel title="Ice aktar"><Text style={{ marginTop: 8, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '900' }}>Uyari: Geri yukleme mevcut lokal verinin ustune yazar. Emin degilsen once mevcut veriyi disa aktar.</Text><Text style={hint}>Eski v0.1/v0.2/v0.3/v0.4 yedekleri acilinca eksik v0.5 alanlari uygulama tarafindan tamamlanir.</Text><Box value={importText} onChangeText={setImportText} placeholder="Kaydettigin yedek metnini buraya yapistir" /><Button label="Yedekten geri yukle" onPress={handleImport} color="#FFB347" /></Panel>
      <View style={{ marginTop: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' }}><Text style={{ color: '#102A35', fontSize: 17, fontWeight: '900' }}>Google Drive notu</Text><Text style={hint}>Otomatik Google Drive yedegi v1.0 sonrasi opsiyonel ozellik olarak beklemede. Simdilik manuel yedek metni kullanilacak.</Text></View>
      <TouchableOpacity style={{ marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#FFD0D8', alignItems: 'center' }} onPress={confirmReset}><Text style={{ color: '#7A1E2B', fontSize: 15, fontWeight: '900' }}>Demo veriyi sifirla</Text></TouchableOpacity>
    </ScrollView>
  );
}

function syncYearPlans(input) {
  const list = Array.isArray(input.plans) ? input.plans : [];
  const area = input.targetAreas.join(' / ');
  const antalyaPlan = { id: 'year_2026_antalya', year: input.year, title: `${input.year} Antalya yeni hayat`, goalType: 'tasinma', country: 'Turkiye', city: 'Antalya', area, targetMonth: input.targetMonth, targetDate: input.targetDate, estimatedBudget: input.moveBudget, savedAmount: input.moveSaved, status: 'active', note: 'Antalya ana hedefi Ayarlar ekranindan senkronlanir.' };
  const motorcyclePlan = { id: 'year_motorcycle_goal', year: input.year, title: 'Yeni motosiklet', goalType: 'arac', country: 'Turkiye', city: 'Antalya', area: '', targetMonth: input.targetMonth, targetDate: input.targetDate, estimatedBudget: input.motorcyclePrice, savedAmount: input.motorcycleSaved, status: 'planned', note: 'Motosiklet fiyati Ayarlar ve Liste ekranlariyla baglidir.' };
  const without = list.filter((p) => p.id !== antalyaPlan.id && p.id !== motorcyclePlan.id);
  return [antalyaPlan, motorcyclePlan, ...without];
}
function getBackupStats(data) { const count = (x) => Array.isArray(x) ? x.length : 0; const stats = { yearlyPlans: count(data?.yearlyPlans), moneyEntries: count(data?.moneyEntries), shoppingItems: count(data?.shoppingItems), debtEntries: count(data?.debtEntries), customGoals: count(data?.customGoals), activities: count(data?.activities), beaches: count(data?.beaches) }; return { ...stats, totalRecords: Object.values(stats).reduce((a, b) => a + b, 0) }; }
function Panel({ title, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text>{children}</View>; }
function CountLine({ label, value }) { return <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#D9F1F2' }}><Text style={{ color: '#315661', fontSize: 13, fontWeight: '800' }}>{label}</Text><Text style={{ color: '#102A35', fontSize: 13, fontWeight: '900' }}>{value}</Text></View>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={label}>{props.label}</Text><TextInput {...props} style={inputStyle} placeholderTextColor="#7C969D" /></View>; }
function Box(props) { return <TextInput multiline {...props} placeholderTextColor="#7C969D" style={boxStyle} />; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function toYear(value, fallback) { const y = Number(value); return Number.isFinite(y) && y >= 2020 ? Math.round(y) : fallback; }
function dateYear(text) { const match = String(text || '').match(/^(\d{4})-/); return match ? Number(match[1]) : 0; }
function toNumber(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) && parsed > 0 ? parsed : 0; }

const hero = { marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const eyebrow = { color: '#FF7A59', fontSize: 12, fontWeight: '900' };
const title = { marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' };
const line = { marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' };
const panel = { marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const panelTitle = { color: '#102A35', fontSize: 22, fontWeight: '900' };
const label = { color: '#315661', fontSize: 12, fontWeight: '900' };
const hint = { marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const inputStyle = { marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' };
const boxStyle = { minHeight: 120, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' };
