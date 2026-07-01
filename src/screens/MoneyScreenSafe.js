import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencySelector } from '../components/CurrencySelector';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

const incomeCategories = ['Maaş', 'Günlük kazanç', 'Ek gelir', 'Satış', 'Diğer'];
const expenseCategories = ['Ev', 'Market', 'Ulaşım', 'Borç', 'Eğlence', 'Çocuk', 'Diğer'];
const categories = ['Maaş', 'Günlük kazanç', 'Ek gelir', 'Satış', 'Ev', 'Market', 'Ulaşım', 'Borç', 'Eğlence', 'Çocuk', 'Diğer'];
const quickTemplates = [
  { type: 'income', title: 'Günlük kazanç', category: 'Günlük kazanç', savingRate: 35 },
  { type: 'income', title: 'Ek gelir', category: 'Ek gelir', savingRate: 50 },
  { type: 'expense', title: 'Market', category: 'Market', savingRate: 0 },
  { type: 'expense', title: 'Ulaşım', category: 'Ulaşım', savingRate: 0 },
  { type: 'expense', title: 'Borç ödemesi', category: 'Borç', savingRate: 0 },
];
const typeFilters = [{ key: 'all', label: 'Tümü' }, { key: 'income', label: 'Gelir' }, { key: 'expense', label: 'Gider' }];

