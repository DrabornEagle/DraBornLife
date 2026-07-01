import React from 'react';
import { Text, View } from 'react-native';

export function RoomPlanPanel({ rooms, money }) {
  const rows = (rooms || []).map(makeRow).sort((a, b) => b.order - a.order);
  return (
    <View style={box}>
      <Text style={head} numberOfLines={2}>Oda tamamlama planı</Text>
      <Text style={sub} numberOfLines={3}>Odalar kalan eşya ve bütçeye göre sıralanır.</Text>
      {rows.length === 0 ? <Text style={empty}>Önce oda ve eşya ekle.</Text> : rows.map((room, index) => <Line key={room.id} room={room} index={index} money={money} />)}
    </View>
  );
}

function makeRow(room) {
  const items = room.items || [];
  const total = items.reduce((s, x) => s + n(x.estimatedPrice), 0);
  const doneItems = items.filter((x) => x.isCompleted);
  const done = doneItems.length;
  const doneTotal = doneItems.reduce((s, x) => s + n(x.estimatedPrice), 0);
  const count = items.length;
  const percent = count ? Math.round((done / count) * 100) : 0;
  const left = Math.max(0, total - doneTotal);
  const order = (100 - percent) + (left > 0 ? 20 : 0) + (count === 0 ? 15 : 0);
  return { ...room, count, done, percent, left, order };
}

function Line({ room, index, money }) {
  return <View style={line}><Text style={num}>{index + 1}</Text><View style={body}><Text style={name} numberOfLines={1}>{room.title}</Text><Text style={txt} numberOfLines={2}>{room.done}/{room.count} eşya • %{room.percent} • Kalan: {money(room.left)}</Text></View></View>;
}
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

const box = { marginTop: 14, padding: 14, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const head = { color: '#102A35', fontSize: 19, lineHeight: 24, fontWeight: '900' };
const sub = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const empty = { marginTop: 10, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const line = { marginTop: 9, padding: 11, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', alignItems: 'center' };
const num = { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2DE2E6', color: '#06202A', textAlign: 'center', textAlignVertical: 'center', fontSize: 12, fontWeight: '900', marginRight: 10 };
const body = { flex: 1, paddingRight: 6 };
const name = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const txt = { marginTop: 3, color: '#315661', fontSize: 12, lineHeight: 16, fontWeight: '800' };
