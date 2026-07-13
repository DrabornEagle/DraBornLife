import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
      <View style={styles.errorRoot}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.errorContent}>
          <Text style={styles.errorTitle}>DraBornLife güvenli mod</Text>
          <Text style={styles.errorBody}>
            Uygulama açılırken bir hata yakalandı. Uygulama doğrudan kapanmak
            yerine hata bilgisini gösteriyor.
          </Text>
          <Text selectable style={styles.errorMessage}>
            {message}
          </Text>
          <Text style={styles.errorCode}>
            Sürüm: v1.0.2 • Hata kodu: STARTUP-LOAD
          </Text>
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

function LoadingDot({ value }) {
  const translateY = value.interpolate({
    inputRange: [0.25, 1],
    outputRange: [2, -5],
  });

  return (
    <Animated.View
      style={[
        styles.loadingDot,
        {
          opacity: value,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

function AnimatedSplash({ onFinish }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.25)).current;
  const dot2 = useRef(new Animated.Value(0.25)).current;
  const dot3 = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const spinner = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulser = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const dots = Animated.loop(
      Animated.stagger(
        160,
        [dot1, dot2, dot3].map((dot) =>
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 260,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.25,
              duration: 420,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );

    const entrance = Animated.spring(rise, {
      toValue: 1,
      damping: 13,
      stiffness: 90,
      mass: 0.8,
      useNativeDriver: true,
    });

    spinner.start();
    pulser.start();
    dots.start();
    entrance.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, 2250);

    return () => {
      clearTimeout(timer);
      spinner.stop();
      pulser.stop();
      dots.stop();
      entrance.stop();
    };
  }, [dot1, dot2, dot3, fade, onFinish, pulse, rise, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.09],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.58],
  });
  const entranceScale = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });
  const entranceY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });

  return (
    <Animated.View style={[styles.splashOverlay, { opacity: fade }]}>
      <ImageBackground
        source={require('./assets/splash-v102.jpg')}
        resizeMode="cover"
        style={styles.splashImage}
      >
        <StatusBar hidden />
        <View style={styles.splashShade} />
        <Animated.View
          style={[
            styles.splashAnimationArea,
            {
              opacity: rise,
              transform: [
                { translateY: entranceY },
                { scale: entranceScale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.splashGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />
          <Animated.View
            style={[styles.splashSpinner, { transform: [{ rotate }] }]}
          />
          <View style={styles.spinnerCore} />
          <View style={styles.loadingDots}>
            <LoadingDot value={dot1} />
            <LoadingDot value={dot2} />
            <LoadingDot value={dot3} />
          </View>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
}

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <DraBornLifeErrorBoundary>
      <View style={styles.appRoot}>
        <AppLoader />
        {showSplash ? (
          <AnimatedSplash onFinish={() => setShowSplash(false)} />
        ) : null}
      </View>
    </DraBornLifeErrorBoundary>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: '#020817',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: '#020817',
  },
  splashImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020817',
  },
  splashShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 7, 20, 0.08)',
  },
  splashAnimationArea: {
    position: 'absolute',
    top: '53%',
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashGlow: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#22D3EE',
  },
  splashSpinner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: 'rgba(103, 232, 249, 0.18)',
    borderTopColor: '#67E8F9',
    borderRightColor: '#F8D77A',
    shadowColor: '#22D3EE',
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
  spinnerCore: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.34)',
    backgroundColor: 'rgba(2, 8, 23, 0.62)',
  },
  loadingDots: {
    position: 'absolute',
    top: 112,
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#67E8F9',
    shadowColor: '#67E8F9',
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 5,
  },
  errorRoot: {
    flex: 1,
    backgroundColor: '#08111F',
  },
  errorContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 14,
  },
  errorBody: {
    color: '#D8E2F2',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  errorMessage: {
    color: '#FCA5A5',
    backgroundColor: '#321827',
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    lineHeight: 21,
  },
  errorCode: {
    color: '#7DD3FC',
    marginTop: 18,
    fontSize: 13,
    fontWeight: '700',
  },
});

registerRootComponent(Root);
