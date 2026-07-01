import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BackupTestCenter } from '../components/BackupTestCenter';
import { CurrencySelector } from '../components/CurrencySelector';
import { NoticeBox } from '../components/NoticeBox';
import { APP_STATUS_CODE } from '../config/appVersion';
import { BACKUP_SCOPE, createBackupText, getBackupStats, getDataHealthReport, parseBackupText } from '../utils/backupUtils';

export function SettingsScreenFixed({ lifeData, onReset, onRestore }) {
  const settings = lifeData?.settings || {};
  const stats = useMemo(() => getBackupStats(lifeData), [lifeData]);
  const health = useMemo(() => getDataHealthReport(lifeData), [lifeData]);
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  function info(text) { setMessageType('info'); setMessage(text); }
  function fail(text) { setMessageType('error'); setMessage(text); }

  function handleExport() {
    const text = createBackupText(lifeData);
    setExportText(text);
    info(`Yedek hazır. ${stats.totalRecords} kayıt, ${health.errorCount} hata, ${health.warningCount} uyarı.`);
  }

  function handleImport() {
    if (!importText.trim()) return fail('İçe aktarım için önce yedek metnini yapıştır.');
    const result = parseBackupText(importText);
    if (!result.ok) return fail(result.error);
    onRestore(result.data);
    const nextStats = result.stats || getBackupStats(result.data);
    info(`Geri yükleme tamamlandı. Kayıt: ${nextStats.totalRecords}.`);
  }

  function confirmReset() {
    Alert.alert('Demo veriyi sıfırla?', 'Devam etmeden önce yedek alman önerilir.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sıfırla', style: 'destructive', onPress: () => { onReset(); info('Demo veri sıfırlandı.'); } },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={hero}><Text style={eyebrow}>AYARLAR</Text><Text style={title}>Yedek ve veri merkezi</Text><Text style={line}>Sürüm: {APP_STATUS_CODE}</Text><Text style={line}>Para birimi: {settings.currency || 'TL'}</Text></View>
      <NoticeBox message={message} type={messageType} />
      <CurrencySelector lifeData={lifeData} onSave={onRestore} />
      <Panel title="Veri sağlığı"><Text style={hint}>Yedek almadan önce temel kontrol.</Text><Count label="Durum" value={health.ok ? 'Sağlıklı' : 'Kontrol gerekli'} /><Count label="Kritik hata" value={health.errorCount} /><Count label="Uyarı" value={health.warningCount} />{health.errors.slice(0, 3).map((item) => <Text key={item} style={errorText}>• {item}</Text>)}{health.warnings.slice(0, 3).map((item) => <Text key={item} style={warnText}>• {item}</Text>)}</Panel>
      <Panel title="Yedek merkezi"><Text style={hint}>Cihaz içi veriyi metin olarak dışa aktarır ve aynı metinden geri yükler.</Text><Count label="Toplam kayıt" value={stats.totalRecords} /><Count label="Yıl hedefi" value={stats.yearlyPlans} /><Count label="Ev odası" value={stats.homeSetupRooms} /><Count label="Aktivite" value={stats.activities} /><Count label="Sahil / rota" value={stats.beaches} /><Count label="Para kaydı" value={stats.moneyEntries} /><Count label="Alınacak kalem" value={stats.shoppingItems} /><Count label="Borç kaydı" value={stats.debtEntries} /><Text style={hint}>Kapsam: {BACKUP_SCOPE.join(', ')}</Text></Panel>
      <BackupTestCenter lifeData={lifeData} exportText={exportText} importText={importText} />
      <Panel title="Dışa aktar"><Text style={hint}>Yedek metni oluştur ve tamamını güvenli yerde sakla.</Text><Button label="Yedek metni oluştur" onPress={handleExport} color="#2DE2E6" /><Box value={exportText} onChangeText={setExportText} placeholder="Dışa aktarım metni burada görünecek" /></Panel>
      <Panel title="İçe aktar"><Text style={warning}>Geri yükleme mevcut lokal verinin üstüne yazar. Önce mevcut veriyi dışa aktar.</Text><Box value={importText} onChangeText={setImportText} placeholder="Kaydettiğin yedek metnini buraya yapıştır" /><Button label="Yedekten geri yükle" onPress={handleImport} color="#FFB347" /></Panel>
      <View style={noteBox}><Text style={noteTitle}>Google Drive notu</Text><Text style={hint}>Otomatik Google Drive yedeği ileride opsiyonel özellik olabilir. Şimdilik manuel yedek metni kullanılacak.</Text></View>
      <TouchableOpacity style={resetButton} onPress={confirmReset}><Text style={resetText}>Demo veriyi sıfırla</Text></TouchableOpacity>
    </ScrollView>
  );
}

function Panel({ title, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text>{children}</View>; }
function Count({ label, value }) { return <View style={countLine}><Text style={countLabel} numberOfLines={2}>{label}</Text><Text style={countValue} numberOfLines={2}>{String(value)}</Text></View>; }
function Box(props) { return <TextInput multiline {...props} placeholderTextColor="#7C969D" style={boxStyle} />; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }

const hero = { marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 };
const eyebrow = { color: '#FF7A59', fontSize: 12, fontWeight: '900' };
const title = { marginTop: 8, color: '#102A35', fontSize: 30, lineHeight: 36, fontWeight: '900' };
const line = { marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' };
const panel = { marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const panelTitle = { color: '#102A35', fontSize: 22, fontWeight: '900' };
const hint = { marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const warning = { marginTop: 8, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '900' };
const warnText = { marginTop: 6, color: '#7A4D00', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const errorText = { marginTop: 6, color: '#7A1E2B', fontSize: 12, lineHeight: 17, fontWeight: '900' };
const countLine = { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#D9F1F2' };
const countLabel = { flex: 1, paddingRight: 8, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const countValue = { maxWidth: 130, color: '#102A35', fontSize: 13, lineHeight: 18, textAlign: 'right', fontWeight: '900' };
const boxStyle = { marginTop: 12, minHeight: 150, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' };
const noteBox = { marginTop: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' };
const noteTitle = { color: '#102A35', fontSize: 17, fontWeight: '900' };
const resetButton = { marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#FFD0D8', alignItems: 'center' };
const resetText = { color: '#7A1E2B', fontSize: 15, fontWeight: '900' };
