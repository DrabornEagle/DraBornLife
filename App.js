import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KEY = 'drabornlife-v01-colorful';
const VERSION = 'v0.1';
const statuses = ['Planlandı', 'Parası Birikti', 'Satın Alındı', 'Kuruldu', 'Vazgeçildi'];
const moveStatuses = ['Planlama', 'Para birikiyor', 'Ev araştırması başladı', 'Ev tutuldu', 'Eşyalar alınıyor', 'Kurulum başladı', 'Antalya’ya taşınıldı'];
const financeModes = [
  ['income', 'Gelir', 'cash-plus', ['#00D4FF', '#4D7CFF']],
  ['expense', 'Gider', 'cart-arrow-down', ['#FF477E', '#FF9F1C']],
  ['saving', 'Birikim', 'piggy-bank', ['#20E3B2', '#29FFC6']],
  ['debt', 'Borç', 'alert-decagram', ['#A855F7', '#F43F5E']]
];

const defaultData = {
  settings: { targetBudget: 650000, targetDate: '2026-10-31', motorcycleTarget: 130000, theme: 'color' },
  incomes: [],
  expenses: [],
  savings: [],
  debts: [],
  items: [
    { id: 'rent', name: 'Kira ilk ay', category: 'Kira / Depozito', estimate: 35000, actual: 0, status: 'Planlandı', priority: 'Yüksek', note: 'Denize yakın ev.' },
    { id: 'deposit', name: 'Depozito', category: 'Kira / Depozito', estimate: 70000, actual: 0, status: 'Planlandı', priority: 'Yüksek', note: 'Muratpaşa/Lara veya Konyaaltı.' },
    { id: 'white', name: 'Beyaz eşya seti', category: 'Beyaz Eşya', estimate: 90000, actual: 0, status: 'Planlandı', priority: 'Yüksek', note: 'Buzdolabı, çamaşır, bulaşık.' },
    { id: 'furniture', name: 'Mobilya temel set', category: 'Mobilya', estimate: 130000, actual: 0, status: 'Planlandı', priority: 'Yüksek', note: 'Salon, yatak odası, çocuk odası.' },
    { id: 'firstmonth', name: 'İlk ay yaşam', category: 'İlk Ay Yaşam', estimate: 70000, actual: 0, status: 'Planlandı', priority: 'Yüksek', note: 'Market, ulaşım, okul hazırlığı.' },
    { id: 'gta', name: 'GTA 6 / PS5 Pro / TV', category: 'GTA 6 Seti', estimate: 95000, actual: 0, status: 'Planlandı', priority: 'Orta', note: '19 Kasım 2026 öncesi hazır.' },
    { id: 'motor', name: 'Sıfır motosiklet', category: 'Yeni Motosiklet', estimate: 130000, actual: 0, status: 'Planlandı', priority: 'Orta', note: 'Eski motor satılıp yenisi alınacak.' },
    { id: 'fun', name: 'Antalya aile eğlence', category: 'Antalya Eğlence', estimate: 30000, actual: 0, status: 'Planlandı', priority: 'Orta', note: 'Aquapark, deniz, aile aktiviteleri.' }
  ],
  notes: [{ id: 'note-1', title: 'Yeni hayat hedefi', body: 'Evimize tatil hayatını taşıyoruz.', category: 'Aile', date: new Date().toISOString() }],
  relocation: { city: 'Antalya', status: 'Planlama', regions: 'Muratpaşa / Lara / Konyaaltı', homeGoal: 'Denize yakın, yeni bina, temiz ev' }
};

const num = (v) => Number(String(v ?? '').replace(/\./g, '').replace(',', '.')) || 0;
const money = (v) => `${Math.round(num(v)).toLocaleString('tr-TR')} TL`;
const uid = () => String(Date.now()) + Math.random().toString(16).slice(2);
const daysLeft = (date) => Math.max(0, Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86400000));
const pct = (a, b) => (!b ? 0 : Math.max(0, Math.min(100, Math.round((a / b) * 100))));

