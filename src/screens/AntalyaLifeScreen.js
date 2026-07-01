import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NoticeBox } from '../components/NoticeBox';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatMoney } from '../utils/lifeSummary';

const activityCategories = ['Aquapark', 'Sahil', 'Piknik', 'Yemek', 'Gezi', 'Çocuk eğlence', 'Tatil'];
const activityFilters = [{ key: 'all', label: 'Tümü' }, { key: 'active', label: 'Aktif' }, { key: 'done', label: 'Tamamlandı' }];
const itemGroups = ['Temel mobilya', 'Beyaz eşya', 'Elektronik', 'Mutfak', 'Çocuk', 'Dekorasyon', 'Diğer'];
const placeTypes = ['Sahil', 'Aquapark', 'Gezi', 'Tatil'];
const placeFilters = [{ key: 'all', label: 'Tümü' }, { key: 'planned', label: 'Planlı' }, { key: 'visited', label: 'Gidildi' }];

export function AntalyaLifeScreen({ lifeData, onSave }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const beaches = lifeData?.beaches || [];
  const customGoals = lifeData?.customGoals || [];
  const money = (value) => formatMoney(value, lifeData);

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'living_room');
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemGroup, setItemGroup] = useState('Temel mobilya');
  const [itemGroupFilter, setItemGroupFilter] = useState('Tümü');
  const [itemPrice, setItemPrice] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState('Aquapark');
  const [activityPrice, setActivityPrice] = useState('');
  const [activitySaved, setActivitySaved] = useState('');
  const [activityTargetMonth, setActivityTargetMonth] = useState('');
  const [activityNote, setActivityNote] = useState('');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('Tümü');
  const [activityStatusFilter, setActivityStatusFilter] = useState('all');
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [placeTitle, setPlaceTitle] = useState('');
  const [placeType, setPlaceType] = useState('Sahil');
  const [placeArea, setPlaceArea] = useState('Antalya');
  const [placeBudget, setPlaceBudget] = useState('');
  const [placeNote, setPlaceNote] = useState('');
  const [placeFilter, setPlaceFilter] = useState('all');
  const [notice, setNotice] = useState({ text: '', type: 'info' });

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0] || { items: [], title: 'Oda' };
  const roomItems = rooms.flatMap((room) => room.items || []);
  const selectedItems = selectedRoom.items || [];
  const visibleRoomItems = selectedItems.filter((item) => itemGroupFilter === 'Tümü' || (item.group || 'Diğer') === itemGroupFilter);
  const roomDone = roomItems.filter((item) => item.isCompleted).length;
  const selectedRoomDone = selectedItems.filter((item) => item.isCompleted);
  const selectedRoomTotal = selectedItems.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const selectedRoomDoneBudget = selectedRoomDone.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const activityTotal = activities.reduce((sum, item) => sum + n(item.estimatedPrice), 0);
  const activitySavedTotal = activities.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const activityDone = activities.filter((item) => item.isCompleted).length;
  const visibleActivities = activities.filter((item) => (activityCategoryFilter === 'Tümü' || item.category === activityCategoryFilter) && (activityStatusFilter === 'all' || (activityStatusFilter === 'done' && item.isCompleted) || (activityStatusFilter === 'active' && !item.isCompleted)));
  const visitedPlaces = beaches.filter((item) => item.status === 'visited' || item.status === 'done').length;
  const plannedPlaces = beaches.length - visitedPlaces;
  const visiblePlaces = beaches.filter((item) => placeFilter === 'all' || item.status === placeFilter || (placeFilter === 'visited' && item.status === 'done'));
  const placeBudgetTotal = beaches.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const customDone = customGoals.filter((item) => item.isCompleted).length;
  const customTotal = customGoals.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const customSaved = customGoals.reduce((sum, item) => sum + n(item.savedAmount), 0);

  function info(text) { setNotice({ text, type: 'info' }); }
  function error(text) { setNotice({ text, type: 'error' }); }
  function saveRooms(nextRooms) { onSave({ ...lifeData, homeSetupRooms: nextRooms }); }
  function saveActivities(nextActivities) { onSave({ ...lifeData, activities: nextActivities }); }
  function savePlaces(nextPlaces) { onSave({ ...lifeData, beaches: nextPlaces }); }
  function clearRoomForm() { setEditingItemId(null); setItemTitle(''); setItemGroup('Temel mobilya'); setItemPrice(''); setItemNote(''); }
  function clearActivityForm() { setEditingActivityId(null); setActivityTitle(''); setActivityCategory('Aquapark'); setActivityPrice(''); setActivitySaved(''); setActivityTargetMonth(''); setActivityNote(''); }
  function clearPlaceForm() { setEditingPlaceId(null); setPlaceTitle(''); setPlaceType('Sahil'); setPlaceArea('Antalya'); setPlaceBudget(''); setPlaceNote(''); }

  function saveRoomItem() {
    const title = itemTitle.trim(); const price = n(itemPrice);
    if (!title) return error('Eşya adı boş olamaz.');
    if (itemPrice.trim() && price < 0) return error('Tahmini fiyat negatif olamaz.');
    const oldItem = selectedItems.find((item) => item.id === editingItemId);
    const nextItem = { id: editingItemId || `home_item_${Date.now()}`, title, group: itemGroup, estimatedPrice: price, note: itemNote.trim(), isCompleted: editingItemId ? !!oldItem?.isCompleted : false };
    saveRooms(rooms.map((room) => room.id !== selectedRoom.id ? room : { ...room, items: editingItemId ? (room.items || []).map((item) => item.id === editingItemId ? nextItem : item) : [nextItem, ...(room.items || [])] }));
    info(editingItemId ? 'Oda eşyası güncellendi.' : 'Oda eşyası eklendi.');
    clearRoomForm();
  }
  function editRoomItem(item) { setEditingItemId(item.id); setItemTitle(item.title || ''); setItemGroup(item.group || 'Diğer'); setItemPrice(String(item.estimatedPrice || '')); setItemNote(item.note || ''); info('Eşya düzenleme modu açıldı.'); }
  function removeRoomItem(itemId) { saveRooms(rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).filter((item) => item.id !== itemId) } : room)); if (editingItemId === itemId) clearRoomForm(); info('Oda eşyası kaldırıldı.'); }
  function toggleRoomItem(itemId) { saveRooms(rooms.map((room) => room.id === selectedRoom.id ? { ...room, items: (room.items || []).map((item) => item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item) } : room)); info('Eşya durumu güncellendi.'); }

  function saveActivity() {
    const title = activityTitle.trim(); const price = n(activityPrice); const saved = n(activitySaved);
    if (!title) return error('Aktivite adı boş olamaz.');
    if (price > 0 && saved > price) return error('Biriken tutar tahmini fiyattan büyük olamaz.');
    const oldActivity = activities.find((item) => item.id === editingActivityId);
    const nextActivity = { id: editingActivityId || `activity_${Date.now()}`, title, category: activityCategory, estimatedPrice: price, savedAmount: saved, targetMonth: activityTargetMonth.trim(), note: activityNote.trim(), isCompleted: editingActivityId ? !!oldActivity?.isCompleted : false };
    saveActivities(editingActivityId ? activities.map((item) => item.id === editingActivityId ? nextActivity : item) : [nextActivity, ...activities]);
    info(editingActivityId ? 'Aktivite güncellendi.' : 'Aktivite eklendi.'); clearActivityForm();
  }
  function editActivity(item) { setEditingActivityId(item.id); setActivityTitle(item.title || ''); setActivityCategory(item.category || 'Aquapark'); setActivityPrice(String(item.estimatedPrice || '')); setActivitySaved(String(item.savedAmount || '')); setActivityTargetMonth(item.targetMonth || ''); setActivityNote(item.note || ''); info('Aktivite düzenleme modu açıldı.'); }
  function removeActivity(activityId) { saveActivities(activities.filter((item) => item.id !== activityId)); if (editingActivityId === activityId) clearActivityForm(); info('Aktivite kaldırıldı.'); }
  function toggleActivity(activityId) { saveActivities(activities.map((item) => item.id === activityId ? { ...item, isCompleted: !item.isCompleted } : item)); info('Aktivite durumu güncellendi.'); }

  function savePlace() {
    const title = placeTitle.trim(); const budget = n(placeBudget);
    if (!title) return error('Sahil / aquapark / tatil hedef adı boş olamaz.');
    const oldPlace = beaches.find((item) => item.id === editingPlaceId);
    const nextPlace = { id: editingPlaceId || `place_${Date.now()}`, title, type: placeType, area: placeArea.trim() || 'Antalya', estimatedBudget: budget, status: editingPlaceId ? oldPlace?.status || 'planned' : 'planned', familyNote: placeNote.trim() };
    savePlaces(editingPlaceId ? beaches.map((item) => item.id === editingPlaceId ? nextPlace : item) : [nextPlace, ...beaches]);
    info(editingPlaceId ? 'Hedef güncellendi.' : 'Yeni rota hedefi eklendi.'); clearPlaceForm();
  }
  function editPlace(item) { setEditingPlaceId(item.id); setPlaceTitle(item.title || ''); setPlaceType(item.type || 'Sahil'); setPlaceArea(item.area || 'Antalya'); setPlaceBudget(String(item.estimatedBudget || '')); setPlaceNote(item.familyNote || ''); info('Hedef düzenleme modu açıldı.'); }
  function removePlace(placeId) { savePlaces(beaches.filter((item) => item.id !== placeId)); if (editingPlaceId === placeId) clearPlaceForm(); info('Hedef kaldırıldı.'); }
  function togglePlace(placeId) { savePlaces(beaches.map((item) => item.id === placeId ? { ...item, status: item.status === 'visited' || item.status === 'done' ? 'planned' : 'visited' } : item)); info('Hedef durumu güncellendi.'); }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F6F8' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#071A24' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' }}>Antalya Yaşam</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Ev kurulumu, aile aktiviteleri, sahil ve tatil hedeflerini tek yaşam panelinde takip et.</Text>
      </View>
      <NoticeBox message={notice.text} type={notice.type} />
      <View style={{ flexDirection: 'row', marginTop: 14 }}><MiniCard title="Ev kurulumu" value={`%${percent(roomDone, roomItems.length)}`} text={`${roomDone}/${roomItems.length || 0} eşya tamam`} /><MiniCard title="Aile aktivite" value={money(Math.max(0, activityTotal - activitySavedTotal))} text={`%${percent(activitySavedTotal, activityTotal)} bütçe hazır`} /></View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}><MiniCard title="Sahil / Aqua" value={`${visitedPlaces}/${beaches.length}`} text={`${plannedPlaces} planlı hedef`} /><MiniCard title="Özel hedef" value={`${customDone}/${customGoals.length}`} text={money(Math.max(0, customTotal - customSaved))} /></View>

      <Panel title="Ev kurulum odaları" subtitle="Oda seç, eşya grubu belirle, bütçe ve tamamlanma durumunu takip et.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>{rooms.map((room) => <Chip key={room.id} label={fix(room.title)} active={selectedRoom.id === room.id} onPress={() => { setSelectedRoomId(room.id); setItemGroupFilter('Tümü'); clearRoomForm(); }} />)}</ScrollView>
        {rooms.map((room) => { const items = room.items || []; const done = items.filter((item) => item.isCompleted).length; const total = items.reduce((sum, item) => sum + n(item.estimatedPrice), 0); return <Line key={room.id} left={fix(room.title)} right={`%${percent(done, items.length)}`} note={`${done}/${items.length} tamam - ${money(total)}`} />; })}
      </Panel>

      <Panel title={`${fix(selectedRoom.title)} eşya grupları`} subtitle="Bu oda için alınacak veya kurulacak eşyaları grup ve bütçe ile yönet.">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}><SmallSummary title="Toplam" value={money(selectedRoomTotal)} /><SmallSummary title="Tamam" value={`${selectedRoomDone.length}/${selectedItems.length}`} /><SmallSummary title="Kalan" value={money(Math.max(0, selectedRoomTotal - selectedRoomDoneBudget))} /></View>
        <Input label="Eşya adı" value={itemTitle} onChangeText={setItemTitle} placeholder="Örn: Koltuk takımı" />
        <Text style={labelStyle}>Eşya grubu</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{itemGroups.map((group) => <Chip key={group} label={group} active={itemGroup === group} onPress={() => setItemGroup(group)} />)}</ScrollView>
        <Input label="Tahmini fiyat" value={itemPrice} onChangeText={setItemPrice} placeholder="Örn: 35000" keyboardType="numeric" />
        <Input label="Not" value={itemNote} onChangeText={setItemNote} placeholder="İsteğe bağlı" />
        <Button label={editingItemId ? 'Eşyayı güncelle' : 'Eşyayı ekle'} onPress={saveRoomItem} color="#FFB347" />
        {editingItemId && <Button label="Düzenlemeyi iptal et" onPress={clearRoomForm} color="#CFECEE" />}
        <Text style={labelStyle}>Grup filtresi</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginBottom: 8 }}>{['Tümü', ...itemGroups].map((group) => <Chip key={group} label={group} active={itemGroupFilter === group} onPress={() => setItemGroupFilter(group)} />)}</ScrollView>
        {visibleRoomItems.length === 0 ? <EmptyText text="Bu odada bu filtreye uygun eşya yok." /> : visibleRoomItems.map((item) => <RoomItem key={item.id} item={item} onToggle={toggleRoomItem} onEdit={editRoomItem} onRemove={removeRoomItem} money={money} />)}
      </Panel>

      <Panel title="Aile aktivite planı" subtitle="Aquapark, sahil, piknik, yemek, gezi ve tatil hedeflerini bütçe ve hedef ayla takip et.">
        <View style={{ flexDirection: 'row', marginBottom: 8 }}><SmallSummary title="Toplam" value={money(activityTotal)} /><SmallSummary title="Biriken" value={money(activitySavedTotal)} /><SmallSummary title="Tamam" value={`${activityDone}/${activities.length}`} /></View>
        <Input label="Aktivite adı" value={activityTitle} onChangeText={setActivityTitle} placeholder="Örn: Aile aquapark günü" />
        <Text style={labelStyle}>Kategori</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{activityCategories.map((category) => <Chip key={category} label={category} active={activityCategory === category} onPress={() => setActivityCategory(category)} />)}</ScrollView>
        <Input label="Tahmini fiyat" value={activityPrice} onChangeText={setActivityPrice} placeholder="Örn: 2500" keyboardType="numeric" />
        <Input label="Biriken tutar" value={activitySaved} onChangeText={setActivitySaved} placeholder="Örn: 500" keyboardType="numeric" />
        <Input label="Hedef ay" value={activityTargetMonth} onChangeText={setActivityTargetMonth} placeholder="Örn: Haziran 2027" />
        <Input label="Aile notu" value={activityNote} onChangeText={setActivityNote} placeholder="Örn: Çocuk için uygun saatleri araştır" />
        <Button label={editingActivityId ? 'Aktiviteyi güncelle' : 'Aktivite ekle'} onPress={saveActivity} color="#FFB347" />
        {editingActivityId && <Button label="Düzenlemeyi iptal et" onPress={clearActivityForm} color="#CFECEE" />}
        <Text style={labelStyle}>Kategori filtresi</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{['Tümü', ...activityCategories].map((category) => <Chip key={category} label={category} active={activityCategoryFilter === category} onPress={() => setActivityCategoryFilter(category)} />)}</ScrollView>
        <Text style={labelStyle}>Durum filtresi</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginBottom: 8 }}>{activityFilters.map((filter) => <Chip key={filter.key} label={filter.label} active={activityStatusFilter === filter.key} onPress={() => setActivityStatusFilter(filter.key)} />)}</ScrollView>
        {visibleActivities.length === 0 ? <EmptyText text="Bu filtreye uygun aktivite yok." /> : visibleActivities.map((item) => <ActivityItem key={item.id} item={item} onToggle={toggleActivity} onEdit={editActivity} onRemove={removeActivity} money={money} />)}
      </Panel>

      <Panel title="Sahil, aquapark ve tatil rotası" subtitle="Planlanan ve gidilen aile hedeflerini ayrıca rota kartlarıyla takip et.">
        <Input label="Hedef adı" value={placeTitle} onChangeText={setPlaceTitle} placeholder="Örn: Lara Plajı" />
        <Text style={labelStyle}>Tür</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>{placeTypes.map((type) => <Chip key={type} label={type} active={placeType === type} onPress={() => setPlaceType(type)} />)}</ScrollView>
        <Input label="Bölge" value={placeArea} onChangeText={setPlaceArea} placeholder="Örn: Lara" />
        <Input label="Tahmini bütçe" value={placeBudget} onChangeText={setPlaceBudget} placeholder="Örn: 1500" keyboardType="numeric" />
        <Input label="Aile notu" value={placeNote} onChangeText={setPlaceNote} placeholder="İsteğe bağlı" />
        <Button label={editingPlaceId ? 'Hedefi güncelle' : 'Hedef ekle'} onPress={savePlace} color="#FFB347" />
        {editingPlaceId && <Button label="Düzenlemeyi iptal et" onPress={clearPlaceForm} color="#CFECEE" />}
        <Text style={labelStyle}>Filtre</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, marginBottom: 8 }}>{placeFilters.map((filter) => <Chip key={filter.key} label={filter.label} active={placeFilter === filter.key} onPress={() => setPlaceFilter(filter.key)} />)}</ScrollView>
        <Line left="Toplam rota bütçesi" right={money(placeBudgetTotal)} note={`${visitedPlaces} gidildi / ${plannedPlaces} planlı`} />
        {visiblePlaces.length === 0 ? <EmptyText text="Bu filtreye uygun hedef yok." /> : visiblePlaces.map((item) => <PlaceItem key={item.id} item={item} onToggle={togglePlace} onEdit={editPlace} onRemove={removePlace} money={money} />)}
      </Panel>

      <Panel title="Özel hedefler" subtitle="Özel hedefler alt menüdeki Hedef sekmesinden eklenir ve yönetilir.">
        {customGoals.length === 0 ? <EmptyText text="Henüz özel hedef yok. Alt menüden Hedef sekmesine girerek ilk hedefini ekleyebilirsin." /> : customGoals.map((item) => <Line key={item.id} left={fix(item.title)} right={item.isCompleted ? 'Tamam' : 'Aktif'} note={`${fix(item.category || 'hedef')} - ${money(item.estimatedBudget)}`} />)}
      </Panel>
    </ScrollView>
  );
}

