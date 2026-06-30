import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { APP_STATUS_CODE } from '../config/appVersion';
import { BACKUP_SCOPE, createBackupText, parseBackupText } from '../utils/backupUtils';

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
  const [messageType, setMessageType] = useState('info');

  function showInfo(text) { setMessageType('info'); setMessage(text); }
  function showError(text) { setMessageType('error'); setMessage(text); }

  function saveTargets() {
    const nextMotorcyclePrice = toNumber(motorcyclePrice);
    const nextTargetAmount = toNumber(targetAmount);
    const nextOldSale = toNumber(oldMotorcycleSaleAmount);

    if (targetAmount.trim() && nextTargetAmount <= 0) return showError('Toplam hedef butce negatif veya hatali olamaz.');
    if (motorcyclePrice.trim() && nextMotorcyclePrice <= 0) return showError('Motosiklet fiyati negatif veya hatali olamaz.');
    if (oldMotorcycleSaleAmount.trim() && nextOldSale < 0) return showError('Eski motosiklet satis tutari negatif olamaz.');

    const targetAreas = targetAreasText.split(',').map((x) => x.trim()).filter(Boolean);
    const nextData = {
      ...lifeData,
      settings: { ...settings, targetAreas: targetAreas.length ? targetAreas : ['Muratpasa', 'Lara', 'Konyaalti'], targetMoveMonthText: targetMonthText.trim() || 'Ekim / Kasim 2026', currency: 'TRY' },
      goals: { ...goals, antalyaMove: { ...moveGoal, targetDate: targetDate.trim() || '2026-10-31', targetAmount: nextTargetAmount }, motorcycle: { ...motorcycle, estimatedPrice: nextMotorcyclePrice || 130000, oldMotorcycleSaleAmount: nextOldSale, isPriceEditable: true } },
      shoppingItems: (lifeData?.shoppingItems || []).map((item) => item.id === 'motorcycle' ? { ...item, estimatedPrice: nextMotorcyclePrice || 130000 } : item),
    };

    onRestore(nextData);
    showInfo('Hedef ayarlari kaydedildi. Ana ekranda yeni degerleri gorebilirsin.');
  }

  function handleExport() {
    setExportText(createBackupText(lifeData));
    showInfo('v0.4 yedek metni hazir. Finans, ev kurulum, aktiviteler, sahil/aquapark/tatil, ozel hedefler ve yil planlari dahil.');
  }

  function handleImport() {
    if (!importText.trim()) return showError('Ice aktarim icin once yedek metnini kutuya yapistirmalisin.');
    const result = parseBackupText(importText);
    if (!result.ok) return showError(result.error);
    onRestore(result.data);
    const warning = result.versionWarning ? ` ${result.versionWarning}` : '';
    const scopeText = result.scope?.length ? ` Kapsam: ${result.scope.length} veri alani.` : ' Eski yedek algilandi; eksik v0.4 alanlari otomatik tamamlanacak.';
    showInfo(`Veriler geri yuklendi. Yedek surumu: ${result.backupVersion}.${scopeText}${warning}`);
  }

  function confirmReset() {
    Alert.alert(
      'Demo veriyi sifirla?',
      'Bu islem mevcut lokal demo verinin ustune yazar. Devam etmeden once yedek alman onerilir.',
      [
        { text: 'Vazgec', style: 'cancel' },
        { text: 'Sifirla', style: 'destructive', onPress: () => { onReset(); showInfo('Demo veri sifirlandi. Ana ekrandan kontrol edebilirsin.'); } },
      ]
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#06202A' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={{ marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>HEDEF AYARLARI</Text>
        <Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>Ayarlar</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 15, fontWeight: '800' }}>Uygulama surumu: {APP_STATUS_CODE}</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' }}>Para birimi: TRY</Text>
      </View>

      <NoticeBox message={message} type={messageType} />

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Antalya hedefi</Text>
        <Input label="Hedef tarih" value={targetDate} onChangeText={setTargetDate} placeholder="2026-10-31" />
        <Input label="Hedef ay metni" value={targetMonthText} onChangeText={setTargetMonthText} placeholder="Ekim / Kasim 2026" />
        <Input label="Hedef bolgeler" value={targetAreasText} onChangeText={setTargetAreasText} placeholder="Muratpasa, Lara, Konyaalti" />
        <Input label="Toplam hedef butce" value={targetAmount} onChangeText={setTargetAmount} placeholder="Orn: 500000" keyboardType="numeric" />
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Motosiklet hedefi</Text>
        <Input label="Sifir motosiklet tahmini fiyat" value={motorcyclePrice} onChangeText={setMotorcyclePrice} placeholder="130000" keyboardType="numeric" />
        <Input label="Eski motosiklet satis tutari" value={oldMotorcycleSaleAmount} onChangeText={setOldMotorcycleSaleAmount} placeholder="Orn: 60000" keyboardType="numeric" />
        <TouchableOpacity onPress={saveTargets} style={{ marginTop: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Hedef ayarlarini kaydet</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>v0.4 yedek kapsami</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{BACKUP_SCOPE.join(', ')}</Text>
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Disa aktar</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Yedek metni tum lokal verileri kapsar. Yeni telefonda Ice aktar alanina yapistirarak geri yukleyebilirsin.</Text>
        <TouchableOpacity onPress={handleExport} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#2DE2E6', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedek metni olustur</Text></TouchableOpacity>
        <TextInput multiline value={exportText} onChangeText={setExportText} placeholder="Disa aktarim metni burada gorunecek" placeholderTextColor="#7C969D" style={{ minHeight: 120, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Ice aktar</Text>
        <Text style={{ marginTop: 8, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '900' }}>Uyari: Geri yukleme mevcut lokal verinin ustune yazar. Eski v0.1/v0.2/v0.3 yedekleri yuklenirse yeni v0.4 alanlari otomatik tamamlanir.</Text>
        <TextInput multiline value={importText} onChangeText={setImportText} placeholder="Kaydettigin yedek metnini buraya yapistir" placeholderTextColor="#7C969D" style={{ minHeight: 120, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
        <TouchableOpacity onPress={handleImport} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedekten geri yukle</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 22, backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#FFDCA0' }}>
        <Text style={{ color: '#102A35', fontSize: 17, fontWeight: '900' }}>Google Drive notu</Text>
        <Text style={{ marginTop: 7, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Otomatik Google Drive yedegi v1.0 sonrasi opsiyonel ozellik olarak beklemede. Simdilik manuel yedek metni kullanilacak.</Text>
      </View>

      <TouchableOpacity style={{ marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#FFD0D8', alignItems: 'center' }} onPress={confirmReset}><Text style={{ color: '#7A1E2B', fontSize: 15, fontWeight: '900' }}>Demo veriyi sifirla</Text></TouchableOpacity>
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
