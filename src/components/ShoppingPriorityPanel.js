import React from 'react';
import { Text, View } from 'react-native';

export function ShoppingPriorityPanel({ items, money }) {
  const scored = (items || []).map(scoreItem).filter((x) => !x.isPurchasedOrInstalled).sort((a, b) => b.priorityScore - a.priorityScore);
  return (
    <View style={panel}>
      <Text style={title} numberOfLines={2}>Öncelik puanı</Text>
      <Text style={note} numberOfLines={3}>Alınacak kalemler önem ve hazır olma durumuna göre sıralanır.</Text>
      {scored.length === 0 ? <Text style={empty}>Öncelik göstermek için kalan alınacak kalem yok.</Text> : scored.slice(0, 5).map((item, index) => <Row key={item.id} item={item} index={index} money={money} />)}
    </View>
  );
}

function scoreItem(item) {
  const total = n(item.estimatedPrice) * Math.max(1, n(item.quantity));
  const saved = n(item.savedAmount);
  const readyRatio = total > 0 ? Math.min(1, saved / total) : 0;
  let score = 20;
  if (item.isMoneyReady) score += 35;
  if (item.homeRoomId && item.homeRoomId !== 'none') score += 15;
  if (['Kira / Depozito', 'Beyaz eşya', 'Mobilya', 'Mutfak / ev temel'].includes(item.category)) score += 20;
  if (['GTA 6 seti', 'Antalya eğlence'].includes(item.category)) score += 8;
  if (total > 0 && total <= 10000) score += 8;
  score += Math.round(readyRatio * 20);
  return { ...item, priorityScore: Math.max(1, Math.min(100, score)), total, remaining: Math.max(0, total - saved) };
}

function Row({ item, index, money }) {
  return <View style={row}><Text style={rank}>{index + 1}</Text><View style={{ flex: 1, paddingRight: 8 }}><Text style={rowTitle} numberOfLines={1}>{item.title}</Text><Text style={rowText} numberOfLines={2}>{item.category} • Kalan: {money(item.remaining)}</Text></View><Text style={score} numberOfLines={1}>{item.priorityScore}</Text></View>;
}
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

const panel = { marginTop: 14, padding: 14, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const title = { color: '#102A35', fontSize: 19, lineHeight: 24, fontWeight: '900' };
const note = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const empty = { marginTop: 10, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const row = { marginTop: 9, padding: 11, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', alignItems: 'center' };
const rank = { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2DE2E6', color: '#06202A', textAlign: 'center', textAlignVertical: 'center', fontSize: 12, fontWeight: '900', marginRight: 10 };
const rowTitle = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const rowText = { marginTop: 3, color: '#315661', fontSize: 12, lineHeight: 16, fontWeight: '800' };
const score = { width: 34, textAlign: 'right', color: '#FF7A59', fontSize: 17, lineHeight: 21, fontWeight: '900' };
