import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../theme';

export function CleanMetricCard({ label, value, hint, accent = theme.colors.aqua }) {
  return (
    <View style={{ flex: 1, margin: 5, padding: 16, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7F1F2' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 9, height: 9, borderRadius: 5, marginRight: 8, backgroundColor: accent }} />
        <Text style={{ color: theme.colors.slate, fontSize: 11, fontWeight: '900', letterSpacing: 0.7 }}>{label}</Text>
      </View>
      <Text style={{ marginTop: 12, color: theme.colors.textDark, fontSize: 24, fontWeight: '900' }}>{value}</Text>
      <Text style={{ marginTop: 4, color: theme.colors.slate, fontSize: 12, fontWeight: '600' }}>{hint}</Text>
    </View>
  );
}
