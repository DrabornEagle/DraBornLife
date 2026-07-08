import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VERSION = 'v0.2.2';
const KEY = 'drabornlife-v021-clean';

const itemStatuses = ['Planlandı', 'Parası Birikti', 'Satın Alındı', 'Kuruldu', 'Vazgeçildi'];
const moveStatuses = ['Planlama', 'Para birikiyor', 'Ev araştırması başladı', 'Ev tutuldu', 'Eşyalar alınıyor', 'Kurulum başladı', 'Antalya’ya taşınıldı'];
const financeModes = [
  ['income', 'Gelir', 'cash-plus', ['#18D6FF', '#2F80FF']],
  ['expense', 'Gider', 'cart-arrow-down', ['#FF4D8D', '#FF9E2C']],
  ['saving', 'Birikim', 'piggy-bank', ['#13E5A7', '#22D3EE']],
  ['debt', 'Borç', 'alert-circle', ['#8B5CF6', '#FF4D6D']]
];
const categoryMap = {
  income: ['Günlük kazanç', 'İş geliri', 'Ek gelir', 'Satış geliri', 'Borç tahsilatı', 'Diğer'],
  expense: ['Market', 'Ev', 'Kira', 'Ulaşım', 'Çocuk', 'Borç ödemesi', 'Antalya hazırlık', 'Eğlence', 'Diğer'],
  saving: ['Antalya hedefi', 'Motor', 'GTA 6 seti', 'Acil durum', 'Ev kurulum', 'Diğer'],
  debt: ['Kredi kartı', 'Kişisel borç', 'Taksit', 'Elden borç', 'Diğer']
};

const emptyData = {
  settings: { targetBudget: 650000, targetDate: '2026-10-31', motorcycleTarget: 130000, theme: 'dark' },
  incomes: [],
  expenses: [],
  savings: [],
  debts: [],
  items: [],
  houses: [],
  schools: [],
  checklist: [],
  notes: [],
  relocation: { city: 'Antalya', status: 'Planlama', regions: 'Muratpaşa / Lara / Konyaaltı', homeGoal: 'Denize yakın, yeni bina, temiz ev' }
};

const num = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const clean = String(value ?? '').trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
};
const money = (value) => `${Math.round(num(value)).toLocaleString('tr-TR')} TL`;
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const daysLeft = (date) => Math.max(0, Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86400000));
const percent = (a, b) => (!b ? 0 : Math.max(0, Math.min(100, Math.round((a / b) * 100))));
const houseScore = (h) => Math.max(0, Math.min(100, Math.round(100 - num(h.seaMin) * 2.1 - num(h.schoolMin) * 1.8 - num(h.buildingAge) * 1.2 - Math.max(0, num(h.rent) - 30000) / 1000)));
const schoolScore = (s) => Math.max(0, Math.min(100, Math.round(100 - num(s.distanceMin) * 2.2 - Math.max(0, num(s.monthly) - 18000) / 700)));

