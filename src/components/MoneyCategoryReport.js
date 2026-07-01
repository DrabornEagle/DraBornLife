import React from 'react';
import { Text, View } from 'react-native';

export function MoneyCategoryReport({ entries, money }) {
  const report = buildCategoryReport(entries || []);
  return (
    <View style={panel}>
      <Text style={title} numberOfLines={2}>Kategori raporu</Text>
      <Text style={note} numberOfLines={3}>Gelir ve gider hangi kategorilerden geliyor, hızlıca gör.</Text>
      <View style={miniRow}>
        <Mini label="En yüksek gelir" value={report.topIncome ? `${report.topIncome.category} • ${money(report.topIncome.income)}` : 'Yok'} />
        <Mini label="En yüksek gider" value={report.topExpense ? `${report.topExpense.category} • ${money(report.topExpense.expense)}` : 'Yok'} />
      </View>
      {report.rows.length === 0 ? <Text style={empty}>Kategori raporu için önce gelir veya gider kaydı ekle.</Text> : report.rows.slice(0, 6).map((row) => <Row key={row.category} row={row} money={money} />)}
    </View>
  );
}

function buildCategoryReport(entries) {
  const map = {};
  entries.forEach((entry) => {
    const category = entry.category || 'Diğer';
    if (!map[category]) map[category] = { category, income: 0, expense: 0, net: 0, count: 0 };
    const amount = n(entry.amount);
    if (entry.type === 'income') map[category].income += amount;
    if (entry.type === 'expense') map[category].expense += amount;
    map[category].net = map[category].income - map[category].expense;
    map[category].count += 1;
  });
  const rows = Object.values(map).sort((a, b) => Math.max(b.income, b.expense) - Math.max(a.income, a.expense));
  const topIncome = rows.filter((x) => x.income > 0).sort((a, b) => b.income - a.income)[0];
  const topExpense = rows.filter((x) => x.expense > 0).sort((a, b) => b.expense - a.expense)[0];
  return { rows, topIncome, topExpense };
}
function Row({ row, money }) { return <View style={rowStyle}><View style={{ flex: 1, paddingRight: 8 }}><Text style={rowTitle} numberOfLines={1}>{row.category}</Text><Text style={rowSub} numberOfLines={2}>{row.count} kayıt • Net: {money(row.net)}</Text></View><View style={amountBox}><Text style={income} numberOfLines={1}>+ {money(row.income)}</Text><Text style={expense} numberOfLines={1}>- {money(row.expense)}</Text></View></View>; }
function Mini({ label, value }) { return <View style={mini}><Text style={miniLabel} numberOfLines={1}>{label}</Text><Text style={miniValue} numberOfLines={3}>{value}</Text></View>; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }

const panel = { marginTop: 14, padding: 14, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const title = { color: '#102A35', fontSize: 19, lineHeight: 24, fontWeight: '900' };
const note = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const miniRow = { flexDirection: 'row', marginTop: 10 };
const mini = { flex: 1, marginHorizontal: 3, padding: 11, minHeight: 82, borderRadius: 18, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniLabel = { color: '#315661', fontSize: 10, fontWeight: '900' };
const miniValue = { marginTop: 5, color: '#102A35', fontSize: 12, lineHeight: 16, fontWeight: '900' };
const rowStyle = { marginTop: 8, padding: 11, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', alignItems: 'center' };
const rowTitle = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const rowSub = { marginTop: 4, color: '#315661', fontSize: 12, lineHeight: 16, fontWeight: '800' };
const amountBox = { maxWidth: 112, alignItems: 'flex-end' };
const income = { color: '#128C7E', fontSize: 11, lineHeight: 15, fontWeight: '900' };
const expense = { marginTop: 3, color: '#FF5E7E', fontSize: 11, lineHeight: 15, fontWeight: '900' };
const empty = { marginTop: 10, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
