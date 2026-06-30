import React from 'react';
import { Text, View } from 'react-native';

export function NoticeBox({ message, type = 'info' }) {
  if (!message) return null;

  const isError = type === 'error';
  const backgroundColor = isError ? '#FFD0D8' : '#DDF8FA';
  const borderColor = isError ? '#FF9AAD' : '#BEEDEF';
  const textColor = isError ? '#7A1E2B' : '#102A35';

  return (
    <View style={{ marginTop: 12, padding: 12, borderRadius: 16, backgroundColor, borderWidth: 1, borderColor }}>
      <Text style={{ color: textColor, fontSize: 13, lineHeight: 18, fontWeight: '900' }}>{message}</Text>
    </View>
  );
}