export default function App() {
  const [data, setData] = useState(emptyData);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('panel');
  const [lifeTab, setLifeTab] = useState('ev');
  const [financeMode, setFinanceMode] = useState('income');
  const [finance, setFinance] = useState({ title: '', amount: '', category: '', note: '' });
  const [payment, setPayment] = useState({});
  const [item, setItem] = useState({ name: '', category: '', estimate: '', actual: '', priority: '', note: '' });
  const [house, setHouse] = useState({ title: '', region: '', rent: '', deposit: '', seaMin: '', schoolMin: '', buildingAge: '', note: '' });
  const [school, setSchool] = useState({ name: '', region: '', monthly: '', distanceMin: '', ageGroup: '5 yaş', note: '' });
  const [task, setTask] = useState('');
  const [note, setNote] = useState({ title: '', category: '', body: '' });
  const [backup, setBackup] = useState('');
  const [toast, setToast] = useState('');
  const float = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => raw && setData(cleanMerge(JSON.parse(raw)))).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true })
    ])).start();
  }, [float]);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [tab, lifeTab, fade]);

  const theme = getTheme(data.settings.theme);
  const stats = useMemo(() => getStats(data), [data]);
  const save = (next) => setData({ ...next, version: VERSION, updatedAt: new Date().toISOString() });
  const say = (msg) => setToast(msg);

  function setMode(mode) {
    setFinanceMode(mode);
    setFinance({ ...finance, category: categoryMap[mode][0] });
  }

  function addFinance() {
    if (!finance.title.trim() || !num(finance.amount)) return say('Başlık ve tutar gir.');
    const row = { id: uid(), title: finance.title.trim(), amount: num(finance.amount), category: finance.category || 'Genel', note: finance.note, date: new Date().toISOString() };
    const key = financeMode === 'income' ? 'incomes' : financeMode === 'expense' ? 'expenses' : financeMode === 'saving' ? 'savings' : 'debts';
    save({ ...data, [key]: [financeMode === 'debt' ? { ...row, paid: 0 } : row, ...data[key]] });
    setFinance({ title: '', amount: '', category: categoryMap[financeMode][0], note: '' });
    say('Kayıt eklendi.');
  }

  function addDebtPayment(id) {
    const value = num(payment[id]);
    if (!value) return say('Ödeme tutarı gir.');
    save({ ...data, debts: data.debts.map((d) => d.id === id ? { ...d, paid: Math.min(num(d.amount), num(d.paid) + value) } : d) });
    setPayment({ ...payment, [id]: '' });
    say('Borç ödemesi işlendi.');
  }

  function addItem() {
    if (!item.name.trim() || !num(item.estimate)) return say('Ürün adı ve fiyat gir.');
    save({ ...data, items: [{ id: uid(), ...item, estimate: num(item.estimate), actual: num(item.actual), status: 'Planlandı' }, ...data.items] });
    setItem({ name: '', category: '', estimate: '', actual: '', priority: '', note: '' });
    say('Ürün eklendi.');
  }

  function addHouse() {
    if (!house.title.trim() || !num(house.rent)) return say('Ev başlığı ve kira gir.');
    save({ ...data, houses: [{ id: uid(), ...house, rent: num(house.rent), deposit: num(house.deposit), seaMin: num(house.seaMin), schoolMin: num(house.schoolMin), buildingAge: num(house.buildingAge) }, ...data.houses] });
    setHouse({ title: '', region: '', rent: '', deposit: '', seaMin: '', schoolMin: '', buildingAge: '', note: '' });
    say('Ev adayı eklendi.');
  }

  function addSchool() {
    if (!school.name.trim() || !num(school.monthly)) return say('Okul adı ve ücret gir.');
    save({ ...data, schools: [{ id: uid(), ...school, monthly: num(school.monthly), distanceMin: num(school.distanceMin) }, ...data.schools] });
    setSchool({ name: '', region: '', monthly: '', distanceMin: '', ageGroup: '5 yaş', note: '' });
    say('Okul adayı eklendi.');
  }

  function addTask() {
    if (!task.trim()) return say('Görev yaz.');
    save({ ...data, checklist: [{ id: uid(), title: task.trim(), done: false }, ...data.checklist] });
    setTask('');
  }

  function addNote() {
    if (!note.title.trim() || !note.body.trim()) return say('Not başlığı ve içerik gir.');
    save({ ...data, notes: [{ id: uid(), ...note, date: new Date().toISOString() }, ...data.notes] });
    setNote({ title: '', category: '', body: '' });
    say('Not eklendi.');
  }

  function remove(key, id) {
    save({ ...data, [key]: data[key].filter((x) => x.id !== id) });
    say('Silindi.');
  }

  function backupNow() {
    setBackup(JSON.stringify({ ...data, version: VERSION, exportedAt: new Date().toISOString() }, null, 2));
    say('Yedek hazır.');
  }

  function restoreNow() {
    try { save(cleanMerge(JSON.parse(backup))); say('Yedek yüklendi.'); } catch { say('Yedek okunamadı.'); }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.status} />
      <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFillObject} />
      <Background float={float} />
      <Header theme={theme} />
      <Animated.View style={[styles.flex, { opacity: fade }]}>
        {tab === 'panel' && <Dashboard theme={theme} data={data} stats={stats} float={float} />}
        {tab === 'finans' && <Finance theme={theme} data={data} mode={financeMode} setMode={setMode} form={finance} setForm={setFinance} add={addFinance} payment={payment} setPayment={setPayment} addDebtPayment={addDebtPayment} remove={remove} stats={stats} />}
        {tab === 'liste' && <Shopping theme={theme} data={data} form={item} setForm={setItem} add={addItem} remove={remove} save={save} stats={stats} />}
        {tab === 'antalya' && <Antalya theme={theme} data={data} save={save} lifeTab={lifeTab} setLifeTab={setLifeTab} house={house} setHouse={setHouse} addHouse={addHouse} school={school} setSchool={setSchool} addSchool={addSchool} task={task} setTask={setTask} addTask={addTask} note={note} setNote={setNote} addNote={addNote} remove={remove} />}
        {tab === 'ayar' && <Settings theme={theme} data={data} save={save} backup={backup} setBackup={setBackup} backupNow={backupNow} restoreNow={restoreNow} reset={() => { save(emptyData); say('Temiz veri açıldı.'); }} />}
      </Animated.View>
      {!!toast && <Pressable onPress={() => setToast('')} style={styles.toast}><LinearGradient colors={['#2E6BFF', '#8A5CFF']} style={styles.toastInner}><Text style={styles.toastText}>{toast}</Text></LinearGradient></Pressable>}
      <Nav theme={theme} active={tab} setActive={setTab} />
    </View>
  );
}

function cleanMerge(raw) {
  return {
    ...emptyData,
    ...raw,
    settings: { ...emptyData.settings, ...(raw.settings || {}) },
    relocation: { ...emptyData.relocation, ...(raw.relocation || {}) },
    incomes: Array.isArray(raw.incomes) ? raw.incomes : [],
    expenses: Array.isArray(raw.expenses) ? raw.expenses : [],
    savings: Array.isArray(raw.savings) ? raw.savings : [],
    debts: Array.isArray(raw.debts) ? raw.debts : [],
    items: Array.isArray(raw.items) ? raw.items : [],
    houses: Array.isArray(raw.houses) ? raw.houses : [],
    schools: Array.isArray(raw.schools) ? raw.schools : [],
    checklist: Array.isArray(raw.checklist) ? raw.checklist : [],
    notes: Array.isArray(raw.notes) ? raw.notes : []
  };
}

