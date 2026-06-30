import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function SettingsScreen({ lifeData, onReset }) {
  return (
    <View style={{ flex: 1, minHeight: 720, padding: 24, backgroundColor: '#06202A' }}>
      <View style={{ marginTop: 34, padding: 24, borderRadius: 32, backgroundColor: 'white' }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>LOKAL VERI</Text>
        <Text style={{ marginTop: 10, color: '#102A35', fontSize: 34, fontWeight: '900' }}>Ayarlar</Text>
        <Text style={{ marginTop: 12, color: '#52616B', fontSize: 15, fontWeight: '700' }}>Sürüm: {lifeData?.settings?.currentVersionCode || 'v0.0.4'}</Text>
        <Text style={{ marginTop: 12, color: '#52616B', fontSize: 15, fontWeight: '700' }}>Veri modu: cihaz içi lokal kayıt</Text>
        <TouchableOpacity style={{ marginTop: 24, paddingVertical: 14, borderRadius: 20, backgroundColor: '#2DE2E6', alignItems: 'center' }} onPress={onReset}>
          <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>Demo veriyi sıfırla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
