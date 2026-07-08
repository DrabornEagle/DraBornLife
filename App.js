import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const VERSION = 'v0.3.1';
const KEY = 'drabornlife-v03-save-system';
const LEGACY_KEYS = ['drabornlife-v02-complete', 'drabornlife-v01-complete', 'drabornlife-v021-clean'];
const REGIONS = ['Muratpaşa', 'Lara', 'Konyaaltı'];
const itemStatuses = ['Planlandı', 'Parası Birikti', 'Satın Alındı', 'Kuruldu'];
const priorityOptions = ['Düşük', 'Yüksek'];
const financeModes = [
  ['income', 'Gelir Ekle', 'cash-plus', ['#19D3FF', '#2E6BFF']],
  ['expense', 'Gider Ekle', 'cart-arrow-down', ['#FF4D8D', '#FF9E2C']],
  ['saving', 'Birikim Ekle', 'piggy-bank', ['#0FE0A0', '#22D3EE']],
  ['debt', 'Borç Ekle', 'alert-circle', ['#8B5CF6', '#FF4D6D']],
];
const itemCategories = ['GTA 6 Set', 'Yeni motosiklet', 'OKUL', 'Kira / depozito', 'Beyaz eşya', 'Mobilya', 'Salon', 'Yatak odası', 'Çocuk odası', 'Mutfak', 'Banyo', 'Temizlik', 'Elektronik', 'İlk ay yaşam', 'Antalya eğlence'];
const itemIcons = { 'GTA 6 Set': 'gamepad-variant', 'Yeni motosiklet': 'motorbike', OKUL: 'school', 'Kira / depozito': 'home-city', 'Beyaz eşya': 'fridge', Mobilya: 'sofa', Salon: 'sofa', 'Yatak odası': 'bed-king', 'Çocuk odası': 'baby-face', Mutfak: 'silverware-fork-knife', Banyo: 'shower', Temizlik: 'broom', Elektronik: 'monitor', 'İlk ay yaşam': 'calendar-month', 'Antalya eğlence': 'palm-tree', Manuel: 'playlist-plus' };
const catalog = {
  'GTA 6 Set': ['PS5 Pro', 'TV', 'GTA 6 oyunu', 'Ekstra kol', 'PS Plus / oyun hesabı'],
  'Yeni motosiklet': ['Yeni motosiklet', 'Kask', 'Mont', 'Eldiven', 'Motor kilidi', 'Ruhsat / sigorta masrafı'],
  OKUL: ['Özel okul kayıt ücreti', 'Aylık okul taksidi', 'Kırtasiye seti', 'Okul kıyafeti', 'Servis ücreti', 'Yemek ücreti', 'Etkinlik / gezi ücreti'],
  'Kira / depozito': ['İlk kira', 'Depozito', 'Emlakçı komisyonu', 'Abonelik açılışları', 'Site aidatı başlangıç'],
  'Beyaz eşya': ['Buzdolabı', 'Çamaşır makinesi', 'Bulaşık makinesi', 'Fırın', 'Ocak', 'Klima'],
  Mobilya: ['Koltuk takımı', 'Yemek masası', 'TV ünitesi', 'Gardırop', 'Yatak baza başlık'],
  Salon: ['Koltuk', 'TV ünitesi', 'Orta sehpa', 'Halı', 'Perde', 'Aydınlatma'],
  'Yatak odası': ['Yatak', 'Baza', 'Başlık', 'Gardırop', 'Komodin', 'Perde'],
  'Çocuk odası': ['Çocuk yatağı', 'Çocuk dolabı', 'Çalışma masası', 'Oyuncak düzenleyici', 'Halı'],
  Mutfak: ['Tencere seti', 'Tava seti', 'Tabak bardak takımı', 'Çatal kaşık takımı', 'Kettle', 'Kahve makinesi'],
  Banyo: ['Havlu seti', 'Banyo dolabı', 'Duş rafı', 'Çamaşır sepeti', 'Banyo paspası'],
  Temizlik: ['Elektrikli süpürge', 'Mop seti', 'Temizlik ürünleri', 'Çöp kovaları', 'Deterjan stok'],
  Elektronik: ['Laptop', 'Telefon', 'TV', 'Modem', 'Tablet / aksesuar'],
  'İlk ay yaşam': ['Market başlangıç alışverişi', 'Ulaşım bütçesi', 'Okul hazırlık', 'Fatura payı', 'Acil nakit'],
  'Antalya eğlence': ['Aquapark', 'Sahil günü', 'Lunapark / aktivite', 'Aile yemeği', 'Hafta sonu gezisi'],
};
const categoryMap = {
  income: ['Günlük kazanç', 'İş geliri', 'Ek gelir', 'Satış geliri', 'Borç tahsilatı', 'Diğer'],
  expense: ['Ev gideri', 'Market', 'Ulaşım', 'Çocuk', 'Borç ödemesi', 'Antalya hazırlık', 'Eğlence', 'Okul', 'Diğer'],
  saving: ['Günlük birikim', 'İş geliri', 'Ek gelir', 'Motor', 'GTA 6 Set', 'Okul', 'Acil durum', 'Diğer'],
  debt: ['Kredi kartı', 'Kişisel borç', 'Taksit', 'Elden borç', 'Diğer'],
};
const catIcons = { 'Günlük kazanç': 'cash-fast', 'İş geliri': 'briefcase', 'Ek gelir': 'plus-circle', 'Satış geliri': 'tag-multiple', 'Borç tahsilatı': 'account-cash', 'Ev gideri': 'home', Market: 'cart', Ulaşım: 'car', Çocuk: 'baby-face', 'Borç ödemesi': 'credit-card-check', 'Antalya hazırlık': 'palm-tree', Eğlence: 'party-popper', Okul: 'school', 'Günlük birikim': 'piggy-bank', Motor: 'motorbike', 'GTA 6 Set': 'gamepad-variant', 'Acil durum': 'shield-alert', Diğer: 'dots-horizontal-circle' };
const defaultData = {
  settings: { targetBudget: 650000, targetDate: '2026-11-01', currency: 'TL', theme: 'dark' },
  incomes: [], expenses: [], savings: [], debts: [], items: [], houses: [], schools: [], checklist: [], notes: [], activities: [], saveHistory: [],
  backupSettings: { dailyLocalSave: true }, lastSaveAt: '', lastDailySaveDate: '',
  motorcycle: { price: 130000, saved: 0, status: 'Planlandı', note: 'Eski motosiklet satılacak, Antalya’da sıfır motosiklet alınacak.' },
  gtaGoal: { targetDate: '2026-11-19', note: 'GTA 6 çıkmadan önce taşınma tamamlanmalı ve set hazır olmalı.', items: [{ id: 'ps5', name: 'PS5 Pro', cost: 0, status: 'Planlandı' }, { id: 'tv', name: 'TV', cost: 0, status: 'Planlandı' }, { id: 'game', name: 'GTA 6 oyunu', cost: 0, status: 'Planlandı' }] },
  relocation: { city: 'Antalya', status: 'Planlama', regions: 'Muratpaşa / Lara / Konyaaltı', homeGoal: 'Denize yakın, yeni bina, temiz ev', moveNote: 'Ankara’dan nakliye yok; birkaç valizle gidilecek. Eşyalar Antalya’dan sıfır alınacak.' },
  family: { note: 'Evimize tatil hayatını taşıyoruz.', motivation: 'Deniz, sahil, aquapark, aile aktiviteleri ve Antalya’da yeni yaşam.' },
};

