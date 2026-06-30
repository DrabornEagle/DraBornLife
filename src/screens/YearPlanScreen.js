import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

const TYPES = ['tasinma', 'seyahat', 'ev', 'arac', 'oyun', 'aile', 'diger'];
const STATUS = [
  ['planned', 'Planli'],
  ['active', 'Aktif'],
  ['saving', 'Para birikiyor'],
  ['done', 'Tamam'],
  ['postponed', 'Ertelendi'],
  ['cancelled', 'Iptal'],
];

export function YearPlanScreen({ lifeData, onSave }) {
  const plans = Array.isArray(lifeData?.yearlyPlans) ? lifeData.yearlyPlans : [];
  const selectedYear = Number(lifeData?.settings?.selectedYear || plans[0]?.year || 2026);
  const years = useMemo(() => Array.from(new Set([...plans.map((p) => Number(p.year)), selectedYear, 2026, 2027, 2028])).filter(Boolean).sort((a, b) => a - b), [plans, selectedYear]);
  const shown = plans.filter((p) => Number(p.year) === selectedYear);
  const total = shown.reduce((s, p) => s + n(p.estimatedBudget), 0);
  const saved = shown.reduce((s, p) => s + n(p.savedAmount), 0);
  const left = Math.max(0, total - saved);
  const done = shown.filter((p) => p.status === 'done' || p.status === 'completed').length;
  const progress = total > 0 ? Math.min(100, Math.round((saved / total) * 100)) : 0;
  const nearest = nearestCalc(shown);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blank(selectedYear));
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const msg = (text, type = 'info') => setNotice({ text, type });

  function patchForm(key, value) { setForm((old) => ({ ...old, [key]: value })); }
  function selectYear(year) { onSave({ ...lifeData, settings: { ...(lifeData?.settings || {}), selectedYear: year } }); patchForm('year', String(year)); }
  function savePlans(nextPlans, nextYear) { onSave({ ...lifeData, yearlyPlans: nextPlans, settings: { ...(lifeData?.settings || {}), selectedYear: nextYear || selectedYear } }); }
  function resetForm() { setEditingId(null); setForm(blank(selectedYear)); }

  function saveGoal() {
    const title = form.title.trim();
    const year = Number(form.year);
    const budget = n(form.estimatedBudget);
    const savedAmount = n(form.savedAmount);
    if (!title) return msg('Hedef adi bos olamaz.', 'error');
    if (!Number.isFinite(year) || year < 2020) return msg('Hedef yili hatali. Ornek: 2026', 'error');
    if (budget < 0 || savedAmount < 0) return msg('Butce veya biriken tutar negatif olamaz.', 'error');
    if (budget > 0 && savedAmount > budget) return msg('Biriken tutar hedef butceden buyuk olamaz.', 'error');
    const nextGoal = { id: editingId || `year_goal_${Date.now()}`, year, title, goalType: form.goalType, country: form.country.trim(), city: form.city.trim(), area: form.area.trim(), targetMonth: form.targetMonth.trim(), targetDate: form.targetDate.trim(), estimatedBudget: budget, savedAmount, status: form.status, note: form.note.trim() };
    const nextPlans = editingId ? plans.map((p) => p.id === editingId ? nextGoal : p) : [nextGoal, ...plans];
    savePlans(nextPlans, year);
    msg(editingId ? 'Yillik hedef guncellendi.' : 'Yillik hedef eklendi.');
    resetForm();
  }

  function editGoal(plan) { setEditingId(plan.id); setForm({ title: plan.title || '', goalType: plan.goalType || 'tasinma', year: String(plan.year || selectedYear), country: plan.country || '', city: plan.city || '', area: plan.area || '', targetMonth: plan.targetMonth || '', targetDate: plan.targetDate || '', estimatedBudget: String(plan.estimatedBudget || ''), savedAmount: String(plan.savedAmount || ''), status: plan.status || 'planned', note: plan.note || '' }); msg('Hedef duzenleme modu acildi.'); }
  function removeGoal(id) { savePlans(plans.filter((p) => p.id !== id)); if (editingId === id) resetForm(); msg('Yillik hedef silindi.'); }
  function setStatus(id, status) { savePlans(plans.map((p) => p.id === id ? { ...p, status } : p)); msg('Hedef durumu guncellendi.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160 }}>
      <Hero />
      <NoticeBox message={notice.text} type={notice.type} />
      <Panel title="Yil sec" note="Hedefleri yil yil ayir."><ScrollView horizontal showsHorizontalScrollIndicator={false}>{years.map((y) => <Chip key={y} label={String(y)} active={selectedYear === y} onPress={() => selectYear(y)} />)}</ScrollView></Panel>
      <Row><Mini title="Secili yil" value={String(selectedYear)} text={`${shown.length} hedef`} /><Mini title="Butce" value={formatTRY(total)} text={`${formatTRY(saved)} birikti`} /></Row>
      <Row><Mini title="Ilerleme" value={`%${progress}`} text={`${formatTRY(left)} kalan`} /><Mini title="En yakin" value={nearest.daysLabel} text={nearest.title} /></Row>
      <GoalForm form={form} set={patchForm} editing={!!editingId} save={saveGoal} cancel={resetForm} />
      <Panel title="Birikim geri sayimi" note="Hedef tarihine gore kalan sure ve gerekli birikim hesaplanir."><Row><Mini title="Kalan butce" value={formatTRY(left)} text="Secili yil toplam" /><Mini title="Aylik lazim" value={formatTRY(nearest.monthlyNeed)} text="En yakin hedef" /></Row><Row><Mini title="Haftalik lazim" value={formatTRY(nearest.weeklyNeed)} text="En yakin hedef" /><Mini title="Tamam" value={`${done}/${shown.length}`} text="Hedef durumu" /></Row></Panel>
      <Panel title={`${selectedYear} hedefleri`} note="Hedefleri duzenle, sil veya durumunu degistir.">{shown.length === 0 ? <Text style={txt}>Bu yil icin henuz hedef yok.</Text> : shown.map((p) => <GoalCard key={p.id} plan={p} edit={editGoal} remove={removeGoal} setStatus={setStatus} />)}</Panel>
    </ScrollView>
  );
}