export default function App() {
  const [data, setData] = useState(defaultData);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('panel');
  const [financeMode, setFinanceMode] = useState('income');
  const [finance, setFinance] = useState({ title: '', amount: '', category: 'Günlük kazanç', note: '' });
  const [item, setItem] = useState({ name: '', category: 'Mobilya', estimate: '', actual: '', priority: 'Orta', note: '' });
  const [note, setNote] = useState({ title: '', body: '', category: 'Genel' });
  const [backup, setBackup] = useState('');
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState({});
  const float = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => raw && setData(mergeData(JSON.parse(raw)))).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  useEffect(() => {
    Animated.loop(Animated.parallel([
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1800, useNativeDriver: true })
      ])
    ])).start();
  }, [float, pulse]);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [tab, fade]);

  const t = palette(data.settings.theme);
  const stats = useMemo(() => getStats(data), [data]);
  const save = (next) => setData({ ...next, version: VERSION, updatedAt: new Date().toISOString() });

  function addFinance() {
    if (!finance.title.trim() || !num(finance.amount)) return setMessage('Başlık ve tutar gir.');
    const row = { id: uid(), title: finance.title.trim(), amount: num(finance.amount), category: finance.category || 'Genel', note: finance.note, date: new Date().toISOString() };
    if (financeMode === 'income') save({ ...data, incomes: [row, ...data.incomes] });
    if (financeMode === 'expense') save({ ...data, expenses: [row, ...data.expenses] });
    if (financeMode === 'saving') save({ ...data, savings: [row, ...data.savings] });
    if (financeMode === 'debt') save({ ...data, debts: [{ ...row, paid: 0 }, ...data.debts] });
    setFinance({ title: '', amount: '', category: financeMode === 'income' ? 'Günlük kazanç' : financeMode === 'expense' ? 'Ev gideri' : financeMode === 'saving' ? 'Birikim' : 'Borç', note: '' });
    setMessage('Kayıt eklendi.');
  }

  function addPayment(id) {
    const value = num(payments[id]);
    if (!value) return;
    save({ ...data, debts: data.debts.map((d) => d.id === id ? { ...d, paid: Math.min(num(d.amount), num(d.paid) + value) } : d) });
    setPayments({ ...payments, [id]: '' });
    setMessage('Borç ödemesi işlendi.');
  }

  function remove(key, id) {
    save({ ...data, [key]: data[key].filter((x) => x.id !== id) });
    setMessage('Silindi.');
  }

  function addItem() {
    if (!item.name.trim() || !num(item.estimate)) return setMessage('Ürün adı ve tahmini fiyat gir.');
    save({ ...data, items: [{ id: uid(), ...item, estimate: num(item.estimate), actual: num(item.actual), status: 'Planlandı' }, ...data.items] });
    setItem({ name: '', category: 'Mobilya', estimate: '', actual: '', priority: 'Orta', note: '' });
    setMessage('Ürün eklendi.');
  }

  function setItemStatus(id, status) {
    save({ ...data, items: data.items.map((x) => x.id === id ? { ...x, status } : x) });
  }

  function addNote() {
    if (!note.title.trim() || !note.body.trim()) return setMessage('Not başlığı ve içerik gir.');
    save({ ...data, notes: [{ id: uid(), ...note, date: new Date().toISOString() }, ...data.notes] });
    setNote({ title: '', body: '', category: 'Genel' });
    setMessage('Not eklendi.');
  }

  function makeBackup() {
    setBackup(JSON.stringify({ ...data, version: VERSION, exportedAt: new Date().toISOString() }, null, 2));
    setMessage('Renkli yedek metni hazır.');
  }

  function restoreBackup() {
    try {
      save(mergeData(JSON.parse(backup)));
      setMessage('Yedek geri yüklendi.');
    } catch (e) {
      setMessage('Yedek okunamadı. JSON metnini kontrol et.');
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.status} />
      <LinearGradient colors={t.bgGradient} style={StyleSheet.absoluteFillObject} />
      <Backdrop float={float} pulse={pulse} />
      <Header t={t} />
      <Animated.View style={[styles.flex, { opacity: fade }]}>
        {tab === 'panel' && <Dashboard t={t} data={data} stats={stats} float={float} pulse={pulse} />}
        {tab === 'finans' && <Finance t={t} data={data} mode={financeMode} setMode={setFinanceMode} form={finance} setForm={setFinance} add={addFinance} remove={remove} payments={payments} setPayments={setPayments} addPayment={addPayment} stats={stats} />}
        {tab === 'liste' && <Items t={t} data={data} item={item} setItem={setItem} addItem={addItem} setItemStatus={setItemStatus} remove={remove} stats={stats} />}
        {tab === 'plan' && <Plan t={t} data={data} save={save} note={note} setNote={setNote} addNote={addNote} remove={remove} />}
        {tab === 'ayar' && <Settings t={t} data={data} save={save} backup={backup} setBackup={setBackup} makeBackup={makeBackup} restoreBackup={restoreBackup} reset={() => save(defaultData)} />}
      </Animated.View>
      {!!message && <Pressable onPress={() => setMessage('')} style={styles.toast}><LinearGradient colors={['#6D5BFF', '#00D4FF']} style={styles.toastInner}><Text style={styles.toastText}>{message}</Text></LinearGradient></Pressable>}
      <Nav t={t} tab={tab} setTab={setTab} />
    </SafeAreaView>
  );
}

