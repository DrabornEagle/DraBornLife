import React from 'react';
import { Text, View } from 'react-native';
import { textPresets, theme } from '../theme';

export function EmptyStateCard({ title, text, icon = '🌴' }) {
  return (
    <View style={card}>
      <View style={iconBubble}><Text style={iconStyle}>{icon}</Text></View>
      <Text style={titleStyle}>{title}</Text>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const card = {
  marginTop: 12,
  padding: 18,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.cardSoft,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: 'center',
};
const iconBubble = {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: theme.colors.white,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: 'center',
  justifyContent: 'center',
};
const iconStyle = { fontSize: 28 };
const titleStyle = { ...textPresets.sectionTitle, marginTop: 10, fontSize: 17, lineHeight: 22, textAlign: 'center' };
const textStyle = { ...textPresets.body, marginTop: 6, textAlign: 'center' };
