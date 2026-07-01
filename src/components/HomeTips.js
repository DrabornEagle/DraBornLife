import React from 'react';
import { Text, View } from 'react-native';

export function HomeTips({ summary, lifeData, money }) {
  const checks = getDailyChecks(summary, lifeData, money);
  const done = checks.filter((x) => x.ok).length;
  const items = getTips(summary, lifeData, money).slice(0, 4);
  return (
    <View style={box}>
      <View style={topRow}>
        <View style={{ flex: 1 }}>
          <Text style={head}>GÜNLÜK KONTROL</Text>
          <Text style={note}>Bugün bakılacak kısa liste.</Text>
        </View>
        <Text style={score}>{done}/{checks.length}</Text>
      </View>
      {checks.map((item) => <Check key={item.title} item={item} />)}
      <Text style={[head, { marginTop: 16 }]}>AKILLI ÖNERİLER</Text>
      <Text style={note}>Bugün bakman gereken en önemli alanlar.</Text>
      {items.map((item, index) => <View key={item.title} style={row}><Text style={num}>{index + 1}</Text><View style={{ flex: 1 }}><Text style={title} numberOfLines={1}>{item.title}</Text><Text style={text} numberOfLines={2}>{item.text}</Text></View></View>)}
    </View>
  );
}

function getDailyChecks(summary, lifeData, money) {
  const moneyEntries = lifeData?.moneyEntries || [];
  const shopping = lifeData?.shoppingItems || [];
  const rooms = lifeData?.homeSetupRooms || [];
  const activities = lifeData?.activities || [];
  const today = new Date().toISOString().slice(0, 10);
  const hasMoneyToday = moneyEntries.some((entry) => String(entry.date || '').slice(0, 10) === today);
  const roomItemCount = rooms.flatMap((room) => room.items || []).length;
  const openShopping = shopping.filter((item) => !item.isPurchasedOrInstalled).length;
  return [
    { title: 'Para kaydı', ok: hasMoneyToday, text: hasMoneyToday ? 'Bugün kayıt var.' : 'Bugünkü gelir / gideri gir.' },
    { title: 'Bütçe', ok: summary.savingPercent >= 60, text: 'Kalan: ' + money(summary.targetRemaining) },
    { title: 'Borç', ok: summary.debtLeft <= 0, text: summary.debtLeft > 0 ? 'Kalan borç: ' + money(summary.debtLeft) : 'Borç baskısı yok.' },
    { title: 'Alınacaklar', ok: openShopping === 0 || summary.shoppingReady > 0, text: String(openShopping) + ' açık kalem var.' },
    { title: 'Ev kurulumu', ok: roomItemCount > 0, text: String(roomItemCount) + ' eşya takipte.' },
    { title: 'Yaşam planı', ok: activities.length > 0, text: String(activities.length) + ' aile aktivitesi var.' },
  ];
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

function Check({ item }) { return <View style={row}><Text style={[tag, item.ok ? okTag : waitTag]}>{item.ok ? 'OK' : 'Bak'}</Text><View style={{ flex: 1 }}><Text style={title} numberOfLines={1}>{item.title}</Text><Text style={text} numberOfLines={2}>{item.text}</Text></View></View>; }

const box = { marginHorizontal: 18, marginTop: 12, padding: 16, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA' };
const topRow = { flexDirection: 'row', alignItems: 'center' };
const head = { color: '#FF7A59', fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 };
const note = { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const score = { color: '#FF7A59', fontSize: 21, fontWeight: '900' };
const row = { marginTop: 9, padding: 12, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#DDE8EA', flexDirection: 'row', alignItems: 'center' };
const num = { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2DE2E6', color: '#06202A', textAlign: 'center', textAlignVertical: 'center', fontSize: 12, fontWeight: '900', marginRight: 10 };
const tag = { width: 38, marginRight: 10, paddingVertical: 5, borderRadius: 12, textAlign: 'center', fontSize: 10, fontWeight: '900' };
const okTag = { backgroundColor: '#2DE2E6', color: '#06202A' };
const waitTag = { backgroundColor: '#FFF1D6', color: '#7A4D00' };
const title = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const text = { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 16, fontWeight: '800' };