function mergeData(raw) {
  return {
    ...defaultData,
    ...raw,
    settings: { ...defaultData.settings, ...(raw.settings || {}) },
    relocation: { ...defaultData.relocation, ...(raw.relocation || {}) },
    incomes: Array.isArray(raw.incomes) ? raw.incomes : [],
    expenses: Array.isArray(raw.expenses) ? raw.expenses : [],
    savings: Array.isArray(raw.savings) ? raw.savings : [],
    debts: Array.isArray(raw.debts) ? raw.debts : [],
    items: Array.isArray(raw.items) ? raw.items : defaultData.items,
    notes: Array.isArray(raw.notes) ? raw.notes : defaultData.notes
  };
}

function getStats(data) {
  const income = data.incomes.reduce((s, x) => s + num(x.amount), 0);
  const expense = data.expenses.reduce((s, x) => s + num(x.amount), 0);
  const saving = data.savings.reduce((s, x) => s + num(x.amount), 0);
  const debtTotal = data.debts.reduce((s, x) => s + num(x.amount), 0);
  const debtPaid = data.debts.reduce((s, x) => s + num(x.paid), 0);
  const itemsTotal = data.items.reduce((s, x) => s + num(x.actual || x.estimate), 0);
  const bought = data.items.filter((x) => ['Satın Alındı', 'Kuruldu'].includes(x.status)).length;
  const target = num(data.settings.targetBudget);
  const days = daysLeft(data.settings.targetDate);
  const left = Math.max(0, target - saving);
  return { income, expense, saving, net: income - expense, debtTotal, debtPaid, debtLeft: Math.max(0, debtTotal - debtPaid), debtPct: pct(debtPaid, debtTotal), itemsTotal, bought, target, days, left, progress: pct(saving, target), daily: days ? left / days : left, weekly: days ? (left / days) * 7 : left, monthly: days ? (left / days) * 30 : left };
}

function palette(mode) {
  if (mode === 'light') return { mode, status: 'dark-content', bg: '#F8FAFF', bgGradient: ['#F8FAFF', '#EAF2FF', '#FFF3F8'], text: '#14162A', softText: '#4B5568', muted: '#697386', card: 'rgba(255,255,255,0.82)', cardSolid: '#FFFFFF', line: 'rgba(20,22,42,0.10)', nav: 'rgba(255,255,255,0.86)', primary: '#6D5BFF', cyan: '#00B8FF', pink: '#FF477E', green: '#13C99A', orange: '#FF9F1C', danger: '#EF476F' };
  return { mode, status: 'light-content', bg: '#070719', bgGradient: ['#070719', '#111443', '#20103D'], text: '#FFFFFF', softText: '#DDE6FF', muted: '#AAB6D3', card: 'rgba(255,255,255,0.105)', cardSolid: '#151A3F', line: 'rgba(255,255,255,0.13)', nav: 'rgba(14,18,48,0.88)', primary: '#8A78FF', cyan: '#00D4FF', pink: '#FF477E', green: '#20E3B2', orange: '#FFB703', danger: '#FF5470' };
}

function Backdrop({ float, pulse }) {
  const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -24] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.13] });
  return <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
    <Animated.View style={[styles.blobA, { transform: [{ translateY: y }, { scale }] }]} />
    <Animated.View style={[styles.blobB, { transform: [{ translateY: y }, { scale }] }]} />
    <Animated.View style={[styles.blobC, { transform: [{ translateY: y }] }]} />
  </View>;
}

function Header({ t }) {
  return <View style={styles.header}>
    <View style={styles.brandRow}><LinearGradient colors={['#FF477E', '#6D5BFF', '#00D4FF']} style={styles.logo}><Text style={styles.logoText}>D</Text></LinearGradient><View><Text style={[styles.title, { color: t.text }]}>DraBornLife</Text><Text style={[styles.subtitle, { color: t.muted }]}>Renkli Antalya yaşam kokpiti</Text></View></View>
    <LinearGradient colors={['#20E3B2', '#00D4FF']} style={styles.badge}><Text style={styles.badgeText}>{VERSION}</Text></LinearGradient>
  </View>;
}

