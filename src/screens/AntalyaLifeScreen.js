import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

export function AntalyaLifeScreen({ lifeData }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const beaches = lifeData?.beaches || [];
  const customGoals = lifeData?.customGoals || [];

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' }}>Antalya Life</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Ev kurulumu, aile aktiviteleri, sahil ve hedefleri tek yasam panelinde takip et.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <MiniCard title="Ev Kurulum" value={`%${homePercent}`} text={`${roomDone}/${roomItems.length || 0} esya tamam`} />
        <MiniCard title="Aktivite" value={formatTRY(Math.max(0, activityTotal - activitySaved))} text="Kalan aktivite butcesi" />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <MiniCard title="Sahil/Aqua" value={`${visitedPlaces}/${beaches.length}`} text={`${plannedPlaces} planli hedef`} />
        <MiniCard title="Ozel Hedef" value={`${customDone}/${customGoals.length}`} text={formatTRY(Math.max(0, customTotal - customSaved))} />
      </View>

      <Panel title="Ev kurulum odalari" subtitle="v0.3.4 adiminda oda ici esya ekleme/duzenleme gelecek.">
        {rooms.map((room) => {
          const items = room.items || [];
          const done = items.filter((item) => item.isCompleted).length;
          return <Line key={room.id} left={room.title} right={`%${percent(done, items.length)}`} note={`${done}/${items.length} tamam`} />;
        })}
      </Panel>

      <Panel title="Aile aktivite butcesi" subtitle="v0.3.5 adiminda aktivite ekleme/duzenleme gelecek.">
        {activities.map((item) => <Line key={item.id} left={item.title} right={formatTRY(Math.max(0, n(item.estimatedPrice) - n(item.savedAmount)))} note={item.category} />)}
        <Line left="Tamamlanan aktivite" right={`${activityDone}/${activities.length}`} note="Aile keyfi hedefleri" />
      </Panel>

      <Panel title="Sahil, aquapark ve tatil" subtitle="v0.3.6 adiminda gidildi/planlandi takibi gelecek.">
        {beaches.map((item) => <Line key={item.id} left={item.title} right={item.status === 'visited' ? 'Gidildi' : 'Planli'} note={`${item.type} • ${item.area}`} />)}
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

function MiniCard({ title, value, text }) {
  return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 22, fontWeight: '900' }}>{value}</Text><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{text}</Text></View>;
}

function Line({ left, right, note }) {
  return <View style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#CFECEE' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 14, fontWeight: '900' }}>{left}</Text><Text style={{ color: '#FF7A59', fontSize: 13, fontWeight: '900' }}>{right}</Text></View><Text style={{ marginTop: 3, color: '#315661', fontSize: 12, fontWeight: '800' }}>{note}</Text></View>;
}

function percent(current, total) {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
}

function n(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
