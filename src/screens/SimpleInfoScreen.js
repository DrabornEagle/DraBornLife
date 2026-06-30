import React from 'react';
import { Text, View } from 'react-native';

export function SimpleInfoScreen({ title, subtitle }) {
  return (
    <View style={{ flex: 1, minHeight: 720, padding: 24, backgroundColor: '#06202A' }}>
      <Text style={{ color: 'white', fontSize: 32, fontWeight: '900', marginTop: 30 }}>{title}</Text>
      <Text style={{ color: '#C8FBFF', fontSize: 16, lineHeight: 24, marginTop: 14 }}>{subtitle}</Text>
    </View>
  );
}
