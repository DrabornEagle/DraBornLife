import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

export function DebtScreen({ lifeData, onSave }) {
  const [title, setTitle] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [targetFinishDate, setTargetFinishDate] = useState('2026-10-31');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState(null);

  const debts = lifeData?.debtEntries || [];

  const summary = useMemo(() => {
    const total = debts.reduce((sum, item) => sum + toNumber(item.totalDebt), 0);
    const paid = debts.reduce((sum, item) => sum + toNumber(item.paidAmount), 0);
    const left = Math.max(0, total - paid);
    const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
    const completed = debts.filter((item) => Math.max(0, toNumber(item.totalDebt) - toNumber(item.paidAmount)) <= 0 && toNumber(item.totalDebt) > 0).length;
    return { total, paid, left, percent, completed };
  }, [debts]);

  function saveDebts(nextDebts) {
    onSave({ ...lifeData, debtEntries: nextDebts });
  }

  function clearForm() {
    setEditingId(null);
    setTitle('');
    setTotalDebt('');
    setPaidAmount('');
    setTargetFinishDate('2026-10-31');
    setNote('');
  }

  function saveDebt() {
    const cleanTitle = title.trim();
    const parsedTotal = toNumber(totalDebt);
    if (!cleanTitle || parsedTotal <= 0) return;

    const oldDebt = debts.find((item) => item.id === editingId);
    const nextDebt = {
      id: editingId || `debt_${Date.now()}`,
      title: cleanTitle,
      totalDebt: parsedTotal,
      paidAmount: Math.min(parsedTotal, toNumber(paidAmount)),
      targetFinishDate: targetFinishDate.trim() || '2026-10-31',
      note: note.trim(),
      paymentHistory: oldDebt?.paymentHistory || [],
      updatedAt: editingId ? new Date().toISOString() : undefined,
    };

    const nextDebts = editingId ? debts.map((item) => item.id === editingId ? nextDebt : item) : [nextDebt, ...debts];
    saveDebts(nextDebts);
    clearForm();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setTotalDebt(String(item.totalDebt || ''));
    setPaidAmount(String(item.paidAmount || ''));
    setTargetFinishDate(item.targetFinishDate || '2026-10-31');
    setNote(item.note || '');
  }

  function deleteDebt(id) {
    if (editingId === id) clearForm();
    saveDebts(debts.filter((item) => item.id !== id));
  }

  function addPayment(id, amount) {
    const payment = toNumber(amount);
    if (payment <= 0) return;

    saveDebts(debts.map((item) => {
      if (item.id !== id) return item;
      const total = toNumber(item.totalDebt);
      const nextPaid = Math.min(total, toNumber(item.paidAmount) + payment);
      const nextHistory = [{ id: `pay_${Date.now()}`, amount: payment, date: new Date().toISOString() }, ...(item.paymentHistory || [])];
      return { ...item, paidAmount: nextPaid, paymentHistory: nextHistory };
    }));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} contentContainerStyle={{ padding: 18, paddingBottom: 140 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 32, fontWeight: '900' }}>Borç Takibi</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Borç ekle, düzenle, ödeme gir ve tamamlananları takip et.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}><SummaryCard label="Toplam" value={formatTRY(summary.total)} /><SummaryCard label="Ödenen" value={formatTRY(summary.paid)} /></View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}><SummaryCard label="Kalan" value={formatTRY(summary.left)} /><SummaryCard label="Biten" value={`${summary.completed} borç`} /></View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{editingId ? 'Borcu düzenle' : 'Yeni borç ekle'}</Text>
        <Input label="Borç adı" value={title} onChangeText={setTitle} placeholder="Örn: Kredi kartı" />
        <Input label="Toplam borç" value={totalDebt} onChangeText={setTotalDebt} placeholder="Örn: 25000" keyboardType="numeric" />
        <Input label="Şimdiye kadar ödenen" value={paidAmount} onChangeText={setPaidAmount} placeholder="Örn: 5000" keyboardType="numeric" />
        <Input label="Hedef bitiş tarihi" value={targetFinishDate} onChangeText={setTargetFinishDate} placeholder="2026-10-31" />
        <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />
        <TouchableOpacity onPress={saveDebt} style={{ marginTop: 16, paddingVertical: 15, borderRadius: 20, backgroundColor: '#FFB347', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 16, fontWeight: '900' }}>{editingId ? 'Güncelle' : 'Borcu kaydet'}</Text></TouchableOpacity>
        {editingId && <TouchableOpacity onPress={clearForm} style={{ marginTop: 10, paddingVertical: 13, borderRadius: 18, backgroundColor: '#CFECEE', alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>Düzenlemeyi iptal et</Text></TouchableOpacity>}
      </View>

      <View style={{ marginTop: 16 }}><Text style={{ color: '#102A35', fontSize: 22, fontWeight: '900' }}>Borçlar</Text>{debts.length === 0 ? <Text style={{ marginTop: 8, color: '#315661', fontSize: 14, fontWeight: '700' }}>Henüz borç kaydı yok.</Text> : debts.map((item) => <DebtRow key={item.id} item={item} onAddPayment={addPayment} onEdit={startEdit} onDelete={deleteDebt} />)}</View>
    </ScrollView>
  );
}

function DebtRow({ item, onAddPayment, onEdit, onDelete }) {
  const [payment, setPayment] = useState('');
  const total = toNumber(item.totalDebt);
  const paid = toNumber(item.paidAmount);
  const left = Math.max(0, total - paid);
  const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const isCompleted = total > 0 && left <= 0;
  const history = item.paymentHistory || [];

  function submitPayment() {
    onAddPayment(item.id, payment);
    setPayment('');
  }

  return <View style={{ marginTop: 9, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text><Text style={{ color: isCompleted ? '#128C7E' : '#FF5E7E', fontSize: 15, fontWeight: '900' }}>{isCompleted ? 'Sıfırlandı' : formatTRY(left)}</Text></View><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, fontWeight: '800' }}>Ödenen: {formatTRY(paid)} / {formatTRY(total)} • Hedef: {item.targetFinishDate || '2026-10-31'}</Text><View style={{ height: 10, marginTop: 10, borderRadius: 20, backgroundColor: '#CFECEE', overflow: 'hidden' }}><View style={{ width: `${percent}%`, height: '100%', backgroundColor: isCompleted ? '#128C7E' : '#2DE2E6' }} /></View>{!!item.note && <Text style={{ marginTop: 6, color: '#315661', fontSize: 12, fontWeight: '700' }}>{item.note}</Text>}<View style={{ flexDirection: 'row', marginTop: 12 }}><TextInput value={payment} onChangeText={setPayment} placeholder="Ödeme" keyboardType="numeric" placeholderTextColor="#7C969D" style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontWeight: '800' }} /><TouchableOpacity onPress={submitPayment} style={{ marginLeft: 8, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#2DE2E6', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#06202A', fontSize: 13, fontWeight: '900' }}>Ekle</Text></TouchableOpacity></View>{history.length > 0 && <Text style={{ marginTop: 8, color: '#315661', fontSize: 12, fontWeight: '800' }}>Son ödeme: {formatTRY(history[0].amount)}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><ActionButton label="Düzenle" onPress={() => onEdit(item)} color="#2DE2E6" textColor="#06202A" /><ActionButton label="Sil" onPress={() => onDelete(item.id)} color="#FFD0D8" textColor="#7A1E2B" /></View></View>;
}
function ActionButton({ label, onPress, color, textColor }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: textColor, fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function SummaryCard({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 20, fontWeight: '900' }}>{value}</Text></View>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function toNumber(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
