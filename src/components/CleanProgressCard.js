import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../theme';

export function CleanProgressCard({ title, subtitle, percent, leftLabel, rightLabel, color = theme.colors.aqua }) {
  const safePercent = Math.max(0, Math.min(100, percent || 0));

  return (
    <View style={{ marginHorizontal: 18, marginTop: 12, padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7F1F2' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ color: theme.colors.textDark, fontSize: 18, fontWeight: '900' }}>{title}</Text>
          <Text style={{ marginTop: 4, color: theme.colors.slate, fontSize: 12, fontWeight: '600' }}>{subtitle}</Text>
        </View>
        <Text style={{ color, fontSize: 22, fontWeight: '900' }}>{safePercent}%</Text>
      </View>
      <View style={{ height: 10, marginTop: 14, borderRadius: 20, backgroundColor: '#EAF3F4', overflow: 'hidden' }}>
        <View style={{ width: `${safePercent}%`, height: '100%', borderRadius: 20, backgroundColor: color }} />
      </View>
      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.colors.slate, fontSize: 12, fontWeight: '700' }}>{leftLabel}</Text>
        <Text style={{ color: theme.colors.slate, fontSize: 12, fontWeight: '700' }}>{rightLabel}</Text>
      </View>
    </View>
  );
}
