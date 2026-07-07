import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KEY = 'drabornlife-v01-final';
const VERSION = 'v0.1';
const statuses = ['Planlandı', 'Parası Birikti', 'Satın Alındı', 'Kuruldu', 'Vazgeçildi'];
const moveStatuses = ['Planlama', 'Para birikiyor', 'Ev araştırması başladı', 'Ev tutuldu', 'Eşyalar alınıyor', 'Kurulum başladı', 'Antalya’ya taşınıldı'];
const modes = [
  ['income', 'Gelir', 'trending-up'],
  ['expense', 'Gider', 'trending-down'],
  ['saving', 'Birikim', 'piggy-bank'],
  ['debt', 'Borç', 'alert-circle']
];

const defaultData = {
  settings: { targetBudget: 650000, targetDate: '2026-10-31', motorcycleTarget: 130000, theme: 'dark' },
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

const n = (v) => Number(String(v ?? '').replace(/\./g, '').replace(',', '.')) || 0;
const money = (v) => `${Math.round(n(v)).toLocaleString('tr-TR')} TL`;
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
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setData(mergeData(JSON.parse(raw)));
    }).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2400, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 2400, useNativeDriver: true })
    ])).start();
  }, [float]);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [tab, fade]);

  const dark = data.settings.theme === 'dark';
  const t = theme(dark);
  const stats = useMemo(() => getStats(data), [data]);
  const save = (next) => setData({ ...next, version: VERSION, updatedAt: new Date().toISOString() });

  function addFinance() {
    if (!finance.title.trim() || !n(finance.amount)) return setMessage('Başlık ve tutar gir.');
    const row = { id: uid(), title: finance.title.trim(), amount: n(finance.amount), category: finance.category || 'Genel', note: finance.note, date: new Date().toISOString() };
    if (financeMode === 'income') save({ ...data, incomes: [row, ...data.incomes] });
    if (financeMode === 'expense') save({ ...data, expenses: [row, ...data.expenses] });
    if (financeMode === 'saving') save({ ...data, savings: [row, ...data.savings] });
    if (financeMode === 'debt') save({ ...data, debts: [{ ...row, paid: 0 }, ...data.debts] });
    setFinance({ title: '', amount: '', category: financeMode === 'income' ? 'Günlük kazanç' : financeMode === 'expense' ? 'Ev gideri' : financeMode === 'saving' ? 'Birikim' : 'Borç', note: '' });
    setMessage('Kayıt eklendi.');
  }

  function addPayment(id) {
    const value = n(payments[id]);
    if (!value) return;
    save({ ...data, debts: data.debts.map((d) => d.id === id ? { ...d, paid: Math.min(n(d.amount), n(d.paid) + value) } : d) });
    setPayments({ ...payments, [id]: '' });
    setMessage('Borç ödemesi işlendi.');
  }

  function remove(key, id) {
    save({ ...data, [key]: data[key].filter((x) => x.id !== id) });
    setMessage('Kayıt silindi.');
  }

  function addItem() {
    if (!item.name.trim() || !n(item.estimate)) return setMessage('Ürün adı ve tahmini fiyat gir.');
    save({ ...data, items: [{ id: uid(), ...item, estimate: n(item.estimate), actual: n(item.actual), status: 'Planlandı' }, ...data.items] });
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
    setMessage('Yedek metni oluşturuldu.');
  }

  function restoreBackup() {
    try {
      const parsed = JSON.parse(backup);
      save(mergeData(parsed));
      setMessage('Yedek geri yüklendi.');
    } catch (e) {
      setMessage('Yedek okunamadı. JSON metnini kontrol et.');
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={dark ? ['#070A16', '#101735'] : ['#F5F7FF', '#EAF3FF']} style={StyleSheet.absoluteFillObject} />
      <Header t={t} />
      <Animated.View style={[styles.flex, { opacity: fade }]}>
        {tab === 'panel' && <Dashboard t={t} data={data} stats={stats} float={float} />}
        {tab === 'finans' && <Finance t={t} data={data} mode={financeMode} setMode={setFinanceMode} form={finance} setForm={setFinance} add={addFinance} remove={remove} payments={payments} setPayments={setPayments} addPayment={addPayment} stats={stats} />}
        {tab === 'liste' && <Items t={t} data={data} item={item} setItem={setItem} addItem={addItem} setItemStatus={setItemStatus} remove={remove} stats={stats} />}
        {tab === 'plan' && <Plan t={t} data={data} save={save} note={note} setNote={setNote} addNote={addNote} remove={remove} />}
        {tab === 'ayar' && <Settings t={t} data={data} save={save} backup={backup} setBackup={setBackup} makeBackup={makeBackup} restoreBackup={restoreBackup} reset={() => save(defaultData)} />}
      </Animated.View>
      {!!message && <Pressable onPress={() => setMessage('')} style={[styles.toast, { backgroundColor: t.toast }]}><Text style={styles.toastText}>{message}</Text></Pressable>}
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
  const income = data.incomes.reduce((s, x) => s + n(x.amount), 0);
  const expense = data.expenses.reduce((s, x) => s + n(x.amount), 0);
  const saving = data.savings.reduce((s, x) => s + n(x.amount), 0);
  const debtTotal = data.debts.reduce((s, x) => s + n(x.amount), 0);
  const debtPaid = data.debts.reduce((s, x) => s + n(x.paid), 0);
  const itemsTotal = data.items.reduce((s, x) => s + n(x.actual || x.estimate), 0);
  const bought = data.items.filter((x) => ['Satın Alındı', 'Kuruldu'].includes(x.status)).length;
  const target = n(data.settings.targetBudget);
  const days = daysLeft(data.settings.targetDate);
  const left = Math.max(0, target - saving);
  return { income, expense, saving, net: income - expense, debtTotal, debtPaid, debtLeft: Math.max(0, debtTotal - debtPaid), debtPct: pct(debtPaid, debtTotal), itemsTotal, bought, target, days, left, progress: pct(saving, target), daily: days ? left / days : left, weekly: days ? (left / days) * 7 : left, monthly: days ? (left / days) * 30 : left };
}

function theme(dark) {
  return dark ? { bg: '#070A16', card: 'rgba(18,23,43,0.90)', card2: '#12172B', text: '#F8FAFF', muted: '#A9B1C7', line: 'rgba(255,255,255,0.10)', primary: '#8A78FF', blue: '#36C2FF', green: '#28D39B', red: '#FB5470', toast: '#20284B' } : { bg: '#F5F7FF', card: 'rgba(255,255,255,0.94)', card2: '#FFFFFF', text: '#151829', muted: '#687083', line: 'rgba(15,23,42,0.10)', primary: '#6D5BFF', blue: '#13B8FF', green: '#18B985', red: '#EF476F', toast: '#20284B' };
}

function Header({ t }) {
  return <View style={styles.header}><View><Text style={[styles.title, { color: t.text }]}>DraBornLife</Text><Text style={[styles.subtitle, { color: t.muted }]}>Antalya yeni hayat kontrol merkezi</Text></View><LinearGradient colors={['#6D5BFF', '#13B8FF']} style={styles.badge}><Text style={styles.badgeText}>{VERSION}</Text></LinearGradient></View>;
}

function Dashboard({ t, data, stats, float }) {
  const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <LinearGradient colors={['#1A2050', '#111833']} style={styles.hero}>
      <Animated.View style={[styles.orb, { transform: [{ translateY: y }] }]} />
      <Animated.View style={[styles.orbTwo, { transform: [{ translateY: y }] }]} />
      <Text style={styles.kicker}>ANTALYA HEDEFİ</Text>
      <Text style={styles.heroTitle}>{stats.progress}% tamamlandı</Text>
      <Text style={styles.heroBody}>Ekim sonu 2026’ya {stats.days} gün kaldı. GTA 6 çıkmadan önce yeni ev hazır modu.</Text>
      <Progress t={t} value={stats.progress} />
      <View style={styles.heroGrid}><Mini label="Hedef" value={money(stats.target)} /><Mini label="Birikim" value={money(stats.saving)} /><Mini label="Kalan" value={money(stats.left)} /></View>
    </LinearGradient>
    <View style={styles.grid}><Stat t={t} icon="wallet" label="Net durum" value={money(stats.net)} /><Stat t={t} icon="calendar-today" label="Günlük gerek" value={money(stats.daily)} /><Stat t={t} icon="calendar-week" label="Haftalık gerek" value={money(stats.weekly)} /><Stat t={t} icon="calendar-month" label="Aylık gerek" value={money(stats.monthly)} /></View>
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Bugünkü durum</Text><Text style={[styles.body, { color: t.muted }]}>Alınacaklar toplamı {money(stats.itemsTotal)}. Borç kalan {money(stats.debtLeft)}. Liste ilerlemesi {stats.bought}/{data.items.length}. Taşınma durumu: {data.relocation.status}.</Text></Card>
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Aile motivasyonu</Text><Text style={[styles.body, { color: t.muted }]}>Denize yakın ev, yeni eşyalar, Kayra için okul planı, aquaparklar ve Antalya’da yepyeni yaşam. Evimize tatil hayatını taşıyoruz.</Text></Card>
  </ScrollView>;
}

function Finance({ t, data, mode, setMode, form, setForm, add, remove, payments, setPayments, addPayment, stats }) {
  const key = mode === 'income' ? 'incomes' : mode === 'expense' ? 'expenses' : mode === 'saving' ? 'savings' : 'debts';
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Section t={t} title="Finans" sub="Gelir, gider, birikim ve borç barı" />
    <Row>{modes.map(([id, label]) => <Chip key={id} t={t} active={mode === id} label={label} onPress={() => setMode(id)} />)}</Row>
    <Card t={t}>
      <Input t={t} label={mode === 'debt' ? 'Borç adı' : 'Başlık'} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
      <Input t={t} label={mode === 'debt' ? 'Toplam borç' : 'Tutar'} value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} keyboardType="numeric" />
      <Input t={t} label="Kategori" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} />
      <Input t={t} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} />
      <Primary label="Kaydet" onPress={add} />
    </Card>
    <View style={styles.grid}><Stat t={t} icon="trending-up" label="Gelir" value={money(stats.income)} /><Stat t={t} icon="trending-down" label="Gider" value={money(stats.expense)} /><Stat t={t} icon="piggy-bank" label="Birikim" value={money(stats.saving)} /><Stat t={t} icon="alert" label="Kalan borç" value={money(stats.debtLeft)} /></View>
    {mode === 'debt' && <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Borç barı</Text><Text style={[styles.body, { color: t.muted }]}>Toplam: {money(stats.debtTotal)} • Ödenen: {money(stats.debtPaid)} • Kalan: {money(stats.debtLeft)}</Text><Progress t={t} value={stats.debtPct} /></Card>}
    {data[key].map((x) => mode === 'debt' ? <DebtCard key={x.id} t={t} debt={x} payments={payments} setPayments={setPayments} addPayment={addPayment} onDelete={() => remove('debts', x.id)} /> : <ListCard key={x.id} t={t} title={x.title} sub={`${x.category} • ${new Date(x.date).toLocaleDateString('tr-TR')}`} value={money(x.amount)} note={x.note} onDelete={() => remove(key, x.id)} />)}
  </ScrollView>;
}

