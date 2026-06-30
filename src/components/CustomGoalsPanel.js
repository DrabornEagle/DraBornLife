import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from './NoticeBox';
import { formatTRY } from '../utils/lifeSummary';

const goalCategories = ['ev', 'aile', 'tatil', 'oyun', 'motor', 'yasam', 'diger'];

export function CustomGoalsPanel({ lifeData, onSave }) {
  const goals = lifeData?.customGoals || [];
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('yasam');
  const [budget, setBudget] = useState('');
  const [saved, setSaved] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState({ text: '', type: 'info' });

  const totalBudget = goals.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const totalSaved = goals.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const doneCount = goals.filter((item) => item.isCompleted).length;

  function info(text) { setNotice({ text, type: 'info' }); }
  function error(text) { setNotice({ text, type: 'error' }); }

  function clearForm() {
    setEditingId(null);
    setTitle('');
    setCategory('yasam');
    setBudget('');
    setSaved('');
    setTargetDate('');
    setNote('');
  }

  function saveGoals(nextGoals) {
    onSave({ ...lifeData, customGoals: nextGoals });
  }

  function saveGoal() {
    const cleanTitle = title.trim();
    const cleanBudget = n(budget);
    const cleanSaved = n(saved);
    if (!cleanTitle) return error('Hedef adi bos olamaz.');
    if (budget.trim() && cleanBudget < 0) return error('Tahmini butce negatif olamaz.');
    if (saved.trim() && cleanSaved < 0) return error('Biriken tutar negatif olamaz.');
    if (cleanBudget > 0 && cleanSaved > cleanBudget) return error('Biriken tutar tahmini butceden buyuk olamaz.');

    const oldGoal = goals.find((item) => item.id === editingId);
    const nextGoal = {
      id: editingId || `custom_goal_${Date.now()}`,
      title: cleanTitle,
      category,
      estimatedBudget: cleanBudget,
      savedAmount: cleanSaved,
      targetDate: targetDate.trim(),
      note: note.trim(),
      isCompleted: editingId ? !!oldGoal?.isCompleted : false,
    };

    const nextGoals = editingId ? goals.map((item) => item.id === editingId ? nextGoal : item) : [nextGoal, ...goals];
    saveGoals(nextGoals);
    info(editingId ? 'Ozel hedef guncellendi.' : 'Ozel hedef eklendi.');
    clearForm();
  }

  function editGoal(item) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setCategory(item.category || 'yasam');
    setBudget(String(item.estimatedBudget || ''));
    setSaved(String(item.savedAmount || ''));
    setTargetDate(item.targetDate || '');
    setNote(item.note || '');
    info('Ozel hedef duzenleme modu acildi.');
  }

  function deleteGoal(goalId) {
    saveGoals(goals.filter((item) => item.id !== goalId));
    if (editingId === goalId) clearForm();
    info('Ozel hedef silindi.');
  }

  function toggleGoal(goalId) {
    saveGoals(goals.map((item) => item.id === goalId ? { ...item, isCompleted: !item.isCompleted } : item));
    info('Ozel hedef durumu guncellendi.');
  }

  return (
    <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Ozel hedefler</Text>
      <Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Antalya hayati icin istedigin ek hedefleri olustur ve takip et.</Text>
      <NoticeBox message={notice.text} type={notice.type} />

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Mini label="Toplam" value={formatTRY(totalBudget)} />
        <Mini label="Biriken" value={formatTRY(totalSaved)} />
        <Mini label="Tamam" value={`${doneCount}/${goals.length}`} />
      </View>

      <Input label="Hedef adi" value={title} onChangeText={setTitle} placeholder="Orn: Miami temali balkon" />
      <Text style={{ marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' }}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
        {goalCategories.map((item) => <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}
      </ScrollView>
      <Input label="Tahmini butce" value={budget} onChangeText={setBudget} placeholder="Orn: 10000" keyboardType="numeric" />
      <Input label="Biriken tutar" value={saved} onChangeText={setSaved} placeholder="Orn: 2000" keyboardType="numeric" />
      <Input label="Hedef ay veya tarih" value={targetDate} onChangeText={setTargetDate} placeholder="Orn: Kasim 2026" />
      <Input label="Not" value={note} onChangeText={setNote} placeholder="Istege bagli" />
      <Button label={editingId ? 'Hedefi guncelle' : 'Hedef ekle'} onPress={saveGoal} color="#FFB347" />
      {editingId && <Button label="Duzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}

      {goals.length === 0 ? <Text style={{ marginTop: 12, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>Henuz ozel hedef yok. Ilk hedefini ekleyerek Antalya hayalini parcalara bol.</Text> : goals.map((item) => <GoalItem key={item.id} item={item} onToggle={toggleGoal} onEdit={editGoal} onDelete={deleteGoal} />)}
    </View>
  );
}

function Mini({ label, value }) { return <View style={{ flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 10, fontWeight: '900' }}>{label}</Text><Text style={{ marginTop: 5, color: '#102A35', fontSize: 13, fontWeight: '900' }}>{value}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 15, fontWeight: '800' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function GoalItem({ item, onToggle, onEdit, onDelete }) { const left = Math.max(0, n(item.estimatedBudget) - n(item.savedAmount)); return <View style={{ marginTop: 10, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text><Text style={{ color: item.isCompleted ? '#128C7E' : '#FF7A59', fontSize: 12, fontWeight: '900' }}>{item.isCompleted ? 'Tamam' : formatTRY(left)}</Text></View><Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '800' }}>{item.category} - Biriken: {formatTRY(item.savedAmount)} / {formatTRY(item.estimatedBudget)}</Text>{!!item.targetDate && <Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '800' }}>Hedef: {item.targetDate}</Text>}{!!item.note && <Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '700' }}>{item.note}</Text>}<View style={{ flexDirection: 'row', marginTop: 10 }}><Small label="Tamam" onPress={() => onToggle(item.id)} active={item.isCompleted} /><Small label="Duzenle" onPress={() => onEdit(item)} active /><Small label="Sil" onPress={() => onDelete(item.id)} danger /></View></View>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 6, paddingVertical: 9, borderRadius: 15, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 11, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