function Dashboard({ t, data, stats, float, pulse }) {
  const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <LinearGradient colors={['#FF477E', '#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroColor}>
      <Animated.View style={[styles.sun, { transform: [{ translateY: y }, { scale }] }]} />
      <Animated.View style={[styles.moon, { transform: [{ translateY: y }] }]} />
      <Text style={styles.kicker}>ANTALYA 2026</Text>
      <Text style={styles.heroTitle}>%{stats.progress}</Text>
      <Text style={styles.heroBody}>Yeni hayat yükleniyor. {stats.days} gün kaldı; hedef {money(stats.target)}.</Text>
      <Progress value={stats.progress} />
      <View style={styles.heroGrid}><Mini label="Birikim" value={money(stats.saving)} /><Mini label="Kalan" value={money(stats.left)} /><Mini label="Liste" value={`${stats.bought}/${data.items.length}`} /></View>
    </LinearGradient>
    <View style={styles.quickRow}><ColorStat colors={['#00D4FF', '#4D7CFF']} icon="wallet" label="Net" value={money(stats.net)} /><ColorStat colors={['#20E3B2', '#29FFC6']} icon="calendar-today" label="Günlük" value={money(stats.daily)} /></View>
    <View style={styles.quickRow}><ColorStat colors={['#FFB703', '#FF477E']} icon="calendar-week" label="Haftalık" value={money(stats.weekly)} /><ColorStat colors={['#A855F7', '#6D5BFF']} icon="calendar-month" label="Aylık" value={money(stats.monthly)} /></View>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Bugünkü görev modu</Text><Text style={[styles.body, { color: t.softText }]}>Alınacaklar toplamı {money(stats.itemsTotal)}. Borç kalan {money(stats.debtLeft)}. Taşınma durumu: {data.relocation.status}. Denize yakın yeni ev hedefi aktif.</Text></Glass>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Aile motivasyonu</Text><Text style={[styles.body, { color: t.softText }]}>Kayra için okul, Lara/Konyaaltı sahilleri, aquaparklar, GTA 6 seti ve sıfırdan kurulan ev. Bu uygulama artık taşınma kumanda paneli.</Text></Glass>
  </ScrollView>;
}

function Finance({ t, data, mode, setMode, form, setForm, add, remove, payments, setPayments, addPayment, stats }) {
  const key = mode === 'income' ? 'incomes' : mode === 'expense' ? 'expenses' : mode === 'saving' ? 'savings' : 'debts';
  const active = financeModes.find((m) => m[0] === mode) || financeModes[0];
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ScreenTitle t={t} title="Finans Merkezi" sub="Gelir, gider, birikim, borç" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>{financeModes.map(([id, label, icon, colors]) => <ModeButton key={id} active={mode === id} label={label} icon={icon} colors={colors} onPress={() => setMode(id)} />)}</ScrollView>
    <Glass t={t}>
      <Text style={[styles.cardTitle, { color: t.text }]}>{active[1]} ekle</Text>
      <Input t={t} label={mode === 'debt' ? 'Borç adı' : 'Başlık'} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
      <Input t={t} label={mode === 'debt' ? 'Toplam borç' : 'Tutar'} value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} keyboardType="numeric" />
      <Input t={t} label="Kategori" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} />
      <Input t={t} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} />
      <Primary label="Renkli kaydet" colors={active[3]} onPress={add} />
    </Glass>
    <View style={styles.quickRow}><ColorStat colors={['#00D4FF', '#4D7CFF']} icon="trending-up" label="Gelir" value={money(stats.income)} /><ColorStat colors={['#FF477E', '#FF9F1C']} icon="trending-down" label="Gider" value={money(stats.expense)} /></View>
    <View style={styles.quickRow}><ColorStat colors={['#20E3B2', '#29FFC6']} icon="piggy-bank" label="Birikim" value={money(stats.saving)} /><ColorStat colors={['#A855F7', '#F43F5E']} icon="alert" label="Borç" value={money(stats.debtLeft)} /></View>
    {mode === 'debt' && <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Borç barı</Text><Text style={[styles.body, { color: t.softText }]}>Toplam {money(stats.debtTotal)} • Ödenen {money(stats.debtPaid)} • Kalan {money(stats.debtLeft)}</Text><Progress value={stats.debtPct} /></Glass>}
    {data[key].map((x) => mode === 'debt' ? <DebtCard key={x.id} t={t} debt={x} payments={payments} setPayments={setPayments} addPayment={addPayment} onDelete={() => remove('debts', x.id)} /> : <ListCard key={x.id} t={t} title={x.title} sub={`${x.category} • ${new Date(x.date).toLocaleDateString('tr-TR')}`} value={money(x.amount)} note={x.note} onDelete={() => remove(key, x.id)} />)}
  </ScrollView>;
}