function DebtCard({ t, debt, payments, setPayments, addPayment, onDelete }) {
  const done = pct(n(debt.paid), n(debt.amount));
  return <Card t={t}><View style={styles.listTop}><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{debt.title}</Text><Text style={[styles.listSub, { color: t.muted }]}>Kalan {money(n(debt.amount) - n(debt.paid))} • %{done}</Text></View><Text style={[styles.amount, { color: t.text }]}>{money(debt.amount)}</Text></View><Progress t={t} value={done} /><Input t={t} label="Ödeme ekle" value={payments[debt.id] || ''} keyboardType="numeric" onChangeText={(v) => setPayments({ ...payments, [debt.id]: v })} /><View style={styles.actions}><SmallButton label="Ödeme işle" onPress={() => addPayment(debt.id)} /><Pressable onPress={onDelete}><Text style={[styles.delete, { color: t.red }]}>Sil</Text></Pressable></View></Card>;
}

function Items({ t, data, item, setItem, addItem, setItemStatus, remove, stats }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Section t={t} title="Alınacaklar" sub="Sıfırdan ev kurulum listesi" />
    <Card t={t}><Input t={t} label="Ürün adı" value={item.name} onChangeText={(v) => setItem({ ...item, name: v })} /><Input t={t} label="Kategori" value={item.category} onChangeText={(v) => setItem({ ...item, category: v })} /><Input t={t} label="Tahmini fiyat" value={item.estimate} keyboardType="numeric" onChangeText={(v) => setItem({ ...item, estimate: v })} /><Input t={t} label="Gerçek fiyat" value={item.actual} keyboardType="numeric" onChangeText={(v) => setItem({ ...item, actual: v })} /><Input t={t} label="Öncelik" value={item.priority} onChangeText={(v) => setItem({ ...item, priority: v })} /><Input t={t} label="Not" value={item.note} onChangeText={(v) => setItem({ ...item, note: v })} /><Primary label="Ürün ekle" onPress={addItem} /></Card>
    <View style={styles.grid}><Stat t={t} icon="calculator" label="Liste toplamı" value={money(stats.itemsTotal)} /><Stat t={t} icon="check-decagram" label="Tamamlanan" value={`${stats.bought}/${data.items.length}`} /></View>
    {data.items.map((x) => <Card key={x.id} t={t}><View style={styles.listTop}><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{x.name}</Text><Text style={[styles.listSub, { color: t.muted }]}>{x.category} • {x.priority} • {x.note}</Text></View><Text style={[styles.amount, { color: t.text }]}>{money(x.actual || x.estimate)}</Text></View><Row>{statuses.map((s) => <Chip key={s} t={t} active={x.status === s} label={s} onPress={() => setItemStatus(x.id, s)} />)}</Row><Pressable onPress={() => remove('items', x.id)}><Text style={[styles.delete, { color: t.red }]}>Sil</Text></Pressable></Card>)}
  </ScrollView>;
}

