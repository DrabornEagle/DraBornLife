import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { YearFinancePanel } from '../components/YearFinancePanel';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

const TYPES = [['tasinma', 'Taşınma'], ['seyahat', 'Seyahat'], ['ev', 'Ev'], ['arac', 'Araç'], ['oyun', 'Oyun'], ['aile', 'Aile'], ['diger', 'Diğer']];
const STATUS = [['planned', 'Planlı'], ['active', 'Aktif'], ['saving', 'Para birikiyor'], ['done', 'Tamam'], ['postponed', 'Ertelendi'], ['cancelled', 'İptal']];

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
    if (!title) return msg('Hedef adı boş olamaz.', 'error');
    if (!Number.isFinite(year) || year < 2020) return msg('Hedef yılı hatalı. Örnek: 2026', 'error');
    if (budget < 0 || savedAmount < 0) return msg('Bütçe veya biriken tutar negatif olamaz.', 'error');
    if (budget > 0 && savedAmount > budget) return msg('Biriken tutar hedef bütçeden büyük olamaz.', 'error');
    const nextGoal = { id: editingId || `year_goal_${Date.now()}`, year, title, goalType: form.goalType, country: form.country.trim(), city: form.city.trim(), area: form.area.trim(), targetMonth: form.targetMonth.trim(), targetDate: form.targetDate.trim(), estimatedBudget: budget, savedAmount, status: form.status, note: form.note.trim() };
    const nextPlans = editingId ? plans.map((p) => p.id === editingId ? nextGoal : p) : [nextGoal, ...plans];
    savePlans(nextPlans, year);
    msg(editingId ? 'Yıllık hedef güncellendi.' : 'Yıllık hedef eklendi.');
    resetForm();
  }

  function editGoal(plan) { setEditingId(plan.id); setForm({ title: plan.title || '', goalType: plan.goalType || 'tasinma', year: String(plan.year || selectedYear), country: plan.country || '', city: plan.city || '', area: plan.area || '', targetMonth: plan.targetMonth || '', targetDate: plan.targetDate || '', estimatedBudget: String(plan.estimatedBudget || ''), savedAmount: String(plan.savedAmount || ''), status: plan.status || 'planned', note: plan.note || '' }); msg('Hedef düzenleme modu açıldı.'); }
  function removeGoal(id) { savePlans(plans.filter((p) => p.id !== id)); if (editingId === id) resetForm(); msg('Yıllık hedef silindi.'); }
  function setStatus(id, status) { savePlans(plans.map((p) => p.id === id ? { ...p, status } : p)); msg('Hedef durumu güncellendi.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160, backgroundColor: '#F4FBF9' }}>
      <Hero selectedYear={selectedYear} progress={progress} count={shown.length} />
      <NoticeBox message={notice.text} type={notice.type} />
      <Panel title="Yıl seç" note="Hedefleri yıl yıl ayır; Antalya, aile, tatil ve büyük yaşam planlarını tek akışta takip et."><ScrollView horizontal showsHorizontalScrollIndicator={false}>{years.map((y) => <Chip key={y} label={String(y)} active={selectedYear === y} onPress={() => selectYear(y)} />)}</ScrollView></Panel>
      <Row><Mini title="Seçili yıl" value={String(selectedYear)} text={`${shown.length} hedef`} /><Mini title="Bütçe" value={formatTRY(total)} text={`${formatTRY(saved)} birikti`} /></Row>
      <Row><Mini title="İlerleme" value={`%${progress}`} text={`${formatTRY(left)} kalan`} /><Mini title="En yakın" value={nearest.daysLabel} text={nearest.title} /></Row>
      <YearFinancePanel lifeData={lifeData} selectedYear={selectedYear} />
      <GoalForm form={form} set={patchForm} editing={!!editingId} save={saveGoal} cancel={resetForm} />
      <Panel title="Birikim geri sayımı" note="Hedef tarihine göre kalan süre ve gerekli birikim hesaplanır."><Row><Mini title="Kalan bütçe" value={formatTRY(left)} text="Seçili yıl toplam" /><Mini title="Aylık lazım" value={formatTRY(nearest.monthlyNeed)} text="En yakın hedef" /></Row><Row><Mini title="Haftalık lazım" value={formatTRY(nearest.weeklyNeed)} text="En yakın hedef" /><Mini title="Tamam" value={`${done}/${shown.length}`} text="Hedef durumu" /></Row></Panel>
      <Panel title={`${selectedYear} hedefleri`} note="Hedefleri düzenle, sil veya durumunu değiştir.">{shown.length === 0 ? <EmptyState /> : shown.map((p) => <GoalCard key={p.id} plan={p} edit={editGoal} remove={removeGoal} setStatus={setStatus} />)}</Panel>
    </ScrollView>
  );
}

