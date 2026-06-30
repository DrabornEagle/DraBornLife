import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

export function AntalyaLifeScreen({ lifeData, onSave }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const beaches = lifeData?.beaches || [];
  const customGoals = lifeData?.customGoals || [];

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'living_room');
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [notice, setNotice] = useState({ text: '', type: 'info' });

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0] || { items: [] };
  const roomItems = rooms.flatMap((room) => room.items || []);
  const roomDone = roomItems.filter((item) => item.isCompleted).length;
  const homePercent = percent(roomDone, roomItems.length);

  const activityTotal = activities.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const activitySaved = activities.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const activityDone = activities.filter((item) => item.isCompleted).length;

  const visitedPlaces = beaches.filter((item) => item.status === 'visited' || item.status === 'done').length;
  const plannedPlaces = beaches.length - visitedPlaces;
  const customDone = customGoals.filter((item) => item.isCompleted).length;
  const customTotal = customGoals.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const customSaved = customGoals.reduce((sum, item) => sum + n(item.savedAmount), 0);

  function info(text) { setNotice({ text, type: 'info' }); }
  function error(text) { setNotice({ text, type: 'error' }); }

  function clearForm() {
    setEditingItemId(null);
    setItemTitle('');
    setItemPrice('');
    setItemNote('');
  }

  function saveRooms(nextRooms) {
    onSave({ ...lifeData, homeSetupRooms: nextRooms });
  }

  function saveRoomItem() {
    const title = itemTitle.trim();
    const price = n(itemPrice);
    if (!title) return error('Esya adi bos olamaz.');
    if (itemPrice.trim() && price < 0) return error('Tahmini fiyat negatif olamaz.');

    const nextItem = {
      id: editingItemId || `home_item_${Date.now()}`,
      title,
      estimatedPrice: price,
      note: itemNote.trim(),
      isCompleted: editingItemId ? !!selectedRoom.items?.find((item) => item.id === editingItemId)?.isCompleted : false,
    };

    const nextRooms = rooms.map((room) => {
      if (room.id !== selectedRoom.id) return room;
      const items = room.items || [];
      return {
        ...room,
        items: editingItemId ? items.map((item) => item.id === editingItemId ? nextItem : item) : [nextItem, ...items],
      };
    });

    saveRooms(nextRooms);
    info(editingItemId ? 'Oda esyasi guncellendi.' : 'Oda esyasi eklendi.');
    clearForm();
  }

  function editRoomItem(item) {
    setEditingItemId(item.id);
    setItemTitle(item.title || '');
    setItemPrice(String(item.estimatedPrice || ''));
    setItemNote(item.note || '');
    info('Esya duzenleme modu acildi.');
  }

  function deleteRoomItem(itemId) {
    const nextRooms = rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).filter((item) => item.id !== itemId) } : room);
    saveRooms(nextRooms);
    if (editingItemId === itemId) clearForm();
    info('Oda esyasi silindi.');
  }

  function toggleRoomItem(itemId) {
    const nextRooms = rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).map((item) => item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item) } : room);
    saveRooms(nextRooms);
    info('Esya durumu guncellendi.');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' }}>Antalya Life</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Ev kurulumu, aile aktiviteleri, sahil ve hedefleri tek yasam panelinde takip et.</Text>
      </View>

      <NoticeBox message={notice.text} type={notice.type} />

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <MiniCard title="Ev Kurulum" value={`%${homePercent}`} text={`${roomDone}/${roomItems.length || 0} esya tamam`} />
        <MiniCard title="Aktivite" value={formatTRY(Math.max(0, activityTotal - activitySaved))} text="Kalan aktivite butcesi" />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <MiniCard title="Sahil/Aqua" value={`${visitedPlaces}/${beaches.length}`} text={`${plannedPlaces} planli hedef`} />
        <MiniCard title="Ozel Hedef" value={`${customDone}/${customGoals.length}`} text={formatTRY(Math.max(0, customTotal - customSaved))} />
      </View>

      <Panel title="Ev kurulum odalari" subtitle="Oda sec, esya ekle, tamamlandi durumunu takip et.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {rooms.map((room) => <Chip key={room.id} label={room.title} active={selectedRoom.id === room.id} onPress={() => { setSelectedRoomId(room.id); clearForm(); }} />)}
        </ScrollView>
        {rooms.map((room) => {
          const items = room.items || [];
          const done = items.filter((item) => item.isCompleted).length;
          return <Line key={room.id} left={room.title} right={`%${percent(done, items.length)}`} note={`${done}/${items.length} tamam`} />;
        })}
      </Panel>

      <Panel title={`${selectedRoom.title || 'Oda'} esyalari`} subtitle="Bu oda icin alinacak veya kurulacak esyalari ekle.">
        <Input label="Esya adi" value={itemTitle} onChangeText={setItemTitle} placeholder="Orn: Koltuk takimi" />
        <Input label="Tahmini fiyat" value={itemPrice} onChangeText={setItemPrice} placeholder="Orn: 35000" keyboardType="numeric" />
        <Input label="Not" value={itemNote} onChangeText={setItemNote} placeholder="Istege bagli" />
        <Button label={editingItemId ? 'Esyayi guncelle' : 'Esyayi ekle'} onPress={saveRoomItem} color="#FFB347" />
        {editingItemId && <Button label="Duzenlemeyi iptal et" onPress={clearForm} color="#CFECEE" />}
        {(selectedRoom.items || []).length === 0 ? <Text style={{ marginTop: 12, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>Bu odada henuz esya yok. Ilk esyayi ekleyerek oda kurulumunu baslat.</Text> : (selectedRoom.items || []).map((item) => <RoomItem key={item.id} item={item} onToggle={toggleRoomItem} onEdit={editRoomItem} onDelete={deleteRoomItem} />)}
      </Panel>

      <Panel title="Aile aktivite butcesi" subtitle="v0.3.5 adiminda aktivite ekleme/duzenleme gelecek.">
        {activities.map((item) => <Line key={item.id} left={item.title} right={formatTRY(Math.max(0, n(item.estimatedPrice) - n(item.savedAmount)))} note={item.category} />)}
        <Line left="Tamamlanan aktivite" right={`${activityDone}/${activities.length}`} note="Aile keyfi hedefleri" />
      </Panel>

      <Panel title="Sahil, aquapark ve tatil" subtitle="v0.3.6 adiminda gidildi/planlandi takibi gelecek.">
        {beaches.map((item) => <Line key={item.id} left={item.title} right={item.status === 'visited' ? 'Gidildi' : 'Planli'} note={`${item.type} - ${item.area}`} />)}
      </Panel>

      <Panel title="Ozel hedefler" subtitle="v0.3.7 adiminda yeni hedef ekleme sistemi gelecek.">
        {customGoals.length === 0 ? <Text style={{ color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>Henuz ozel hedef yok. Sonraki adimlarda kendi hedeflerini ekleyebileceksin.</Text> : customGoals.map((item) => <Line key={item.id} left={item.title} right={item.isCompleted ? 'Tamam' : 'Aktif'} note={formatTRY(item.estimatedBudget)} />)}
      </Panel>
    </ScrollView>
  );
}

function Panel({ title, subtitle, children }) {
  return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{subtitle}</Text>{children}</View>;
}
function MiniCard({ title, value, text }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 22, fontWeight: '900' }}>{value}</Text><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{text}</Text></View>; }
function Line({ left, right, note }) { return <View style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#CFECEE' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 14, fontWeight: '900' }}>{left}</Text><Text style={{ color: '#FF7A59', fontSize: 13, fontWeight: '900' }}>{right}</Text></View><Text style={{ marginTop: 3, color: '#315661', fontSize: 12, fontWeight: '800' }}>{note}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', color: '#102A35', fontSize: 15, fontWeight: '800' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function RoomItem({ item, onToggle, onEdit, onDelete }) { return <View style={{ marginTop: 10, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 15, fontWeight: '900' }}>{item.title}</Text><Text style={{ color: item.isCompleted ? '#128C7E' : '#FF7A59', fontSize: 12, fontWeight: '900' }}>{item.isCompleted ? 'Tamam' : 'Bekliyor'}</Text></View><Text style={{ marginTop: 4, color: '#315661', fontSize: 12, fontWeight: '800' }}>{formatTRY(item.estimatedPrice)} {item.note ? `- ${item.note}` : ''}</Text><View style={{ flexDirection: 'row', marginTop: 10 }}><Small label="Tamam" onPress={() => onToggle(item.id)} active={item.isCompleted} /><Small label="Duzenle" onPress={() => onEdit(item)} active /><Small label="Sil" onPress={() => onDelete(item.id)} danger /></View></View>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 6, paddingVertical: 9, borderRadius: 15, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#CFECEE', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 11, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function percent(current, total) { if (!total || total <= 0) return 0; return Math.max(0, Math.min(100, Math.round((current / total) * 100))); }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
