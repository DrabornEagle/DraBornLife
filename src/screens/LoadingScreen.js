import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function LoadingScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>🌴</Text>
      <Text style={styles.title}>DraBornLife</Text>
      <Text style={styles.subtitle}>Lokal veriler hazırlanıyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.oceanDeep,
    padding: 24,
  },
  logo: {
    fontSize: 56,
    marginBottom: 14,
  },
  title: {
    color: theme.colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    color: theme.colors.aquaSoft,
    fontSize: 16,
    fontWeight: '700',
  },
});
