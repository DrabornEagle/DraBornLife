import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencySelector } from '../components/CurrencySelector';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

export function DebtScreenSafe({ lifeData, onSave }) {
  const [form, setForm] = useState({ title: '', totalDebt: '', paidAmount: '', targetFinishDate: '2026-10-31', note: '' });
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const debts = lifeData?.debtEntries || [];
  const money = (value) => formatMoney(value, lifeData);

  const summary = useMemo(() => {
    const total = debts.reduce((s, x) => s + n(x.totalDebt), 0);
    const paid = debts.reduce((s, x) => s + n(x.paidAmount), 0);
    const completed = debts.filter(x => n(x.totalDebt) > 0 && n(x.paidAmount) >= n(x.totalDebt)).length;
    return { total, paid, left: Math.max(0, total - paid), completed };
  }, [debts]);

  const setField = (key, value) => setForm({ ...form, [key]: value });
  const info = text => setNotice({ text, type: 'info' });
  const error = text => setNotice({ text, type: 'error' });

  function clearForm() { setEditingId(null); setForm({ title: '', totalDebt: '', paidAmount: '', targetFinishDate: '2026-10-31', note: '' }); }

  function saveDebt() {
    const title = form.title.trim();
    const total = n(form.totalDebt);
    const paid = n(form.paidAmount);
    const date = form.targetFinishDate.trim() || '2026-10-31';
    if (!title) return error('Borç adı boş olamaz.');
    if (!form.totalDebt.trim() || total <= 0) return error('Toplam borç 0’dan büyük olmalı.');
    if (form.paidAmount.trim() && paid < 0) return error('Ödenen tutar negatif olamaz.');
    if (paid > total) return error('Ödenen tutar toplam borçtan büyük olamaz.');
    if (!validDate(date)) return error('Hedef bitiş tarihi YYYY-MM-DD formatında olmalı. Örnek: 2026-10-31');
    const old = debts.find(x => x.id === editingId);
    const next = { id: editingId || `debt_${Date.now()}`, title, totalDebt: total, paidAmount: paid, targetFinishDate: date, note: form.note.trim(), paymentHistory: old?.paymentHistory || [], updatedAt: editingId ? new Date().toISOString() : undefined };
    const nextDebts = editingId ? debts.map(x => x.id === editingId ? next : x) : [next, ...debts];
    onSave({ ...lifeData, debtEntries: nextDebts });
    info(editingId ? 'Borç kaydı güncellendi.' : 'Borç kaydı eklendi.');
    clearForm();
  }

  function editDebt(debt) { setEditingId(debt.id); setForm({ title: debt.title || '', totalDebt: String(debt.totalDebt || ''), paidAmount: String(debt.paidAmount || ''), targetFinishDate: debt.targetFinishDate || '2026-10-31', note: debt.note || '' }); info('Borç düzenleme moduna alındı.'); }
  function removeDebt(id) { onSave({ ...lifeData, debtEntries: debts.filter(x => x.id !== id) }); if (editingId === id) clearForm(); info('Borç kaydı silindi.'); }
  function addPayment(id, value) {
    const payment = n(value);
    if (payment <= 0) return error('Ödeme tutarı 0’dan büyük olmalı.');
    const debt = debts.find(x => x.id === id);
    const left = Math.max(0, n(debt?.totalDebt) - n(debt?.paidAmount));
    if (!debt) return error('Borç kaydı bulunamadı.');
    if (left <= 0) return error('Bu borç zaten kapanmış görünüyor.');
    if (payment > left) return error(`Ödeme kalan borçtan büyük olamaz. Kalan: ${money(left)}`);
    onSave({ ...lifeData, debtEntries: debts.map(x => x.id !== id ? x : { ...x, paidAmount: n(x.paidAmount) + payment, paymentHistory: [{ id: `pay_${Date.now()}`, amount: payment, date: new Date().toISOString() }, ...(x.paymentHistory || [])] }) });
    info('Borç ödemesi eklendi.');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingBottom: 190 }}>
      <Header title="Borç paneli" text="Toplam borç, ödenen tutar, kalan borç ve ödeme girişlerini ayrı kartlarda takip et." />
      <NoticeBox message={notice.text} type={notice.type} />
      <CurrencySelector lifeData={lifeData} onSave={onSave} />

      <Panel title="Borç özeti" note="Kalan ve ödenen tutar seçili para birimine göre gösterilir.">
        <View style={{ flexDirection: 'row', marginTop: 10 }}><Card label="Toplam" value={money(summary.total)} /><Card label="Ödenen" value={money(summary.paid)} /></View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}><Card label="Kalan" value={money(summary.left)} /><Card label="Kapanan" value={`${summary.completed} borç`} /></View>
      </Panel>

      <Panel title={editingId ? 'Borcu düzenle' : 'Yeni borç ekle'} note="Borcu önce toplam tutarıyla kaydet, sonra ödeme yaptıkça kartından ödeme ekle.">
        <Input label="Borç adı" value={form.title} onChangeText={v => setField('title', v)} placeholder="Örn: Kredi kartı" />
        <Input label="Toplam borç" value={form.totalDebt} onChangeText={v => setField('totalDebt', v)} placeholder="Örn: 25000" keyboardType="numeric" />
        <Input label="Şimdiye kadar ödenen" value={form.paidAmount} onChangeText={v => setField('paidAmount', v)} placeholder="Örn: 5000" keyboardType="numeric" />
        <Input label="Hedef bitiş tarihi" value={form.targetFinishDate} onChangeText={v => setField('targetFinishDate', v)} placeholder="2026-10-31" />
        <Input label="Not" value={form.note} onChangeText={v => setField('note', v)} placeholder="İsteğe bağlı" />
        <Button label={editingId ? 'Güncelle' : 'Borcu kaydet'} onPress={saveDebt} color="#FFB347" />
        {editingId && <Button label="Düzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
      </Panel>

      <Panel title="Borç kartları" note="Her borç ayrı karttır; ödeme ekleme, düzenleme ve silme işlemi kartın içinde yapılır.">
        {debts.length === 0 ? <EmptyStateCard icon="📉" title="Henüz borç kaydı yok" text="Borç eklediğinde toplam, ödenen ve kalan tutar burada temiz şekilde takip edilir." /> : debts.map(x => <DebtRow key={x.id} item={x} onEdit={editDebt} onDelete={removeDebt} onPay={addPayment} money={money} />)}
      </Panel>
    </ScrollView>
  );
}

