import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';

class DraBornLifeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('DraBornLife startup/render error', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message || String(this.state.error);
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>DraBornLife güvenli mod</Text>
          <Text style={styles.body}>
            Uygulama açılırken bir hata yakalandı. Uygulama doğrudan kapanmak yerine hata bilgisini gösteriyor.
          </Text>
          <Text selectable style={styles.error}>{message}</Text>
          <Text style={styles.code}>Sürüm: v1.0.1 • Hata kodu: STARTUP-LOAD</Text>
        </ScrollView>
      </View>
    );
  }
}

function AppLoader() {
  const module = require('./App');
  const DraBornLifeApp = module.default || module;
  return <DraBornLifeApp />;
}

function Root() {
  return (
    <DraBornLifeErrorBoundary>
      <AppLoader />
    </DraBornLifeErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08111F' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 14 },
  body: { color: '#D8E2F2', fontSize: 16, lineHeight: 24, marginBottom: 18 },
  error: { color: '#FCA5A5', backgroundColor: '#321827', borderRadius: 14, padding: 16, fontSize: 14, lineHeight: 21 },
  code: { color: '#7DD3FC', marginTop: 18, fontSize: 13, fontWeight: '700' },
});

registerRootComponent(Root);
