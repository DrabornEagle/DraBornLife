import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencySelector } from '../components/CurrencySelector';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

const categories = ['Kira / Depozito', 'Beyaz eşya', 'Mobilya', 'Mutfak / ev temel', 'Çocuk odası', 'İlk ay yaşam', 'Antalya eğlence', 'GTA 6 seti', 'Motosiklet'];
const statuses = [{ key: 'all', label: 'Tümü' }, { key: 'ready', label: 'Parası Birikti' }, { key: 'purchased', label: 'Satın Alındı' }, { key: 'remaining', label: 'Kalanlar' }];

export function ShoppingScreenSafe({ lifeData, onSave }) {
  const [form, setForm] = useState({ category: 'Mobilya', title: '', estimatedPrice: '', quantity: '1', savedAmount: '', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const items = lifeData?.shoppingItems || [];
  const money = (value) => formatMoney(value, lifeData);

  const visible = items.filter(item => {
    const categoryOk = categoryFilter === 'Tümü' || item.category === categoryFilter;
    const statusOk = statusFilter === 'all' || (statusFilter === 'ready' && item.isMoneyReady) || (statusFilter === 'purchased' && item.isPurchasedOrInstalled) || (statusFilter === 'remaining' && !item.isPurchasedOrInstalled);
    return categoryOk && statusOk;
  });

  const summary = useMemo(() => {
    const total = items.reduce((s, x) => s + itemTotal(x), 0);
    const saved = items.reduce((s, x) => s + n(x.savedAmount), 0);
    const purchased = items.filter(x => x.isPurchasedOrInstalled).length;
    const ready = items.filter(x => x.isMoneyReady).length;
    return { total, saved, purchased, ready, remaining: Math.max(0, total - saved) };
  }, [items]);

  const setField = (key, value) => setForm({ ...form, [key]: value });
  const info = text => setNotice({ text, type: 'info' });
  const error = text => setNotice({ text, type: 'error' });

  function clearForm() { setEditingId(null); setForm({ category: 'Mobilya', title: '', estimatedPrice: '', quantity: '1', savedAmount: '', note: '' }); }
  function sync(nextItems) { const moto = nextItems.find(x => x.id === 'motorcycle' || x.category === 'Motosiklet'); const base = { ...lifeData, shoppingItems: nextItems }; if (!moto) return base; return { ...base, goals: { ...base.goals, motorcycle: { ...(base.goals?.motorcycle || {}), estimatedPrice: n(moto.estimatedPrice) || 130000, savedAmount: n(moto.savedAmount), isPriceEditable: true } } }; }

  function saveItem() {
    const title = form.title.trim(); const price = n(form.estimatedPrice); const qty = n(form.quantity); const saved = n(form.savedAmount);
    if (!title) return error('Ürün / hedef adı boş olamaz.');
    if (form.estimatedPrice.trim() && price < 0) return error('Tahmini fiyat negatif olamaz.');
    if (!form.quantity.trim() || qty <= 0) return error('Adet 1 veya daha büyük olmalı.');
    if (form.savedAmount.trim() && saved < 0) return error('Birikmiş tutar negatif olamaz.');
    if (saved > price * Math.max(1, qty) && price > 0) return error('Birikmiş tutar toplam tahmini fiyattan büyük olamaz.');
    const old = items.find(x => x.id === editingId);
    const next = { id: editingId || `shop_${Date.now()}`, category: form.category, title, estimatedPrice: price, quantity: Math.max(1, qty), savedAmount: saved, isMoneyReady: old?.isMoneyReady || false, isPurchasedOrInstalled: old?.isPurchasedOrInstalled || false, note: form.note.trim() };
    const nextItems = editingId ? items.map(x => x.id === editingId ? next : x) : [next, ...items];
    onSave(sync(nextItems)); info(editingId ? 'Alınacak kalemi güncellendi.' : 'Alınacak kalemi eklendi.'); clearForm();
  }

  function editItem(item) { setEditingId(item.id); setForm({ category: item.category || 'Mobilya', title: item.title || '', estimatedPrice: String(item.estimatedPrice || ''), quantity: String(item.quantity || '1'), savedAmount: String(item.savedAmount || ''), note: item.note || '' }); info('Kalem düzenleme moduna alındı.'); }
  function removeItem(id) { onSave(sync(items.filter(x => x.id !== id))); if (editingId === id) clearForm(); info('Alınacak kalemi silindi.'); }
  function toggle(id, key) { onSave(sync(items.map(x => x.id === id ? { ...x, [key]: !x[key] } : x))); info('Kalem durumu güncellendi.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <Header title="Alınacaklar paneli" text="Ev, kira, beyaz eşya, mobilya ve özel hedefleri kategori kartlarıyla takip et." />
      <NoticeBox message={notice.text} type={notice.type} />
      <CurrencySelector lifeData={lifeData} onSave={onSave} />
      <Panel title="Liste özeti" note="Birikmiş, kalan ve satın alınan kalemleri tek bakışta gör.">
        <View style={{ flexDirection: 'row', marginTop: 10 }}><Card label="Toplam" value={money(summary.total)} /><Card label="Birikmiş" value={money(summary.saved)} /></View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Card label="Kalan" value={money(summary.remaining)} /><Card label="Hazır / Alındı" value={`${summary.ready} / ${summary.purchased}`} /></View>
      </Panel>
      <Panel title={editingId ? 'Kalemi düzenle' : 'Yeni kalem ekle'} note="Kalemi önce kategoriye yerleştir; sonra fiyat, adet ve birikmiş tutarı gir.">
        <Text style={labelStyle}>Kategori</Text><Chips items={categories} active={form.category} onPick={v => setField('category', v)} />
        <Input label="Ürün / hedef adı" value={form.title} onChangeText={v => setField('title', v)} placeholder="Örn: Salon koltuk takımı" />
        <Input label="Tahmini fiyat" value={form.estimatedPrice} onChangeText={v => setField('estimatedPrice', v)} placeholder="Örn: 35000" keyboardType="numeric" />
        <Input label="Adet" value={form.quantity} onChangeText={v => setField('quantity', v)} placeholder="1" keyboardType="numeric" />
        <Input label="Birikmiş tutar" value={form.savedAmount} onChangeText={v => setField('savedAmount', v)} placeholder="Örn: 5000" keyboardType="numeric" />
        <Input label="Not" value={form.note} onChangeText={v => setField('note', v)} placeholder="İsteğe bağlı" />
        <Button label={editingId ? 'Güncelle' : 'Listeye ekle'} onPress={saveItem} color="#FFB347" />
        {editingId && <Button label="Düzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
      </Panel>
      <Panel title="Gösterilecek liste" note="Önce kategori, sonra durum seç. Böylece karmaşa azalır."><Text style={labelStyle}>Kategori</Text><Chips items={['Tümü', ...categories]} active={categoryFilter} onPick={setCategoryFilter} /><Text style={labelStyle}>Durum</Text><Chips items={statuses.map(x => x.label)} active={statuses.find(x => x.key === statusFilter)?.label || 'Tümü'} onPick={label => setStatusFilter(statuses.find(x => x.label === label)?.key || 'all')} /></Panel>
      <Panel title="Liste kartları" note={`${visible.length} kalem gösteriliyor.`}>{visible.length === 0 ? <Text style={emptyText}>Bu filtreye uygun kalem yok.</Text> : visible.map(item => <Row key={item.id} item={item} onEdit={editItem} onDelete={removeItem} onToggle={toggle} money={money} />)}</Panel>
    </ScrollView>
  );
}
function Header({ title, text }) { return <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 }}><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL} • Expo Go</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>{text}</Text></View>; }
function Panel({ title, note, children }) { return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text>{!!note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{note}</Text>}{children}</View>; }
function Card({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 18, lineHeight: 23, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function Chips({ items, active, onPick }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{items.map(x => <TouchableOpacity key={x} onPress={() => onPick(x)} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active === x ? '#2DE2E6' : '#E7F4F4', borderWidth: 1, borderColor: active === x ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{x}</Text></TouchableOpacity>)}</ScrollView>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={labelStyle}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Row({ item, onEdit, onDelete, onToggle, money }) { const total = itemTotal(item); const left = Math.max(0, total - n(item.savedAmount)); return <View style={{ marginTop: 9, padding: 14, borderRadius: 20, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text><Text style={{ color: '#102A35', fontSize: 15, fontWeight: '900' }}>{money(total)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{item.category} • Kalan: {money(left)}</Text><View style={{ flexDirection: 'row', marginTop: 10 }}><Small label="Parası Birikti" active={item.isMoneyReady} onPress={() => onToggle(item.id, 'isMoneyReady')} /><Small label="Satın Alındı" active={item.isPurchasedOrInstalled} onPress={() => onToggle(item.id, 'isPurchasedOrInstalled')} /></View><View style={{ flexDirection: 'row', marginTop: 8 }}><Small label="Düzenle" active onPress={() => onEdit(item)} /><Small label="Sil" danger onPress={() => onDelete(item.id)} /></View></View>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#E7F4F4', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
const labelStyle = { marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' };
const emptyText = { marginTop: 8, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '700' };
function itemTotal(item) { return n(item.estimatedPrice) * Math.max(1, n(item.quantity)); }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
