import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { RegionComparisonPanel } from '../components/RegionComparisonPanel';
import { RoomPlanPanel } from '../components/RoomPlanPanel';
import { LifeReportPanel } from '../components/LifeReportPanel';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

const itemGroups = ['Temel mobilya', 'Beyaz eşya', 'Elektronik', 'Mutfak', 'Çocuk', 'Dekorasyon', 'Diğer'];
const activityCategories = ['Aquapark', 'Sahil', 'Piknik', 'Yemek', 'Gezi', 'Çocuk eğlence', 'Tatil'];
const placeTypes = ['Sahil', 'Aquapark', 'Gezi', 'Tatil'];

export function AntalyaLifeScreen({ lifeData, onSave }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const beaches = lifeData?.beaches || [];
  const customGoals = lifeData?.customGoals || [];
  const money = (value) => formatMoney(value, lifeData);

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'living_room');
  const [notice, setNotice] = useState({ text: '', type: 'info' });
  const [itemTitle, setItemTitle] = useState('');
  const [itemGroup, setItemGroup] = useState('Temel mobilya');
  const [itemPrice, setItemPrice] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState('Aquapark');
  const [activityPrice, setActivityPrice] = useState('');
  const [activitySaved, setActivitySaved] = useState('');
  const [placeTitle, setPlaceTitle] = useState('');
  const [placeType, setPlaceType] = useState('Sahil');
  const [placeArea, setPlaceArea] = useState('Antalya');
  const [placeBudget, setPlaceBudget] = useState('');

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0] || { id: 'room', title: 'Oda', items: [] };
  const roomItems = rooms.flatMap((room) => room.items || []);
  const roomDone = roomItems.filter((item) => item.isCompleted).length;
  const selectedItems = selectedRoom.items || [];
  const selectedTotal = selectedItems.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const selectedDone = selectedItems.filter((item) => item.isCompleted);
  const selectedDoneTotal = selectedDone.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const activityTotal = activities.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const activitySavedTotal = activities.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const activityDone = activities.filter((item) => item.isCompleted).length;
  const visitedPlaces = beaches.filter((item) => item.status === 'visited' || item.status === 'done').length;
  const customDone = customGoals.filter((item) => item.isCompleted).length;

  function info(text) { setNotice({ text, type: 'info' }); }
  function error(text) { setNotice({ text, type: 'error' }); }
  function saveRooms(nextRooms) { onSave({ ...lifeData, homeSetupRooms: nextRooms }); }
  function saveActivities(nextActivities) { onSave({ ...lifeData, activities: nextActivities }); }
  function savePlaces(nextPlaces) { onSave({ ...lifeData, beaches: nextPlaces }); }
  function clearItem() { setItemTitle(''); setItemGroup('Temel mobilya'); setItemPrice(''); setItemNote(''); }
  function clearActivity() { setActivityTitle(''); setActivityCategory('Aquapark'); setActivityPrice(''); setActivitySaved(''); }
  function clearPlace() { setPlaceTitle(''); setPlaceType('Sahil'); setPlaceArea('Antalya'); setPlaceBudget(''); }

  function addRoomItem() {
    const title = itemTitle.trim(); const price = n(itemPrice);
    if (!title) return error('Eşya adı boş olamaz.');
    if (price < 0) return error('Tahmini fiyat negatif olamaz.');
    const nextItem = { id: `home_item_${Date.now()}`, title, group: itemGroup, estimatedPrice: price, note: itemNote.trim(), isCompleted: false };
    saveRooms(rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: [nextItem, ...(room.items || [])] } : room));
    info('Oda eşyası eklendi.'); clearItem();
  }
  function toggleRoomItem(itemId) { saveRooms(rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).map((item) => item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item) } : room)); info('Eşya durumu güncellendi.'); }
  function removeRoomItem(itemId) { saveRooms(rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).filter((item) => item.id !== itemId) } : room)); info('Oda eşyası kaldırıldı.'); }

  function addActivity() { const title = activityTitle.trim(); const price = n(activityPrice); const saved = n(activitySaved); if (!title) return error('Aktivite adı boş olamaz.'); if (saved > price && price > 0) return error('Biriken tutar tahmini fiyattan büyük olamaz.'); saveActivities([{ id: `activity_${Date.now()}`, title, category: activityCategory, estimatedPrice: price, savedAmount: saved, isCompleted: false }, ...activities]); info('Aktivite eklendi.'); clearActivity(); }
  function toggleActivity(id) { saveActivities(activities.map((item) => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)); info('Aktivite durumu güncellendi.'); }
  function removeActivity(id) { saveActivities(activities.filter((item) => item.id !== id)); info('Aktivite kaldırıldı.'); }
  function addPlace() { const title = placeTitle.trim(); if (!title) return error('Hedef adı boş olamaz.'); savePlaces([{ id: `place_${Date.now()}`, title, type: placeType, area: placeArea.trim() || 'Antalya', estimatedBudget: n(placeBudget), status: 'planned' }, ...beaches]); info('Rota hedefi eklendi.'); clearPlace(); }
  function togglePlace(id) { savePlaces(beaches.map((item) => item.id === id ? { ...item, status: item.status === 'visited' || item.status === 'done' ? 'planned' : 'visited' } : item)); info('Hedef durumu güncellendi.'); }
  function removePlace(id) { savePlaces(beaches.filter((item) => item.id !== id)); info('Hedef kaldırıldı.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F6F8' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <View style={hero}><Text style={top}>{APP_VERSION_LABEL}</Text><Text style={h1}>Antalya Yaşam</Text><Text style={heroText}>Ev kurulumu, aile aktiviteleri, sahil ve tatil hedeflerini tek yaşam panelinde takip et.</Text></View>
      <NoticeBox message={notice.text} type={notice.type} />
      <View style={{ flexDirection: 'row', marginTop: 14 }}><Mini title="Ev kurulumu" value={`%${percent(roomDone, roomItems.length)}`} text={`${roomDone}/${roomItems.length || 0} eşya tamam`} /><Mini title="Aile aktivite" value={money(Math.max(0, activityTotal - activitySavedTotal))} text={`%${percent(activitySavedTotal, activityTotal)} bütçe hazır`} /></View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}><Mini title="Sahil / Aqua" value={`${visitedPlaces}/${beaches.length}`} text="rota hedefi" /><Mini title="Özel hedef" value={`${customDone}/${customGoals.length}`} text="tamamlandı" /></View>
      <RoomPlanPanel rooms={rooms} money={money} />
      <LifeReportPanel lifeData={lifeData} money={money} />
      <RegionComparisonPanel lifeData={lifeData} onSave={onSave} />

      <Panel title="Ev kurulum odaları" subtitle="Oda seç, eşya grubu belirle, bütçe ve tamamlanma durumunu takip et.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>{rooms.map((room) => <Chip key={room.id} label={fix(room.title)} active={selectedRoom.id === room.id} onPress={() => setSelectedRoomId(room.id)} />)}</ScrollView>
        {rooms.map((room) => { const items = room.items || []; const done = items.filter((item) => item.isCompleted).length; const total = items.reduce((sum, item) => sum + n(item.estimatedPrice), 0); return <Line key={room.id} left={fix(room.title)} right={`%${percent(done, items.length)}`} note={`${done}/${items.length} tamam - ${money(total)}`} />; })}
      </Panel>

      <Panel title={`${fix(selectedRoom.title)} eşyaları`} subtitle="Seçili odanın kalan eşyalarını yönet.">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}><Small title="Toplam" value={money(selectedTotal)} /><Small title="Tamam" value={`${selectedDone.length}/${selectedItems.length}`} /><Small title="Kalan" value={money(Math.max(0, selectedTotal - selectedDoneTotal))} /></View>
        <Input label="Eşya adı" value={itemTitle} onChangeText={setItemTitle} placeholder="Örn: Koltuk takımı" />
        <Text style={labelStyle}>Eşya grubu</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{itemGroups.map((group) => <Chip key={group} label={group} active={itemGroup === group} onPress={() => setItemGroup(group)} />)}</ScrollView>
        <Input label="Tahmini fiyat" value={itemPrice} onChangeText={setItemPrice} placeholder="Örn: 35000" keyboardType="numeric" />
        <Input label="Not" value={itemNote} onChangeText={setItemNote} placeholder="İsteğe bağlı" />
        <Button label="Eşyayı ekle" onPress={addRoomItem} color="#FFB347" />
        {selectedItems.length === 0 ? <Empty text="Bu odada eşya yok." /> : selectedItems.map((item) => <Item key={item.id} title={item.title} status={item.isCompleted ? 'Tamam' : 'Bekliyor'} sub={`${fix(item.group || 'Diğer')} - ${money(item.estimatedPrice)}`} onDone={() => toggleRoomItem(item.id)} onRemove={() => removeRoomItem(item.id)} />)}
      </Panel>

      <Panel title="Aile aktivite planı" subtitle="Aquapark, sahil, piknik, yemek, gezi ve tatil hedeflerini takip et.">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}><Small title="Toplam" value={money(activityTotal)} /><Small title="Biriken" value={money(activitySavedTotal)} /><Small title="Tamam" value={`${activityDone}/${activities.length}`} /></View>
        <Input label="Aktivite adı" value={activityTitle} onChangeText={setActivityTitle} placeholder="Örn: Aile aquapark günü" />
        <Text style={labelStyle}>Kategori</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{activityCategories.map((x) => <Chip key={x} label={x} active={activityCategory === x} onPress={() => setActivityCategory(x)} />)}</ScrollView>
        <Input label="Tahmini fiyat" value={activityPrice} onChangeText={setActivityPrice} placeholder="Örn: 2500" keyboardType="numeric" />
        <Input label="Biriken tutar" value={activitySaved} onChangeText={setActivitySaved} placeholder="Örn: 500" keyboardType="numeric" />
        <Button label="Aktivite ekle" onPress={addActivity} color="#FFB347" />
        {activities.length === 0 ? <Empty text="Henüz aktivite yok." /> : activities.map((item) => <Item key={item.id} title={item.title} status={item.isCompleted ? 'Tamam' : money(Math.max(0, n(item.estimatedPrice) - n(item.savedAmount)))} sub={`${fix(item.category)} - Biriken: ${money(item.savedAmount)}`} onDone={() => toggleActivity(item.id)} onRemove={() => removeActivity(item.id)} />)}
      </Panel>

      <Panel title="Sahil, aquapark ve tatil rotası" subtitle="Planlanan ve gidilen aile hedeflerini takip et.">
        <Input label="Hedef adı" value={placeTitle} onChangeText={setPlaceTitle} placeholder="Örn: Lara Plajı" />
        <Text style={labelStyle}>Tür</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{placeTypes.map((x) => <Chip key={x} label={x} active={placeType === x} onPress={() => setPlaceType(x)} />)}</ScrollView>
        <Input label="Bölge" value={placeArea} onChangeText={setPlaceArea} placeholder="Örn: Lara" />
        <Input label="Tahmini bütçe" value={placeBudget} onChangeText={setPlaceBudget} placeholder="Örn: 1500" keyboardType="numeric" />
        <Button label="Hedef ekle" onPress={addPlace} color="#FFB347" />
        {beaches.length === 0 ? <Empty text="Henüz rota hedefi yok." /> : beaches.map((item) => <Item key={item.id} title={item.title} status={item.status === 'visited' || item.status === 'done' ? 'Gidildi' : 'Planlı'} sub={`${fix(item.type)} - ${fix(item.area)} - ${money(item.estimatedBudget)}`} onDone={() => togglePlace(item.id)} onRemove={() => removePlace(item.id)} />)}
      </Panel>
    </ScrollView>
  );
}