const num = (v) => Number(String(v ?? '').replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '')) || 0;
const money = (v) => `${Math.round(num(v)).toLocaleString('tr-TR')} TL`;
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const today = () => new Date().toISOString().slice(0, 10);
const daysLeft = (d) => Math.max(0, Math.ceil((new Date(`${d}T23:59:59`).getTime() - Date.now()) / 86400000));
const pct = (a, b) => (!num(b) ? 0 : Math.max(0, Math.min(100, Math.round((num(a) / num(b)) * 100))));
const compactDate = (d) => d ? new Date(d).toLocaleString('tr-TR') : 'Yok';
const fileStamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const saveFileName = () => `DraBornLife_Save_${VERSION}_${fileStamp()}.json`;
const normalizeCategory = (cat) => cat === 'GTA 6 seti' ? 'GTA 6 Set' : (cat === 'TV' || cat === 'PS5 Pro') ? 'Elektronik' : cat || 'Manuel';
const normalizePriority = (p) => p === 'Yüksek' || p === 'Acil' ? 'Yüksek' : 'Düşük';
const itemPrice = (x) => num(x.averagePrice || x.price || x.estimate || x.actual || x.cost);
const isMonth = (d) => String(d || '').slice(0, 7) === today().slice(0, 7);
const isToday = (d) => String(d || '').slice(0, 10) === today();
const isWeek = (d) => Date.now() - new Date(d || 0).getTime() <= 7 * 86400000;
const fixAnkara = (t) => String(t || defaultData.relocation.moveNote).replace(/Antakya’dan/g, 'Ankara’dan').replace(/Antakya'dan/g, "Ankara'dan");

function merge(raw) {
  const src = raw?.data || raw || {};
  const relocation = { ...defaultData.relocation, ...(src.relocation || {}) };
  relocation.moveNote = fixAnkara(relocation.moveNote);
  return {
    ...defaultData,
    ...src,
    settings: { ...defaultData.settings, ...(src.settings || {}), targetDate: src.settings?.targetDate === '2026-10-31' ? '2026-11-01' : (src.settings?.targetDate || defaultData.settings.targetDate) },
    backupSettings: { ...defaultData.backupSettings, ...(src.backupSettings || {}) },
    motorcycle: { ...defaultData.motorcycle, ...(src.motorcycle || {}) },
    gtaGoal: { ...defaultData.gtaGoal, ...(src.gtaGoal || {}) },
    relocation,
    family: { ...defaultData.family, ...(src.family || {}) },
    incomes: Array.isArray(src.incomes) ? src.incomes : [],
    expenses: Array.isArray(src.expenses) ? src.expenses : [],
    savings: Array.isArray(src.savings) ? src.savings : [],
    debts: Array.isArray(src.debts) ? src.debts : [],
    items: Array.isArray(src.items) ? src.items.map((x) => ({ ...x, category: normalizeCategory(x.category), priority: normalizePriority(x.priority), favorite: !!x.favorite })) : [],
    houses: Array.isArray(src.houses) ? src.houses : [],
    schools: Array.isArray(src.schools) ? src.schools : [],
    checklist: Array.isArray(src.checklist) ? src.checklist : [],
    notes: Array.isArray(src.notes) ? src.notes : [],
    activities: Array.isArray(src.activities) ? src.activities : [],
    saveHistory: Array.isArray(src.saveHistory) ? src.saveHistory : [],
  };
}
function statsOf(data) {
  const sum = (arr, key = 'amount') => arr.reduce((s, x) => s + num(x[key]), 0);
  const saving = sum(data.savings) + num(data.motorcycle?.saved);
  const itemsTotal = data.items.reduce((s, x) => s + itemPrice(x), 0);
  const target = itemsTotal || num(data.settings.targetBudget);
  const bought = data.items.filter((x) => ['Satın Alındı', 'Kuruldu'].includes(x.status));
  const boughtTotal = bought.reduce((s, x) => s + itemPrice(x), 0);
  const favoriteItems = data.items.filter((x) => x.favorite);
  const days = daysLeft(data.settings.targetDate);
  const left = Math.max(0, target - saving);
  return {
    income: sum(data.incomes), expense: sum(data.expenses), saving, target, left, days,
    progress: pct(saving, target), daily: days ? Math.ceil(left / days) : left, weekly: days ? Math.ceil(left / days) * 7 : left,
    todayIncome: data.incomes.filter((x) => isToday(x.date)).reduce((s, x) => s + num(x.amount), 0),
    todayExpense: data.expenses.filter((x) => isToday(x.date)).reduce((s, x) => s + num(x.amount), 0),
    monthIncome: data.incomes.filter((x) => isMonth(x.date)).reduce((s, x) => s + num(x.amount), 0),
    monthExpense: data.expenses.filter((x) => isMonth(x.date)).reduce((s, x) => s + num(x.amount), 0),
    weekIncome: data.incomes.filter((x) => isWeek(x.date)).reduce((s, x) => s + num(x.amount), 0),
    weekExpense: data.expenses.filter((x) => isWeek(x.date)).reduce((s, x) => s + num(x.amount), 0),
    monthSavings: data.savings.filter((x) => isMonth(x.date)).reduce((s, x) => s + num(x.amount), 0),
    debtTotal: sum(data.debts), debtPaid: sum(data.debts, 'paid'), debtLeft: Math.max(0, sum(data.debts) - sum(data.debts, 'paid')),
    itemsTotal, boughtTotal, boughtCount: bought.length, itemsLeft: Math.max(0, itemsTotal - boughtTotal),
    favoriteItems, favoriteTotal: favoriteItems.reduce((s, x) => s + itemPrice(x), 0),
    gtaDays: daysLeft(data.gtaGoal.targetDate), gtaTotal: (data.gtaGoal.items || []).reduce((s, x) => s + num(x.cost), 0),
    taskPct: pct(data.checklist.filter((x) => x.done).length, data.checklist.length),
  };
}
function themeOf(mode) {
  if (mode === 'light') return { status: 'dark-content', bg: '#F6F8FF', bgGradient: ['#F7FAFF', '#ECF4FF', '#FFF6F1'], card: 'rgba(255,255,255,0.94)', card2: '#FFFFFF', text: '#111827', muted: '#667085', line: 'rgba(16,24,40,0.10)', nav: 'rgba(255,255,255,0.95)' };
  return { status: 'light-content', bg: '#08111F', bgGradient: ['#08111F', '#10264A', '#1A1238'], card: 'rgba(255,255,255,0.118)', card2: 'rgba(255,255,255,0.075)', text: '#FFFFFF', muted: '#C4D0E3', line: 'rgba(255,255,255,0.14)', nav: 'rgba(10,21,38,0.94)' };
}
function groupItems(items) {
  const extra = [...new Set(items.map((x) => normalizeCategory(x.category)).filter((x) => !itemCategories.includes(x)))];
  return [...itemCategories, ...extra].map((cat) => [cat, items.filter((x) => normalizeCategory(x.category) === cat)]).filter(([, arr]) => arr.length);
}
function groupSum(list) {
  const out = {};
  list.forEach((x) => { const k = normalizeCategory(x.category || 'Manuel'); out[k] = (out[k] || 0) + num(x.amount); });
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

export default function App() {
  const [data, setData] = useState(defaultData);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('panel');
  const [goalTab, setGoalTab] = useState('items');
  const [planTab, setPlanTab] = useState('plan');
  const [financeMode, setFinanceMode] = useState('income');
  const [financeOpen, setFinanceOpen] = useState(null);
  const [goalOpen, setGoalOpen] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [itemGroupOpen, setItemGroupOpen] = useState(null);
  const [finance, setFinance] = useState({ title: '', amount: '', paid: '', date: today(), category: 'Günlük kazanç', note: '' });
  const [manualItem, setManualItem] = useState({ name: '', category: 'GTA 6 Set', customCategory: '', averagePrice: '', priority: 'Düşük', note: '' });
  const [drafts, setDrafts] = useState({});
  const [task, setTask] = useState('');
  const [noteDraft, setNoteDraft] = useState({ title: '', body: '' });
  const [backupText, setBackupText] = useState('');
  const [toast, setToast] = useState('');
  const dailyRef = useRef(false);
  const float = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  const theme = themeOf(data.settings.theme);
  const stats = useMemo(() => statsOf(data), [data]);
  const save = (next) => setData({ ...next, version: VERSION, updatedAt: new Date().toISOString() });
  const say = (msg) => setToast(msg);

  useEffect(() => { (async () => { try { let raw = await AsyncStorage.getItem(KEY); if (!raw) { for (const k of LEGACY_KEYS) { raw = await AsyncStorage.getItem(k); if (raw) break; } } if (raw) setData(merge(JSON.parse(raw))); } finally { setReady(true); } })(); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {}); }, [ready, data]);
  useEffect(() => { if (!ready || dailyRef.current) return; dailyRef.current = true; if (data.backupSettings?.dailyLocalSave !== false && data.lastDailySaveDate !== today()) setTimeout(() => writeSaveFile('Günlük otomatik', false), 700); }, [ready]);
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }), Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true })])).start(); }, [float]);
  useEffect(() => { fade.setValue(0); Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start(); }, [tab, goalTab, planTab]);

  function savePayload(source = data) {
    return { app: 'DraBornLife', saveVersion: VERSION, createdAt: new Date().toISOString(), driveMode: 'manual', data: source };
  }
  async function getSaveDir() {
    const root = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    if (!root) throw new Error('Cihaz kayıt alanı bulunamadı');
    const dir = `${root}DraBornLifeSaves/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
    return dir;
  }
  async function writeSaveFile(type = 'Manuel cihaz içi', visibleToast = true) {
    try {
      const dir = await getSaveDir();
      const name = saveFileName();
      const uri = `${dir}${name}`;
      const payload = savePayload({ ...data, version: VERSION, updatedAt: new Date().toISOString() });
      await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
      const row = { id: uid(), type, name, uri, createdAt: payload.createdAt, version: VERSION };
      setData((prev) => ({ ...prev, saveHistory: [row, ...(prev.saveHistory || [])].slice(0, 40), lastSaveAt: row.createdAt, lastDailySaveDate: type.includes('Günlük') ? today() : prev.lastDailySaveDate, version: VERSION, updatedAt: new Date().toISOString() }));
      if (visibleToast) say('Save dosyası oluşturuldu.');
      return row;
    } catch (err) {
      setBackupText(JSON.stringify(savePayload(), null, 2));
      say(`Save oluşturulamadı: ${err?.message || 'dosya izni'}`);
      return null;
    }
  }
  async function shareSaveFile() {
    const row = await writeSaveFile('Paylaş / Drive manuel', false);
    if (!row) return;
    if (!(await Sharing.isAvailableAsync())) return say('Paylaşım bu cihazda desteklenmiyor.');
    await Sharing.shareAsync(row.uri, { mimeType: 'application/json', dialogTitle: 'DraBornLife Save Dosyasını Paylaş' });
    say('Paylaş ekranından Drive seçebilirsin.');
  }
  async function saveToFolder() {
    try {
      const access = FileSystem.StorageAccessFramework;
      if (!access?.requestDirectoryPermissionsAsync) return say('Klasör seçerek kaydetme desteklenmiyor. Paylaş butonunu kullan.');
      const perm = await access.requestDirectoryPermissionsAsync();
      if (!perm.granted) return say('Klasör izni verilmedi.');
      const name = saveFileName();
      const uri = await access.createFileAsync(perm.directoryUri, name, 'application/json');
      await FileSystem.writeAsStringAsync(uri, JSON.stringify(savePayload(), null, 2));
      const row = { id: uid(), type: 'Klasöre kaydedildi', name, uri, createdAt: new Date().toISOString(), version: VERSION };
      save({ ...data, saveHistory: [row, ...(data.saveHistory || [])].slice(0, 40), lastSaveAt: row.createdAt });
      say('Save dosyası seçilen klasöre kaydedildi.');
    } catch (err) {
      say(`Klasöre kayıt olmadı: ${err?.message || 'izin verilmedi'}`);
    }
  }
  async function restoreFromFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return say('Dosya seçilemedi.');
      const parsed = JSON.parse(await FileSystem.readAsStringAsync(asset.uri));
      if (parsed.app !== 'DraBornLife' && !parsed.data && !parsed.settings) return say('Bu DraBornLife save dosyası değil.');
      const restored = merge(parsed.data || parsed);
      const row = { id: uid(), type: 'Dosyadan geri yüklendi', name: asset.name || 'restore.json', uri: asset.uri, createdAt: new Date().toISOString(), version: VERSION };
      save({ ...restored, saveHistory: [row, ...(restored.saveHistory || [])].slice(0, 40), lastSaveAt: row.createdAt });
      say('Save dosyasından geri yüklendi.');
    } catch {
      say('Dosya okunamadı veya JSON değil.');
    }
  }
  function makeBackupText() { setBackupText(JSON.stringify(savePayload(), null, 2)); say('JSON save metni hazır.'); }
  function restoreBackupText() { try { save(merge(JSON.parse(backupText))); say('JSON metninden geri yüklendi.'); } catch { say('JSON metni okunamadı.'); } }

  function setMode(mode) { setFinanceMode(mode); setFinanceOpen(financeOpen === mode ? null : mode); setFinance({ title: '', amount: '', paid: '', date: today(), category: categoryMap[mode][0], note: '' }); }
  function addFinance() {
    if (!num(finance.amount)) return say('Tutar gir.');
    const key = financeMode === 'income' ? 'incomes' : financeMode === 'expense' ? 'expenses' : financeMode === 'saving' ? 'savings' : 'debts';
    const row = { id: uid(), title: finance.title || finance.category, amount: num(finance.amount), paid: financeMode === 'debt' ? num(finance.paid) : undefined, date: finance.date || today(), category: finance.category, note: finance.note };
    save({ ...data, [key]: [row, ...(data[key] || [])] });
    setFinance({ title: '', amount: '', paid: '', date: today(), category: categoryMap[financeMode][0], note: '' });
    say('Kayıt eklendi.');
  }
  function addCatalogItem(name, category) {
    const key = `${category}-${name}`;
    const draft = drafts[key] || {};
    if (!num(draft.cost)) return say('Ortalama fiyat gir.');
    save({ ...data, items: [{ id: uid(), name, category: normalizeCategory(category), averagePrice: num(draft.cost), status: draft.status || 'Planlandı', priority: category === 'GTA 6 Set' || category === 'Yeni motosiklet' ? 'Yüksek' : 'Düşük', favorite: false, note: `${category} kategorisinden eklendi.` }, ...data.items] });
    say('Alınacaklara eklendi.');
  }
  function addManualItem() {
    const category = normalizeCategory(manualItem.customCategory.trim() || manualItem.category);
    if (!manualItem.name.trim() || !num(manualItem.averagePrice)) return say('Ürün adı ve fiyat gir.');
    save({ ...data, items: [{ id: uid(), name: manualItem.name.trim(), category, averagePrice: num(manualItem.averagePrice), status: 'Planlandı', priority: normalizePriority(manualItem.priority), favorite: false, note: manualItem.note }, ...data.items] });
    setManualItem({ name: '', category: 'GTA 6 Set', customCategory: '', averagePrice: '', priority: 'Düşük', note: '' });
    say('Manuel ürün eklendi.');
  }
  const patchItem = (id, patch) => save({ ...data, items: data.items.map((x) => x.id === id ? { ...x, ...patch } : x) });
  const remove = (key, id) => save({ ...data, [key]: data[key].filter((x) => x.id !== id) });

  return <View style={[styles.root, { backgroundColor: theme.bg }]}><StatusBar barStyle={theme.status} /><LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFillObject} /><Background float={float} /><Header theme={theme} /><Animated.View style={[styles.flex, { opacity: fade }]}>{tab === 'panel' && <Panel theme={theme} data={data} stats={stats} />}{tab === 'finans' && <Finance theme={theme} data={data} stats={stats} mode={financeMode} open={financeOpen} setMode={setMode} form={finance} setForm={setFinance} add={addFinance} remove={remove} />}{tab === 'hedef' && <Goals theme={theme} data={data} stats={stats} tab={goalTab} setTab={setGoalTab} goalOpen={goalOpen} setGoalOpen={setGoalOpen} manualOpen={manualOpen} setManualOpen={setManualOpen} itemGroupOpen={itemGroupOpen} setItemGroupOpen={setItemGroupOpen} drafts={drafts} setDrafts={setDrafts} addCatalogItem={addCatalogItem} manualItem={manualItem} setManualItem={setManualItem} addManualItem={addManualItem} patchItem={patchItem} remove={remove} />}{tab === 'plan' && <Plan theme={theme} data={data} save={save} planTab={planTab} setPlanTab={setPlanTab} task={task} setTask={setTask} noteDraft={noteDraft} setNoteDraft={setNoteDraft} remove={remove} />}{tab === 'ayar' && <Settings theme={theme} data={data} save={save} backupText={backupText} setBackupText={setBackupText} writeSaveFile={writeSaveFile} shareSaveFile={shareSaveFile} saveToFolder={saveToFolder} restoreFromFile={restoreFromFile} makeBackupText={makeBackupText} restoreBackupText={restoreBackupText} reset={() => save(defaultData)} />}</Animated.View>{toast ? <Pressable onPress={() => setToast('')} style={styles.toast}><LinearGradient colors={['#2E6BFF', '#8A5CFF']} style={styles.toastInner}><Text style={styles.toastText}>{toast}</Text></LinearGradient></Pressable> : null}<Nav theme={theme} active={tab} setActive={setTab} /></View>;
}

function Background({ float }) { const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -22] }); return <View pointerEvents="none" style={StyleSheet.absoluteFillObject}><Animated.View style={[styles.blobOne, { transform: [{ translateY: y }] }]} /><Animated.View style={[styles.blobTwo, { transform: [{ translateY: y }] }]} /><Animated.View style={[styles.blobThree, { transform: [{ translateY: y }] }]} /></View>; }
function Header({ theme }) { return <View style={styles.header}><View style={styles.brand}><LinearGradient colors={['#2EE6A6', '#2E6BFF']} style={styles.logo}><MaterialCommunityIcons name="palm-tree" size={26} color="white" /></LinearGradient><View><Text style={[styles.appTitle, { color: theme.text }]}>DraBornLife</Text><Text style={[styles.appSub, { color: theme.muted }]}>v0.3.1 Save sistemi</Text></View></View><View style={styles.version}><Text style={styles.versionText}>{VERSION}</Text></View></View>; }
function Panel({ theme, data, stats }) { const expenseGroups = groupSum(data.expenses); const itemGroups = groupSum(stats.favoriteItems.map((x) => ({ category: x.category, amount: itemPrice(x) }))); return <ScrollView contentContainerStyle={styles.scroll}><Today theme={theme} stats={stats} /><Hero stats={stats} data={data} /><Title theme={theme} title="Raporlar" sub="Favoriler ve gider kategorileri" /><MetricGrid stats={stats} data={data} /><Report theme={theme} title="Alınacaklar Kategori Raporu" groups={itemGroups} empty="Henüz favori ürün seçilmedi." /><Report theme={theme} title="Gider Kategori Raporu" groups={expenseGroups} empty="Henüz gider yok." /><GtaCard stats={stats} /></ScrollView>; }
function Today({ theme, stats }) { const net = stats.todayIncome - stats.todayExpense; return <LinearGradient colors={net >= 0 ? ['rgba(15,224,160,0.22)', 'rgba(46,107,255,0.16)'] : ['rgba(255,77,141,0.22)', 'rgba(255,158,44,0.14)']} style={[styles.todayCard, { borderColor: theme.line }]}><View style={styles.row}><Badge icon={net >= 0 ? 'trending-up' : 'trending-down'} colors={net >= 0 ? ['#0FE0A0', '#2E6BFF'] : ['#FF4D8D', '#FF9E2C']} /><View style={styles.flex}><Text style={[styles.titleSmall, { color: theme.text }]}>Bugünkü durum</Text><Text style={[styles.muted, { color: theme.muted }]}>Gelir {money(stats.todayIncome)} • Gider {money(stats.todayExpense)}</Text></View><Text style={[styles.value, { color: net >= 0 ? '#0FE0A0' : '#FF5A7A' }]}>{money(net)}</Text></View></LinearGradient>; }
function Hero({ stats, data }) { return <LinearGradient colors={['#0FE0A0', '#2E6BFF', '#8A5CFF']} style={styles.hero}><Text style={styles.heroKicker}>ANTALYA HAZIRLIK • KASIM BAŞI 2026</Text><Text style={styles.heroPercent}>%{stats.progress}</Text><Text style={styles.heroText}>{stats.days} gün kaldı. Son save: {compactDate(data.lastSaveAt)}</Text><Bar value={stats.progress} /><View style={styles.heroStats}><Mini label="Hedef" value={money(stats.target)} /><Mini label="Birikim" value={money(stats.saving)} /><Mini label="Eksik" value={money(stats.left)} /></View></LinearGradient>; }
function MetricGrid({ stats, data }) { return <View style={styles.metricGrid}><Metric colors={['#2E6BFF', '#31B5FF']} icon="calendar-month" label="Aylık gelir" value={money(stats.monthIncome)} /><Metric colors={['#FF4D8D', '#FF9E2C']} icon="calendar-month" label="Aylık gider" value={money(stats.monthExpense)} /><Metric colors={['#0FE0A0', '#27D3C3']} icon="star" label="Favori hedef" value={money(stats.favoriteTotal)} /><Metric colors={['#8A5CFF', '#FF4D6D']} icon="content-save" label="Save" value={`${data.saveHistory?.length || 0} adet`} /></View>; }
function Report({ theme, title, groups, empty }) { const total = groups.reduce((s, [, v]) => s + num(v), 0); return <Card theme={theme}><Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>{groups.length === 0 ? <Text style={[styles.body, { color: theme.muted }]}>{empty}</Text> : groups.map(([name, value]) => <View key={name} style={[styles.reportRow, { borderColor: theme.line, backgroundColor: theme.card2 }]}><View style={styles.rowBetween}><Text style={[styles.itemTitle, { color: theme.text }]}>{name}</Text><Text style={[styles.itemValue, { color: theme.text }]}>{money(value)}</Text></View><Text style={[styles.muted, { color: theme.muted }]}>%{pct(value, total)}</Text><Bar value={pct(value, total)} /></View>)}</Card>; }
function GtaCard({ stats }) { return <LinearGradient colors={['#FF4D8D', '#8A5CFF', '#2E6BFF']} style={styles.gtaCard}><Text style={styles.gtaKicker}>GTA 6 GERİ SAYIM</Text><Text style={styles.gtaDays}>{stats.gtaDays}</Text><Text style={styles.gtaText}>gün kaldı • Set maliyeti {money(stats.gtaTotal)}</Text></LinearGradient>; }
function Finance({ theme, data, stats, mode, open, setMode, form, setForm, add, remove }) { const key = mode === 'income' ? 'incomes' : mode === 'expense' ? 'expenses' : mode === 'saving' ? 'savings' : 'debts'; const list = data[key] || []; return <ScrollView contentContainerStyle={styles.scroll}><Title theme={theme} title="Finans" sub="Formlar kapalı başlar, dokununca açılır" />{financeModes.map(([id, label, icon, colors]) => <Card key={id} theme={theme}><Pressable onPress={() => setMode(id)} style={styles.row}><Badge icon={icon} colors={mode === id ? colors : ['#2C3E55', '#1D2D44']} /><View style={styles.flex}><Text style={[styles.cardTitle, { color: theme.text }]}>{label}</Text><Text style={[styles.muted, { color: theme.muted }]}>{open === id ? 'Kapatmak için dokun' : 'Açmak için dokun'}</Text></View><MaterialCommunityIcons name={open === id ? 'chevron-up' : 'chevron-down'} size={28} color={theme.muted} /></Pressable>{open === id ? <View style={styles.accordionBody}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{categoryMap[id].map((c) => <Pill key={c} theme={theme} active={form.category === c} label={c} onPress={() => setForm({ ...form, category: c })} />)}</ScrollView><Input theme={theme} label={id === 'debt' || form.category === 'Diğer' ? 'Başlık' : 'Başlık opsiyonel'} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} /><Input theme={theme} label="Tutar" value={form.amount} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, amount: v })} />{id === 'debt' ? <Input theme={theme} label="Ödenen" value={form.paid} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, paid: v })} /> : null}<Input theme={theme} label="Tarih" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} /><Input theme={theme} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} /><Button label="Kaydet" colors={colors} onPress={add} /></View> : null}</Card>)}<View style={styles.metricGrid}><Metric colors={['#2E6BFF', '#31B5FF']} icon="calendar-today" label="Bugün" value={money(mode === 'income' ? stats.todayIncome : mode === 'expense' ? stats.todayExpense : 0)} /><Metric colors={['#0FE0A0', '#27D3C3']} icon="calendar-week" label="7 gün" value={money(mode === 'income' ? stats.weekIncome : mode === 'expense' ? stats.weekExpense : stats.weekly)} /><Metric colors={['#FF9E2C', '#FF4D8D']} icon="calendar-month" label="Bu ay" value={money(mode === 'income' ? stats.monthIncome : mode === 'expense' ? stats.monthExpense : stats.monthSavings)} /><Metric colors={['#8A5CFF', '#FF4D6D']} icon="chart-bar" label="Kalan borç" value={money(stats.debtLeft)} /></View>{list.map((x) => <Record key={x.id} theme={theme} title={x.title} sub={`${x.category || 'Genel'} • ${x.date || ''}`} value={money(mode === 'debt' ? num(x.amount) - num(x.paid) : x.amount)} onDelete={() => remove(key, x.id)} />)}</ScrollView>; }
function Goals(p) { return <ScrollView contentContainerStyle={styles.scroll}><Title theme={p.theme} title="Hedefler & Alınacaklar" sub="Kategoriler kapalı başlar" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>{[['items', 'Alınacaklar', 'cart'], ['gta', '★ GTA 6', 'star-shooting'], ['motor', '★ Motor', 'motorbike']].map(([id, label, icon]) => <Mode key={id} active={p.tab === id} label={label} icon={icon} onPress={() => p.setTab(id)} />)}</ScrollView>{p.tab === 'items' ? <Shopping {...p} /> : p.tab === 'gta' ? <GtaGoal {...p} /> : <MotorGoal {...p} />}</ScrollView>; }
function Shopping({ theme, data, stats, goalOpen, setGoalOpen, manualOpen, setManualOpen, itemGroupOpen, setItemGroupOpen, drafts, setDrafts, addCatalogItem, manualItem, setManualItem, addManualItem, patchItem, remove }) { const updateDraft = (category, name, patch) => setDrafts({ ...drafts, [`${category}-${name}`]: { ...(drafts[`${category}-${name}`] || { status: 'Planlandı', cost: '' }), ...patch } }); return <><View style={styles.metricGrid}><Metric colors={['#FF9E2C', '#FF4D8D']} icon="calculator" label="Toplam" value={money(stats.itemsTotal)} /><Metric colors={['#0FE0A0', '#2E6BFF']} icon="star" label="Favori" value={money(stats.favoriteTotal)} /><Metric colors={['#8B5CF6', '#2E6BFF']} icon="cart" label="Kalan" value={money(stats.itemsLeft)} /><Metric colors={['#2E6BFF', '#31B5FF']} icon="format-list-checks" label="Adet" value={`${stats.boughtCount}/${data.items.length}`} /></View>{itemCategories.map((category) => <Card key={category} theme={theme}><Pressable onPress={() => setGoalOpen(goalOpen === category ? null : category)} style={styles.row}><Badge icon={itemIcons[category] || 'cart'} colors={goalOpen === category ? ['#8A5CFF', '#2E6BFF'] : ['#2C3E55', '#1D2D44']} /><View style={styles.flex}><Text style={[styles.cardTitle, { color: theme.text }]}>{category}</Text><Text style={[styles.muted, { color: theme.muted }]}>{goalOpen === category ? 'Ürünleri kapat' : 'Ürünleri göster'}</Text></View><MaterialCommunityIcons name={goalOpen === category ? 'chevron-up' : 'chevron-down'} size={28} color={theme.muted} /></Pressable>{goalOpen === category ? <View style={styles.accordionBody}>{(catalog[category] || []).map((name) => { const key = `${category}-${name}`; const draft = drafts[key] || {}; return <View key={key} style={[styles.innerCard, { borderColor: theme.line, backgroundColor: theme.card2 }]}><Text style={[styles.itemTitle, { color: theme.text }]}>{name}</Text><Input theme={theme} label="Ortalama fiyat" value={String(draft.cost || '')} keyboardType="numeric" onChangeText={(v) => updateDraft(category, name, { cost: v })} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{itemStatuses.map((s) => <Pill key={s} theme={theme} active={(draft.status || 'Planlandı') === s} label={s} onPress={() => updateDraft(category, name, { status: s })} />)}</ScrollView><Button label="Alınacaklara ekle" colors={['#8A5CFF', '#2E6BFF']} onPress={() => addCatalogItem(name, category)} /></View>; })}</View> : null}</Card>)}<Card theme={theme}><Pressable onPress={() => setManualOpen(!manualOpen)} style={styles.row}><Badge icon="playlist-plus" colors={manualOpen ? ['#FF9E2C', '#FF4D8D'] : ['#2C3E55', '#1D2D44']} /><View style={styles.flex}><Text style={[styles.cardTitle, { color: theme.text }]}>Manuel Ürün Ekle</Text><Text style={[styles.muted, { color: theme.muted }]}>{manualOpen ? 'Formu kapat' : 'Kendi ürününü ekle'}</Text></View><MaterialCommunityIcons name={manualOpen ? 'chevron-up' : 'chevron-down'} size={28} color={theme.muted} /></Pressable>{manualOpen ? <View style={styles.accordionBody}><Input theme={theme} label="Ürün adı" value={manualItem.name} onChangeText={(v) => setManualItem({ ...manualItem, name: v })} /><Input theme={theme} label="Opsiyonel kategori" value={manualItem.customCategory} onChangeText={(v) => setManualItem({ ...manualItem, customCategory: v })} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{itemCategories.map((c) => <Pill key={c} theme={theme} active={manualItem.category === c} label={c} onPress={() => setManualItem({ ...manualItem, category: c })} />)}</ScrollView><Input theme={theme} label="Ortalama fiyat" value={manualItem.averagePrice} keyboardType="numeric" onChangeText={(v) => setManualItem({ ...manualItem, averagePrice: v })} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{priorityOptions.map((x) => <Pill key={x} theme={theme} active={manualItem.priority === x} label={x} onPress={() => setManualItem({ ...manualItem, priority: x })} />)}</ScrollView><Input theme={theme} label="Not" value={manualItem.note} onChangeText={(v) => setManualItem({ ...manualItem, note: v })} /><Button label="Manuel ürünü kaydet" colors={['#FF9E2C', '#FF4D8D']} onPress={addManualItem} /></View> : null}</Card>{groupItems(data.items).map(([category, items]) => <Card key={category} theme={theme}><Pressable onPress={() => setItemGroupOpen(itemGroupOpen === category ? null : category)} style={styles.row}><Badge icon={itemIcons[category] || 'cart'} colors={['#FF9E2C', '#FF4D8D']} /><View style={styles.flex}><Text style={[styles.cardTitle, { color: theme.text }]}>{category}</Text><Text style={[styles.muted, { color: theme.muted }]}>{items.length} ürün • {money(items.reduce((s, x) => s + itemPrice(x), 0))}</Text></View><MaterialCommunityIcons name={itemGroupOpen === category ? 'chevron-up' : 'chevron-down'} size={28} color={theme.muted} /></Pressable>{itemGroupOpen === category ? <View style={styles.accordionBody}>{items.map((x) => <View key={x.id} style={[styles.innerCard, { borderColor: theme.line, backgroundColor: theme.card2 }]}><View style={styles.rowBetween}><Text style={[styles.itemTitle, { color: theme.text }]}>{x.favorite ? '★ ' : ''}{x.name}</Text><Text style={[styles.itemValue, { color: theme.text }]}>{money(itemPrice(x))}</Text></View><Text style={[styles.muted, { color: theme.muted }]}>Öncelik: {x.priority}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{itemStatuses.map((s) => <Pill key={s} theme={theme} active={x.status === s} label={s} onPress={() => patchItem(x.id, { status: s })} />)}</ScrollView><View style={styles.actions}><Pressable onPress={() => patchItem(x.id, { favorite: !x.favorite })}><Text style={styles.editText}>{x.favorite ? 'Favoriden çıkar' : 'Favori yap'}</Text></Pressable><Pressable onPress={() => remove('items', x.id)}><Text style={styles.deleteText}>Sil</Text></Pressable></View></View>)}</View> : null}</Card>)}</>; }
function GtaGoal({ theme, data, stats }) { return <Card theme={theme}><Text style={[styles.cardTitle, { color: theme.text }]}>★ GTA 6 Favori Hedefi</Text><Text style={[styles.body, { color: theme.muted }]}>Kalan gün: {stats.gtaDays}. Toplam set maliyeti: {money(stats.gtaTotal)}</Text>{(data.gtaGoal.items || []).map((x) => <View key={x.id} style={[styles.innerCard, { borderColor: theme.line, backgroundColor: theme.card2 }]}><Text style={[styles.itemTitle, { color: theme.text }]}>{x.name}</Text><Text style={[styles.muted, { color: theme.muted }]}>Ortalama fiyat: {money(x.cost)}</Text></View>)}</Card>; }
function MotorGoal({ theme, data, stats }) { return <Card theme={theme}><Text style={[styles.cardTitle, { color: theme.text }]}>★ Yeni MOTOR Favori Hedefi</Text><Text style={[styles.body, { color: theme.muted }]}>Hedef fiyat: {money(data.motorcycle.price)}. Birikmiş: {money(data.motorcycle.saved)}. Kalan: {money(Math.max(0, num(data.motorcycle.price) - num(data.motorcycle.saved)))}</Text><Bar value={pct(data.motorcycle.saved, data.motorcycle.price)} /></Card>; }
function Plan({ theme, data, save, planTab, setPlanTab, task, setTask, noteDraft, setNoteDraft, remove }) { return <ScrollView contentContainerStyle={styles.scroll}><Title theme={theme} title="Plan" sub="Taşınma, yapılacaklar ve notlar" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>{[['plan', 'Plan', 'map-marker'], ['tasks', 'Yapılacaklar', 'clipboard-check'], ['not', 'Notlar', 'note-text']].map(([id, label, icon]) => <Mode key={id} active={planTab === id} label={label} icon={icon} onPress={() => setPlanTab(id)} />)}</ScrollView>{planTab === 'plan' ? <Card theme={theme}><Text style={[styles.cardTitle, { color: theme.text }]}>Hedef şehir: Antalya</Text><Text style={[styles.body, { color: theme.muted }]}>{data.relocation.regions}{`\n`}{data.relocation.homeGoal}{`\n`}{fixAnkara(data.relocation.moveNote)}</Text></Card> : null}{planTab === 'tasks' ? <><Card theme={theme}><Input theme={theme} label="Yeni görev" value={task} onChangeText={setTask} /><Button label="Görev ekle" colors={['#8A5CFF', '#2E6BFF']} onPress={() => { if (task.trim()) { save({ ...data, checklist: [{ id: uid(), title: task.trim(), done: false }, ...data.checklist] }); setTask(''); } }} /></Card>{data.checklist.map((x) => <Card key={x.id} theme={theme}><Pressable style={styles.row} onPress={() => save({ ...data, checklist: data.checklist.map((i) => i.id === x.id ? { ...i, done: !i.done } : i) })}><MaterialCommunityIcons name={x.done ? 'check-circle' : 'circle-outline'} size={30} color={x.done ? '#0FE0A0' : theme.muted} /><Text style={[styles.itemTitle, { color: theme.text }]}>{x.title}</Text></Pressable><Delete onPress={() => remove('checklist', x.id)} /></Card>)}</> : null}{planTab === 'not' ? <><Card theme={theme}><Input theme={theme} label="Başlık" value={noteDraft.title} onChangeText={(v) => setNoteDraft({ ...noteDraft, title: v })} /><Input theme={theme} label="Not" value={noteDraft.body} onChangeText={(v) => setNoteDraft({ ...noteDraft, body: v })} multiline /><Button label="Not ekle" colors={['#FF4D8D', '#2E6BFF']} onPress={() => { if (noteDraft.title && noteDraft.body) { save({ ...data, notes: [{ id: uid(), ...noteDraft, date: new Date().toISOString() }, ...data.notes] }); setNoteDraft({ title: '', body: '' }); } }} /></Card>{data.notes.map((x) => <Record key={x.id} theme={theme} title={x.title} sub={new Date(x.date).toLocaleDateString('tr-TR')} note={x.body} onDelete={() => remove('notes', x.id)} />)}</> : null}</ScrollView>; }
function Settings({ theme, data, save, backupText, setBackupText, writeSaveFile, shareSaveFile, saveToFolder, restoreFromFile, makeBackupText, restoreBackupText, reset }) { return <ScrollView contentContainerStyle={styles.scroll}><Title theme={theme} title="Ayarlar" sub="v0.3.1 Save & Yedek sistemi" /><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Save & Yedek</Text><Text style={[styles.body, { color: theme.muted }]}>Otomatik Drive yok. Save dosyasını cihazda oluşturabilir, paylaş ekranından Drive’a manuel gönderebilirsin.</Text><View style={styles.saveMiniGrid}><SaveMini theme={theme} icon="content-save" label="Son save" value={compactDate(data.lastSaveAt)} /><SaveMini theme={theme} icon="history" label="Geçmiş" value={`${data.saveHistory?.length || 0} dosya`} /><SaveMini theme={theme} icon="cloud-off-outline" label="Drive" value="Manuel" /><SaveMini theme={theme} icon="calendar-check" label="Günlük" value={data.backupSettings?.dailyLocalSave !== false ? 'Açık' : 'Kapalı'} /></View><ActionButton icon="content-save" title="Cihaz içi save oluştur" sub="Uygulama klasörüne JSON dosyası yazar" colors={['#2E6BFF', '#8A5CFF']} onPress={() => writeSaveFile('Manuel cihaz içi')} /><ActionButton icon="folder-download" title="Klasör seçerek kaydet" sub="Dosyalar/Downloads gibi klasör seç" colors={['#0FE0A0', '#2E6BFF']} onPress={saveToFolder} /><ActionButton icon="share-variant" title="Paylaş / Drive’a manuel gönder" sub="Android paylaş ekranını açar" colors={['#FF9E2C', '#FF4D8D']} onPress={shareSaveFile} /><ActionButton icon="file-upload" title="Save dosyası seç ve geri yükle" sub="JSON yedeği uygulamaya yükler" colors={['#8A5CFF', '#2E6BFF']} onPress={restoreFromFile} /><Pressable onPress={() => save({ ...data, backupSettings: { ...data.backupSettings, dailyLocalSave: data.backupSettings?.dailyLocalSave === false } })} style={[styles.toggle, { borderColor: theme.line, backgroundColor: theme.card2 }]}><MaterialCommunityIcons name={data.backupSettings?.dailyLocalSave !== false ? 'toggle-switch' : 'toggle-switch-off'} size={38} color={data.backupSettings?.dailyLocalSave !== false ? '#0FE0A0' : theme.muted} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>Günlük yerel save</Text><Text style={[styles.muted, { color: theme.muted }]}>Uygulama açılınca günde 1 kez cihaz içine save alır.</Text></View></Pressable></Card><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Save Geçmişi</Text>{(data.saveHistory || []).length === 0 ? <Text style={[styles.body, { color: theme.muted }]}>Henüz save yok.</Text> : data.saveHistory.slice(0, 10).map((h) => <View key={h.id} style={[styles.historyRow, { borderColor: theme.line, backgroundColor: theme.card2 }]}><MaterialCommunityIcons name="file-document" size={24} color="#31B5FF" /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{h.type}</Text><Text style={[styles.muted, { color: theme.muted }]}>{h.name}{`\n`}{compactDate(h.createdAt)}</Text></View></View>)}</Card><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>JSON Save Metni</Text><Text style={[styles.body, { color: theme.muted }]}>Dosya yazma sorunu olursa yedek metin olarak da saklayabilirsin.</Text><Button label="JSON metni oluştur" colors={['#2E6BFF', '#8A5CFF']} onPress={makeBackupText} /><Input theme={theme} label="Save JSON" value={backupText} onChangeText={setBackupText} multiline /><Button label="JSON metninden geri yükle" colors={['#0FE0A0', '#2E6BFF']} onPress={restoreBackupText} /></Card><Card theme={theme}><Text style={[styles.cardTitleBig, { color: theme.text }]}>Tema</Text><View style={styles.themeRow}><Button label="Koyu" colors={['#08111F', '#2E6BFF']} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'dark' } })} /><Button label="Açık" colors={['#EAF2FF', '#B9D7FF']} onPress={() => save({ ...data, settings: { ...data.settings, theme: 'light' } })} /></View><Pressable onPress={reset}><Text style={styles.deleteText}>Verileri sıfırla</Text></Pressable></Card></ScrollView>; }

function Card({ theme, children }) { return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.line }]}>{children}</View>; }
function Title({ theme, title, sub }) { return <View style={styles.screenTitle}><Text style={[styles.screenText, { color: theme.text }]}>{title}</Text><Text style={[styles.screenSub, { color: theme.muted }]}>{sub}</Text></View>; }
function Badge({ icon, colors }) { return <LinearGradient colors={colors} style={styles.badge}><MaterialCommunityIcons name={icon} size={25} color="white" /></LinearGradient>; }
function SaveMini({ theme, icon, label, value }) { return <View style={[styles.saveMini, { borderColor: theme.line, backgroundColor: theme.card2 }]}><MaterialCommunityIcons name={icon} size={22} color="#31B5FF" /><Text style={[styles.saveMiniValue, { color: theme.text }]} numberOfLines={1}>{value}</Text><Text style={[styles.saveMiniLabel, { color: theme.muted }]}>{label}</Text></View>; }
function ActionButton({ icon, title, sub, colors, onPress }) { return <Pressable onPress={onPress}><LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}><MaterialCommunityIcons name={icon} size={25} color="white" /><View style={styles.flex}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionSub}>{sub}</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color="white" /></LinearGradient></Pressable>; }
function Input({ theme, label, multiline, ...props }) { return <View style={styles.field}>{label ? <Text style={[styles.label, { color: theme.muted }]}>{label}</Text> : null}<TextInput placeholderTextColor="#8CA0BA" style={[styles.input, multiline && styles.multi, { color: theme.text, borderColor: theme.line, backgroundColor: theme.card2 }]} multiline={multiline} {...props} /></View>; }
function Button({ label, colors, onPress }) { return <Pressable onPress={onPress} style={styles.buttonWrap}><LinearGradient colors={colors} style={styles.button}><Text style={styles.buttonText}>{label}</Text></LinearGradient></Pressable>; }
function Bar({ value }) { return <View style={styles.track}><LinearGradient colors={['#0FE0A0', '#2E6BFF', '#8A5CFF']} style={[styles.fill, { width: `${Math.max(0, value)}%` }]} /></View>; }
function Mini({ label, value }) { return <View><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>; }
function Metric({ colors, icon, label, value }) { return <LinearGradient colors={colors} style={styles.metric}><MaterialCommunityIcons name={icon} size={25} color="white" /><Text numberOfLines={2} style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></LinearGradient>; }
function Pill({ theme, active, label, onPress }) { return <Pressable onPress={onPress} style={[styles.pill, { borderColor: active ? '#31B5FF' : theme.line, backgroundColor: active ? 'rgba(49,181,255,0.18)' : 'transparent' }]}><Text style={[styles.pillText, { color: active ? '#31B5FF' : theme.muted }]}>{label}</Text></Pressable>; }
function Mode({ active, label, icon, onPress }) { return <Pressable onPress={onPress} style={styles.mode}><LinearGradient colors={active ? ['#0FE0A0', '#2E6BFF'] : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)']} style={styles.modeInner}><MaterialCommunityIcons name={icon} size={25} color="white" /><Text style={styles.modeText}>{label}</Text></LinearGradient></Pressable>; }
function Record({ theme, title, sub, value, note, onDelete }) { return <Card theme={theme}><View style={styles.rowBetween}><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>{sub ? <Text style={[styles.muted, { color: theme.muted }]}>{sub}</Text> : null}</View>{value ? <Text style={[styles.itemValue, { color: theme.text }]}>{value}</Text> : null}</View>{note ? <Text style={[styles.body, { color: theme.muted }]}>{note}</Text> : null}{onDelete ? <Delete onPress={onDelete} /> : null}</Card>; }
function Delete({ onPress }) { return <Pressable onPress={onPress}><Text style={styles.deleteText}>Sil</Text></Pressable>; }
function Nav({ theme, active, setActive }) { const items = [['panel', 'Panel', 'home'], ['finans', 'Finans', 'wallet'], ['hedef', 'Hedefler', 'star-shooting'], ['plan', 'Plan', 'map-marker'], ['ayar', 'Ayar', 'cog']]; return <View style={[styles.nav, { backgroundColor: theme.nav, borderColor: theme.line }]}>{items.map(([id, label, icon]) => <Pressable key={id} onPress={() => setActive(id)} style={styles.navItem}>{active === id ? <LinearGradient colors={['#0FE0A0', '#2E6BFF']} style={styles.navActive}><MaterialCommunityIcons name={icon} size={24} color="white" /></LinearGradient> : <MaterialCommunityIcons name={icon} size={26} color={theme.muted} />}<Text style={[styles.navLabel, { color: active === id ? theme.text : theme.muted }]}>{label}</Text></Pressable>)}</View>; }

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 34 }, flex: { flex: 1 }, blobOne: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -80, right: -100, backgroundColor: 'rgba(46,107,255,0.24)' }, blobTwo: { position: 'absolute', width: 210, height: 210, borderRadius: 105, top: 250, left: -105, backgroundColor: 'rgba(15,224,160,0.17)' }, blobThree: { position: 'absolute', width: 170, height: 170, borderRadius: 85, bottom: 70, right: -70, backgroundColor: 'rgba(138,92,255,0.20)' },
  header: { paddingHorizontal: 18, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, appTitle: { fontSize: 31, fontWeight: '900', letterSpacing: -1.1 }, appSub: { fontSize: 14, fontWeight: '800', marginTop: 2 }, version: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.16)' }, versionText: { color: 'white', fontWeight: '900', fontSize: 15 },
  scroll: { padding: 18, paddingBottom: 122 }, screenTitle: { marginBottom: 12, marginTop: 6 }, screenText: { fontSize: 31, fontWeight: '900', letterSpacing: -1 }, screenSub: { fontSize: 15, fontWeight: '800', marginTop: 3 }, card: { borderWidth: 1, borderRadius: 26, padding: 16, marginBottom: 12 }, cardTitleBig: { fontSize: 22, fontWeight: '900' }, cardTitle: { fontSize: 18, fontWeight: '900' }, body: { fontSize: 15, lineHeight: 22, fontWeight: '750', marginTop: 8 }, muted: { fontSize: 13, lineHeight: 19, fontWeight: '800', marginTop: 3 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }, badge: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 32, padding: 21, overflow: 'hidden', marginBottom: 14 }, heroKicker: { color: 'rgba(255,255,255,0.84)', fontSize: 12, fontWeight: '900', letterSpacing: 1 }, heroPercent: { color: 'white', fontSize: 58, fontWeight: '900', letterSpacing: -2, marginTop: 4 }, heroText: { color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 23, fontWeight: '800' }, heroStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }, miniLabel: { color: 'rgba(255,255,255,0.76)', fontSize: 12, fontWeight: '900' }, miniValue: { color: 'white', fontSize: 16, fontWeight: '900', marginTop: 4 },
  todayCard: { borderWidth: 1, borderRadius: 28, padding: 15, marginBottom: 12 }, titleSmall: { fontSize: 21, fontWeight: '900' }, value: { fontSize: 17, fontWeight: '900' }, track: { height: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden', marginTop: 14 }, fill: { height: '100%', borderRadius: 99 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }, metric: { width: '48.5%', minHeight: 116, borderRadius: 24, padding: 14, justifyContent: 'space-between' }, metricValue: { color: 'white', fontSize: 16, lineHeight: 22, fontWeight: '900' }, metricLabel: { color: 'rgba(255,255,255,0.84)', fontSize: 12, fontWeight: '900' }, reportRow: { borderWidth: 1, borderRadius: 20, padding: 12, marginTop: 10 }, gtaCard: { borderRadius: 32, padding: 21, marginBottom: 14 }, gtaKicker: { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: '900', letterSpacing: 1 }, gtaDays: { color: 'white', fontSize: 62, fontWeight: '900', letterSpacing: -2, marginTop: 4 }, gtaText: { color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 23, fontWeight: '800', marginTop: 6 },
  saveMiniGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, marginBottom: 6 }, saveMini: { width: '48.5%', minHeight: 74, borderRadius: 20, borderWidth: 1, padding: 11, justifyContent: 'space-between' }, saveMiniValue: { fontSize: 14, fontWeight: '900', marginTop: 4 }, saveMiniLabel: { fontSize: 11, fontWeight: '900' }, actionButton: { minHeight: 72, borderRadius: 22, marginTop: 10, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }, actionTitle: { color: 'white', fontSize: 15, fontWeight: '900' }, actionSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, lineHeight: 17, fontWeight: '800', marginTop: 2 }, toggle: { marginTop: 12, borderWidth: 1, borderRadius: 22, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }, historyRow: { borderWidth: 1, borderRadius: 18, padding: 11, marginTop: 9, flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeRow: { gap: 10, paddingBottom: 12 }, mode: { borderRadius: 24, overflow: 'hidden' }, modeInner: { minWidth: 112, height: 78, padding: 14, borderRadius: 24, justifyContent: 'space-between' }, modeText: { color: 'white', fontSize: 14, fontWeight: '900' }, accordionBody: { marginTop: 14 }, innerCard: { borderWidth: 1, borderRadius: 22, padding: 13, marginTop: 10 }, itemTitle: { fontSize: 16, fontWeight: '900' }, itemValue: { fontSize: 15, fontWeight: '900', marginTop: 4 }, field: { marginTop: 10 }, label: { fontSize: 13, fontWeight: '900', marginBottom: 7 }, input: { minHeight: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, fontSize: 16, fontWeight: '800' }, multi: { minHeight: 116, textAlignVertical: 'top', paddingTop: 12 }, pillRow: { flexDirection: 'row', gap: 8, paddingVertical: 10 }, pill: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 99, borderWidth: 1 }, pillText: { fontSize: 13, fontWeight: '900' }, buttonWrap: { marginTop: 14, borderRadius: 20, overflow: 'hidden' }, button: { height: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 }, buttonText: { color: 'white', fontSize: 15, fontWeight: '900' }, themeRow: { flexDirection: 'row', gap: 10 }, actions: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }, editText: { color: '#31B5FF', fontSize: 15, fontWeight: '900', marginTop: 12 }, deleteText: { color: '#FF5A7A', fontSize: 15, fontWeight: '900', marginTop: 12 },
  nav: { position: 'absolute', left: 14, right: 14, bottom: 14, height: 82, borderRadius: 32, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navActive: { width: 46, height: 38, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, navLabel: { fontSize: 12, fontWeight: '900', marginTop: 4 }, toast: { position: 'absolute', left: 18, right: 18, bottom: 106, borderRadius: 20, overflow: 'hidden' }, toastInner: { padding: 14 }, toastText: { color: 'white', fontWeight: '900', textAlign: 'center', fontSize: 15 }
});
