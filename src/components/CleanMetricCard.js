import React from 'react';
import { Text, View } from 'react-native';
import { textPresets, theme } from '../theme';

export function CleanMetricCard({ label, value, hint, accent = theme.colors.aqua }) {
  return (
    <View style={card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 9, height: 9, borderRadius: 5, marginRight: 8, backgroundColor: accent }} />
        <Text style={labelStyle} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={valueStyle} numberOfLines={2}>{value}</Text>
      <Text style={hintStyle} numberOfLines={2}>{hint}</Text>
    </View>
  );
}

const card = {
  flex: 1,
  margin: 5,
  padding: 16,
  minHeight: 142,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.cardSoft,
  borderWidth: 1,
  borderColor: theme.colors.border,
};
const labelStyle = { ...textPresets.label, flex: 1, letterSpacing: 0.5 };
const valueStyle = { marginTop: 12, color: theme.colors.textDark, fontSize: 22, lineHeight: 28, fontWeight: theme.fontWeight.black };
const hintStyle = { marginTop: 4, color: theme.colors.textSoft, fontSize: theme.fontSize.label, lineHeight: 17, fontWeight: theme.fontWeight.strong };
