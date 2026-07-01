import React from 'react';
import { Text, View } from 'react-native';

export function HomeTips({ summary, lifeData, money }) {
  const items = getTips(summary, lifeData, money).slice(0, 4);
  return (
    <View style={box}>
      <Text style={head}>AKILLI ÖNERİLER</Text>
      <Text style={note}>Bugün bakman gereken en önemli alanlar.</Text>
      {items.map((item, index) => <View key={item.title} style={row}><Text style={num}>{index + 1}</Text><View style={{ flex: 1 }}><Text style={title}>{item.title}</Text><Text style={text}>{item.text}</Text></View></View>)}
    </View>
  );
}

function getTips(summary, lifeData, money) {
  const moneyEmpty = (lifeData?.moneyEntries || []).length === 0;
  const goalsEmpty = (lifeData?.customGoals || []).length === 0;
  const list = [];
  if (summary.targetRemaining > 0) list.push({ title: 'Bütçe temposu', text: `${money(summary.targetRemaining)} kaldı. Haftalık hedefi kontrol et.` });
  if (summary.debtLeft > 0) list.push({ title: 'Borç azaltma', text: `${money(summary.debtLeft)} borç kaldı. Ödeme planını güncelle.` });
  if (summary.homeSetupPercent < 60) list.push({ title: 'Ev kurulumu', text: `Kurulum ilerlemesi %${summary.homeSetupPercent}. Oda listesini tamamla.` });
  if (summary.shoppingBought < summary.shoppingCount) list.push({ title: 'Alınacaklar', text: `${summary.shoppingReady} kalemin parası hazır. Listeyi güncelle.` });
  if (moneyEmpty) list.push({ title: 'Gerçek veri', text: 'Para ekranına ilk gerçek gelir / gider kaydını gir.' });
  if (goalsEmpty) list.push({ title: 'Özel hedef', text: 'Aile ve yaşam hedeflerini yıl planına bağla.' });
  return list.length ? list : [{ title: 'Plan dengede', text: 'Bugün kısa bir kontrol yeterli.' }];
}

const box = { marginHorizontal: 18, marginTop: 12, padding: 16, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA' };
const head = { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 };
const note = { marginTop: 5, color: '#52616B', fontSize: 13, fontWeight: '800' };
const row = { marginTop: 9, padding: 12, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#DDE8EA', flexDirection: 'row', alignItems: 'center' };
const num = { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2DE2E6', color: '#06202A', textAlign: 'center', textAlignVertical: 'center', fontSize: 12, fontWeight: '900', marginRight: 10 };
const title = { color: '#102A35', fontSize: 14, fontWeight: '900' };
const text = { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 16, fontWeight: '800' };
