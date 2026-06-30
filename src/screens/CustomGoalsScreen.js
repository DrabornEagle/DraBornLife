import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CustomGoalsPanel } from '../components/CustomGoalsPanel';
import { APP_VERSION_LABEL } from '../config/appVersion';

export function CustomGoalsScreen({ lifeData, onSave }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' }}>Ozel Hedefler</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Antalya hayati icin ek hedeflerini butce, tarih ve tamamlandi durumuyla takip et.</Text>
      </View>
      <CustomGoalsPanel lifeData={lifeData} onSave={onSave} />
    </ScrollView>
  );
}