function DebtCard({ t, debt, payments, setPayments, addPayment, onDelete }) {
  const done = pct(num(debt.paid), num(debt.amount));
  return <Glass t={t}><View style={styles.listTop}><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{debt.title}</Text><Text style={[styles.listSub, { color: t.muted }]}>Kalan {money(num(debt.amount) - num(debt.paid))} • %{done}</Text></View><Text style={[styles.amount, { color: t.text }]}>{money(debt.amount)}</Text></View><Progress value={done} /><Input t={t} label="Ödeme ekle" value={payments[debt.id] || ''} keyboardType="numeric" onChangeText={(v) => setPayments({ ...payments, [debt.id]: v })} /><View style={styles.actions}><SmallButton label="Ödeme işle" colors={['#20E3B2', '#00D4FF']} onPress={() => addPayment(debt.id)} /><Pressable onPress={onDelete}><Text style={[styles.delete, { color: t.danger }]}>Sil</Text></Pressable></View></Glass>;
}

function Items({ t, data, item, setItem, addItem, setItemStatus, remove, stats }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ScreenTitle t={t} title="Alınacaklar Galaksisi" sub="Ev kurulum, GTA 6 seti, motosiklet" />
    <Glass t={t}><Input t={t} label="Ürün adı" value={item.name} onChangeText={(v) => setItem({ ...item, name: v })} /><Input t={t} label="Kategori" value={item.category} onChangeText={(v) => setItem({ ...item, category: v })} /><Input t={t} label="Tahmini fiyat" value={item.estimate} keyboardType="numeric" onChangeText={(v) => setItem({ ...item, estimate: v })} /><Input t={t} label="Gerçek fiyat" value={item.actual} keyboardType="numeric" onChangeText={(v) => setItem({ ...item, actual: v })} /><Input t={t} label="Öncelik" value={item.priority} onChangeText={(v) => setItem({ ...item, priority: v })} /><Input t={t} label="Not" value={item.note} onChangeText={(v) => setItem({ ...item, note: v })} /><Primary label="Listeye ışınla" colors={['#FF477E', '#6D5BFF', '#00D4FF']} onPress={addItem} /></Glass>
    <View style={styles.quickRow}><ColorStat colors={['#FFB703', '#FF477E']} icon="calculator" label="Toplam" value={money(stats.itemsTotal)} /><ColorStat colors={['#20E3B2', '#00D4FF']} icon="check-decagram" label="Biten" value={`${stats.bought}/${data.items.length}`} /></View>
    {data.items.map((x, index) => <ItemCard key={x.id} t={t} item={x} index={index} setStatus={(s) => setItemStatus(x.id, s)} onDelete={() => remove('items', x.id)} />)}
  </ScrollView>;
}

function ItemCard({ t, item, index, setStatus, onDelete }) {
  const colors = [['#FF477E', '#FFB703'], ['#6D5BFF', '#00D4FF'], ['#20E3B2', '#00D4FF'], ['#A855F7', '#F43F5E']][index % 4];
  return <Glass t={t}><View style={styles.listTop}><LinearGradient colors={colors} style={styles.itemIcon}><MaterialCommunityIcons name={item.category.includes('Motor') ? 'motorbike' : item.category.includes('GTA') ? 'gamepad-variant' : item.category.includes('Beyaz') ? 'washing-machine' : 'home-heart'} size={23} color="white" /></LinearGradient><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{item.name}</Text><Text style={[styles.listSub, { color: t.muted }]}>{item.category} • {item.priority}</Text><Text style={[styles.body, { color: t.softText }]}>{item.note}</Text></View><Text style={[styles.amount, { color: t.text }]}>{money(item.actual || item.estimate)}</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{statuses.map((s) => <Pill key={s} t={t} active={item.status === s} label={s} onPress={() => setStatus(s)} />)}</ScrollView><Pressable onPress={onDelete}><Text style={[styles.delete, { color: t.danger }]}>Sil</Text></Pressable></Glass>;
}