function Plan({ t, data, save, note, setNote, addNote, remove }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Section t={t} title="Antalya planı" sub="Ev, bölge, aile ve motivasyon" />
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Taşınma hedefi</Text><Text style={[styles.body, { color: t.muted }]}>Şehir: {data.relocation.city}. Bölgeler: {data.relocation.regions}. Hedef: {data.relocation.homeGoal}. Antakya’dan nakliye yok; birkaç valizle gidilecek, eşyalar Antalya’dan sıfır alınacak.</Text><Row>{moveStatuses.map((s) => <Chip key={s} t={t} active={data.relocation.status === s} label={s} onPress={() => save({ ...data, relocation: { ...data.relocation, status: s } })} />)}</Row></Card>
    <View style={styles.grid}><Stat t={t} icon="motorbike" label="Motor hedefi" value={money(data.settings.motorcycleTarget)} /><Stat t={t} icon="gamepad-variant" label="GTA 6 tarihi" value="19 Kasım" /></View>
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Not ekle</Text><Input t={t} label="Başlık" value={note.title} onChangeText={(v) => setNote({ ...note, title: v })} /><Input t={t} label="Kategori" value={note.category} onChangeText={(v) => setNote({ ...note, category: v })} /><Input t={t} label="Not" value={note.body} onChangeText={(v) => setNote({ ...note, body: v })} multiline /><Primary label="Notu kaydet" onPress={addNote} /></Card>
    {data.notes.map((x) => <Card key={x.id} t={t}><Text style={[styles.listTitle, { color: t.text }]}>{x.title}</Text><Text style={[styles.listSub, { color: t.muted }]}>{x.category} • {new Date(x.date).toLocaleDateString('tr-TR')}</Text><Text style={[styles.body, { color: t.muted }]}>{x.body}</Text><Pressable onPress={() => remove('notes', x.id)}><Text style={[styles.delete, { color: t.red }]}>Sil</Text></Pressable></Card>)}
  </ScrollView>;
}

