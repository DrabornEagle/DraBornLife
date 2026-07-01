import React from 'react';
import { Text, View } from 'react-native';

export function LifeDecisionReport({ lifeData, money }) {
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const places = lifeData?.beaches || [];
  const goals = lifeData?.customGoals || [];
  const report = buildReport(rooms, activities, places, goals, money);
  return (
    <View style={box}>
      <Text style={head}>Antalya karar raporu</Text>
      <Text style={sub}>Bugün yaşam tarafında neye odaklanacağını özetler.</Text>
      <View style={hero}>
        <Text style={heroTop}>Ana karar</Text>
        <Text style={heroTitle}>{report.main.title}</Text>
        <Text style={heroText}>{report.main.text}</Text>
      </View>
      {report.rows.map((row) => <Line key={row.title} row={row} />)}
    </View>
  );
}

function buildReport(rooms, activities, places, goals, money) {
  const roomItems = rooms.flatMap((room) => room.items || []);
  const roomDone = roomItems.filter((item) => item.isCompleted).length;
  const roomPercent = pct(roomDone, roomItems.length);
  const roomBudgetLeft = roomItems.filter((item) => !item.isCompleted).reduce((s, x) => s + n(x.estimatedPrice), 0);
  const activityDone = activities.filter((item) => item.isCompleted).length;
  const activityPercent = pct(activityDone, activities.length);
  const visited = places.filter((item) => item.status === 'visited' || item.status === 'done').length;
  const placePercent = pct(visited, places.length);
  const goalDone = goals.filter((item) => item.isCompleted).length;
  const goalPercent = pct(goalDone, goals.length);
  const rows = [
    makeRow('Ev kurulumu', roomPercent, `${roomDone}/${roomItems.length || 0} eşya tamam • Kalan: ${money(roomBudgetLeft)}`),
    makeRow('Aile aktivite', activityPercent, `${activityDone}/${activities.length || 0} aktivite tamam`),
    makeRow('Sahil / aqua rota', placePercent, `${visited}/${places.length || 0} hedef gidildi`),
    makeRow('Özel hedef', goalPercent, `${goalDone}/${goals.length || 0} hedef tamam`),
  ];
  const main = pickMain({ roomPercent, roomItems, roomBudgetLeft, activityPercent, activities, placePercent, places, goalPercent, goals, money });
  return { main, rows };
}

function pickMain(data) {
  if ((data.roomItems || []).length === 0 || data.roomPercent < 50) return { title: 'Önce ev kurulumu', text: `Ev tarafı %{data.roomPercent}. Kalan kurulum bütçesi ${data.money(data.roomBudgetLeft)}.` };
  if ((data.activities || []).length === 0 || data.activityPercent < 40) return { title: 'Aile aktivitelerini planla', text: `Aktivite tarafı %{data.activityPercent}. Antalya yaşam hedefi için aile planı eksik kalmasın.` };
  if ((data.places || []).length === 0 || data.placePercent < 35) return { title: 'Sahil ve aqua rotası', text: `Rota tarafı %{data.placePercent}. Lara ve Konyaaltı gibi hedefleri listele.` };
  if ((data.goals || []).length === 0 || data.goalPercent < 50) return { title: 'Özel hedefleri netleştir', text: `Özel hedef tarafı %{data.goalPercent}. Yıl planına bağlı hedefleri güncelle.` };
  return { title: 'Yaşam planı dengede', text: 'Bugün kısa bir veri kontrolü yeterli. Eksik kalan küçük kalemleri kapat.' };
}

function makeRow(title, value, text) { return { title, value, text }; }
function Line({ row }) { return <View style={line}><View style={{ flex: 1 }}><Text style={lineTitle}>{row.title}</Text><Text style={lineText}>{row.text}</Text></View><Text style={score}>%{row.value}</Text></View>; }
function pct(done, total) { if (!total) return 0; return Math.round((done / total) * 100); }
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
const score = { marginLeft: 8, color: '#FF7A59', fontSize: 18, fontWeight: '900' };