function getStats(data) {
  const income = data.incomes.reduce((s, x) => s + num(x.amount), 0);
  const expense = data.expenses.reduce((s, x) => s + num(x.amount), 0);
  const saving = data.savings.reduce((s, x) => s + num(x.amount), 0);
  const debtTotal = data.debts.reduce((s, x) => s + num(x.amount), 0);
  const debtPaid = data.debts.reduce((s, x) => s + num(x.paid), 0);
  const target = num(data.settings.targetBudget);
  const days = daysLeft(data.settings.targetDate);
  const left = Math.max(0, target - saving);
  const bought = data.items.filter((x) => ['Satın Alındı', 'Kuruldu'].includes(x.status)).length;
  const itemsTotal = data.items.reduce((s, x) => s + num(x.actual || x.estimate), 0);
  const bestHouse = [...data.houses].sort((a, b) => houseScore(b) - houseScore(a))[0];
  const bestSchool = [...data.schools].sort((a, b) => schoolScore(b) - schoolScore(a))[0];
  const doneTasks = data.checklist.filter((x) => x.done).length;
  const daily = days > 0 ? Math.ceil(left / days) : left;
  return { income, expense, saving, net: income - expense, debtTotal, debtPaid, debtLeft: Math.max(0, debtTotal - debtPaid), debtPct: percent(debtPaid, debtTotal), target, days, left, progress: percent(saving, target), daily, weekly: daily * 7, monthly: daily * 30, bought, itemsTotal, bestHouse, bestSchool, doneTasks, taskPct: percent(doneTasks, data.checklist.length) };
}

function getTheme(mode) {
  if (mode === 'light') return { mode, status: 'dark-content', bg: '#F6F8FF', bgGradient: ['#F7FAFF', '#ECF4FF', '#FFF6F1'], card: 'rgba(255,255,255,0.90)', card2: '#FFFFFF', text: '#111827', muted: '#667085', line: 'rgba(16,24,40,0.10)', nav: 'rgba(255,255,255,0.94)' };
  return { mode, status: 'light-content', bg: '#08111F', bgGradient: ['#08111F', '#10264A', '#1A1238'], card: 'rgba(255,255,255,0.115)', card2: 'rgba(255,255,255,0.075)', text: '#FFFFFF', muted: '#C4D0E3', line: 'rgba(255,255,255,0.14)', nav: 'rgba(10,21,38,0.94)' };
}

function Background({ float }) {
  const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  return <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
    <Animated.View style={[styles.blobOne, { transform: [{ translateY: y }] }]} />
    <Animated.View style={[styles.blobTwo, { transform: [{ translateY: y }] }]} />
    <Animated.View style={[styles.blobThree, { transform: [{ translateY: y }] }]} />
  </View>;
}

function Header({ theme }) {
  return <View style={styles.header}>
    <View style={styles.brand}><LinearGradient colors={['#2EE6A6', '#2E6BFF']} style={styles.logo}><MaterialCommunityIcons name="palm-tree" size={26} color="white" /></LinearGradient><View><Text style={[styles.appTitle, { color: theme.text }]}>DraBornLife</Text><Text style={[styles.appSub, { color: theme.muted }]}>Antalya hedef ve finans paneli</Text></View></View>
    <View style={styles.version}><Text style={styles.versionText}>{VERSION}</Text></View>
  </View>;
}

