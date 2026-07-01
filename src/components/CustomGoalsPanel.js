import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EmptyStateCard } from './EmptyStateCard';
import { NoticeBox } from './NoticeBox';
import { formatMoney } from '../utils/lifeSummary';

const goalCategories = ['Ev', 'Aile', 'Tatil', 'Oyun', 'Motor', 'Yaşam', 'Diğer'];
const yearOptionsBase = [2026, 2027, 2028, 2029, 2030];

export function CustomGoalsPanel({ lifeData, onSave }) {
  const goals = lifeData?.customGoals || [];
  const plans = lifeData?.yearlyPlans || [];
  const defaultYear = Number(lifeData?.settings?.selectedYear || 2026);
  const years = useMemo(() => Array.from(new Set([...yearOptionsBase, defaultYear, ...goals.map(g => Number(g.year)), ...plans.map(p => Number(p.year))])).filter(Boolean).sort((a, b) => a - b), [goals, plans, defaultYear]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Yaşam');
  const [year, setYear] = useState(String(defaultYear));
  const [budget, setBudget] = useState('');
  const [saved, setSaved] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const money = (value) => formatMoney(value, lifeData);

  const selectedYear = Number(year) || defaultYear;
  const yearGoals = goals.filter((item) => Number(item.year || defaultYear) === selectedYear);
  const totalBudget = goals.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const totalSaved = goals.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const doneCount = goals.filter((item) => item.isCompleted).length;
  const yearDone = yearGoals.filter((item) => item.isCompleted).length;

  function info(text) { setNotice({ text, type: 'info' }); }
  function error(text) { setNotice({ text, type: 'error' }); }
  function clearForm() { setEditingId(null); setTitle(''); setCategory('Yaşam'); setYear(String(defaultYear)); setBudget(''); setSaved(''); setTargetDate(''); setNote(''); }
  function saveAll(nextGoals) { onSave({ ...lifeData, customGoals: nextGoals, yearlyPlans: syncYearPlans(lifeData?.yearlyPlans || [], nextGoals, defaultYear) }); }

  function saveGoal() {
    const cleanTitle = title.trim();
    const cleanBudget = n(budget);
    const cleanSaved = n(saved);
    const cleanTargetDate = targetDate.trim();
    const cleanYear = Number(year) || defaultYear;
    if (!cleanTitle) return error('Hedef adı boş olamaz.');
    if (cleanTitle.length < 3) return error('Hedef adı en az 3 karakter olmalı.');
    if (!Number.isFinite(cleanYear) || cleanYear < 2020) return error('Hedef yılı hatalı. Örnek: 2026');
    if (budget.trim() && cleanBudget <= 0) return error('Tahmini bütçe 0’dan büyük olmalı.');
    if (saved.trim() && cleanSaved < 0) return error('Biriken tutar negatif olamaz.');
    if (cleanSaved > 0 && cleanBudget <= 0) return error('Biriken tutar giriyorsan tahmini bütçe de girmelisin.');
    if (cleanBudget > 0 && cleanSaved > cleanBudget) return error('Biriken tutar tahmini bütçeden büyük olamaz.');
    if (cleanTargetDate && looksLikeDate(cleanTargetDate) && !validDate(cleanTargetDate)) return error('Tarih formatı YYYY-MM-DD olmalı. Örnek: 2026-10-31. Ay metni yazacaksan Kasım 2026 gibi yazabilirsin.');

    const oldGoal = goals.find((item) => item.id === editingId);
    const goalId = editingId || `custom_goal_${Date.now()}`;
    const nextGoal = { id: goalId, linkedYearPlanId: oldGoal?.linkedYearPlanId || `linked_year_${goalId}`, title: cleanTitle, category, year: cleanYear, estimatedBudget: cleanBudget, savedAmount: cleanSaved, targetDate: cleanTargetDate, note: note.trim(), isCompleted: editingId ? !!oldGoal?.isCompleted : false };
    const nextGoals = editingId ? goals.map((item) => item.id === editingId ? nextGoal : item) : [nextGoal, ...goals];
    saveAll(nextGoals);
    info(editingId ? 'Özel hedef güncellendi ve yıl planına yansıtıldı.' : 'Özel hedef eklendi ve yıl planına bağlandı.');
    clearForm();
  }

  function editGoal(item) { setEditingId(item.id); setTitle(item.title || ''); setCategory(item.category || 'Yaşam'); setYear(String(item.year || defaultYear)); setBudget(String(item.estimatedBudget || '')); setSaved(String(item.savedAmount || '')); setTargetDate(item.targetDate || ''); setNote(item.note || ''); info('Özel hedef düzenleme modu açıldı.'); }
  function deleteGoal(goalId) { saveAll(goals.filter((item) => item.id !== goalId)); if (editingId === goalId) clearForm(); info('Özel hedef silindi ve yıl planı bağlantısı temizlendi.'); }
  function toggleGoal(goalId) { const nextGoals = goals.map((item) => item.id === goalId ? { ...item, isCompleted: !item.isCompleted } : item); saveAll(nextGoals); info('Özel hedef durumu yıl planına yansıtıldı.'); }

  return (
    <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' }}>
      <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Özel hedefler</Text>
      <Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Ek hedeflerini yıl planına bağla; tamamlanma durumu Yıl ekranına otomatik yansır.</Text>
      <NoticeBox message={notice.text} type={notice.type} />
      <View style={{ flexDirection: 'row', marginTop: 10 }}><Mini label="Toplam" value={money(totalBudget)} /><Mini label="Biriken" value={money(totalSaved)} /><Mini label="Tamam" value={`${doneCount}/${goals.length}`} /></View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}><Mini label="Seçili yıl" value={String(selectedYear)} /><Mini label="Yıl hedefi" value={`${yearGoals.length}`} /><Mini label="Yıl tamam" value={`${yearDone}/${yearGoals.length}`} /></View>
      <Input label="Hedef adı" value={title} onChangeText={setTitle} placeholder="Örn: Miami temalı balkon" />
      <Text style={{ marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' }}>Hedef yılı</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>{years.map((item) => <Chip key={item} label={String(item)} active={String(item) === year} onPress={() => setYear(String(item))} />)}</ScrollView>
      <Text style={{ marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' }}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>{goalCategories.map((item) => <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</ScrollView>
      <Input label="Tahmini bütçe" value={budget} onChangeText={setBudget} placeholder="Örn: 10000" keyboardType="numeric" />
      <Input label="Biriken tutar" value={saved} onChangeText={setSaved} placeholder="Örn: 2000" keyboardType="numeric" />
      <Input label="Hedef ay veya tarih" value={targetDate} onChangeText={setTargetDate} placeholder="Örn: Kasım 2026 veya 2026-11-30" />
      <Input label="Not" value={note} onChangeText={setNote} placeholder="İsteğe bağlı" />
      <Button label={editingId ? 'Hedefi güncelle' : 'Hedef ekle'} onPress={saveGoal} color="#FFB347" />
      {editingId && <Button label="Düzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
      {goals.length === 0 ? <EmptyStateCard icon="🎯" title="Henüz özel hedef yok" text="İlk hedefini ekleyerek Antalya hayalini küçük ve takip edilebilir parçalara böl." /> : goals.map((item) => <GoalItem key={item.id} item={item} defaultYear={defaultYear} onToggle={toggleGoal} onEdit={editGoal} onDelete={deleteGoal} money={money} />)}
    </View>
  );
}

function syncYearPlans(plans, goals, defaultYear) {
  const linkedIds = goals.map((goal) => goal.linkedYearPlanId || `linked_year_${goal.id}`);
  const basePlans = plans.filter((plan) => !String(plan.id || '').startsWith('linked_year_') || linkedIds.includes(plan.id));
  const linkedPlans = goals.map((goal) => ({ id: goal.linkedYearPlanId || `linked_year_${goal.id}`, year: Number(goal.year || defaultYear), title: goal.title, goalType: categoryToType(goal.category), country: 'Türkiye', city: 'Antalya', area: '', targetMonth: looksLikeDate(goal.targetDate) ? '' : goal.targetDate || '', targetDate: validDate(goal.targetDate) ? goal.targetDate : '', estimatedBudget: n(goal.estimatedBudget), savedAmount: n(goal.savedAmount), status: goal.isCompleted ? 'done' : 'active', note: `Özel hedef bağlantısı: ${goal.note || 'not yok'}` }));
  const withoutOld = basePlans.filter((plan) => !linkedPlans.some((linked) => linked.id === plan.id));
  return [...linkedPlans, ...withoutOld];
}
function categoryToType(category) { if (category === 'Ev') return 'ev'; if (category === 'Tatil') return 'seyahat'; if (category === 'Motor') return 'arac'; if (category === 'Oyun') return 'oyun'; if (category === 'Aile') return 'aile'; return 'diger'; }
function Mini({ label, value }) { return <View style={{ flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 10, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 5, color: '#102A35', fontSize: 12, lineHeight: 16, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#E7F4F4' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 15, fontWeight: '800' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function GoalItem({ item, defaultYear, onToggle, onEdit, onDelete, money }) { const left = Math.max(0, n(item.estimatedBudget) - n(item.savedAmount)); return <View style={{ marginTop: 10, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, paddingRight: 8, color: '#102A35', fontSize: 15, lineHeight: 20, fontWeight: '900' }}>{item.title}</Text><Text style={{ maxWidth: 110, textAlign: 'right', color: item.isCompleted ? '#128C7E' : '#FF7A59', fontSize: 12, lineHeight: 17, fontWeight: '900' }} numberOfLines={2}>{item.isCompleted ? 'Tamam' : money(left)}</Text></View><Text style={{ marginTop: 4, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{item.category} • Yıl: {item.year || defaultYear} • Biriken: {money(item.savedAmount)} / {money(item.estimatedBudget)}</Text>{!!item.targetDate && <Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '800' }}>Hedef: {item.targetDate}</Text>}{!!item.note && <Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '700' }}>{item.note}</Text>}<Text style={{ marginTop: 4, color: '#128C7E', fontSize: 12, fontWeight: '900' }}>Yıl planı bağlantısı aktif</Text><View style={{ flexDirection: 'row', marginTop: 10 }}><Small label="Tamam" onPress={() => onToggle(item.id)} active={item.isCompleted} /><Small label="Düzenle" onPress={() => onEdit(item)} active /><Small label="Sil" onPress={() => onDelete(item.id)} danger /></View></View>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 6, paddingVertical: 9, borderRadius: 15, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#E7F4F4', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 11, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')); }
function looksLikeDate(value) { return /^\d/.test(String(value || '')); }