function Settings({ t, data, save, backup, setBackup, makeBackup, restoreBackup, reset }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Section t={t} title="Ayarlar" sub="Tema, hedef, yedekleme" />
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Tema</Text><Row><Chip t={t} label="Dark" active={data.settings.theme === 'dark'} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'dark' } })} /><Chip t={t} label="Light" active={data.settings.theme === 'light'} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'light' } })} /></Row></Card>
    <Card t={t}><Input t={t} label="Toplam hedef bütçe" value={String(data.settings.targetBudget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetBudget: n(v) } })} /><Input t={t} label="Hedef tarih" value={data.settings.targetDate} onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetDate: v } })} /><Input t={t} label="Motosiklet hedef fiyatı" value={String(data.settings.motorcycleTarget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, motorcycleTarget: n(v) } })} /></Card>
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Yedekleme</Text><Text style={[styles.body, { color: t.muted }]}>Manuel dışa aktarma ve içe aktarma JSON metni ile yapılır. v0.1 cihaz içi kayıt kullanır; APK hedefi v1.0.</Text><Primary label="Yedek oluştur" onPress={makeBackup} /><Input t={t} label="Yedek JSON" value={backup} onChangeText={setBackup} multiline /><Primary label="Geri yükle" onPress={restoreBackup} /></Card>
    <Card t={t}><Text style={[styles.cardTitle, { color: t.text }]}>Tehlikeli alan</Text><Text style={[styles.body, { color: t.muted }]}>Tüm test verilerini sıfırlar.</Text><Pressable onPress={reset}><Text style={[styles.delete, { color: t.red }]}>Verileri sıfırla</Text></Pressable></Card>
  </ScrollView>;
}