function Dashboard({ theme, data, stats, float }) {
  const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <LinearGradient colors={['#0FE0A0', '#2E6BFF', '#8A5CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <Animated.View style={[styles.heroGlow, { transform: [{ translateY: y }] }]} />
      <Text style={styles.heroKicker}>HEDEFE İLERLEME</Text>
      <Text style={styles.heroPercent}>%{stats.progress}</Text>
      <Text style={styles.heroText}>{stats.days} gün kaldı. Kalan tutar {money(stats.left)}.</Text>
      <Bar value={stats.progress} />
      <View style={styles.heroStats}><Mini label="Hedef" value={money(stats.target)} /><Mini label="Birikim" value={money(stats.saving)} /><Mini label="Günlük hedef" value={money(stats.daily)} /></View>
    </LinearGradient>

    <Card theme={theme} tight>
      <View style={styles.infoHeader}><BadgeIcon icon="calendar-today" colors={['#0FE0A0', '#2E6BFF']} /><View style={styles.flex}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Günlük hedef nedir?</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>Hedef tarihe kadar kalan parayı tamamlamak için her gün ortalama ayırman gereken tutardır.</Text></View></View>
      <View style={styles.dailyBox}><Text style={styles.dailyAmount}>{money(stats.daily)}</Text><Text style={styles.dailyText}>Bugünden itibaren günlük ortalama</Text></View>
    </Card>

    <View style={styles.metricGrid}><Metric colors={['#2E6BFF', '#31B5FF']} icon="wallet" label="Net durum" value={money(stats.net)} /><Metric colors={['#0FE0A0', '#27D3C3']} icon="target" label="Kalan hedef" value={money(stats.left)} /><Metric colors={['#FF9E2C', '#FF4D8D']} icon="cart" label="Alınacaklar" value={money(stats.itemsTotal)} /><Metric colors={['#8A5CFF', '#FF4D6D']} icon="alert-circle" label="Kalan borç" value={money(stats.debtLeft)} /></View>

    <Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Bugünkü özet</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>Ev: {stats.bestHouse ? `${stats.bestHouse.title} / %${houseScore(stats.bestHouse)}` : 'henüz ev eklenmedi'}{`\n`}Okul: {stats.bestSchool ? `${stats.bestSchool.name} / %${schoolScore(stats.bestSchool)}` : 'henüz okul eklenmedi'}{`\n`}Checklist: {stats.doneTasks} görev tamamlandı.</Text></Card>
  </ScrollView>;
}

function Finance({ theme, data, mode, setMode, form, setForm, add, payment, setPayment, addDebtPayment, remove, stats }) {
  const key = mode === 'income' ? 'incomes' : mode === 'expense' ? 'expenses' : mode === 'saving' ? 'savings' : 'debts';
  const active = financeModes.find((x) => x[0] === mode) || financeModes[0];
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Title theme={theme} title="Finans" sub="Kategorili gelir, gider, birikim ve borç takibi" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>{financeModes.map(([id, label, icon, colors]) => <Mode key={id} active={mode === id} label={label} icon={icon} colors={colors} onPress={() => setMode(id)} />)}</ScrollView>

    <Card theme={theme}>
      <Text style={[styles.cardTitleBig, { color: theme.text }]}>{active[1]} ekle</Text>
      <Text style={[styles.sectionNote, { color: theme.muted }]}>Kategori seç veya manuel kategori yaz.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{categoryMap[mode].map((cat) => <Pill key={cat} theme={theme} active={form.category === cat} label={cat} onPress={() => setForm({ ...form, category: cat })} />)}</ScrollView>
      <Input theme={theme} label="Başlık" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
      <Input theme={theme} label="Tutar" value={form.amount} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, amount: v })} />
      <Input theme={theme} label="Manuel kategori" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} />
      <Input theme={theme} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} />
      <Button label="Kaydet" colors={active[3]} onPress={add} />
    </Card>

    <View style={styles.metricGrid}><Metric colors={['#2E6BFF', '#31B5FF']} icon="cash-plus" label="Gelir" value={money(stats.income)} /><Metric colors={['#FF4D8D', '#FF9E2C']} icon="cart-arrow-down" label="Gider" value={money(stats.expense)} /><Metric colors={['#0FE0A0', '#27D3C3']} icon="piggy-bank" label="Birikim" value={money(stats.saving)} /><Metric colors={['#8A5CFF', '#FF4D6D']} icon="alert-circle" label="Borç" value={money(stats.debtLeft)} /></View>
    {mode === 'debt' && <Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Borç barı</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>Toplam {money(stats.debtTotal)} • Ödenen {money(stats.debtPaid)} • Kalan {money(stats.debtLeft)}</Text><Bar value={stats.debtPct} /></Card>}
    {data[key].length === 0 && <Empty theme={theme} icon="playlist-plus" text="Henüz kayıt yok. İlk gerçek kaydı yukarıdan ekle." />}
    {data[key].map((x) => mode === 'debt' ? <Debt key={x.id} theme={theme} debt={x} payment={payment} setPayment={setPayment} addDebtPayment={addDebtPayment} onDelete={() => remove('debts', x.id)} /> : <Record key={x.id} theme={theme} title={x.title} sub={`${x.category || 'Genel'} • ${new Date(x.date).toLocaleDateString('tr-TR')}`} value={money(x.amount)} note={x.note} onDelete={() => remove(key, x.id)} />)}
  </ScrollView>;
}

function Debt({ theme, debt, payment, setPayment, addDebtPayment, onDelete }) {
  const done = percent(num(debt.paid), num(debt.amount));
  return <Card theme={theme}><View style={styles.rowTop}><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{debt.title}</Text><Text style={[styles.itemSub, { color: theme.muted }]}>Kalan {money(num(debt.amount) - num(debt.paid))} • %{done}</Text></View><Text style={[styles.itemValue, { color: theme.text }]}>{money(debt.amount)}</Text></View><Bar value={done} /><Input theme={theme} label="Ödeme ekle" value={payment[debt.id] || ''} keyboardType="numeric" onChangeText={(v) => setPayment({ ...payment, [debt.id]: v })} /><Button label="Ödeme işle" colors={['#0FE0A0', '#2E6BFF']} onPress={() => addDebtPayment(debt.id)} /><Delete onPress={onDelete} /></Card>;
}

