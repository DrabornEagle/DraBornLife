import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../theme';

export function NoticeBox({ message, type = 'info' }) {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';
  const backgroundColor = isError ? theme.colors.danger : isSuccess ? '#E4FAEE' : '#DDF8FA';
  const borderColor = isError ? '#FF9AAD' : isSuccess ? '#B5E9C8' : theme.colors.border;
  const textColor = isError ? theme.colors.dangerText : theme.colors.textDark;
  const label = isError ? 'Hata' : isSuccess ? 'Tamam' : 'Bilgi';

  return (
    <View style={{ marginTop: 12, padding: 13, borderRadius: theme.radius.md, backgroundColor, borderWidth: 1, borderColor }}>
      <Text style={{ color: textColor, fontSize: theme.fontSize.body, lineHeight: 19, fontWeight: theme.fontWeight.black }}>{label}: {message}</Text>
    </View>
  );
}
