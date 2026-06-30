import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatTRY } from '../utils/lifeSummary';

export function DebtScreen({ lifeData, onSave }) {
  const [title, setTitle] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [note, setNote] = useState('');

  const debts = lifeData?.debtEntries || [];

  const summary = useMemo(() => {
    const total = debts.reduce((sum, item) => sum + toNumber(item.totalDebt), 0);
    const paid = debts.reduce((sum, item) => sum + toNumber(item.paidAmount), 0);
    const left = Math.max(0, total - paid);
    const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
    return { total, paid, left, percent };
  }, [debts]);

  function saveDebts(nextDebts) {
    onSave({
      ...lifeData,
      debtEntries: nextDebts,
    });
  }

  function addDebt() {
    const cleanTitle = title.trim();
    const parsedTotal = toNumber(totalDebt);
    if (!cleanTitle || parsedTotal <= 0) return;

    const nextDebt = {
      id: `debt_${Date.now()}`,
      title: cleanTitle,
      totalDebt: parsedTotal,
      paidAmount: toNumber(paidAmount),
      targetFinishDate: '2026-10-31',
      note: note.trim(),
    };

    saveDebts([nextDebt, ...debts]);
    setTitle('');
    setTotalDebt('');
    setPaidAmount('');
    setNote('');
  }

  function addPayment(id, amount) {
    const payment = toNumber(amount);
    if (payment <= 0) return;
    saveDebts(debts.map((item) => item.id === id ? { ...item, paidAmount: Math.min(toNumber(item.totalDebt), toNumber(item.paidAmount) + payment) } : item));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>DraBornLife • v0.0.9</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 32, fontWeight: '900' }}>Borç Takibi</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Antalya’ya kadar borç azaltma hedefini net şekilde takip et.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <SummaryCard label="Toplam" value={formatTRY(summary.total)} />
        <SummaryCard label="Ödenen" value={formatTRY(summary.paid)} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <SummaryCard label="Kalan" value={formatTRY(summary.left)} />
        <SummaryCard label="İlerleme" value={`${summary.percent}%`} />
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Yeni borç ekle</Text>
        <Input label="Borç adı" value={title} onChangeText={setTitle} placeholder="Örn: Kredi kartı" />
        <Input label="Toplam borç" value={totalDebt} onChangeText={setTotalDebt} placeholder="Örn: 25000" keyboardType="numeric" />
        <Input label="Şimdiye kadar ödenen" value={paidAmount} onChangeText={setPaidAmount} placeholder="Örn: 5000" keyboardType="numeric" />
        <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />
        <TouchableOpacity onPress={addDebt} style={{ marginTop: 16, paddingVertical: 15, borderRadius: 20, backgroundColor: '#FFB347', alignItems: 'center' }}>
          <Text style={{ color: '#06202A', fontSize: 16, fontWeight: '900' }}>Borcu kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Borçlar</Text>
        {debts.length === 0 ? (
          <Text style={{ marginTop: 8, color: '#315661', fontSize: 14, fontWeight: '700' }}>Henüz borç kaydı yok.</Text>
        ) : (
          debts.map((item) => <DebtRow key={item.id} item={item} onAddPayment={addPayment} />)
        )}
      </View>
    </ScrollView>
  );
}

function DebtRow({ item, onAddPayment }) {
  const [payment, setPayment] = useState('');
  const total = toNumber(item.totalDebt);
  const paid = toNumber(item.paidAmount);
  const left = Math.max(0, total - paid);
  const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

  function submitPayment() {
    onAddPayment(item.id, payment);
    setPayment('');
  }

  return (
    <View style={{ marginTop: 9, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text>
        <Text style={{ color: '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{formatTRY(left)}</Text>
      </View>
      <Text style={{ marginTop: 6, color: '#315661', fontSize: 12, fontWeight: '800' }}>Ödenen: {formatTRY(paid)} / {formatTRY(total)}</Text>
      <View style={{ height: 10, marginTop: 10, borderRadius: 20, backgroundColor: '#CFECEE', overflow: 'hidden' }}>
        <View style={{ width: `${percent}%`, height: '100%', backgroundColor: '#2DE2E6' }} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TextInput value={payment} onChangeText={setPayment} placeholder="Ödeme" keyboardType="numeric" placeholderTextColor="#7C969D" style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontWeight: '800' }} />
        <TouchableOpacity onPress={submitPayment} style={{ marginLeft: 8, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#2DE2E6', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#06202A', fontSize: 13, fontWeight: '900' }}>Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
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

function Input(props) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text>
      <TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" />
    </View>
  );
}

function toNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