function Shopping({ theme, data, form, setForm, add, remove, save, stats }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Title theme={theme} title="Alınacaklar" sub="Eşyalar, motor, GTA seti" />
    <Card theme={theme}><Input theme={theme} label="Ürün adı" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} /><Input theme={theme} label="Kategori" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} /><Input theme={theme} label="Tahmini fiyat" value={form.estimate} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, estimate: v })} /><Input theme={theme} label="Gerçek fiyat" value={form.actual} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, actual: v })} /><Input theme={theme} label="Öncelik" value={form.priority} onChangeText={(v) => setForm({ ...form, priority: v })} /><Input theme={theme} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} /><Button label="Listeye ekle" colors={['#FF9E2C', '#FF4D8D']} onPress={add} /></Card>
    <View style={styles.metricGrid}><Metric colors={['#FF9E2C', '#FF4D8D']} icon="calculator" label="Toplam" value={money(stats.itemsTotal)} /><Metric colors={['#0FE0A0', '#2E6BFF']} icon="check-circle" label="Tamamlanan" value={`${stats.bought}/${data.items.length}`} /></View>
    {data.items.length === 0 && <Empty theme={theme} icon="cart-plus" text="Alınacaklar boş. İlk gerçek ürünü ekle." />}
    {data.items.map((x) => <Card key={x.id} theme={theme}><View style={styles.rowTop}><BadgeIcon icon="cart" colors={['#FF9E2C', '#FF4D8D']} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{x.name}</Text><Text style={[styles.itemSub, { color: theme.muted }]}>{x.category || 'Kategori yok'} • {x.priority || 'Öncelik yok'}</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>{x.note}</Text></View><Text style={[styles.itemValue, { color: theme.text }]}>{money(x.actual || x.estimate)}</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{itemStatuses.map((s) => <Pill key={s} theme={theme} active={x.status === s} label={s} onPress={() => save({ ...data, items: data.items.map((i) => i.id === x.id ? { ...i, status: s } : i) })} />)}</ScrollView><Delete onPress={() => remove('items', x.id)} /></Card>)}
  </ScrollView>;
}

function Antalya({ theme, data, save, lifeTab, setLifeTab, house, setHouse, addHouse, school, setSchool, addSchool, task, setTask, addTask, note, setNote, addNote, remove }) {
  const tabs = [['ev', 'Evler', 'home-search'], ['okul', 'Okullar', 'school'], ['check', 'Checklist', 'clipboard-check'], ['not', 'Notlar', 'note-text']];
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Title theme={theme} title="Antalya" sub="Ev, okul ve taşınma hazırlığı" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>{tabs.map(([id, label, icon]) => <Mode key={id} active={lifeTab === id} label={label} icon={icon} colors={['#0FE0A0', '#2E6BFF']} onPress={() => setLifeTab(id)} />)}</ScrollView>
    <Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Taşınma durumu</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{moveStatuses.map((s) => <Pill key={s} theme={theme} active={data.relocation.status === s} label={s} onPress={() => save({ ...data, relocation: { ...data.relocation, status: s } })} />)}</ScrollView></Card>
    {lifeTab === 'ev' && <Houses theme={theme} houses={data.houses} house={house} setHouse={setHouse} addHouse={addHouse} remove={remove} />}
    {lifeTab === 'okul' && <Schools theme={theme} schools={data.schools} school={school} setSchool={setSchool} addSchool={addSchool} remove={remove} />}
    {lifeTab === 'check' && <Checklist theme={theme} data={data} save={save} task={task} setTask={setTask} addTask={addTask} remove={remove} />}
    {lifeTab === 'not' && <Notes theme={theme} notes={data.notes} note={note} setNote={setNote} addNote={addNote} remove={remove} />}
  </ScrollView>;
}

function Houses({ theme, houses, house, setHouse, addHouse, remove }) {
  return <><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Ev adayı ekle</Text><Input theme={theme} label="Ev başlığı" value={house.title} onChangeText={(v) => setHouse({ ...house, title: v })} /><Input theme={theme} label="Bölge" value={house.region} onChangeText={(v) => setHouse({ ...house, region: v })} /><Input theme={theme} label="Kira" value={house.rent} keyboardType="numeric" onChangeText={(v) => setHouse({ ...house, rent: v })} /><Input theme={theme} label="Depozito" value={house.deposit} keyboardType="numeric" onChangeText={(v) => setHouse({ ...house, deposit: v })} /><View style={styles.three}><MiniInput theme={theme} label="Deniz dk" value={house.seaMin} onChangeText={(v) => setHouse({ ...house, seaMin: v })} /><MiniInput theme={theme} label="Okul dk" value={house.schoolMin} onChangeText={(v) => setHouse({ ...house, schoolMin: v })} /><MiniInput theme={theme} label="Bina yaşı" value={house.buildingAge} onChangeText={(v) => setHouse({ ...house, buildingAge: v })} /></View><Input theme={theme} label="Not" value={house.note} onChangeText={(v) => setHouse({ ...house, note: v })} /><Button label="Ev kaydet" colors={['#2E6BFF', '#31B5FF']} onPress={addHouse} /></Card>{houses.length === 0 && <Empty theme={theme} icon="home-plus" text="Ev listesi boş. İlk gerçek ev adayını ekle." />}{houses.map((h) => <Card key={h.id} theme={theme}><View style={styles.rowTop}><BadgeIcon icon="home-search" colors={['#2E6BFF', '#31B5FF']} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{h.title}</Text><Text style={[styles.itemSub, { color: theme.muted }]}>{h.region || 'Bölge yok'} • Deniz {h.seaMin || 0} dk • Okul {h.schoolMin || 0} dk</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>{h.note}</Text></View><Text style={styles.score}>%{houseScore(h)}</Text></View><Text style={[styles.itemValue, { color: theme.text }]}>Kira {money(h.rent)} • Depozito {money(h.deposit)}</Text><Delete onPress={() => remove('houses', h.id)} /></Card>)}</>;
}