function fix(value) { return String(value || '').replace(/Cocuk/g, 'Çocuk').replace(/cocuk/g, 'çocuk').replace(/odasi/g, 'odası').replace(/Odasi/g, 'Odası').replace(/Ozel/g, 'Özel').replace(/ozel/g, 'özel').replace(/esya/g, 'eşya').replace(/Esya/g, 'Eşya'); }
function Panel({ title, subtitle, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text><Text style={panelSub}>{subtitle}</Text>{children}</View>; }
function Mini({ title, value, text }) { return <View style={mini}><Text style={miniTitle}>{title}</Text><Text style={miniValue} numberOfLines={2}>{value}</Text><Text style={miniText}>{text}</Text></View>; }
function Small({ title, value }) { return <View style={small}><Text style={smallTitle}>{title}</Text><Text style={smallValue} numberOfLines={2}>{value}</Text></View>; }
function Line({ left, right, note }) { return <View style={line}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={lineLeft}>{fix(left)}</Text><Text style={lineRight}>{fix(right)}</Text></View><Text style={lineNote}>{fix(note)}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={[chip, active && activeChip]}><Text style={chipText}>{fix(label)}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={labelStyle}>{props.label}</Text><TextInput {...props} style={inputStyle} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function Empty({ text }) { return <Text style={empty}>{fix(text)}</Text>; }
function Item({ title, status, sub, onDone, onRemove }) { return <View style={itemCard}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={itemTitle}>{fix(title)}</Text><Text style={itemStatus}>{fix(status)}</Text></View><Text style={itemSub}>{fix(sub)}</Text><View style={{ flexDirection: 'row', marginTop: 10 }}><SmallButton label="Durum" onPress={onDone} /><SmallButton label="Kaldır" onPress={onRemove} danger /></View></View>; }
function SmallButton({ label, onPress, danger }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 6, paddingVertical: 9, borderRadius: 15, backgroundColor: danger ? '#FFD0D8' : '#2DE2E6', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 11, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function percent(done, total) { if (!total) return 0; return Math.round((done / total) * 100); }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

const hero = { padding: 20, borderRadius: 30, backgroundColor: '#071A24' };
const top = { color: '#C8FBFF', fontSize: 12, fontWeight: '900' };
const h1 = { marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' };
const heroText = { marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' };
const panel = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const panelTitle = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const panelSub = { marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const miniTitle = { color: '#315661', fontSize: 12, fontWeight: '900' };
const miniValue = { marginTop: 8, color: '#102A35', fontSize: 20, lineHeight: 25, fontWeight: '900' };
const miniText = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const small = { flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const smallTitle = { color: '#315661', fontSize: 10, fontWeight: '900' };
const smallValue = { marginTop: 5, color: '#102A35', fontSize: 13, lineHeight: 17, fontWeight: '900' };
const line = { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E3EAF0' };
const lineLeft = { flex: 1, paddingRight: 10, color: '#102A35', fontSize: 14, lineHeight: 19, fontWeight: '900' };
const lineRight = { maxWidth: 125, color: '#FF7A59', fontSize: 13, lineHeight: 18, textAlign: 'right', fontWeight: '900' };
const lineNote = { marginTop: 3, color: '#315661', fontSize: 12, fontWeight: '800' };
const chip = { marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: '#E8F1F2' };
const activeChip = { backgroundColor: '#2DE2E6' };
const chipText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const labelStyle = { marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' };
const inputStyle = { marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0', color: '#102A35', fontSize: 15, fontWeight: '800' };
const empty = { marginTop: 12, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' };
const itemCard = { marginTop: 10, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const itemTitle = { flex: 1, paddingRight: 8, color: '#102A35', fontSize: 15, lineHeight: 20, fontWeight: '900' };
const itemStatus = { color: '#FF7A59', fontSize: 12, fontWeight: '900' };
const itemSub = { marginTop: 4, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