function Card({ t, children }) { return <View style={[styles.card, { backgroundColor: t.card, borderColor: t.line }]}>{children}</View>; }
function Section({ t, title, sub }) { return <View style={styles.section}><Text style={[styles.sectionTitle, { color: t.text }]}>{title}</Text><Text style={[styles.subtitle, { color: t.muted }]}>{sub}</Text></View>; }
function Row({ children }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{children}</ScrollView>; }
function Mini({ label, value }) { return <View><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>; }
function Progress({ t, value }) { return <View style={[styles.track, { backgroundColor: t.line }]}><LinearGradient colors={['#6D5BFF', '#13B8FF', '#22CFA0']} style={[styles.fill, { width: `${Math.max(3, value)}%` }]} /></View>; }
function Chip({ t, label, active, onPress }) { return <Pressable onPress={onPress} style={[styles.chip, { borderColor: active ? t.primary : t.line, backgroundColor: active ? `${t.primary}24` : 'transparent' }]}><Text style={[styles.chipText, { color: active ? t.primary : t.muted }]}>{label}</Text></Pressable>; }
function Input({ t, label, multiline, ...props }) { return <View style={styles.field}><Text style={[styles.label, { color: t.muted }]}>{label}</Text><TextInput placeholderTextColor="#818AA6" style={[styles.input, multiline && styles.multi, { color: t.text, borderColor: t.line, backgroundColor: t.card2 }]} multiline={multiline} {...props} /></View>; }
function Primary({ label, onPress }) { return <Pressable onPress={onPress} style={styles.primary}><LinearGradient colors={['#6D5BFF', '#13B8FF', '#22CFA0']} style={styles.primaryInner}><Text style={styles.primaryText}>{label}</Text></LinearGradient></Pressable>; }
function SmallButton({ label, onPress }) { return <Pressable onPress={onPress} style={styles.smallButton}><Text style={styles.primaryText}>{label}</Text></Pressable>; }
function Stat({ t, icon, label, value }) { return <View style={[styles.stat, { backgroundColor: t.card, borderColor: t.line }]}><View style={styles.icon}><MaterialCommunityIcons name={icon} size={22} color="white" /></View><Text style={[styles.statValue, { color: t.text }]}>{value}</Text><Text style={[styles.statLabel, { color: t.muted }]}>{label}</Text></View>; }
function ListCard({ t, title, sub, value, note, onDelete }) { return <Card t={t}><View style={styles.listTop}><View style={styles.flex}><Text style={[styles.listTitle, { color: t.text }]}>{title}</Text><Text style={[styles.listSub, { color: t.muted }]}>{sub}</Text></View><Text style={[styles.amount, { color: t.text }]}>{value}</Text></View>{!!note && <Text style={[styles.body, { color: t.muted }]}>{note}</Text>}<Pressable onPress={onDelete}><Text style={[styles.delete, { color: t.red }]}>Sil</Text></Pressable></Card>; }
function Nav({ t, tab, setTab }) { const items = [['panel', 'Panel', 'home-variant'], ['finans', 'Finans', 'wallet'], ['liste', 'Liste', 'cart'], ['plan', 'Plan', 'map-marker-path'], ['ayar', 'Ayar', 'cog']]; return <View style={[styles.nav, { backgroundColor: t.card, borderColor: t.line }]}>{items.map(([id, label, icon]) => <Pressable key={id} onPress={() => setTab(id)} style={styles.navItem}><MaterialCommunityIcons name={icon} size={24} color={tab === id ? t.primary : t.muted} /><Text style={[styles.navText, { color: tab === id ? t.primary : t.muted }]}>{label}</Text></Pressable>)}</View>; }