export function MoneyScreenSafe({ lifeData, onSave }) {
  const [form, setForm] = useState({ type: 'income', title: '', amount: '', category: 'Diğer', savingPartAmount: '', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const entries = lifeData?.moneyEntries || [];
  const money = (value) => formatMoney(value, lifeData);

  const totals = useMemo(() => {
    const income = entries.filter(x => x.type === 'income').reduce((t, x) => t + n(x.amount), 0);
    const expense = entries.filter(x => x.type === 'expense').reduce((t, x) => t + n(x.amount), 0);
    const saving = entries.reduce((t, x) => t + n(x.savingPartAmount), 0);
    const week = period(entries, 7);
    const month = period(entries, 30);
    const today = period(entries, 1);
    return { income, expense, saving, net: income - expense, week, month, today, savingRate: income > 0 ? Math.round((saving / income) * 100) : 0 };
  }, [entries]);

  const visible = entries.filter(e => (typeFilter === 'all' || e.type === typeFilter) && (categoryFilter === 'Tümü' || e.category === categoryFilter));
  const activeCategories = form.type === 'income' ? incomeCategories : expenseCategories;
  const setField = (key, value) => setForm({ ...form, [key]: value });
  const info = (text) => setNotice({ text, type: 'info' });
  const error = (text) => setNotice({ text, type: 'error' });

  function clearForm() { setEditingId(null); setForm({ type: 'income', title: '', amount: '', category: 'Diğer', savingPartAmount: '', note: '' }); }
  function applyTemplate(template) { setEditingId(null); setForm({ type: template.type, title: template.title, amount: '', category: template.category, savingPartAmount: '', note: template.type === 'income' ? `Öneri: gelirden %${template.savingRate} birikime ayır.` : '' }); info(`${template.title} şablonu açıldı. Tutarı girip kaydedebilirsin.`); }
  function autoSaving(rate) { const amount = n(form.amount); if (amount <= 0) return error('Önce gelir tutarını gir.'); setField('savingPartAmount', String(Math.round(amount * rate / 100))); info(`Birikime ayrılan tutar %${rate} olarak hesaplandı.`); }

  function saveEntry() {
    const title = form.title.trim(); const amount = n(form.amount); const saving = n(form.savingPartAmount);
    if (!title) return error('Başlık boş olamaz.');
    if (!form.amount.trim() || amount <= 0) return error('Tutar 0’dan büyük olmalı.');
    if (form.type === 'income' && form.savingPartAmount.trim() && saving < 0) return error('Birikime ayrılan tutar negatif olamaz.');
    if (form.type === 'income' && saving > amount) return error('Birikime ayrılan tutar gelir tutarından büyük olamaz.');
    const old = entries.find(x => x.id === editingId);
    const next = { id: editingId || `money_${Date.now()}`, type: form.type, title, amount, category: form.category, date: old?.date || new Date().toISOString(), updatedAt: editingId ? new Date().toISOString() : undefined, note: form.note.trim(), savingPartAmount: form.type === 'income' ? saving : 0 };
    const nextEntries = editingId ? entries.map(x => x.id === editingId ? next : x) : [next, ...entries];
    onSave({ ...lifeData, moneyEntries: nextEntries });
    info(editingId ? 'Gelir-gider kaydı güncellendi.' : 'Gelir-gider kaydı eklendi.');
    clearForm();
  }

  function editEntry(e) { setEditingId(e.id); setForm({ type: e.type || 'income', title: e.title || '', amount: String(e.amount || ''), category: e.category || 'Diğer', savingPartAmount: String(e.savingPartAmount || ''), note: e.note || '' }); info('Düzenleme modu açıldı.'); }
  function removeEntry(id) { onSave({ ...lifeData, moneyEntries: entries.filter(x => x.id !== id) }); if (editingId === id) clearForm(); info('Gelir-gider kaydı silindi.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <Header title="Para paneli" text="Günlük gelir, gider ve birikim girişini hızlı şablonlarla takip et." />
      <NoticeBox message={notice.text} type={notice.type} />
      <CurrencySelector lifeData={lifeData} onSave={onSave} />

      <Panel title="Finans özeti" note="Bugün, hafta ve ay akışını hızlıca gör.">
        <View style={{ flexDirection: 'row', marginTop: 10 }}><Card label="Gelir" value={money(totals.income)} /><Card label="Gider" value={money(totals.expense)} /></View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Card label="Net" value={money(totals.net)} /><Card label="Birikim" value={money(totals.saving)} /></View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Card label="Bugün net" value={money(totals.today.net)} /><Card label="Birikim oranı" value={`%${totals.savingRate}`} /></View>
      </Panel>

      <Panel title="Nakit akışı" note="Son 7 gün ve son 30 gün net durum.">
        <View style={{ flexDirection: 'row', marginTop: 10 }}><Card label="7 gün net" value={money(totals.week.net)} /><Card label="30 gün net" value={money(totals.month.net)} /></View>
      </Panel>

      <Panel title="Hızlı işlem" note="Sık kullanılan giriş tipini seç, sadece tutarı girip kaydet.">
        <Chips items={quickTemplates.map(x => x.title)} active="" onPick={name => applyTemplate(quickTemplates.find(x => x.title === name))} />
      </Panel>

      <Panel title={editingId ? 'Kaydı düzenle' : 'Yeni gelir / gider kaydı'} note="Gelirde birikime ayrılan tutarı otomatik hesaplayabilirsin.">
        <View style={{ flexDirection: 'row', marginTop: 12 }}><TypeButton label="Gelir" active={form.type === 'income'} onPress={() => setForm({ ...form, type: 'income', category: 'Günlük kazanç' })} /><TypeButton label="Gider" active={form.type === 'expense'} onPress={() => setForm({ ...form, type: 'expense', category: 'Market', savingPartAmount: '' })} /></View>
        <Input label="Başlık" value={form.title} onChangeText={v => setField('title', v)} placeholder="Örn: Günlük kazanç" />
        <Input label="Tutar" value={form.amount} onChangeText={v => setField('amount', v)} placeholder="Örn: 1500" keyboardType="numeric" />
        {form.type === 'income' && <><Input label="Birikime ayrılan" value={form.savingPartAmount} onChangeText={v => setField('savingPartAmount', v)} placeholder="Örn: 500" keyboardType="numeric" /><View style={{ flexDirection: 'row', marginTop: 8 }}><QuickSave label="%25" onPress={() => autoSaving(25)} /><QuickSave label="%35" onPress={() => autoSaving(35)} /><QuickSave label="%50" onPress={() => autoSaving(50)} /></View></>}
        <Text style={labelStyle}>Kategori</Text><Chips items={activeCategories} active={form.category} onPick={v => setField('category', v)} />
        <Input label="Not" value={form.note} onChangeText={v => setField('note', v)} placeholder="İsteğe bağlı" />
        <MainButton label={editingId ? 'Güncelle' : 'Kaydet'} onPress={saveEntry} color="#FFB347" />
        {editingId && <MainButton label="Düzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
      </Panel>

      <Panel title="Gösterilecek kayıtlar" note="Kayıtları önce gelir-gider tipine, sonra kategoriye göre süz.">
        <Text style={labelStyle}>Kayıt tipi</Text><Chips items={typeFilters.map(x => x.label)} active={typeFilters.find(x => x.key === typeFilter)?.label || 'Tümü'} onPick={label => setTypeFilter(typeFilters.find(x => x.label === label)?.key || 'all')} />
        <Text style={labelStyle}>Kategori</Text><Chips items={['Tümü', ...categories]} active={categoryFilter} onPick={setCategoryFilter} />
      </Panel>

      <Panel title="Son işlemler" note={`${visible.length} kayıt gösteriliyor.`}>
        {visible.length === 0 ? <Text style={emptyText}>Bu filtreye uygun kayıt yok.</Text> : visible.map(e => <Row key={e.id} entry={e} onEdit={editEntry} onDelete={removeEntry} money={money} />)}
      </Panel>
    </ScrollView>
  );
}

function Header({ title, text }) { return <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 }}><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL} • Expo Go</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>{text}</Text></View>; }
function Panel({ title, note, children }) { return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text>{!!note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{note}</Text>}{children}</View>; }
function Card({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 17, lineHeight: 22, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function TypeButton({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 13, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#E7F4F4', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Chips({ items, active, onPick }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{items.map(x => <TouchableOpacity key={x} onPress={() => onPick(x)} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active === x ? '#2DE2E6' : '#E7F4F4', borderWidth: 1, borderColor: active === x ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{x}</Text></TouchableOpacity>)}</ScrollView>; }
function QuickSave({ label, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: '#E7F4F4', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label} birikim</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={labelStyle}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function MainButton({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Row({ entry, onEdit, onDelete, money }) { const inc = entry.type === 'income'; return <View style={{ marginTop: 9, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{entry.title}</Text><Text style={{ color: inc ? '#128C7E' : '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{inc ? '+' : '-'} {money(entry.amount)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{inc ? 'Gelir' : 'Gider'} • {entry.category}</Text>{inc && n(entry.savingPartAmount) > 0 && <Text style={{ marginTop: 5, color: '#128C7E', fontSize: 12, fontWeight: '800' }}>Birikime: {money(entry.savingPartAmount)}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><MainButtonSmall label="Düzenle" color="#2DE2E6" onPress={() => onEdit(entry)} /><MainButtonSmall label="Sil" color="#FFD0D8" text="#7A1E2B" onPress={() => onDelete(entry.id)} /></View></View>; }
function MainButtonSmall({ label, color, text = '#06202A', onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: text, fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
const labelStyle = { marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' };
const emptyText = { marginTop: 8, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '700' };
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
function period(entries, days) { const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1); const list = entries.filter(x => { const d = new Date(x.date || 0); return !Number.isNaN(d.getTime()) && d >= start; }); const income = list.filter(x => x.type === 'income').reduce((t, x) => t + n(x.amount), 0); const expense = list.filter(x => x.type === 'expense').reduce((t, x) => t + n(x.amount), 0); return { income, expense, net: income - expense }; }
