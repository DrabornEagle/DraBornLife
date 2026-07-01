import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencySelector } from '../components/CurrencySelector';
import { NoticeBox } from '../components/NoticeBox';
import { APP_STATUS_CODE } from '../config/appVersion';
import { BACKUP_SCOPE, createBackupText, getBackupStats, parseBackupText } from '../utils/backupUtils';

export function SettingsScreenFixed({ lifeData, onReset, onRestore }) {
  const settings = lifeData?.settings || {};
  const goals = lifeData?.goals || {};
  const moveGoal = goals.antalyaMove || {};
  const motorcycle = goals.motorcycle || {};
  const backupStats = useMemo(() => getBackupStats(lifeData), [lifeData]);

  const [activeYear, setActiveYear] = useState(String(settings.selectedYear || 2026));
  const [targetDate, setTargetDate] = useState(moveGoal.targetDate || '2026-10-31');
  const [targetMonthText, setTargetMonthText] = useState(settings.targetMoveMonthText || 'Ekim / Kasım 2026');
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
    if (!year) return showError('Aktif yıl hatalı. Örnek: 2026');
    if (targetAmount.trim() && nextTargetAmount <= 0) return showError('Toplam hedef bütçe hatalı olamaz.');
    if (motorcyclePrice.trim() && nextMotorcyclePrice <= 0) return showError('Motosiklet fiyatı hatalı olamaz.');
    if (oldMotorcycleSaleAmount.trim() && nextOldSale < 0) return showError('Eski motosiklet satış tutarı negatif olamaz.');

    const areas = targetAreasText.split(',').map((x) => x.trim()).filter(Boolean);
    const nextAreas = areas.length ? areas : ['Muratpaşa', 'Lara', 'Konyaaltı'];
    const nextYearlyPlans = syncYearPlans({ plans: lifeData?.yearlyPlans || [], year, targetDate: targetDate.trim() || '2026-10-31', targetMonth: targetMonthText.trim() || 'Ekim / Kasım 2026', targetAreas: nextAreas, moveBudget: nextTargetAmount, moveSaved: moveGoal.savedAmount || 0, motorcyclePrice: nextMotorcyclePrice || 130000, motorcycleSaved: motorcycle.savedAmount || 0 });

    const nextData = {
      ...lifeData,
      settings: { ...settings, selectedYear: year, targetAreas: nextAreas, targetMoveMonthText: targetMonthText.trim() || 'Ekim / Kasım 2026' },
      goals: { ...goals, antalyaMove: { ...moveGoal, targetDate: targetDate.trim() || '2026-10-31', targetAmount: nextTargetAmount }, motorcycle: { ...motorcycle, estimatedPrice: nextMotorcyclePrice || 130000, oldMotorcycleSaleAmount: nextOldSale, isPriceEditable: true } },
      yearlyPlans: nextYearlyPlans,
      shoppingItems: (lifeData?.shoppingItems || []).map((item) => item.id === 'motorcycle' ? { ...item, estimatedPrice: nextMotorcyclePrice || 130000 } : item),
    };
    onRestore(nextData);
    showInfo('Ayarlar kaydedildi. Yıl ekranı, Antalya hedefi ve motosiklet bağlantısı güncellendi.');
  }

  function handleExport() {
    setExportText(createBackupText(lifeData));
    showInfo(`Yedek hazır. ${backupStats.totalRecords} kayıt, ${BACKUP_SCOPE.length} veri alanı, sürüm ${APP_STATUS_CODE}. Metnin tamamını kopyala.`);
  }

  function handleImport() {
    if (!importText.trim()) return showError('İçe aktarım için önce yedek metnini kutuya yapıştırmalısın.');
    const result = parseBackupText(importText);
    if (!result.ok) return showError(result.error);
    const stats = result.stats || getBackupStats(result.data);
    const scopeCount = result.scope?.length || 0;
    const warning = result.versionWarning ? ` ${result.versionWarning}` : '';
    onRestore(result.data);
    showInfo(`Geri yükleme tamamlandı. Sürüm: ${result.backupVersion}. Tarih: ${result.createdAt}. Kayıt: ${stats.totalRecords}. Alan: ${scopeCount || 'eski yedek'}.${warning}`);
  }

  function confirmReset() {
    Alert.alert('Demo veriyi sıfırla?', 'Bu işlem mevcut lokal demo verinin üstüne yazar. Devam etmeden önce yedek alman önerilir.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sıfırla', style: 'destructive', onPress: () => { onReset(); showInfo('Demo veri sıfırlandı. Ana ekrandan kontrol edebilirsin.'); } },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={hero}><Text style={eyebrow}>HEDEF AYARLARI</Text><Text style={title}>Ayarlar</Text><Text style={line}>Uygulama sürümü: {APP_STATUS_CODE}</Text><Text style={line}>Para birimi: {settings.currency || 'TL'}</Text></View>
      <NoticeBox message={message} type={messageType} />
      <CurrencySelector lifeData={lifeData} onSave={onRestore} />
      <Panel title="Yıllık sistem"><Input label="Varsayılan aktif yıl" value={activeYear} onChangeText={setActiveYear} placeholder="2026" keyboardType="numeric" /><Text style={hint}>Bu yıl Ana Sayfa ve Yıl ekranı için varsayılan seçim olur.</Text></Panel>
      <Panel title="Antalya hedefi"><Input label="Hedef tarih" value={targetDate} onChangeText={setTargetDate} placeholder="2026-10-31" /><Input label="Hedef ay metni" value={targetMonthText} onChangeText={setTargetMonthText} placeholder="Ekim / Kasım 2026" /><Input label="Hedef bölgeler" value={targetAreasText} onChangeText={setTargetAreasText} placeholder="Muratpaşa, Lara, Konyaaltı" /><Input label="Toplam hedef bütçe" value={targetAmount} onChangeText={setTargetAmount} placeholder="Örn: 500000" keyboardType="numeric" /></Panel>
      <Panel title="Motosiklet hedefi"><Input label="Sıfır motosiklet tahmini fiyat" value={motorcyclePrice} onChangeText={setMotorcyclePrice} placeholder="130000" keyboardType="numeric" /><Input label="Eski motosiklet satış tutarı" value={oldMotorcycleSaleAmount} onChangeText={setOldMotorcycleSaleAmount} placeholder="Örn: 60000" keyboardType="numeric" /><Button label="Hedef ayarlarını kaydet" onPress={saveTargets} color="#FFB347" /></Panel>
      <Panel title="Yedek merkezi"><Text style={hint}>Bu yedek cihaz içi verinin tamamını metin olarak dışa aktarır. Telefon değişirse aynı metni içe aktararak geri dönebilirsin.</Text><CountLine label="Toplam kayıt" value={backupStats.totalRecords} /><CountLine label="Yıl hedefi" value={backupStats.yearlyPlans} /><CountLine label="Ev odası" value={backupStats.homeSetupRooms} /><CountLine label="Aktivite" value={backupStats.activities} /><CountLine label="Sahil / rota" value={backupStats.beaches} /><CountLine label="Bölge notu" value={backupStats.regionNotes} /><CountLine label="Para kaydı" value={backupStats.moneyEntries} /><CountLine label="Alınacak kalem" value={backupStats.shoppingItems} /><CountLine label="Borç kaydı" value={backupStats.debtEntries} /><Text style={hint}>Yedek kapsamı: {BACKUP_SCOPE.join(', ')}</Text></Panel>
      <Panel title="Dışa aktar"><Text style={hint}>1) Yedek metni oluştur. 2) Metnin tamamını kopyala. 3) WhatsApp, notlar veya dosya olarak güvenli yerde sakla.</Text><Button label="Yedek metni oluştur" onPress={handleExport} color="#2DE2E6" /><Box value={exportText} onChangeText={setExportText} placeholder="Dışa aktarım metni burada görünecek" /></Panel>
      <Panel title="İçe aktar"><Text style={warning}>Uyarı: Geri yükleme mevcut lokal verinin üstüne yazar. Önce mevcut veriyi dışa aktarman önerilir.</Text><Box value={importText} onChangeText={setImportText} placeholder="Kaydettiğin yedek metnini buraya yapıştır" /><Button label="Yedekten geri yükle" onPress={handleImport} color="#FFB347" /></Panel>
      <View style={{ marginTop: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' }}><Text style={{ color: '#102A35', fontSize: 17, fontWeight: '900' }}>Google Drive notu</Text><Text style={hint}>Otomatik Google Drive yedeği ileride opsiyonel özellik olabilir. Şimdilik manuel yedek metni kullanılacak.</Text></View>
      <TouchableOpacity style={{ marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#FFD0D8', alignItems: 'center' }} onPress={confirmReset}><Text style={{ color: '#7A1E2B', fontSize: 15, fontWeight: '900' }}>Demo veriyi sıfırla</Text></TouchableOpacity>
    </ScrollView>
  );
}

function syncYearPlans(input) { const list = Array.isArray(input.plans) ? input.plans : []; const area = input.targetAreas.join(' / '); const antalyaPlan = { id: 'year_2026_antalya', year: input.year, title: `${input.year} Antalya yeni hayat`, goalType: 'tasinma', country: 'Türkiye', city: 'Antalya', area, targetMonth: input.targetMonth, targetDate: input.targetDate, estimatedBudget: input.moveBudget, savedAmount: input.moveSaved, status: 'active', note: 'Antalya ana hedefi Ayarlar ekranından senkronlanır.' }; const motorcyclePlan = { id: 'year_motorcycle_goal', year: input.year, title: 'Yeni motosiklet', goalType: 'arac', country: 'Türkiye', city: 'Antalya', area: '', targetMonth: input.targetMonth, targetDate: input.targetDate, estimatedBudget: input.motorcyclePrice, savedAmount: input.motorcycleSaved, status: 'planned', note: 'Motosiklet fiyatı Ayarlar ve Liste ekranlarıyla bağlıdır.' }; const without = list.filter((p) => p.id !== antalyaPlan.id && p.id !== motorcyclePlan.id); return [antalyaPlan, motorcyclePlan, ...without]; }
function Panel({ title, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text>{children}</View>; }
function CountLine({ label, value }) { return <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#D9F1F2' }}><Text style={{ color: '#315661', fontSize: 13, fontWeight: '800' }}>{label}</Text><Text style={{ color: '#102A35', fontSize: 13, fontWeight: '900' }}>{value}</Text></View>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={label}>{props.label}</Text><TextInput {...props} style={inputStyle} placeholderTextColor="#7C969D" /></View>; }
function Box(props) { return <TextInput multiline {...props} placeholderTextColor="#7C969D" style={boxStyle} />; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function toYear(value, fallback) { const y = Number(value); return Number.isFinite(y) && y >= 2020 ? Math.round(y) : fallback; }
function dateYear(text) { const match = String(text || '').match(/^(\d{4})-/); return match ? Number(match[1]) : 0; }
function toNumber(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) && parsed > 0 ? parsed : 0; }
const hero = { marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 };
const eyebrow = { color: '#FF7A59', fontSize: 12, fontWeight: '900' };
const title = { marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' };
const line = { marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' };
const panel = { marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const panelTitle = { color: '#102A35', fontSize: 22, fontWeight: '900' };
const label = { color: '#315661', fontSize: 12, fontWeight: '900' };
const hint = { marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const warning = { marginTop: 8, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '900' };
const inputStyle = { marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' };
const boxStyle = { marginTop: 12, minHeight: 150, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' };
