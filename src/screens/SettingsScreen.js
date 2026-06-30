import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const APP_VERSION = 'v0.0.9';

export function SettingsScreen({ onReset }) {
  return (
    <View style={{ flex: 1, minHeight: 720, padding: 24, backgroundColor: '#06202A' }}>
      <View style={{ marginTop: 34, padding: 24, borderRadius: 32, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>LOKAL VERI</Text>
        <Text style={{ marginTop: 10, color: '#102A35', fontSize: 34, fontWeight: '900' }}>Ayarlar</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 15, fontWeight: '800' }}>Uygulama sürümü: {APP_VERSION}</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 15, fontWeight: '800' }}>Veri modu: cihaz içi lokal kayıt</Text>
        <Text style={{ marginTop: 12, color: '#315661', fontSize: 13, fontWeight: '700' }}>Not: Eski lokal veri sürümü ekranda gösterilmez; aktif uygulama sürümü gösterilir.</Text>
        <TouchableOpacity style={{ marginTop: 24, paddingVertical: 14, borderRadius: 20, backgroundColor: '#2DE2E6', alignItems: 'center' }} onPress={onReset}>
          <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Demo veriyi sıfırla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