function Plan({ t, data, save, note, setNote, addNote, remove }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ScreenTitle t={t} title="Antalya Rotası" sub="Yeni ev, aile ve motivasyon" />
    <LinearGradient colors={['#00D4FF', '#20E3B2', '#FFB703']} style={styles.routeCard}><Text style={styles.routeTitle}>Muratpaşa • Lara • Konyaaltı</Text><Text style={styles.routeBody}>Denize yakın, yeni bina, temiz ev. Antakya’dan nakliye yok; birkaç valizle gidilecek ve eşyalar Antalya’dan sıfır alınacak.</Text></LinearGradient>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Taşınma durumu</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{moveStatuses.map((s) => <Pill key={s} t={t} active={data.relocation.status === s} label={s} onPress={() => save({ ...data, relocation: { ...data.relocation, status: s } })} />)}</ScrollView></Glass>
    <View style={styles.quickRow}><ColorStat colors={['#A855F7', '#6D5BFF']} icon="motorbike" label="Motor" value={money(data.settings.motorcycleTarget)} /><ColorStat colors={['#FF477E', '#FFB703']} icon="gamepad-variant" label="GTA 6" value="19 Kasım" /></View>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Renkli not ekle</Text><Input t={t} label="Başlık" value={note.title} onChangeText={(v) => setNote({ ...note, title: v })} /><Input t={t} label="Kategori" value={note.category} onChangeText={(v) => setNote({ ...note, category: v })} /><Input t={t} label="Not" value={note.body} onChangeText={(v) => setNote({ ...note, body: v })} multiline /><Primary label="Notu kaydet" colors={['#20E3B2', '#00D4FF']} onPress={addNote} /></Glass>
    {data.notes.map((x) => <Glass key={x.id} t={t}><Text style={[styles.listTitle, { color: t.text }]}>{x.title}</Text><Text style={[styles.listSub, { color: t.muted }]}>{x.category} • {new Date(x.date).toLocaleDateString('tr-TR')}</Text><Text style={[styles.body, { color: t.softText }]}>{x.body}</Text><Pressable onPress={() => remove('notes', x.id)}><Text style={[styles.delete, { color: t.danger }]}>Sil</Text></Pressable></Glass>)}
  </ScrollView>;
}

function Settings({ t, data, save, backup, setBackup, makeBackup, restoreBackup, reset }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ScreenTitle t={t} title="Kontrol Odası" sub="Tema, hedef, yedekleme" />
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Tema modu</Text><View style={styles.themeGrid}><ThemeButton label="Color" active={data.settings.theme === 'color'} colors={['#FF477E', '#6D5BFF', '#00D4FF']} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'color' } })} /><ThemeButton label="Light" active={data.settings.theme === 'light'} colors={['#FFFFFF', '#EAF2FF']} darkText onPress={() => save({ ...data, settings: { ...data.settings, theme: 'light' } })} /></View></Glass>
    <Glass t={t}><Input t={t} label="Toplam hedef bütçe" value={String(data.settings.targetBudget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetBudget: num(v) } })} /><Input t={t} label="Hedef tarih" value={data.settings.targetDate} onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetDate: v } })} /><Input t={t} label="Motosiklet hedef fiyatı" value={String(data.settings.motorcycleTarget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, motorcycleTarget: num(v) } })} /></Glass>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Yedekleme</Text><Text style={[styles.body, { color: t.softText }]}>JSON metniyle dışa aktar / içe aktar. v0.1 Expo Go test; APK hedefi v1.0.</Text><Primary label="Yedek oluştur" colors={['#6D5BFF', '#00D4FF']} onPress={makeBackup} /><Input t={t} label="Yedek JSON" value={backup} onChangeText={setBackup} multiline /><Primary label="Geri yükle" colors={['#20E3B2', '#00D4FF']} onPress={restoreBackup} /></Glass>
    <Glass t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Tehlikeli alan</Text><Text style={[styles.body, { color: t.softText }]}>Tüm test verilerini sıfırlar.</Text><Pressable onPress={reset}><Text style={[styles.delete, { color: t.danger }]}>Verileri sıfırla</Text></Pressable></Glass>
  </ScrollView>;
}

