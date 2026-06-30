import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { textPresets, theme } from '../theme';

export function LoadingScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>🌴</Text>
        <Text style={styles.title}>DraBornLife</Text>
        <Text style={styles.subtitle}>Lokal veriler hazırlanıyor...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.page,
    padding: 24,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: 28,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.hero,
  },
  logo: {
    fontSize: 56,
    marginBottom: 14,
  },
  title: {
    ...textPresets.title,
    textAlign: 'center',
  },
  subtitle: {
    ...textPresets.body,
    marginTop: 10,
    textAlign: 'center',
  },
});
