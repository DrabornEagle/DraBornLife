import React from 'react';
import { Text, View } from 'react-native';

export function EmptyStateCard({ title, text, icon = '🌴' }) {
  return (
    <View style={card}>
      <Text style={iconStyle}>{icon}</Text>
      <Text style={titleStyle}>{title}</Text>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const card = { marginTop: 12, padding: 16, borderRadius: 22, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', alignItems: 'center' };
const iconStyle = { fontSize: 28 };
const titleStyle = { marginTop: 8, color: '#102A35', fontSize: 16, lineHeight: 21, fontWeight: '900', textAlign: 'center' };
const textStyle = { marginTop: 6, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800', textAlign: 'center' };
