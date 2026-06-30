import React from 'react';
import { Text, View } from 'react-native';
import { textPresets, theme } from '../theme';

export function CleanProgressCard({ title, subtitle, percent, leftLabel, rightLabel, color = theme.colors.aqua }) {
  const safePercent = Math.max(0, Math.min(100, percent || 0));

  return (
    <View style={card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={titleStyle}>{title}</Text>
          <Text style={subtitleStyle}>{subtitle}</Text>
        </View>
        <Text style={[percentStyle, { color }]}>{safePercent}%</Text>
      </View>
      <View style={track}>
        <View style={{ width: `${safePercent}%`, height: '100%', borderRadius: 20, backgroundColor: color }} />
      </View>
      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={footerText} numberOfLines={2}>{leftLabel}</Text>
        <Text style={[footerText, { textAlign: 'right' }]} numberOfLines={2}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const card = {
  marginHorizontal: 18,
  marginTop: 12,
  padding: 18,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.card,
  borderWidth: 1,
  borderColor: theme.colors.borderSoft,
  ...theme.shadow.card,
};
const titleStyle = { ...textPresets.sectionTitle, fontSize: 19, lineHeight: 24 };
const subtitleStyle = { marginTop: 5, color: theme.colors.slate, fontSize: theme.fontSize.label, lineHeight: 17, fontWeight: theme.fontWeight.strong };
const percentStyle = { fontSize: 23, lineHeight: 28, fontWeight: theme.fontWeight.black };
const track = { height: 10, marginTop: 14, borderRadius: 20, backgroundColor: '#EAF3F4', overflow: 'hidden' };
const footerText = { flex: 1, color: theme.colors.slate, fontSize: theme.fontSize.label, lineHeight: 17, fontWeight: theme.fontWeight.strong };
