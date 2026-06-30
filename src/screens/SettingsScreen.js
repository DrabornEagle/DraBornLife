import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createBackupText, parseBackupText } from '../utils/backupUtils';

const APP_VERSION = 'v0.0.10';

export function SettingsScreen({ lifeData, onReset, onRestore }) {
  const [backupText, setBackupText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');

  function createBackup() {
    setBackupText(createBackupText(lifeData));
    setMessage('Yedek metni oluşturuldu. Bu metni kopyalayıp dosya olarak saklayabilirsin.');
  }

  function restoreBackup() {
    const result = parseBackupText(importText);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    onRestore(result.data);
    setMessage('Yedek başarıyla geri yüklendi. Ana ekrana dönüp verileri kontrol edebilirsin.');
  }

  return (
    <View style={{ flex: 1, minHeight: 980, padding: 18, backgroundColor: '#06202A' }}>
      <View style={{ marginTop: 20, padding: 22, borderRadius: 30, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>LOKAL VERI</Text>
        <Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>Ayarlar</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 15, fontWeight: '800' }}>Uygulama sürümü: {APP_VERSION}</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 15, fontWeight: '800' }}>Veri modu: cihaz içi lokal kayıt</Text>
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Yedek oluştur</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '700' }}>Bu alan mevcut lokal veriyi yedek metnine çevirir. Metni kopyalayıp dosya olarak saklayabilirsin.</Text>
        <TouchableOpacity style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#2DE2E6', alignItems: 'center' }} onPress={createBackup}>
          <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedek metni oluştur</Text>
        </TouchableOpacity>
        <TextInput multiline value={backupText} onChangeText={setBackupText} placeholder="Yedek metni burada görünecek" placeholderTextColor="#7C969D" style={{ minHeight: 130, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
      </View>

      <View style={{ marginTop: 14, padding: 18, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Yedekten geri yükle</Text>
        <Text style={{ marginTop: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '700' }}>Daha önce sakladığın DraBornLife yedek metnini buraya yapıştır ve geri yükle.</Text>
        <TextInput multiline value={importText} onChangeText={setImportText} placeholder="Yedek metnini buraya yapıştır" placeholderTextColor="#7C969D" style={{ minHeight: 130, marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 12, fontWeight: '700', textAlignVertical: 'top' }} />
        <TouchableOpacity style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: '#FFB347', alignItems: 'center' }} onPress={restoreBackup}>
          <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Yedekten geri yükle</Text>
        </TouchableOpacity>
      </View>

      {!!message && <Text style={{ marginTop: 12, color: '#DDF8FA', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{message}</Text>}

      <TouchableOpacity style={{ marginTop: 18, paddingVertical: 14, borderRadius: 20, backgroundColor: '#2DE2E6', alignItems: 'center' }} onPress={onReset}>
        <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Demo veriyi sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
}
