import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CustomGoalsPanel } from '../components/CustomGoalsPanel';
import { APP_VERSION_LABEL } from '../config/appVersion';

export function CustomGoalsScreen({ lifeData, onSave }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingBottom: 190 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 }}>
        <Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL} • Expo Go</Text>
        <Text style={{ marginTop: 8, color: '#102A35', fontSize: 31, fontWeight: '900' }}>Özel Hedefler</Text>
        <Text style={{ marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Antalya hayatı için ek hedeflerini bütçe, tarih ve tamamlandı durumuyla takip et.</Text>
      </View>
      <CustomGoalsPanel lifeData={lifeData} onSave={onSave} />
    </ScrollView>
  );
}