function Hero() { return <View style={hero}><Text style={heroMini}>{APP_VERSION_LABEL}</Text><Text style={heroTitle}>Yil Plani</Text><Text style={heroText}>Secilen yila gore tasinma, seyahat ve buyuk hayat hedeflerini takip et.</Text></View>; }
function GoalForm({ form, set, editing, save, cancel }) { return <Panel title="Yeni yil hedefi" note="Tasinma, seyahat, ev, arac, oyun veya aile hedefi ekle."><Input label="Hedef adi" value={form.title} onChangeText={(v) => set('title', v)} placeholder="Orn: Dubai aile seyahati" /><Text style={label}>Hedef tipi</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{TYPES.map((t) => <Chip key={t} label={t} active={form.goalType === t} onPress={() => set('goalType', t)} />)}</ScrollView><Input label="Hedef yili" value={form.year} onChangeText={(v) => set('year', v)} placeholder="2027" keyboardType="numeric" /><Input label="Ulke" value={form.country} onChangeText={(v) => set('country', v)} placeholder="Turkiye" /><Input label="Sehir" value={form.city} onChangeText={(v) => set('city', v)} placeholder="Antalya" /><Input label="Bolge" value={form.area} onChangeText={(v) => set('area', v)} placeholder="Lara" /><Input label="Hedef ay" value={form.targetMonth} onChangeText={(v) => set('targetMonth', v)} placeholder="Kasim" /><Input label="Hedef tarih" value={form.targetDate} onChangeText={(v) => set('targetDate', v)} placeholder="2026-10-31" /><Input label="Tahmini butce" value={form.estimatedBudget} onChangeText={(v) => set('estimatedBudget', v)} keyboardType="numeric" placeholder="250000" /><Input label="Biriken tutar" value={form.savedAmount} onChangeText={(v) => set('savedAmount', v)} keyboardType="numeric" placeholder="50000" /><Text style={label}>Durum</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{STATUS.map(([k, v]) => <Chip key={k} label={v} active={form.status === k} onPress={() => set('status', k)} />)}</ScrollView><Input label="Not" value={form.note} onChangeText={(v) => set('note', v)} placeholder="Istege bagli" /><Button label={editing ? 'Hedefi guncelle' : 'Hedef ekle'} onPress={save} color="#FFB347" />{editing && <Button label="Duzenlemeyi iptal et" onPress={cancel} color="#CFECEE" />}</Panel>; }
function GoalCard({ plan, edit, remove, setStatus }) { const c = calc(plan); return <View style={[card, { borderColor: statusColor(plan.status) }]}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={cardTitle}>{plan.title}</Text><Text style={{ color: statusColor(plan.status), fontSize: 12, fontWeight: '900' }}>{statusLabel(plan.status)}</Text></View><Text style={sub}>{plan.goalType} - {plan.city || plan.country || 'hedef'} - {plan.targetMonth || plan.targetDate || 'tarih yok'}</Text><Row><Small title="Kalan" value={formatTRY(c.remainingBudget)} /><Small title="Sure" value={c.daysLabel} /></Row><Row><Small title="Aylik" value={formatTRY(c.monthlyNeed)} /><Small title="Haftalik" value={formatTRY(c.weeklyNeed)} /></Row><Text style={[sub, { color: c.warning ? '#7A1E2B' : '#315661' }]}>{c.message}</Text>{!!plan.note && <Text style={sub}>{plan.note}</Text>}<Row><Button label="Duzenle" onPress={() => edit(plan)} color="#2DE2E6" small /><Button label="Sil" onPress={() => remove(plan.id)} color="#FFD0D8" small /></Row><ScrollView horizontal showsHorizontalScrollIndicator={false}>{STATUS.map(([k, v]) => <Chip key={k} label={v} active={plan.status === k} onPress={() => setStatus(plan.id, k)} />)}</ScrollView></View>; }

