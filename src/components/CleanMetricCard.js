import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../theme';

export function CleanMetricCard({ label, value, hint, accent = theme.colors.aqua }) {
  return (
    <View style={{ flex: 1, margin: 5, padding: 16, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 9, height: 9, borderRadius: 5, marginRight: 8, backgroundColor: accent }} />
        <Text style={{ color: '#315661', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 }}>{label}</Text>
      </View>
      <Text style={{ marginTop: 12, color: theme.colors.textDark, fontSize: 24, fontWeight: '900' }}>{value}</Text>
      <Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '700' }}>{hint}</Text>
    </View>
  );
}
