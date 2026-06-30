import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function MetricCard({ label, value, hint, accent = theme.colors.aqua }) {
  return (
    <View style={styles.card}>
      <View style={[styles.accentDot, { backgroundColor: accent }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 128,
    margin: 6,
    padding: 18,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#06202A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  accentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  label: {
    color: theme.colors.slate,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  value: {
    marginTop: 8,
    color: theme.colors.textDark,
    fontSize: 22,
    fontWeight: '900',
  },
  hint: {
    marginTop: 6,
    color: theme.colors.slate,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
});
