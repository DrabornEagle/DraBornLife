import React from 'react';
import { Text, View } from 'react-native';

export function LifeReportPanel({ lifeData, money }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const places = lifeData?.beaches || [];
  const goals = lifeData?.customGoals || [];
  const rows = makeRows(rooms, activities, places, goals, money);
  const main = pick(rows);
  return (
    <View style={box}>
      <Text style={head}>Antalya karar raporu</Text>
      <Text style={sub}>Yaşam planında bugün hangi alan öne çıkıyor?</Text>
      <View style={hero}><Text style={heroTop}>Ana karar</Text><Text style={heroTitle}>{main.title}</Text><Text style={heroText}>{main.text}</Text></View>
      {rows.map((row) => <Line key={row.title} row={row} />)}
    </View>
  );
}

function makeRows(rooms, activities, places, goals, money) {
  const roomItems = rooms.flatMap((room) => room.items || []);
  const roomDone = roomItems.filter((item) => item.isCompleted).length;
  const roomLeft = roomItems.filter((item) => !item.isCompleted).reduce((s, x) => s + n(x.estimatedPrice), 0);
  const activityDone = activities.filter((item) => item.isCompleted).length;
  const visited = places.filter((item) => item.status === 'visited' || item.status === 'done').length;
  const goalDone = goals.filter((item) => item.isCompleted).length;
  return [
    { title: 'Ev kurulumu', value: score(roomDone, roomItems.length), text: `${roomDone}/${roomItems.length || 0} eşya tamam • Kalan: ${money(roomLeft)}` },
    { title: 'Aile aktivite', value: score(activityDone, activities.length), text: `${activityDone}/${activities.length || 0} aktivite tamam` },
    { title: 'Sahil / aqua rota', value: score(visited, places.length), text: `${visited}/${places.length || 0} hedef gidildi` },
    { title: 'Özel hedef', value: score(goalDone, goals.length), text: `${goalDone}/${goals.length || 0} hedef tamam` },
  ];
}

function pick(rows) {
  const low = [...rows].sort((a, b) => a.value - b.value)[0];
  if (!low || low.value >= 70) return { title: 'Yaşam planı dengede', text: 'Bugün kısa veri kontrolü yeterli.' };
  return { title: low.title + ' öne çıkıyor', text: low.text };
}
function Line({ row }) { return <View style={line}><View style={{ flex: 1 }}><Text style={lineTitle}>{row.title}</Text><Text style={lineText}>{row.text}</Text></View><Text style={scoreText}>{row.value}</Text></View>; }
function score(done, total) { if (!total) return 0; return Math.round((done / total) * 100); }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

const box = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const head = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const sub = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const hero = { marginTop: 10, padding: 14, borderRadius: 20, backgroundColor: '#102A35' };
const heroTop = { color: '#FFB347', fontSize: 11, fontWeight: '900' };
const heroTitle = { marginTop: 5, color: '#FFFFFF', fontSize: 18, lineHeight: 23, fontWeight: '900' };
const heroText = { marginTop: 5, color: '#DDF8FA', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const line = { marginTop: 9, padding: 12, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', alignItems: 'center' };
const lineTitle = { color: '#102A35', fontSize: 14, fontWeight: '900' };
const lineText = { marginTop: 3, color: '#315661', fontSize: 12, lineHeight: 16, fontWeight: '800' };
const scoreText = { marginLeft: 8, color: '#FF7A59', fontSize: 18, fontWeight: '900' };