function ScreenTitle({ t, title, sub }) { return <View style={styles.screenTitle}><Text style={[styles.sectionTitle, { color: t.text }]}>{title}</Text><Text style={[styles.subtitle, { color: t.muted }]}>{sub}</Text></View>; }
function Glass({ t, children }) { return <View style={[styles.glass, { backgroundColor: t.card, borderColor: t.line }]}>{children}</View>; }
function Mini({ label, value }) { return <View><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>; }
function Progress({ value }) { return <View style={styles.track}><LinearGradient colors={['#20E3B2', '#00D4FF', '#FFB703', '#FF477E']} style={[styles.fill, { width: `${Math.max(4, value)}%` }]} /></View>; }
function Pill({ t, label, active, onPress }) { return <Pressable onPress={onPress} style={[styles.pill, { borderColor: active ? t.cyan : t.line, backgroundColor: active ? 'rgba(0,212,255,0.18)' : 'rgba(255,255,255,0.04)' }]}><Text style={[styles.pillText, { color: active ? t.cyan : t.muted }]}>{label}</Text></Pressable>; }
function Input({ t, label, multiline, ...props }) { return <View style={styles.field}><Text style={[styles.label, { color: t.muted }]}>{label}</Text><TextInput placeholderTextColor="#8E9AC0" style={[styles.input, multiline && styles.multi, { color: t.text, borderColor: t.line, backgroundColor: t.mode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.07)' }]} multiline={multiline} {...props} /></View>; }
function Primary({ label, colors, onPress }) { return <Pressable onPress={onPress} style={styles.primary}><LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryInner}><Text style={styles.primaryText}>{label}</Text></LinearGradient></Pressable>; }
function SmallButton({ label, colors, onPress }) { return <Pressable onPress={onPress} style={styles.smallButtonWrap}><LinearGradient colors={colors} style={styles.smallButton}><Text style={styles.primaryText}>{label}</Text></LinearGradient></Pressable>; }
function ColorStat({ colors, icon, label, value }) { return <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.colorStat}><View style={styles.colorIcon}><MaterialCommunityIcons name={icon} size={22} color="white" /></View><Text style={styles.colorValue}>{value}</Text><Text style={styles.colorLabel}>{label}</Text></LinearGradient>; }
function ModeButton({ active, label, icon, colors, onPress }) { return <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeActive]}><LinearGradient colors={active ? colors : ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.06)']} style={styles.modeGradient}><MaterialCommunityIcons name={icon} size={22} color="white" /><Text style={styles.modeText}>{label}</Text></LinearGradient></Pressable>; }
function ThemeButton({ label, active, colors, onPress, darkText }) { return <Pressable onPress={onPress} style={[styles.themeButton, active && styles.themeActive]}><LinearGradient colors={colors} style={styles.themeInner}><Text style={[styles.themeText, darkText && { color: '#14162A' }]}>{label}</Text></LinearGradient></Pressable>; }
function ListCard({ t, title, sub, value, note, onDelete }) { return <Glass t={t}><View style={styles.listTop}><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{title}</Text><Text style={[styles.listSub, { color: t.muted }]}>{sub}</Text></View><Text style={[styles.amount, { color: t.text }]}>{value}</Text></View>{!!note && <Text style={[styles.body, { color: t.softText }]}>{note}</Text>}<Pressable onPress={onDelete}><Text style={[styles.delete, { color: t.danger }]}>Sil</Text></Pressable></Glass>; }
function Nav({ t, tab, setTab }) { const items = [['panel', 'Panel', 'home-variant'], ['finans', 'Finans', 'wallet'], ['liste', 'Liste', 'cart'], ['plan', 'Plan', 'map-marker-path'], ['ayar', 'Ayar', 'cog']]; return <View style={[styles.nav, { backgroundColor: t.nav, borderColor: t.line }]}>{items.map(([id, label, icon]) => <Pressable key={id} onPress={() => setTab(id)} style={styles.navItem}>{tab === id ? <LinearGradient colors={['#FF477E', '#6D5BFF', '#00D4FF']} style={styles.navActive}><MaterialCommunityIcons name={icon} size={22} color="white" /></LinearGradient> : <MaterialCommunityIcons name={icon} size={23} color={t.muted} />}<Text style={[styles.navText, { color: tab === id ? t.text : t.muted }]}>{label}</Text></Pressable>)}</View>; }