function Schools({ theme, schools, school, setSchool, addSchool, remove }) {
  return <><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Okul adayı ekle</Text><Input theme={theme} label="Okul adı" value={school.name} onChangeText={(v) => setSchool({ ...school, name: v })} /><Input theme={theme} label="Bölge" value={school.region} onChangeText={(v) => setSchool({ ...school, region: v })} /><Input theme={theme} label="Aylık tahmini ücret" value={school.monthly} keyboardType="numeric" onChangeText={(v) => setSchool({ ...school, monthly: v })} /><Input theme={theme} label="Eve uzaklık dakika" value={school.distanceMin} keyboardType="numeric" onChangeText={(v) => setSchool({ ...school, distanceMin: v })} /><Input theme={theme} label="Yaş grubu" value={school.ageGroup} onChangeText={(v) => setSchool({ ...school, ageGroup: v })} /><Input theme={theme} label="Not" value={school.note} onChangeText={(v) => setSchool({ ...school, note: v })} /><Button label="Okul kaydet" colors={['#0FE0A0', '#2E6BFF']} onPress={addSchool} /></Card>{schools.length === 0 && <Empty theme={theme} icon="school" text="Okul listesi boş. İlk gerçek okul adayını ekle." />}{schools.map((s) => <Card key={s.id} theme={theme}><View style={styles.rowTop}><BadgeIcon icon="school" colors={['#0FE0A0', '#2E6BFF']} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{s.name}</Text><Text style={[styles.itemSub, { color: theme.muted }]}>{s.region || 'Bölge yok'} • {s.ageGroup || 'Yaş grubu yok'} • {s.distanceMin || 0} dk</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>{s.note}</Text></View><Text style={styles.score}>%{schoolScore(s)}</Text></View><Text style={[styles.itemValue, { color: theme.text }]}>Aylık {money(s.monthly)}</Text><Delete onPress={() => remove('schools', s.id)} /></Card>)}</>;
}

function Checklist({ theme, data, save, task, setTask, addTask, remove }) {
  const done = data.checklist.filter((x) => x.done).length;
  return <><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Taşınma checklist</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>{done}/{data.checklist.length} görev tamamlandı.</Text><Bar value={percent(done, data.checklist.length)} /><Input theme={theme} label="Yeni görev" value={task} onChangeText={setTask} /><Button label="Görev ekle" colors={['#8A5CFF', '#2E6BFF']} onPress={addTask} /></Card>{data.checklist.length === 0 && <Empty theme={theme} icon="clipboard-plus" text="Checklist boş. Gerçek taşınma görevlerini ekle." />}{data.checklist.map((x) => <Card key={x.id} theme={theme}><Pressable onPress={() => save({ ...data, checklist: data.checklist.map((i) => i.id === x.id ? { ...i, done: !i.done } : i) })} style={styles.rowTop}><MaterialCommunityIcons name={x.done ? 'check-circle' : 'circle-outline'} size={34} color={x.done ? '#0FE0A0' : theme.muted} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text, textDecorationLine: x.done ? 'line-through' : 'none' }]}>{x.title}</Text></View></Pressable><Delete onPress={() => remove('checklist', x.id)} /></Card>)}</>;
}

function Notes({ theme, notes, note, setNote, addNote, remove }) {
  return <><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Not ekle</Text><Input theme={theme} label="Başlık" value={note.title} onChangeText={(v) => setNote({ ...note, title: v })} /><Input theme={theme} label="Kategori" value={note.category} onChangeText={(v) => setNote({ ...note, category: v })} /><Input theme={theme} label="Not" value={note.body} onChangeText={(v) => setNote({ ...note, body: v })} multiline /><Button label="Notu kaydet" colors={['#FF4D8D', '#2E6BFF']} onPress={addNote} /></Card>{notes.length === 0 && <Empty theme={theme} icon="note-plus" text="Notlar boş. İlk gerçek notunu ekle." />}{notes.map((x) => <Record key={x.id} theme={theme} title={x.title} sub={`${x.category || 'Genel'} • ${new Date(x.date).toLocaleDateString('tr-TR')}`} note={x.body} onDelete={() => remove('notes', x.id)} />)}</>;
}

function Settings({ theme, data, save, backup, setBackup, backupNow, restoreNow, reset }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Title theme={theme} title="Ayarlar" sub="Tema, hedef, yedek" /><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Tema</Text><View style={styles.themeRow}><Button label="Dark" colors={['#08111F', '#2E6BFF']} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'dark' } })} /><Button label="Light" colors={['#EAF2FF', '#B9D7FF']} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'light' } })} /></View></Card><Card theme={theme}><Input theme={theme} label="Toplam hedef bütçe" value={String(data.settings.targetBudget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetBudget: num(v) } })} /><Input theme={theme} label="Hedef tarih" value={data.settings.targetDate} onChangeText={(v) => save({ ...data, settings: { ...data.settings, targetDate: v } })} /><Input theme={theme} label="Motosiklet hedef fiyatı" value={String(data.settings.motorcycleTarget)} keyboardType="numeric" onChangeText={(v) => save({ ...data, settings: { ...data.settings, motorcycleTarget: num(v) } })} /></Card><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Yedekleme</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>Gerçek verilerini JSON olarak dışa aktarabilir, sonra geri yükleyebilirsin.</Text><Button label="Yedek oluştur" colors={['#2E6BFF', '#8A5CFF']} onPress={backupNow} /><Input theme={theme} label="Yedek JSON" value={backup} onChangeText={setBackup} multiline /><Button label="Geri yükle" colors={['#0FE0A0', '#2E6BFF']} onPress={restoreNow} /></Card><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Temizle</Text><Text style={[styles.bodyBig, { color: theme.muted }]}>Tüm gerçek verileri sıfırlar.</Text><Pressable onPress={reset}><Text style={styles.deleteText}>Verileri sıfırla</Text></Pressable></Card></ScrollView>;
}

