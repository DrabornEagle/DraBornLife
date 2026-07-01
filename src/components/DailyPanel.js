import React from 'react';
import { Text, View } from 'react-native';

export function DailyPanel({ summary, lifeData, money }) {
  const items = makeItems(summary, lifeData, money);
  const ok = items.filter((x) => x.ok).length;
  return (
    <View style={box}>
      <View style={top}>
        <View style={{ flex: 1 }}>
          <Text style={head}>Günlük kontrol</Text>
          <Text style={sub}>Bugün hızlıca bakılacak alanlar.</Text>
        </View>
        <Text style={score}>{ok}/{items.length}</Text>
      </View>
      {items.map((item) => <Row key={item.title} item={item} />)}
    </View>
  );
}

function makeItems(summary, lifeData, money) {
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

function Row({ item }) { return <View style={row}><Text style={[pill, item.ok ? okStyle : waitStyle]}>{item.ok ? 'OK' : 'Bak'}</Text><View style={{ flex: 1 }}><Text style={title} numberOfLines={1}>{item.title}</Text><Text style={text} numberOfLines={2}>{item.text}</Text></View></View>; }

const box = { marginHorizontal: 18, marginTop: 12, padding: 14, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA' };
const top = { flexDirection: 'row', alignItems: 'center' };
const head = { color: '#102A35', fontSize: 20, lineHeight: 25, fontWeight: '900' };
const sub = { marginTop: 4, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const score = { color: '#FF7A59', fontSize: 21, fontWeight: '900' };
const row = { marginTop: 9, padding: 11, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#DDE8EA', flexDirection: 'row', alignItems: 'center' };
const pill = { width: 38, marginRight: 10, paddingVertical: 5, borderRadius: 12, textAlign: 'center', fontSize: 10, fontWeight: '900' };
const okStyle = { backgroundColor: '#2DE2E6', color: '#06202A' };
const waitStyle = { backgroundColor: '#FFF1D6', color: '#7A4D00' };
const title = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const text = { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 16, fontWeight: '800' };
