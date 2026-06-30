import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

const categories = ['Maaş', 'Ek gelir', 'Ev', 'Market', 'Ulaşım', 'Borç', 'Eğlence', 'Diğer'];
const typeFilters = [
  { key: 'all', label: 'Tümü' },
  { key: 'income', label: 'Gelir' },
  { key: 'expense', label: 'Gider' },
];

export function MoneyScreen({ lifeData, onSave }) {
  const [type, setType] = useState('income');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Diğer');
  const [savingPartAmount, setSavingPartAmount] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');

  const entries = lifeData?.moneyEntries || [];
  const visibleEntries = useMemo(() => entries.filter((entry) => {
    const typeMatch = typeFilter === 'all' || entry.type === typeFilter;
    const categoryMatch = categoryFilter === 'Tümü' || entry.category === categoryFilter;
    return typeMatch && categoryMatch;
  }), [entries, typeFilter, categoryFilter]);

  const totals = useMemo(() => {
    const income = entries.filter((x) => x.type === 'income').reduce((t, x) => t + toNumber(x.amount), 0);
    const expense = entries.filter((x) => x.type === 'expense').reduce((t, x) => t + toNumber(x.amount), 0);
    const saving = entries.reduce((t, x) => t + toNumber(x.savingPartAmount), 0);
    return { income, expense, saving, net: income - expense };
  }, [entries]);

  function clearForm() {
    setEditingId(null);
    setType('income');
    setTitle('');
    setAmount('');
    setCategory('Diğer');
    setSavingPartAmount('');
    setNote('');
  }

  function saveEntry() {
    const parsedAmount = toNumber(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const nextEntry = {
      id: editingId || `money_${Date.now()}`,
      type,
      title: title.trim() || (type === 'income' ? 'Gelir' : 'Gider'),
      amount: parsedAmount,
      category,
      date: editingId ? entries.find((item) => item.id === editingId)?.date || new Date().toISOString() : new Date().toISOString(),
      updatedAt: editingId ? new Date().toISOString() : undefined,
      note: note.trim(),
      savingPartAmount: type === 'income' ? toNumber(savingPartAmount) : 0,
    };

    const nextEntries = editingId ? entries.map((entry) => entry.id === editingId ? nextEntry : entry) : [nextEntry, ...entries];
    onSave({ ...lifeData, moneyEntries: nextEntries });
    clearForm();
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setType(entry.type || 'income');
    setTitle(entry.title || '');
    setAmount(String(entry.amount || ''));
    setCategory(entry.category || 'Diğer');
    setSavingPartAmount(String(entry.savingPartAmount || ''));
    setNote(entry.note || '');
  }

  function deleteEntry(id) {
    if (editingId === id) clearForm();
    onSave({ ...lifeData, moneyEntries: entries.filter((entry) => entry.id !== id) });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 32, fontWeight: '900' }}>Gelir-Gider</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Kayıt ekle, düzenle, sil ve kategoriye göre filtrele.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <SummaryCard label="Gelir" value={formatTRY(totals.income)} />
        <SummaryCard label="Gider" value={formatTRY(totals.expense)} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <SummaryCard label="Net" value={formatTRY(totals.net)} />
        <SummaryCard label="Birikime" value={formatTRY(totals.saving)} />
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{editingId ? 'Kaydı düzenle' : 'Yeni kayıt'}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TypeButton label="Gelir" active={type === 'income'} onPress={() => setType('income')} />
          <TypeButton label="Gider" active={type === 'expense'} onPress={() => setType('expense')} />
        </View>

        <Input label="Başlık" value={title} onChangeText={setTitle} placeholder="Örn: Günlük kazanç" />
        <Input label="Tutar" value={amount} onChangeText={setAmount} placeholder="Örn: 1500" keyboardType="numeric" />
        {type === 'income' && <Input label="Birikime ayrılan" value={savingPartAmount} onChangeText={setSavingPartAmount} placeholder="Örn: 500" keyboardType="numeric" />}

        <Text style={{ marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' }}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {categories.map((item) => <FilterChip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}
        </ScrollView>

        <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />
        <TouchableOpacity onPress={saveEntry} style={{ marginTop: 16, paddingVertical: 15, borderRadius: 20, backgroundColor: '#FFB347', alignItems: 'center' }}>
          <Text style={{ color: '#06202A', fontSize: 16, fontWeight: '900' }}>{editingId ? 'Güncelle' : 'Kaydet'}</Text>
        </TouchableOpacity>
        {editingId && (
          <TouchableOpacity onPress={clearForm} style={{ marginTop: 10, paddingVertical: 13, borderRadius: 18, backgroundColor: '#CFECEE', alignItems: 'center' }}>
            <Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>Düzenlemeyi iptal et</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ marginTop: 16, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Filtreler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {typeFilters.map((item) => <FilterChip key={item.key} label={item.label} active={typeFilter === item.key} onPress={() => setTypeFilter(item.key)} />)}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {['Tümü', ...categories].map((item) => <FilterChip key={item} label={item} active={categoryFilter === item} onPress={() => setCategoryFilter(item)} />)}
        </ScrollView>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Son işlemler</Text>
        <Text style={{ marginTop: 4, color: '#315661', fontSize: 13, fontWeight: '700' }}>{visibleEntries.length} kayıt gösteriliyor</Text>
        {visibleEntries.length === 0 ? <Text style={{ marginTop: 8, color: '#315661', fontSize: 14, fontWeight: '700' }}>Bu filtreye uygun kayıt yok.</Text> : visibleEntries.map((entry) => <EntryRow key={entry.id} entry={entry} onEdit={startEdit} onDelete={deleteEntry} />)}
      </View>
    </ScrollView>
  );
}

function SummaryCard({ label, value }) {
  return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 20, fontWeight: '900' }}>{value}</Text></View>;
}

function TypeButton({ label, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={{ flex: 1, paddingVertical: 13, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>;
}

function FilterChip({ label, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>;
}

function Input(props) {
  return <View style={{ marginTop: 14 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>;
}

function EntryRow({ entry, onEdit, onDelete }) {
  const isIncome = entry.type === 'income';
  return (
    <View style={{ marginTop: 9, padding: 14, borderRadius: 18, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{entry.title}</Text>
        <Text style={{ color: isIncome ? '#128C7E' : '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{isIncome ? '+' : '-'} {formatTRY(entry.amount)}</Text>
      </View>
      <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{isIncome ? 'Gelir' : 'Gider'} • {entry.category}</Text>
      {!!entry.note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '700' }}>{entry.note}</Text>}
      {isIncome && toNumber(entry.savingPartAmount) > 0 && <Text style={{ marginTop: 5, color: '#128C7E', fontSize: 12, fontWeight: '800' }}>Birikime: {formatTRY(entry.savingPartAmount)}</Text>}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity onPress={() => onEdit(entry)} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: '#2DE2E6', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>Düzenle</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(entry.id)} style={{ flex: 1, paddingVertical: 10, borderRadius: 16, backgroundColor: '#FFD0D8', alignItems: 'center' }}><Text style={{ color: '#7A1E2B', fontSize: 12, fontWeight: '900' }}>Sil</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function toNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