function Title({ theme, title, sub }) { return <View style={styles.screenTitle}><Text style={[styles.screenText, { color: theme.text }]}>{title}</Text><Text style={[styles.screenSub, { color: theme.muted }]}>{sub}</Text></View>; }
function Card({ theme, children, tight }) { return <View style={[styles.card, tight && styles.cardTight, { backgroundColor: theme.card, borderColor: theme.line }]}>{children}</View>; }
function Input({ theme, label, multiline, ...props }) { return <View style={styles.field}><Text style={[styles.label, { color: theme.muted }]}>{label}</Text><TextInput placeholderTextColor="#8CA0BA" style={[styles.input, multiline && styles.multi, { color: theme.text, borderColor: theme.line, backgroundColor: theme.card2 }]} multiline={multiline} {...props} /></View>; }
function MiniInput(props) { return <View style={styles.miniInput}><Input {...props} keyboardType="numeric" /></View>; }
function Button({ label, colors, onPress }) { return <Pressable onPress={onPress} style={styles.buttonWrap}><LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}><Text style={styles.buttonText}>{label}</Text></LinearGradient></Pressable>; }
function Bar({ value }) { return <View style={styles.track}><LinearGradient colors={['#0FE0A0', '#2E6BFF', '#8A5CFF']} style={[styles.fill, { width: `${Math.max(4, value)}%` }]} /></View>; }
function Mini({ label, value }) { return <View><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>; }
function Metric({ colors, icon, label, value }) { return <LinearGradient colors={colors} style={styles.metric}><MaterialCommunityIcons name={icon} size={28} color="white" /><Text numberOfLines={2} style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></LinearGradient>; }
function Mode({ active, label, icon, colors, onPress }) { return <Pressable onPress={onPress} style={styles.mode}><LinearGradient colors={active ? colors : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)']} style={styles.modeInner}><MaterialCommunityIcons name={icon} size={26} color="white" /><Text style={styles.modeText}>{label}</Text></LinearGradient></Pressable>; }
function Pill({ theme, active, label, onPress }) { return <Pressable onPress={onPress} style={[styles.pill, { borderColor: active ? '#31B5FF' : theme.line, backgroundColor: active ? 'rgba(49,181,255,0.18)' : 'transparent' }]}><Text style={[styles.pillText, { color: active ? '#31B5FF' : theme.muted }]}>{label}</Text></Pressable>; }
function BadgeIcon({ icon, colors }) { return <LinearGradient colors={colors} style={styles.badgeIcon}><MaterialCommunityIcons name={icon} size={24} color="white" /></LinearGradient>; }
function Record({ theme, title, sub, value, note, onDelete }) { return <Card theme={theme}><View style={styles.rowTop}><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text><Text style={[styles.itemSub, { color: theme.muted }]}>{sub}</Text></View>{value ? <Text style={[styles.itemValue, { color: theme.text }]}>{value}</Text> : null}</View>{note ? <Text style={[styles.bodyBig, { color: theme.muted }]}>{note}</Text> : null}<Delete onPress={onDelete} /></Card>; }
function Delete({ onPress }) { return <Pressable onPress={onPress}><Text style={styles.deleteText}>Sil</Text></Pressable>; }
function Empty({ theme, icon, text }) { return <Card theme={theme}><View style={styles.empty}><MaterialCommunityIcons name={icon} size={36} color="#31B5FF" /><Text style={[styles.emptyText, { color: theme.muted }]}>{text}</Text></View></Card>; }
function Nav({ theme, active, setActive }) { const items = [['panel', 'Panel', 'home'], ['finans', 'Finans', 'wallet'], ['liste', 'Liste', 'cart'], ['antalya', 'Antalya', 'map-marker'], ['ayar', 'Ayar', 'cog']]; return <View style={[styles.nav, { backgroundColor: theme.nav, borderColor: theme.line }]}>{items.map(([id, label, icon]) => <Pressable key={id} onPress={() => setActive(id)} style={styles.navItem}>{active === id ? <LinearGradient colors={['#0FE0A0', '#2E6BFF']} style={styles.navActive}><MaterialCommunityIcons name={icon} size={24} color="white" /></LinearGradient> : <MaterialCommunityIcons name={icon} size={26} color={theme.muted} />}<Text style={[styles.navLabel, { color: active === id ? theme.text : theme.muted }]}>{label}</Text></Pressable>)}</View>; }

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 34 }, flex: { flex: 1 }, blobOne: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -80, right: -100, backgroundColor: 'rgba(46,107,255,0.24)' }, blobTwo: { position: 'absolute', width: 210, height: 210, borderRadius: 105, top: 250, left: -105, backgroundColor: 'rgba(15,224,160,0.17)' }, blobThree: { position: 'absolute', width: 170, height: 170, borderRadius: 85, bottom: 70, right: -70, backgroundColor: 'rgba(138,92,255,0.20)' },
  header: { paddingHorizontal: 18, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, appTitle: { fontSize: 31, fontWeight: '900', letterSpacing: -1.1 }, appSub: { fontSize: 14, fontWeight: '800', marginTop: 2 }, version: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.16)' }, versionText: { color: 'white', fontWeight: '900', fontSize: 15 },
  scroll: { padding: 18, paddingBottom: 122 }, hero: { borderRadius: 34, padding: 22, overflow: 'hidden', marginBottom: 14 }, heroGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.18)', right: -40, top: -35 }, heroKicker: { color: 'rgba(255,255,255,0.84)', fontSize: 13, fontWeight: '900', letterSpacing: 1 }, heroPercent: { color: 'white', fontSize: 60, fontWeight: '900', letterSpacing: -2, marginTop: 6 }, heroText: { color: 'rgba(255,255,255,0.92)', fontSize: 17, lineHeight: 25, fontWeight: '800' }, track: { height: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 16 }, fill: { height: '100%', borderRadius: 99 }, heroStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }, miniLabel: { color: 'rgba(255,255,255,0.76)', fontSize: 13, fontWeight: '900' }, miniValue: { color: 'white', fontSize: 17, fontWeight: '900', marginTop: 4 },
  card: { borderWidth: 1, borderRadius: 28, padding: 17, marginBottom: 12 }, cardTight: { padding: 18 }, infoHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' }, dailyBox: { marginTop: 14, borderRadius: 22, padding: 16, backgroundColor: 'rgba(46,107,255,0.18)' }, dailyAmount: { color: 'white', fontSize: 28, fontWeight: '900' }, dailyText: { color: 'rgba(255,255,255,0.80)', fontSize: 14, fontWeight: '800', marginTop: 3 }, cardTitleBig: { fontSize: 21, fontWeight: '900', letterSpacing: -0.4 }, bodyBig: { fontSize: 16, lineHeight: 24, fontWeight: '750', marginTop: 8 }, sectionNote: { fontSize: 14, lineHeight: 20, fontWeight: '800', marginTop: 5 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }, metric: { width: '48.5%', minHeight: 138, borderRadius: 28, padding: 16, justifyContent: 'space-between' }, metricValue: { color: 'white', fontSize: 18, lineHeight: 23, fontWeight: '900' }, metricLabel: { color: 'rgba(255,255,255,0.84)', fontSize: 13, fontWeight: '900' }, screenTitle: { marginBottom: 12 }, screenText: { fontSize: 31, fontWeight: '900', letterSpacing: -1 }, screenSub: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  modeRow: { gap: 10, paddingBottom: 12 }, mode: { borderRadius: 24, overflow: 'hidden' }, modeInner: { minWidth: 112, height: 80, padding: 14, borderRadius: 24, justifyContent: 'space-between' }, modeText: { color: 'white', fontSize: 14, fontWeight: '900' }, field: { marginTop: 11 }, label: { fontSize: 14, fontWeight: '900', marginBottom: 7 }, input: { minHeight: 56, borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, fontSize: 17, fontWeight: '800' }, multi: { minHeight: 132, textAlignVertical: 'top', paddingTop: 12 }, buttonWrap: { marginTop: 15, borderRadius: 22, overflow: 'hidden' }, button: { height: 58, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 }, buttonText: { color: 'white', fontSize: 16, fontWeight: '900' }, rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, flex: { flex: 1 }, itemTitle: { fontSize: 18, fontWeight: '900' }, itemSub: { fontSize: 14, fontWeight: '800', marginTop: 4 }, itemValue: { fontSize: 16, fontWeight: '900', marginTop: 10 }, badgeIcon: { width: 50, height: 50, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, score: { color: '#31B5FF', fontSize: 20, fontWeight: '900' }, pillRow: { flexDirection: 'row', gap: 8, paddingVertical: 11 }, pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 99, borderWidth: 1 }, pillText: { fontSize: 14, fontWeight: '900' }, deleteText: { color: '#FF5A7A', fontSize: 15, fontWeight: '900', marginTop: 13 }, three: { flexDirection: 'row', gap: 8 }, miniInput: { flex: 1 }, empty: { alignItems: 'center', paddingVertical: 10 }, emptyText: { textAlign: 'center', fontSize: 16, lineHeight: 23, fontWeight: '800', marginTop: 8 }, themeRow: { flexDirection: 'row', gap: 10 },
  nav: { position: 'absolute', left: 14, right: 14, bottom: 14, height: 82, borderRadius: 32, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navActive: { width: 46, height: 38, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, navLabel: { fontSize: 12, fontWeight: '900', marginTop: 4 }, toast: { position: 'absolute', left: 18, right: 18, bottom: 106, borderRadius: 20, overflow: 'hidden' }, toastInner: { padding: 14 }, toastText: { color: 'white', fontWeight: '900', textAlign: 'center', fontSize: 15 }
});