function Hero({ selectedYear, progress, count }) { return <View style={hero}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View style={{ flex: 1, paddingRight: 12 }}><Text style={heroMini}>{APP_VERSION_LABEL} • Expo Go</Text><Text style={heroTitle}>Yıl planı</Text><Text style={heroText}>Seçilen yıla göre taşınma, seyahat ve büyük aile hedeflerini sade şekilde takip et.</Text></View><View style={yearBadge}><Text style={yearBadgeText}>{selectedYear}</Text></View></View><Row><Mini title="Hedef" value={String(count)} text="Seçili yıl" /><Mini title="İlerleme" value={`%${progress}`} text="Birikim oranı" /></Row></View>; }
function GoalForm({ form, set, editing, save, cancel }) { return <Panel title={editing ? 'Yıllık hedefi düzenle' : 'Yeni yıl hedefi'} note="Taşınma, seyahat, ev, araç, oyun veya aile hedefi ekle."><Input label="Hedef adı" value={form.title} onChangeText={(v) => set('title', v)} placeholder="Örn: Antalya ev düzeni" /><Text style={label}>Hedef tipi</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{TYPES.map(([k, v]) => <Chip key={k} label={v} active={form.goalType === k} onPress={() => set('goalType', k)} />)}</ScrollView><Input label="Hedef yılı" value={form.year} onChangeText={(v) => set('year', v)} placeholder="2027" keyboardType="numeric" /><Input label="Ülke" value={form.country} onChangeText={(v) => set('country', v)} placeholder="Türkiye" /><Input label="Şehir" value={form.city} onChangeText={(v) => set('city', v)} placeholder="Antalya" /><Input label="Bölge" value={form.area} onChangeText={(v) => set('area', v)} placeholder="Lara" /><Input label="Hedef ay" value={form.targetMonth} onChangeText={(v) => set('targetMonth', v)} placeholder="Kasım" /><Input label="Hedef tarih" value={form.targetDate} onChangeText={(v) => set('targetDate', v)} placeholder="2026-10-31" /><Input label="Tahmini bütçe" value={form.estimatedBudget} onChangeText={(v) => set('estimatedBudget', v)} keyboardType="numeric" placeholder="250000" /><Input label="Biriken tutar" value={form.savedAmount} onChangeText={(v) => set('savedAmount', v)} keyboardType="numeric" placeholder="50000" /><Text style={label}>Durum</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{STATUS.map(([k, v]) => <Chip key={k} label={v} active={form.status === k} onPress={() => set('status', k)} />)}</ScrollView><Input label="Not" value={form.note} onChangeText={(v) => set('note', v)} placeholder="İsteğe bağlı" /><Button label={editing ? 'Hedefi güncelle' : 'Hedef ekle'} onPress={save} color="#FFB347" />{editing && <Button label="Düzenlemeyi iptal et" onPress={cancel} color="#CFECEE" />}</Panel>; }
function GoalCard({ plan, edit, remove, setStatus }) { const c = calc(plan); return <View style={[card, { borderColor: statusColor(plan.status) }]}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={cardTitle}>{plan.title}</Text><Text style={{ color: statusColor(plan.status), fontSize: 12, fontWeight: '900' }}>{statusLabel(plan.status)}</Text></View><Text style={sub}>{typeLabel(plan.goalType)} • {plan.city || plan.country || 'Hedef'} • {plan.targetMonth || plan.targetDate || 'Tarih yok'}</Text><Row><Small title="Kalan" value={formatTRY(c.remainingBudget)} /><Small title="Süre" value={c.daysLabel} /></Row><Row><Small title="Aylık" value={formatTRY(c.monthlyNeed)} /><Small title="Haftalık" value={formatTRY(c.weeklyNeed)} /></Row><Text style={[sub, { color: c.warning ? '#7A1E2B' : '#315661' }]}>{c.message}</Text>{!!plan.note && <Text style={sub}>{plan.note}</Text>}<Row><Button label="Düzenle" onPress={() => edit(plan)} color="#2DE2E6" small /><Button label="Sil" onPress={() => remove(plan.id)} color="#FFD0D8" small /></Row><ScrollView horizontal showsHorizontalScrollIndicator={false}>{STATUS.map(([k, v]) => <Chip key={k} label={v} active={plan.status === k} onPress={() => setStatus(plan.id, k)} />)}</ScrollView></View>; }

