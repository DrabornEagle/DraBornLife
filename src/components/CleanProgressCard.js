import React from 'react';
import { Text, View } from 'react-native';
import { textPresets, theme } from '../theme';

export function CleanProgressCard({ title, subtitle, percent, leftLabel, rightLabel, color = theme.colors.aqua }) {
  const safePercent = Math.max(0, Math.min(100, percent || 0));

  return (
    <View style={card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={titleStyle} numberOfLines={2}>{title}</Text>
          <Text style={subtitleStyle} numberOfLines={3}>{subtitle}</Text>
        </View>
        <Text style={[percentStyle, { color }]} numberOfLines={1}>{safePercent}%</Text>
      </View>
      <View style={track}>
        <View style={{ width: `${safePercent}%`, height: '100%', borderRadius: 20, backgroundColor: color }} />
      </View>
      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={footerText} numberOfLines={2}>{leftLabel}</Text>
        <Text style={[footerText, footerRight]} numberOfLines={2}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const card = {
  marginHorizontal: 16,
  marginTop: 10,
  padding: 16,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.card,
  borderWidth: 1,
  borderColor: theme.colors.borderSoft,
  ...theme.shadow.card,
};
const titleStyle = { ...textPresets.sectionTitle, fontSize: 18, lineHeight: 23 };
const subtitleStyle = { marginTop: 5, color: theme.colors.slate, fontSize: theme.fontSize.label, lineHeight: 17, fontWeight: theme.fontWeight.strong };
const percentStyle = { minWidth: 54, textAlign: 'right', fontSize: 22, lineHeight: 27, fontWeight: theme.fontWeight.black };
const track = { height: 9, marginTop: 13, borderRadius: 20, backgroundColor: '#EAF3F4', overflow: 'hidden' };
const footerText = { flex: 1, color: theme.colors.slate, fontSize: 12, lineHeight: 16, fontWeight: theme.fontWeight.strong };
const footerRight = { marginLeft: 8, textAlign: 'right' };
