import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatTRY } from '../utils/lifeSummary';

const categories = ['Maaş', 'Ek gelir', 'Ev', 'Market', 'Ulaşım', 'Borç', 'Eğlence', 'Diğer'];

export function MoneyScreen({ lifeData, onSave }) {
  const [type, setType] = useState('income');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Diğer');
  const [savingPartAmount, setSavingPartAmount] = useState('');
  const [note, setNote] = useState('');

  const entries = lifeData?.moneyEntries || [];

  const totals = useMemo(() => {
    const income = entries.filter((x) => x.type === 'income').reduce((t, x) => t + toNumber(x.amount), 0);
    const expense = entries.filter((x) => x.type === 'expense').reduce((t, x) => t + toNumber(x.amount), 0);
    const saving = entries.reduce((t, x) => t + toNumber(x.savingPartAmount), 0);
    return { income, expense, saving, net: income - expense };
  }, [entries]);

  function addEntry() {
    const parsedAmount = toNumber(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const nextEntry = {
      id: `money_${Date.now()}`,
      type,
      title: title.trim() || (type === 'income' ? 'Gelir' : 'Gider'),
      amount: parsedAmount,
      category,
      date: new Date().toISOString(),
      note: note.trim(),
      savingPartAmount: type === 'income' ? toNumber(savingPartAmount) : 0,
    };

    onSave({
      ...lifeData,
      moneyEntries: [nextEntry, ...entries],
    });

    setTitle('');
    setAmount('');
    setSavingPartAmount('');
    setNote('');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>DraBornLife • v0.0.7</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 32, fontWeight: '900' }}>Gelir-Gider</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Antalya hedefi için gelir, gider ve birikime ayrılan tutarı kaydet.</Text>
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TypeButton label="Gelir" active={type === 'income'} onPress={() => setType('income')} />
          <TypeButton label="Gider" active={type === 'expense'} onPress={() => setType('expense')} />
        </View>

        <Input label="Başlık" value={title} onChangeText={setTitle} placeholder="Örn: Günlük kazanç" />
        <Input label="Tutar" value={amount} onChangeText={setAmount} placeholder="Örn: 1500" keyboardType="numeric" />

        {type === 'income' && (
          <Input label="Birikime ayrılan" value={savingPartAmount} onChangeText={setSavingPartAmount} placeholder="Örn: 500" keyboardType="numeric" />
        )}

        <Text style={{ marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' }}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {categories.map((item) => (
            <TouchableOpacity key={item} onPress={() => setCategory(item)} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: category === item ? '#2DE2E6' : '#CFECEE' }}>
              <Text style={{ color: '#06202A', fontWeight: '900' }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />

        <TouchableOpacity onPress={addEntry} style={{ marginTop: 16, paddingVertical: 15, borderRadius: 20, backgroundColor: '#FFB347', alignItems: 'center' }}>
          <Text style={{ color: '#06202A', fontSize: 16, fontWeight: '900' }}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Son işlemler</Text>
        {entries.length === 0 ? (
          <Text style={{ marginTop: 8, color: '#315661', fontSize: 14, fontWeight: '700' }}>Henüz gelir-gider kaydı yok.</Text>
        ) : (
          entries.slice(0, 8).map((entry) => <EntryRow key={entry.id} entry={entry} />)
        )}
      </View>
    </ScrollView>
  );
}

function SummaryCard({ label, value }) {
  return (
    <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text>
      <Text style={{ marginTop: 6, color: '#102A35', fontSize: 20, fontWeight: '900' }}>{value}</Text>
    </View>
  );
}

function TypeButton({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, paddingVertical: 13, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}>
      <Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Input(props) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text>
      <TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" />
    </View>
  );
}

function EntryRow({ entry }) {
  const isIncome = entry.type === 'income';
  return (
    <View style={{ marginTop: 9, padding: 14, borderRadius: 18, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{entry.title}</Text>
        <Text style={{ color: isIncome ? '#128C7E' : '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{isIncome ? '+' : '-'} {formatTRY(entry.amount)}</Text>
      </View>
      <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '700' }}>{entry.category}</Text>
    </View>
  );
}

function toNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