function EmptyState() { return <View style={empty}><Text style={{ fontSize: 28 }}>🌴</Text><Text style={txt}>Bu yıl için henüz hedef yok. Yeni bir hedef ekleyerek yıl planını başlat.</Text></View>; }
function Panel({ title, note, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text><Text style={panelNote}>{note}</Text>{children}</View>; }
function Row({ children }) { return <View style={{ flexDirection: 'row', marginTop: 8 }}>{children}</View>; }
function Mini({ title, value, text }) { return <View style={mini}><Text style={miniT}>{title}</Text><Text style={miniV} numberOfLines={1}>{value}</Text><Text style={miniD}>{text}</Text></View>; }
function Small({ title, value }) { return <View style={small}><Text style={miniT}>{title}</Text><Text style={smallV}>{value}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={[chip, { backgroundColor: active ? '#2DE2E6' : '#E7F4F4', borderColor: active ? '#2DE2E6' : '#CFECEE' }]}><Text style={chipText}>{label}</Text></TouchableOpacity>; }
function Button({ label, onPress, color, small }) { return <TouchableOpacity onPress={onPress} style={{ flex: small ? 1 : undefined, marginRight: small ? 6 : 0, marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={btnText}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={label}>{props.label}</Text><TextInput {...props} style={input} placeholderTextColor="#7C969D" /></View>; }

function blank(year) { return { title: '', goalType: 'tasinma', year: String(year), country: 'Türkiye', city: 'Antalya', area: '', targetMonth: '', targetDate: '', estimatedBudget: '', savedAmount: '', status: 'planned', note: '' }; }
function nearestCalc(plans) { const list = plans.map(calc).filter((x) => !x.isDone && x.daysLeft >= 0 && x.targetDate); if (!list.length) return { title: 'Tarih bekliyor', daysLabel: '0 gün', monthlyNeed: 0, weeklyNeed: 0 }; list.sort((a, b) => a.daysLeft - b.daysLeft); return list[0]; }
function calc(plan) { const total = n(plan.estimatedBudget); const saved = n(plan.savedAmount); const remainingBudget = Math.max(0, total - saved); const isDone = plan.status === 'done' || plan.status === 'completed' || (remainingBudget === 0 && total > 0); const targetDate = parseDate(plan.targetDate, plan.targetMonth, plan.year); if (isDone) return { title: plan.title, remainingBudget, daysLeft: 0, daysLabel: 'Tamam', monthlyNeed: 0, weeklyNeed: 0, targetDate, isDone, message: 'Hedef tamamlanmış görünüyor.', warning: false }; if (!targetDate) return { title: plan.title, remainingBudget, daysLeft: -1, daysLabel: 'Tarih yok', monthlyNeed: 0, weeklyNeed: 0, targetDate: null, isDone, message: 'Hedef tarihi eksik. Tarih eklenince geri sayım hesaplanacak.', warning: true }; const today = start(new Date()); const days = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000); if (days < 0) return { title: plan.title, remainingBudget, daysLeft: days, daysLabel: 'Geçti', monthlyNeed: remainingBudget, weeklyNeed: remainingBudget, targetDate, isDone, message: 'Hedef tarihi geçmiş. Tarihi güncellemen veya hedefi tamamlaman iyi olur.', warning: true }; const months = Math.max(1, Math.ceil(days / 30)); const weeks = Math.max(1, Math.ceil(days / 7)); return { title: plan.title, remainingBudget, daysLeft: days, daysLabel: `${days} gün`, monthlyNeed: Math.ceil(remainingBudget / months), weeklyNeed: Math.ceil(remainingBudget / weeks), targetDate, isDone, message: `${months} ay / ${weeks} hafta içinde hedefe ulaşmak için hesaplandı.`, warning: false }; }
function parseDate(targetDate, targetMonth, year) { if (targetDate && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) { const d = new Date(`${targetDate}T00:00:00`); if (!Number.isNaN(d.getTime())) return start(d); } const m = monthNo(targetMonth); return m && year ? new Date(Number(year), m - 1, 28) : null; }
function monthNo(text) { const key = String(text || '').toLocaleLowerCase('tr-TR'); const months = { ocak: 1, şubat: 2, subat: 2, mart: 3, nisan: 4, mayıs: 5, mayis: 5, haziran: 6, temmuz: 7, ağustos: 8, agustos: 8, eylül: 9, eylul: 9, ekim: 10, kasım: 11, kasim: 11, aralık: 12, aralik: 12 }; return months[key] || 0; }
function start(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function statusLabel(s) { const found = STATUS.find(([k]) => k === s); return found ? found[1] : 'Planlı'; }
function typeLabel(s) { const found = TYPES.find(([k]) => k === s); return found ? found[1] : 'Hedef'; }
function statusColor(s) { if (s === 'done' || s === 'completed') return '#128C7E'; if (s === 'active' || s === 'saving') return '#2DE2E6'; if (s === 'postponed') return '#FFB347'; if (s === 'cancelled') return '#FF6B7A'; return '#FF7A59'; }
function n(v) { const x = Number(String(v).replace(',', '.')); return Number.isFinite(x) ? x : 0; }

const hero = { padding: 20, borderRadius: 32, backgroundColor: 'white', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 };
const heroMini = { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 };
const heroTitle = { marginTop: 8, color: '#102A35', fontSize: 34, lineHeight: 38, fontWeight: '900' };
const heroText = { marginTop: 10, color: '#315661', fontSize: 14, lineHeight: 21, fontWeight: '700' };
const yearBadge = { minWidth: 72, height: 58, paddingHorizontal: 10, borderRadius: 24, backgroundColor: '#073B4C', alignItems: 'center', justifyContent: 'center' };
const yearBadgeText = { color: 'white', fontSize: 19, fontWeight: '900' };
const panel = { marginTop: 14, padding: 16, borderRadius: 26, backgroundColor: 'white', borderWidth: 1, borderColor: '#E4F2F1', elevation: 2 };
const panelTitle = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const panelNote = { marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginHorizontal: 4, padding: 14, minHeight: 106, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniT = { color: '#315661', fontSize: 12, fontWeight: '900' };
const miniV = { marginTop: 8, color: '#102A35', fontSize: 19, fontWeight: '900' };
const miniD = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const small = { flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#F4FBF9', borderWidth: 1, borderColor: '#CFECEE' };
const smallV = { marginTop: 4, color: '#102A35', fontSize: 13, fontWeight: '900' };
const chip = { marginRight: 8, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, borderWidth: 1 };
const chipText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const label = { marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' };
const input = { marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 15, fontWeight: '800' };
const btnText = { color: '#06202A', fontSize: 14, fontWeight: '900' };
const card = { marginTop: 10, padding: 14, borderRadius: 22, backgroundColor: '#F8FFFF', borderWidth: 1 };
const cardTitle = { flex: 1, color: '#102A35', fontSize: 17, lineHeight: 22, fontWeight: '900' };
const sub = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 18, fontWeight: '800' };
const empty = { padding: 18, borderRadius: 22, backgroundColor: '#E7FBFC', borderWidth: 1, borderColor: '#BEEDEF', alignItems: 'center' };
const txt = { marginTop: 8, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800', textAlign: 'center' };
