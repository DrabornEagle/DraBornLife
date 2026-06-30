import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_STATUS_CODE } from '../config/appVersion';
import { createBackupText, parseBackupText } from '../utils/backupUtils';

export function SettingsScreenFixed({ lifeData, onReset, onRestore }) {
  const settings = lifeData?.settings || {};
  const goals = lifeData?.goals || {};
  const moveGoal = goals.antalyaMove || {};
  const motorcycle = goals.motorcycle || {};

  const [targetDate, setTargetDate] = useState(moveGoal.targetDate || '2026-10-31');
  const [targetMonthText, setTargetMonthText] = useState(settings.targetMoveMonthText || 'Ekim / Kasım 2026');
  const [targetAreasText, setTargetAreasText] = useState((settings.targetAreas || []).join(', '));
  const [targetAmount, setTargetAmount] = useState(String(moveGoal.targetAmount || ''));
  const [motorcyclePrice, setMotorcyclePrice] = useState(String(motorcycle.estimatedPrice || 130000));
  const [oldMotorcycleSaleAmount, setOldMotorcycleSaleAmount] = useState(String(motorcycle.oldMotorcycleSaleAmount || ''));
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');

  function saveTargets() {
    const targetAreas = targetAreasText.split(',').map((x) => x.trim()).filter(Boolean);
    const nextMotorcyclePrice = toNumber(motorcyclePrice);

    const nextData = {
      ...lifeData,
      settings: { ...settings, targetAreas: targetAreas.length ? targetAreas : ['Muratpaşa', 'Lara', 'Konyaaltı'], targetMoveMonthText: targetMonthText.trim() || 'Ekim / Kasım 2026', currency: 'TRY' },
      goals: { ...goals, antalyaMove: { ...moveGoal, targetDate: targetDate.trim() || '2026-10-31', targetAmount: toNumber(targetAmount) }, motorcycle: { ...motorcycle, estimatedPrice: nextMotorcyclePrice || 130000, oldMotorcycleSaleAmount: toNumber(oldMotorcycleSaleAmount), isPriceEditable: true } },
      shoppingItems: (lifeData?.shoppingItems || []).map((item) => item.id === 'motorcycle' ? { ...item, estimatedPrice: nextMotorcyclePrice || 130000 } : item),
    };

    onRestore(nextData);
    setMessage('Hedef ayarları kaydedildi. Ana ekranda yeni değerleri görebilirsin.');
  }

  function handleExport() {
    setExportText(createBackupText(lifeData));
    setMessage('Yedek metni hazır. Tamamını seçip kopyala, telefonunda not veya txt dosyası olarak sakla.');
  }

  function handleImport() {
    if (!importText.trim()) {
      setMessage('İçe aktarım için önce yedek metnini kutuya yapıştırmalısın.');
      return;
    }
    const result = parseBackupText(importText);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    onRestore(result.data);
    const warning = result.versionWarning ? ` ${result.versionWarning}` : '';
    setMessage(`Veriler geri yüklendi. Yedek sürümü: ${result.backupVersion}.${warning}`);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#06202A' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={{ marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>HEDEF AYARLARI</Text>
        <Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>Ayarlar</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 15, fontWeight: '800' }}>Uygulama sürümü: {APP_STATUS_CODE}</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' }}>Para birimi: TRY</Text>
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Antalya hedefi</Text>
        <Input label="Hedef tarih" value={targetDate} onChangeText={setTargetDate} placeholder="2026-10-31" />
        <Input label="Hedef ay metni" value={targetMonthText} onChangeText={setTargetMonthText} placeholder="Ekim / Kasım 2026" />
        <Input label="Hedef bölgeler" value={targetAreasText} onChangeText={setTargetAreasText} placeholder="Muratpaşa, Lara, Konyaaltı" />
        <Input label="Toplam hedef bütçe" value={targetAmount} onChangeText={setTargetAmount} placeholder="Örn: 500000" keyboardType="numeric" />
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Motosiklet hedefi</Text>
        <Input label="Sıfır motosiklet tahmini fiyat" value={motorcyclePrice} onChangeText={setMotorcyclePrice} placeholder="130000" keyboardType="numeric" />
        <Input label="Eski motosiklet satış tutarı" value={oldMotorcycleSaleAmount} onChangeText={setOldMotorcycleSaleAmount} placeholder="Örn: 60000" keyboardType="numeric" />
        <TouchableOpacity onPress={saveTargets} style={{ marginTop: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Hedef ayarlarını kaydet</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Dışa aktar</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Yedek oluşturunca metnin tamamını kopyala. Telefonunda not, txt dosyası veya güvenli bir klasörde sakla.</Text>
        <TouchableOpacity onPress={handleExport} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#2DE2E6', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedek metni oluştur</Text></TouchableOpacity>
        <TextInput multiline value={exportText} onChangeText={setExportText} placeholder="Dışa aktarım metni burada görünecek" placeholderTextColor="#7C969D" style={{ minHeight: 120, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>İçe aktar</Text>
        <Text style={{ marginTop: 8, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '900' }}>Uyarı: Geri yükleme mevcut lokal verinin üstüne yazar. İşlemden önce güncel verini dışa aktarman önerilir.</Text>
        <TextInput multiline value={importText} onChangeText={setImportText} placeholder="Kaydettiğin yedek metnini buraya yapıştır" placeholderTextColor="#7C969D" style={{ minHeight: 120, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
        <TouchableOpacity onPress={handleImport} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedekten geri yükle</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' }}>
        <Text style={{ color: '#102A35', fontSize: 17, fontWeight: '900' }}>Google Drive notu</Text>
        <Text style={{ marginTop: 7, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Otomatik Google Drive yedeği v1.0 sonrası opsiyonel özellik olarak beklemede. Şimdilik manuel yedek metni kullanılacak.</Text>
      </View>

      {!!message && <Text style={{ marginTop: 12, color: '#DDF8FA', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{message}</Text>}
      <TouchableOpacity style={{ marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#2DE2E6', alignItems: 'center' }} onPress={onReset}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Demo veriyi sıfırla</Text></TouchableOpacity>
    </ScrollView>
  );
}

function Input(props) {
  return <View style={{ marginTop: 14 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>;
}

function toNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
