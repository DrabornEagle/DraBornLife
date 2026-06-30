import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

const categories = ['Kira / Depozito', 'Beyaz eşya', 'Mobilya', 'Mutfak / ev temel', 'Çocuk odası', 'İlk ay yaşam', 'Antalya eğlence', 'GTA 6 seti', 'Motosiklet'];
const statusFilters = [
  { key: 'all', label: 'Tümü' },
  { key: 'ready', label: 'Parası Birikti' },
  { key: 'purchased', label: 'Satın Alındı' },
  { key: 'remaining', label: 'Kalanlar' },
];

export function ShoppingScreen({ lifeData, onSave }) {
  const [category, setCategory] = useState('Mobilya');
  const [title, setTitle] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [savedAmount, setSavedAmount] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [statusFilter, setStatusFilter] = useState('all');

  const items = lifeData?.shoppingItems || [];

  const visibleItems = useMemo(() => items.filter((item) => {
    const categoryMatch = categoryFilter === 'Tümü' || item.category === categoryFilter;
    const statusMatch = statusFilter === 'all'
      || (statusFilter === 'ready' && item.isMoneyReady)
      || (statusFilter === 'purchased' && item.isPurchasedOrInstalled)
      || (statusFilter === 'remaining' && !item.isPurchasedOrInstalled);
    return categoryMatch && statusMatch;
  }), [items, categoryFilter, statusFilter]);

  const summary = useMemo(() => {
    const total = items.reduce((sum, item) => sum + getItemTotal(item), 0);
    const saved = items.reduce((sum, item) => sum + toNumber(item.savedAmount), 0);
    const ready = items.filter((item) => item.isMoneyReady).length;
    const purchased = items.filter((item) => item.isPurchasedOrInstalled).length;
    return { total, saved, ready, purchased, remaining: Math.max(0, total - saved) };
  }, [items]);

  function syncGoals(nextItems, baseData = lifeData) {
    const motorcycleItem = nextItems.find((item) => item.id === 'motorcycle' || item.category === 'Motosiklet');
    if (!motorcycleItem) return { ...baseData, shoppingItems: nextItems };
    return {
      ...baseData,
      shoppingItems: nextItems,
      goals: {
        ...baseData.goals,
        motorcycle: {
          ...(baseData.goals?.motorcycle || {}),
          estimatedPrice: toNumber(motorcycleItem.estimatedPrice) || 130000,
          savedAmount: toNumber(motorcycleItem.savedAmount),
          isPriceEditable: true,
        },
      },
    };
  }

  function saveItems(nextItems) {
    onSave(syncGoals(nextItems));
  }

  function clearForm() {
    setEditingId(null);
    setCategory('Mobilya');
    setTitle('');
    setEstimatedPrice('');
    setQuantity('1');
    setSavedAmount('');
    setNote('');
  }

  function saveItem() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const nextItem = {
      id: editingId || `shop_${Date.now()}`,
      category,
      title: cleanTitle,
      estimatedPrice: toNumber(estimatedPrice),
      quantity: Math.max(1, toNumber(quantity)),
      savedAmount: toNumber(savedAmount),
      isMoneyReady: editingId ? !!items.find((item) => item.id === editingId)?.isMoneyReady : false,
      isPurchasedOrInstalled: editingId ? !!items.find((item) => item.id === editingId)?.isPurchasedOrInstalled : false,
      note: note.trim(),
    };
    const nextItems = editingId ? items.map((item) => item.id === editingId ? nextItem : item) : [nextItem, ...items];
    saveItems(nextItems);
    clearForm();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setCategory(item.category || 'Mobilya');
    setTitle(item.title || '');
    setEstimatedPrice(String(item.estimatedPrice || ''));
    setQuantity(String(item.quantity || '1'));
    setSavedAmount(String(item.savedAmount || ''));
    setNote(item.note || '');
  }

  function deleteItem(id) {
    if (editingId === id) clearForm();
    saveItems(items.filter((item) => item.id !== id));
  }

  function toggleItem(id, key) {
    saveItems(items.map((item) => item.id === id ? { ...item, [key]: !item[key] } : item));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 32, fontWeight: '900' }}>Alınacaklar</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Kalem ekle, düzenle, sil ve durumlarına göre filtrele.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}><SummaryCard label="Toplam" value={formatTRY(summary.total)} /><SummaryCard label="Birikmiş" value={formatTRY(summary.saved)} /></View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}><SummaryCard label="Kalan" value={formatTRY(summary.remaining)} /><SummaryCard label="Alındı" value={`${summary.purchased} kalem`} /></View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{editingId ? 'Kalemi düzenle' : 'Yeni kalem ekle'}</Text>
        <Text style={{ marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' }}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{categories.map((item) => <FilterChip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</ScrollView>
        <Input label="Ürün / hedef adı" value={title} onChangeText={setTitle} placeholder="Örn: Salon koltuk takımı" />
        <Input label="Tahmini fiyat" value={estimatedPrice} onChangeText={setEstimatedPrice} placeholder="Örn: 35000" keyboardType="numeric" />
        <Input label="Adet" value={quantity} onChangeText={setQuantity} placeholder="1" keyboardType="numeric" />
        <Input label="Birikmiş tutar" value={savedAmount} onChangeText={setSavedAmount} placeholder="Örn: 5000" keyboardType="numeric" />
        <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />
        <TouchableOpacity onPress={saveItem} style={{ marginTop: 16, paddingVertical: 15, borderRadius: 20, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 16, fontWeight: '900' }}>{editingId ? 'Güncelle' : 'Listeye ekle'}</Text></TouchableOpacity>
        {editingId && <TouchableOpacity onPress={clearForm} style={{ marginTop: 10, paddingVertical: 13, borderRadius: 18, backgroundColor: '#CFECEE', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>Düzenlemeyi iptal et</Text></TouchableOpacity>}
      </View>

      <View style={{ marginTop: 16, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Filtreler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>{['Tümü', ...categories].map((item) => <FilterChip key={item} label={item} active={categoryFilter === item} onPress={() => setCategoryFilter(item)} />)}</ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{statusFilters.map((item) => <FilterChip key={item.key} label={item.label} active={statusFilter === item.key} onPress={() => setStatusFilter(item.key)} />)}</ScrollView>
      </View>

      <View style={{ marginTop: 16 }}><Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Liste</Text><Text style={{ marginTop: 4, color: '#315661', fontSize: 13, fontWeight: '700' }}>{visibleItems.length} kalem gösteriliyor</Text>{visibleItems.length === 0 ? <Text style={{ marginTop: 8, color: '#315661', fontSize: 14, fontWeight: '700' }}>Bu filtreye uygun kalem yok.</Text> : visibleItems.map((item) => <ShoppingRow key={item.id} item={item} onToggle={toggleItem} onEdit={startEdit} onDelete={deleteItem} />)}</View>
    </ScrollView>
  );
}

function ShoppingRow({ item, onToggle, onEdit, onDelete }) {
  const total = getItemTotal(item);
  const remaining = Math.max(0, total - toNumber(item.savedAmount));
  return <View style={{ marginTop: 9, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text><Text style={{ color: '#102A35', fontSize: 15, fontWeight: '900' }}>{formatTRY(total)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{item.category} • {item.quantity || 1} adet</Text><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '700' }}>Birikmiş: {formatTRY(item.savedAmount)} • Kalan: {formatTRY(remaining)}</Text>{!!item.note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '700' }}>{item.note}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><StatusButton label="Parası Birikti" active={item.isMoneyReady} onPress={() => onToggle(item.id, 'isMoneyReady')} /><StatusButton label="Satın Alındı" active={item.isPurchasedOrInstalled} onPress={() => onToggle(item.id, 'isPurchasedOrInstalled')} /></View><View style={{ flexDirection: 'row', marginTop: 8 }}><ActionButton label="Düzenle" onPress={() => onEdit(item)} color="#2DE2E6" textColor="#06202A" /><ActionButton label="Sil" onPress={() => onDelete(item.id)} color="#FFD0D8" textColor="#7A1E2B" /></View></View>;
}
function StatusButton({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function ActionButton({ label, onPress, color, textColor }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: textColor, fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function FilterChip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function SummaryCard({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 20, fontWeight: '900' }}>{value}</Text></View>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function getItemTotal(item) { return toNumber(item.estimatedPrice) * Math.max(1, toNumber(item.quantity)); }
function toNumber(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