const styles = StyleSheet.create({
  safe: { flex: 1 }, flex: { flex: 1 }, header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, title: { fontSize: 30, fontWeight: '900', letterSpacing: -1 }, subtitle: { fontSize: 13, fontWeight: '700', marginTop: 4 }, badge: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }, badgeText: { color: 'white', fontWeight: '900' }, scroll: { padding: 18, paddingBottom: 120 }, hero: { borderRadius: 30, padding: 20, marginBottom: 14, overflow: 'hidden' }, orb: { position: 'absolute', right: -46, top: -48, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(109,91,255,0.28)' }, orbTwo: { position: 'absolute', left: -30, bottom: -44, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(19,184,255,0.18)' }, kicker: { color: '#36C2FF', fontWeight: '900', letterSpacing: 1 }, heroTitle: { color: '#F8FAFF', fontSize: 40, fontWeight: '900', marginTop: 10, letterSpacing: -1.2 }, heroBody: { color: '#C9D3F3', fontSize: 14, lineHeight: 21, fontWeight: '700', marginTop: 8 }, track: { height: 13, borderRadius: 99, overflow: 'hidden', marginTop: 16 }, fill: { height: '100%', borderRadius: 99 }, heroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }, miniLabel: { color: '#A9B1C7', fontSize: 12, fontWeight: '800' }, miniValue: { color: '#F8FAFF', fontSize: 15, fontWeight: '900', marginTop: 4 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }, stat: { width: '48.5%', borderWidth: 1, borderRadius: 24, padding: 14, marginBottom: 10 }, icon: { width: 42, height: 42, borderRadius: 16, backgroundColor: '#6D5BFF', alignItems: 'center', justifyContent: 'center' }, statValue: { fontSize: 16, fontWeight: '900', marginTop: 10 }, statLabel: { fontSize: 12, fontWeight: '800', marginTop: 4 }, card: { borderWidth: 1, borderRadius: 26, padding: 16, marginBottom: 12 }, cardTitle: { fontSize: 18, fontWeight: '900' }, body: { fontSize: 14, lineHeight: 21, fontWeight: '700', marginTop: 8 }, section: { marginTop: 6, marginBottom: 10 }, sectionTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -.5 }, row: { flexDirection: 'row', gap: 8, paddingVertical: 10 }, chip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 99, borderWidth: 1 }, chipText: { fontSize: 12, fontWeight: '900' }, field: { marginTop: 10 }, label: { fontSize: 12, fontWeight: '900', marginBottom: 7 }, input: { minHeight: 50, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontWeight: '800' }, multi: { minHeight: 130, textAlignVertical: 'top', paddingTop: 12 }, primary: { marginTop: 14, borderRadius: 20, overflow: 'hidden' }, primaryInner: { height: 52, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: 'white', fontSize: 14, fontWeight: '900' }, smallButton: { height: 44, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#6D5BFF', alignItems: 'center', justifyContent: 'center', marginTop: 12 }, listTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, listTitle: { fontSize: 16, fontWeight: '900' }, listSub: { fontSize: 12, fontWeight: '700', marginTop: 4 }, amount: { fontSize: 15, fontWeight: '900' }, delete: { fontSize: 13, fontWeight: '900', marginTop: 12 }, flex: { flex: 1 }, actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, nav: { position: 'absolute', left: 14, right: 14, bottom: 14, height: 74, borderRadius: 28, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navText: { fontSize: 11, fontWeight: '900', marginTop: 4 }, toast: { position: 'absolute', left: 18, right: 18, bottom: 98, padding: 14, borderRadius: 18 }, toastText: { color: 'white', fontWeight: '900', textAlign: 'center' }
});
