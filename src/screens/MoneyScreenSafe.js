import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencySelector } from '../components/CurrencySelector';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

const categories = ['Maaş', 'Ek gelir', 'Ev', 'Market', 'Ulaşım', 'Borç', 'Eğlence', 'Diğer'];
const typeFilters = [{ key: 'all', label: 'Tümü' }, { key: 'income', label: 'Gelir' }, { key: 'expense', label: 'Gider' }];

export function MoneyScreenSafe({ lifeData, onSave }) {
  const [form, setForm] = useState({ type: 'income', title: '', amount: '', category: 'Diğer', savingPartAmount: '', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const entries = lifeData?.moneyEntries || [];
  const money = (value) => formatMoney(value, lifeData);

  const totals = useMemo(() => ({
    income: entries.filter(x => x.type === 'income').reduce((t, x) => t + n(x.amount), 0),
    expense: entries.filter(x => x.type === 'expense').reduce((t, x) => t + n(x.amount), 0),
    saving: entries.reduce((t, x) => t + n(x.savingPartAmount), 0),
  }), [entries]);
  totals.net = totals.income - totals.expense;

  const visible = entries.filter(e => (typeFilter === 'all' || e.type === typeFilter) && (categoryFilter === 'Tümü' || e.category === categoryFilter));
  const setField = (key, value) => setForm({ ...form, [key]: value });
  const info = (text) => setNotice({ text, type: 'info' });
  const error = (text) => setNotice({ text, type: 'error' });

  function clearForm() {
    setEditingId(null);
    setForm({ type: 'income', title: '', amount: '', category: 'Diğer', savingPartAmount: '', note: '' });
  }

  function saveEntry() {
    const title = form.title.trim();
    const amount = n(form.amount);
    const saving = n(form.savingPartAmount);
    if (!title) return error('Başlık boş olamaz.');
    if (!form.amount.trim() || amount <= 0) return error('Tutar 0’dan büyük olmalı. Negatif veya hatalı tutar kaydedilmez.');
    if (form.type === 'income' && form.savingPartAmount.trim() && saving < 0) return error('Birikime ayrılan tutar negatif olamaz.');
    if (form.type === 'income' && saving > amount) return error('Birikime ayrılan tutar gelir tutarından büyük olamaz.');

    const old = entries.find(x => x.id === editingId);
    const next = { id: editingId || `money_${Date.now()}`, type: form.type, title, amount, category: form.category, date: old?.date || new Date().toISOString(), updatedAt: editingId ? new Date().toISOString() : undefined, note: form.note.trim(), savingPartAmount: form.type === 'income' ? saving : 0 };
    const nextEntries = editingId ? entries.map(x => x.id === editingId ? next : x) : [next, ...entries];
    onSave({ ...lifeData, moneyEntries: nextEntries });
    info(editingId ? 'Gelir-gider kaydı güncellendi.' : 'Gelir-gider kaydı eklendi.');
    clearForm();
  }

  function editEntry(e) {
    setEditingId(e.id);
    setForm({ type: e.type || 'income', title: e.title || '', amount: String(e.amount || ''), category: e.category || 'Diğer', savingPartAmount: String(e.savingPartAmount || ''), note: e.note || '' });
    info('Düzenleme modu açıldı. Değişiklikleri yapıp Güncelle butonuna bas.');
  }

  function removeEntry(id) {
    onSave({ ...lifeData, moneyEntries: entries.filter(x => x.id !== id) });
    if (editingId === id) clearForm();
    info('Gelir-gider kaydı silindi.');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <Header title="Para paneli" text="Gelir, gider, birikim ve kategorileri ayrı kartlarda takip et." />
      <NoticeBox message={notice.text} type={notice.type} />
      <CurrencySelector lifeData={lifeData} onSave={onSave} />

      <Panel title="Finans özeti" note="Bu kartlar seçili para birimine göre gösterilir.">
        <View style={{ flexDirection: 'row', marginTop: 10 }}><Card label="Gelir" value={money(totals.income)} /><Card label="Gider" value={money(totals.expense)} /></View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Card label="Net" value={money(totals.net)} /><Card label="Birikime ayrılan" value={money(totals.saving)} /></View>
      </Panel>

      <Panel title={editingId ? 'Kaydı düzenle' : 'Yeni gelir / gider kaydı'} note="Önce gelir mi gider mi olduğunu seç, sonra kategoriye ayır.">
        <View style={{ flexDirection: 'row', marginTop: 12 }}><TypeButton label="Gelir" active={form.type === 'income'} onPress={() => setField('type', 'income')} /><TypeButton label="Gider" active={form.type === 'expense'} onPress={() => setField('type', 'expense')} /></View>
        <Input label="Başlık" value={form.title} onChangeText={v => setField('title', v)} placeholder="Örn: Günlük kazanç" />
        <Input label="Tutar" value={form.amount} onChangeText={v => setField('amount', v)} placeholder="Örn: 1500" keyboardType="numeric" />
        {form.type === 'income' && <Input label="Birikime ayrılan" value={form.savingPartAmount} onChangeText={v => setField('savingPartAmount', v)} placeholder="Örn: 500" keyboardType="numeric" />}
        <Text style={labelStyle}>Kategori</Text><Chips items={categories} active={form.category} onPick={v => setField('category', v)} />
        <Input label="Not" value={form.note} onChangeText={v => setField('note', v)} placeholder="İsteğe bağlı" />
        <MainButton label={editingId ? 'Güncelle' : 'Kaydet'} onPress={saveEntry} color="#FFB347" />
        {editingId && <MainButton label="Düzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
      </Panel>

      <Panel title="Gösterilecek kayıtlar" note="Kayıtları önce gelir-gider tipine, sonra kategoriye göre süz.">
        <Text style={labelStyle}>Kayıt tipi</Text>
        <Chips items={typeFilters.map(x => x.label)} active={typeFilters.find(x => x.key === typeFilter)?.label || 'Tümü'} onPick={label => setTypeFilter(typeFilters.find(x => x.label === label)?.key || 'all')} />
        <Text style={labelStyle}>Kategori</Text>
        <Chips items={['Tümü', ...categories]} active={categoryFilter} onPick={setCategoryFilter} />
      </Panel>

      <Panel title="Son işlemler" note={`${visible.length} kayıt gösteriliyor.`}>
        {visible.length === 0 ? <Text style={emptyText}>Bu filtreye uygun kayıt yok.</Text> : visible.map(e => <Row key={e.id} entry={e} onEdit={editEntry} onDelete={removeEntry} money={money} />)}
      </Panel>
    </ScrollView>
  );
}

function Header({ title, text }) { return <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 }}><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL} • Expo Go</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>{text}</Text></View>; }
function Panel({ title, note, children }) { return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text>{!!note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{note}</Text>}{children}</View>; }
function Card({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 18, lineHeight: 23, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function TypeButton({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 13, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#E7F4F4', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Chips({ items, active, onPick }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{items.map(x => <TouchableOpacity key={x} onPress={() => onPick(x)} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active === x ? '#2DE2E6' : '#E7F4F4', borderWidth: 1, borderColor: active === x ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{x}</Text></TouchableOpacity>)}</ScrollView>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={labelStyle}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function MainButton({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Row({ entry, onEdit, onDelete, money }) { const inc = entry.type === 'income'; return <View style={{ marginTop: 9, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{entry.title}</Text><Text style={{ color: inc ? '#128C7E' : '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{inc ? '+' : '-'} {money(entry.amount)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{inc ? 'Gelir' : 'Gider'} • {entry.category}</Text>{inc && n(entry.savingPartAmount) > 0 && <Text style={{ marginTop: 5, color: '#128C7E', fontSize: 12, fontWeight: '800' }}>Birikime: {money(entry.savingPartAmount)}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><MainButtonSmall label="Düzenle" color="#2DE2E6" onPress={() => onEdit(entry)} /><MainButtonSmall label="Sil" color="#FFD0D8" text="#7A1E2B" onPress={() => onDelete(entry.id)} /></View></View>; }
function MainButtonSmall({ label, color, text = '#06202A', onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: text, fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
const labelStyle = { marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' };
const emptyText = { marginTop: 8, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '700' };
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
