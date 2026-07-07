import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>DraBornLife v0.1</Text>
      <Text style={styles.subtitle}>Antalya yeni hayat kontrol merkezi</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#070A16' },
  title: { color: 'white', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#A9B1C7', marginTop: 8, fontSize: 16 }
});
