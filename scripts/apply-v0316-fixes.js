const fs = require('fs');
const path = require('path');

try {
  require('./apply-v0315-fixes');
} catch (err) {
  console.warn('v0.3.15 base fixes could not run:', err && err.message ? err.message : err);
}

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');
const original = src;

function replaceExact(from, to) {
  if (!src.includes(to) && src.includes(from)) src = src.replace(from, to);
}

replaceExact("const VERSION = 'v0.3.15';", "const VERSION = 'v0.3.16';");
replaceExact("const VERSION = 'v0.3.14';", "const VERSION = 'v0.3.16';");
replaceExact("const VERSION = 'v0.3.13';", "const VERSION = 'v0.3.16';");
replaceExact('v0.3.15 kurulum düzeltme', 'v0.3.16 arayüz düzeltme');
replaceExact('v0.3.14 finans düzeni', 'v0.3.16 arayüz düzeltme');
replaceExact('v0.3.13 favori düzeltme', 'v0.3.16 arayüz düzeltme');
replaceExact('v0.3.10 birikim dağıtımı', 'v0.3.16 arayüz düzeltme');

const settingsSub = 'title="Ayarlar" sub={VERSION + " Save & Yedek sistemi"}';
replaceExact('title="Ayarlar" sub="v0.3.10 Download Save sistemi"', settingsSub);
replaceExact('title="Ayarlar" sub="v0.3.13 Favori save sistemi"', settingsSub);
replaceExact('title="Ayarlar" sub="v0.3.14 Finans sistemi"', settingsSub);
replaceExact('title="Ayarlar" sub="v0.3.15 Download Save sistemi"', settingsSub);

const fadeLine = "  useEffect(() => { fade.setValue(0); Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start(); }, [tab, goalTab, planTab]);";
const bootBlock = fadeLine + "\n  if (!ready) return <View style={[styles.root, { backgroundColor: theme.bg }]}><StatusBar barStyle={theme.status} /><LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFillObject} /><Background float={float} /><View style={styles.bootScreen}><LinearGradient colors={['#2EE6A6', '#2E6BFF']} style={styles.bootLogo}><MaterialCommunityIcons name=\"palm-tree\" size={34} color=\"white\" /></LinearGradient><Text style={[styles.bootTitle, { color: theme.text }]}>DraBornLife</Text><Text style={[styles.bootSub, { color: theme.muted }]}>Save yükleniyor, ekran tek seferde açılacak...</Text></View></View>;";
if (!src.includes('Save yükleniyor, ekran tek seferde açılacak')) replaceExact(fadeLine, bootBlock);

const toastStyle = "toastText: { color: 'white', fontWeight: '900', textAlign: 'center', fontSize: 15 }";
const bootStyle = "toastText: { color: 'white', fontWeight: '900', textAlign: 'center', fontSize: 15 }, bootScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 }, bootLogo: { width: 82, height: 82, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, bootTitle: { fontSize: 34, fontWeight: '900', letterSpacing: -1 }, bootSub: { marginTop: 8, textAlign: 'center', fontSize: 15, lineHeight: 22, fontWeight: '800' }";
if (!src.includes('bootLogo:')) replaceExact(toastStyle, bootStyle);

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v0.3.16 fixes applied.');
} else {
  console.log('DraBornLife v0.3.16 fixes already applied or patterns not found.');
}