function DebtRow({ item, onEdit, onDelete, onPay, money }) {
  const [payment, setPayment] = useState('');
  const total = n(item.totalDebt); const paid = n(item.paidAmount); const left = Math.max(0, total - paid); const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0; const done = total > 0 && left <= 0;
  return <View style={{ marginTop: 9, padding: 14, borderRadius: 20, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, paddingRight: 8, color: '#102A35', fontSize: 15, lineHeight: 20, fontWeight: '900' }}>{item.title}</Text><Text style={{ maxWidth: 120, textAlign: 'right', color: done ? '#128C7E' : '#FF5E7E', fontSize: 14, lineHeight: 18, fontWeight: '900' }} numberOfLines={2}>{done ? 'Sıfırlandı' : money(left)}</Text></View><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>Ödenen: {money(paid)} / {money(total)} • Hedef: {item.targetFinishDate || '2026-10-31'}</Text><View style={{ height: 10, marginTop: 10, borderRadius: 20, backgroundColor: '#CFECEE', overflow: 'hidden' }}><View style={{ width: `${percent}%`, height: '100%', backgroundColor: done ? '#128C7E' : '#2DE2E6' }} /></View><Text style={{ marginTop: 10, color: '#315661', fontSize: 12, fontWeight: '900' }}>Ödeme ekle</Text><View style={{ flexDirection: 'row', marginTop: 7 }}><TextInput value={payment} onChangeText={setPayment} placeholder="Ödeme tutarı" keyboardType="numeric" placeholderTextColor="#7C969D" style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontWeight: '800' }} /><TouchableOpacity onPress={() => { onPay(item.id, payment); setPayment(''); }} style={{ marginLeft: 8, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#2DE2E6', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#06202A', fontSize: 13, fontWeight: '900' }}>Ekle</Text></TouchableOpacity></View>{(item.paymentHistory || []).length > 0 && <Text style={{ marginTop: 8, color: '#315661', fontSize: 12, fontWeight: '800' }}>Son ödeme: {money(item.paymentHistory[0].amount)}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><Small label="Düzenle" active onPress={() => onEdit(item)} /><Small label="Sil" danger onPress={() => onDelete(item.id)} /></View></View>;
}
function Header({ title, text }) { return <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 }}><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL} • Expo Go</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 32, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>{text}</Text></View>; }
function Panel({ title, note, children }) { return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text>{!!note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{note}</Text>}{children}</View>; }
function Card({ label, value }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 20, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 6, color: '#102A35', fontSize: 16, lineHeight: 21, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function Input(props) { return <View style={{ marginTop: 14 }}><Text style={{ marginTop: 14, color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 14, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 16, fontWeight: '700' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 14, paddingVertical: 14, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8, paddingVertical: 10, borderRadius: 16, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')); }