function Panel({ title, note, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text><Text style={panelNote}>{note}</Text>{children}</View>; }
function Row({ children }) { return <View style={{ flexDirection: 'row', marginTop: 8 }}>{children}</View>; }
function Mini({ title, value, text }) { return <View style={mini}><Text style={miniT}>{title}</Text><Text style={miniV}>{value}</Text><Text style={miniD}>{text}</Text></View>; }
function Small({ title, value }) { return <View style={small}><Text style={miniT}>{title}</Text><Text style={smallV}>{value}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={[chip, { backgroundColor: active ? '#2DE2E6' : '#CFECEE' }]}><Text style={chipText}>{label}</Text></TouchableOpacity>; }
function Button({ label, onPress, color, small }) { return <TouchableOpacity onPress={onPress} style={{ flex: small ? 1 : undefined, marginRight: small ? 6 : 0, marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={btnText}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={label}>{props.label}</Text><TextInput {...props} style={input} placeholderTextColor="#7C969D" /></View>; }

function blank(year) { return { title: '', goalType: 'tasinma', year: String(year), country: 'Turkiye', city: 'Antalya', area: '', targetMonth: '', targetDate: '', estimatedBudget: '', savedAmount: '', status: 'planned', note: '' }; }
function nearestCalc(plans) { const list = plans.map(calc).filter((x) => !x.isDone && x.daysLeft >= 0 && x.targetDate); if (!list.length) return { title: 'Tarih bekliyor', daysLabel: '0 gun', monthlyNeed: 0, weeklyNeed: 0 }; list.sort((a, b) => a.daysLeft - b.daysLeft); return list[0]; }
function calc(plan) { const total = n(plan.estimatedBudget); const saved = n(plan.savedAmount); const remainingBudget = Math.max(0, total - saved); const isDone = plan.status === 'done' || plan.status === 'completed' || (remainingBudget === 0 && total > 0); const targetDate = parseDate(plan.targetDate, plan.targetMonth, plan.year); if (isDone) return { title: plan.title, remainingBudget, daysLeft: 0, daysLabel: 'Tamam', monthlyNeed: 0, weeklyNeed: 0, targetDate, isDone, message: 'Hedef tamamlanmis gorunuyor.', warning: false }; if (!targetDate) return { title: plan.title, remainingBudget, daysLeft: -1, daysLabel: 'Tarih yok', monthlyNeed: 0, weeklyNeed: 0, targetDate: null, isDone, message: 'Hedef tarihi eksik. Tarih eklenince geri sayim hesaplanacak.', warning: true }; const today = start(new Date()); const days = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000); if (days < 0) return { title: plan.title, remainingBudget, daysLeft: days, daysLabel: 'Gecti', monthlyNeed: remainingBudget, weeklyNeed: remainingBudget, targetDate, isDone, message: 'Hedef tarihi gecmis. Tarihi guncellemen veya hedefi tamamlaman iyi olur.', warning: true }; const months = Math.max(1, Math.ceil(days / 30)); const weeks = Math.max(1, Math.ceil(days / 7)); return { title: plan.title, remainingBudget, daysLeft: days, daysLabel: `${days} gun`, monthlyNeed: Math.ceil(remainingBudget / months), weeklyNeed: Math.ceil(remainingBudget / weeks), targetDate, isDone, message: `${months} ay / ${weeks} hafta icinde hedefe ulasmak icin hesaplandi.`, warning: false }; }
function parseDate(targetDate, targetMonth, year) { if (targetDate && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) { const d = new Date(`${targetDate}T00:00:00`); if (!Number.isNaN(d.getTime())) return start(d); } const m = monthNo(targetMonth); return m && year ? new Date(Number(year), m - 1, 28) : null; }
function monthNo(text) { const v = String(text || '').toLowerCase(); const names = ['ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik']; return names.findIndex((m) => v.includes(m)) + 1; }
function start(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function statusLabel(s) { const found = STATUS.find(([k]) => k === s); return found ? found[1] : 'Planli'; }
function statusColor(s) { if (s === 'done' || s === 'completed') return '#128C7E'; if (s === 'active' || s === 'saving') return '#2DE2E6'; if (s === 'postponed') return '#FFB347'; if (s === 'cancelled') return '#FF6B7A'; return '#FF7A59'; }
function n(v) { const x = Number(String(v).replace(',', '.')); return Number.isFinite(x) ? x : 0; }

const hero = { padding: 20, borderRadius: 30, backgroundColor: '#06202A' };
const heroMini = { color: '#C8FBFF', fontSize: 12, fontWeight: '900' };
const heroTitle = { marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' };
const heroText = { marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' };
const panel = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const panelTitle = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const panelNote = { marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniT = { color: '#315661', fontSize: 12, fontWeight: '900' };
const miniV = { marginTop: 8, color: '#102A35', fontSize: 19, fontWeight: '900' };
const miniD = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const small = { flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#CFECEE' };
const smallV = { marginTop: 4, color: '#102A35', fontSize: 13, fontWeight: '900' };
const chip = { marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18 };
const chipText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const label = { marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' };
const input = { marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 15, fontWeight: '800' };
const btnText = { color: '#06202A', fontSize: 14, fontWeight: '900' };
const card = { marginTop: 10, padding: 14, borderRadius: 20, backgroundColor: '#F8FFFF', borderWidth: 1 };
const cardTitle = { flex: 1, color: '#102A35', fontSize: 16, fontWeight: '900' };
const sub = { marginTop: 5, color: '#315661', fontSize: 12, lineHeight: 18, fontWeight: '800' };
const txt = { color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' };
