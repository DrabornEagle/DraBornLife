import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function ProgressCard({ title, subtitle, percent, leftLabel, rightLabel, color = theme.colors.aqua }) {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={[styles.percent, { color }]}>{safePercent}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safePercent}%`, backgroundColor: color }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{leftLabel}</Text>
        <Text style={styles.footerText}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 20,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    shadowColor: '#06202A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 9,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: theme.colors.textDark,
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 5,
    color: theme.colors.slate,
    fontSize: 13,
    fontWeight: '600',
  },
  percent: {
    fontSize: 24,
    fontWeight: '900',
  },
  track: {
    height: 12,
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: '#DDEFF1',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 20,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: theme.colors.slate,
    fontSize: 12,
    fontWeight: '700',
  },
});