function fix(value) { return String(value || '').replace(/Cocuk/g, 'Çocuk').replace(/cocuk/g, 'çocuk').replace(/odasi/g, 'odası').replace(/Odasi/g, 'Odası').replace(/Ozel/g, 'Özel').replace(/ozel/g, 'özel').replace(/esya/g, 'eşya').replace(/Esya/g, 'Eşya').replace(/tamamlandi/g, 'tamamlandı').replace(/Tamamlandi/g, 'Tamamlandı'); }
function Panel({ title, subtitle, children }) { return <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0' }}><Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>{subtitle}</Text>{children}</View>; }
function MiniCard({ title, value, text }) { return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 20, lineHeight: 25, fontWeight: '900' }} numberOfLines={2}>{value}</Text><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{text}</Text></View>; }
function SmallSummary({ title, value }) { return <View style={{ flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0' }}><Text style={{ color: '#315661', fontSize: 10, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 5, color: '#102A35', fontSize: 13, lineHeight: 17, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>; }
function Line({ left, right, note }) { return <View style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E3EAF0' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, paddingRight: 10, color: '#102A35', fontSize: 14, lineHeight: 19, fontWeight: '900' }}>{fix(left)}</Text><Text style={{ maxWidth: 125, color: '#FF7A59', fontSize: 13, lineHeight: 18, textAlign: 'right', fontWeight: '900' }} numberOfLines={2}>{fix(right)}</Text></View><Text style={{ marginTop: 3, color: '#315661', fontSize: 12, fontWeight: '800' }}>{fix(note)}</Text></View>; }
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={{ marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#E8F1F2' }}><Text style={{ color: '#06202A', fontSize: 12, fontWeight: '900' }}>{fix(label)}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{props.label}</Text><TextInput {...props} style={{ marginTop: 7, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0', color: '#102A35', fontSize: 15, fontWeight: '800' }} placeholderTextColor="#7C969D" /></View>; }
function Button({ label, onPress, color }) { return <TouchableOpacity onPress={onPress} style={{ marginTop: 12, paddingVertical: 13, borderRadius: 18, backgroundColor: color, alignItems: 'center' }}><Text style={{ color: '#06202A', fontSize: 14, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
function EmptyText({ text }) { return <Text style={{ marginTop: 12, color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>{fix(text)}</Text>; }
function RoomItem({ item, onToggle, onEdit, onRemove, money }) { return <ItemCard title={item.title} status={item.isCompleted ? 'Tamam' : 'Bekliyor'} statusColor={item.isCompleted ? '#128C7E' : '#FF7A59'} sub={`${fix(item.group || 'Diğer')} - ${money(item.estimatedPrice)}`} note={item.note} onToggle={() => onToggle(item.id)} onEdit={() => onEdit(item)} onRemove={() => onRemove(item.id)} />; }
function ActivityItem({ item, onToggle, onEdit, onRemove, money }) { const left = Math.max(0, n(item.estimatedPrice) - n(item.savedAmount)); return <ItemCard title={item.title} status={item.isCompleted ? 'Tamam' : money(left)} statusColor={item.isCompleted ? '#128C7E' : '#FF7A59'} sub={`${fix(item.category)} - Biriken: ${money(item.savedAmount)} / ${money(item.estimatedPrice)}`} note={`${item.targetMonth ? `Hedef ay: ${item.targetMonth}. ` : ''}${item.note || ''}`} onToggle={() => onToggle(item.id)} onEdit={() => onEdit(item)} onRemove={() => onRemove(item.id)} />; }
function PlaceItem({ item, onToggle, onEdit, onRemove, money }) { const visited = item.status === 'visited' || item.status === 'done'; return <ItemCard title={item.title} status={visited ? 'Gidildi' : 'Planlı'} statusColor={visited ? '#128C7E' : '#FF7A59'} sub={`${fix(item.type)} - ${fix(item.area)} - ${money(item.estimatedBudget)}`} note={item.familyNote} onToggle={() => onToggle(item.id)} onEdit={() => onEdit(item)} onRemove={() => onRemove(item.id)} />; }
function ItemCard({ title, status, statusColor, sub, note, onToggle, onEdit, onRemove }) { return <View style={itemCard}><View style={row}><Text style={itemTitleStyle}>{fix(title)}</Text><Text style={{ color: statusColor, fontSize: 12, fontWeight: '900' }}>{fix(status)}</Text></View><Text style={itemSub}>{fix(sub)}</Text>{!!note && <Text style={itemSub}>{fix(note)}</Text>}<View style={btnRow}><Small label="Tamam" onPress={onToggle} active /><Small label="Düzenle" onPress={onEdit} active /><Small label="Kaldır" onPress={onRemove} danger /></View></View>; }
function Small({ label, active, danger, onPress }) { return <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 6, paddingVertical: 9, borderRadius: 15, backgroundColor: danger ? '#FFD0D8' : active ? '#2DE2E6' : '#E8F1F2', alignItems: 'center' }}><Text style={{ color: danger ? '#7A1E2B' : '#06202A', fontSize: 11, fontWeight: '900' }}>{label}</Text></TouchableOpacity>; }
const labelStyle = { marginTop: 12, color: '#315661', fontSize: 12, fontWeight: '900' };
const itemCard = { marginTop: 10, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const row = { flexDirection: 'row', justifyContent: 'space-between' };
const itemTitleStyle = { flex: 1, paddingRight: 8, color: '#102A35', fontSize: 15, lineHeight: 20, fontWeight: '900' };
const itemSub = { marginTop: 4, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const btnRow = { flexDirection: 'row', marginTop: 10 };
function percent(done, total) { if (!total) return 0; return Math.round((done / total) * 100); }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