const styles = StyleSheet.create({
  safe: { flex: 1 }, flex: { flex: 1 }, blobA: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,71,126,0.24)', top: -90, right: -90 }, blobB: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(0,212,255,0.20)', top: 260, left: -120 }, blobC: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(32,227,178,0.16)', bottom: 80, right: -80 }, header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 46, height: 46, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, logoText: { color: 'white', fontSize: 23, fontWeight: '900' }, title: { fontSize: 28, fontWeight: '900', letterSpacing: -1 }, subtitle: { fontSize: 12, fontWeight: '800', marginTop: 3 }, badge: { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 }, badgeText: { color: 'white', fontWeight: '900' }, scroll: { padding: 18, paddingBottom: 120 }, heroColor: { borderRadius: 34, padding: 22, marginBottom: 16, overflow: 'hidden' }, sun: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.17)', right: -42, top: -42 }, moon: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.13)', left: -25, bottom: -20 }, kicker: { color: 'rgba(255,255,255,0.9)', fontWeight: '900', letterSpacing: 1.2 }, heroTitle: { color: 'white', fontSize: 58, fontWeight: '900', letterSpacing: -2.2, marginTop: 6 }, heroBody: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 22, fontWeight: '800', marginTop: 4 }, track: { height: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 18 }, fill: { height: '100%', borderRadius: 99 }, heroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }, miniLabel: { color: 'rgba(255,255,255,0.74)', fontSize: 12, fontWeight: '900' }, miniValue: { color: 'white', fontSize: 15, fontWeight: '900', marginTop: 4 }, quickRow: { flexDirection: 'row', gap: 10, marginBottom: 10 }, colorStat: { flex: 1, minHeight: 136, borderRadius: 28, padding: 15, overflow: 'hidden' }, colorIcon: { width: 42, height: 42, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.20)', alignItems: 'center', justifyContent: 'center' }, colorValue: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 14 }, colorLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: '900', marginTop: 4 }, glass: { borderWidth: 1, borderRadius: 28, padding: 16, marginBottom: 12 }, cardTitle: { fontSize: 18, fontWeight: '900' }, body: { fontSize: 14, lineHeight: 21, fontWeight: '750', marginTop: 8 }, screenTitle: { marginTop: 6, marginBottom: 12 }, sectionTitle: { fontSize: 27, fontWeight: '900', letterSpacing: -0.8 }, modeRow: { gap: 10, paddingBottom: 12 }, modeButton: { borderRadius: 22, overflow: 'hidden' }, modeActive: { transform: [{ scale: 1.02 }] }, modeGradient: { minWidth: 102, height: 74, borderRadius: 22, padding: 13, justifyContent: 'space-between' }, modeText: { color: 'white', fontSize: 13, fontWeight: '900' }, field: { marginTop: 10 }, label: { fontSize: 12, fontWeight: '900', marginBottom: 7 }, input: { minHeight: 52, borderRadius: 19, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontWeight: '800' }, multi: { minHeight: 132, textAlignVertical: 'top', paddingTop: 12 }, primary: { marginTop: 14, borderRadius: 21, overflow: 'hidden' }, primaryInner: { height: 54, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: 'white', fontSize: 14, fontWeight: '900' }, smallButtonWrap: { marginTop: 12, borderRadius: 16, overflow: 'hidden' }, smallButton: { height: 44, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }, listTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, listTitle: { fontSize: 16, fontWeight: '900' }, listSub: { fontSize: 12, fontWeight: '800', marginTop: 4 }, amount: { fontSize: 15, fontWeight: '900' }, actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, delete: { fontSize: 13, fontWeight: '900', marginTop: 12 }, flex: { flex: 1 }, itemIcon: { width: 46, height: 46, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, row: { flexDirection: 'row', gap: 8, paddingVertical: 10 }, pill: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 99, borderWidth: 1 }, pillText: { fontSize: 12, fontWeight: '900' }, routeCard: { borderRadius: 30, padding: 18, marginBottom: 12 }, routeTitle: { color: 'white', fontSize: 22, fontWeight: '900' }, routeBody: { color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 21, fontWeight: '800', marginTop: 8 }, themeGrid: { flexDirection: 'row', gap: 10, marginTop: 12 }, themeButton: { flex: 1, height: 70, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' }, themeActive: { borderColor: '#00D4FF' }, themeInner: { flex: 1, alignItems: 'center', justifyContent: 'center' }, themeText: { color: 'white', fontWeight: '900', fontSize: 16 }, nav: { position: 'absolute', left: 14, right: 14, bottom: 14, height: 78, borderRadius: 30, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navActive: { width: 42, height: 34, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, navText: { fontSize: 10.5, fontWeight: '900', marginTop: 4 }, toast: { position: 'absolute', left: 18, right: 18, bottom: 102, borderRadius: 20, overflow: 'hidden' }, toastInner: { padding: 14 }, toastText: { color: 'white', fontWeight: '900', textAlign: 'center' }
});
