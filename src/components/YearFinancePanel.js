import React from 'react';
import { Text, View } from 'react-native';
import { formatMoney } from '../utils/lifeSummary';
import { getYearlyFinanceSummary } from '../utils/yearlyFinanceSummary';

export function YearFinancePanel({ lifeData, selectedYear, compact = false }) {
  const summary = getYearlyFinanceSummary(lifeData, selectedYear);
  const money = (value) => formatMoney(value, lifeData);

  return (
    <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
      <Text style={{ color: '#102A35', fontSize: compact ? 18 : 20, fontWeight: '900' }}>{summary.year} finans özeti</Text>
      <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Seçili yılın gelir, gider, net birikim ve hedef bütçe ilerlemesi.</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Mini title="Gelir" value={money(summary.income)} />
        <Mini title="Gider" value={money(summary.expense)} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Mini title="Net" value={money(summary.net)} />
        <Mini title="İlerleme" value={`%${summary.progress}`} />
      </View>
      <View style={{ marginTop: 10, padding: 12, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#CFECEE' }}>
        <Line label="Yıllık hedef bütçesi" value={money(summary.targetBudget)} />
        <Line label="Hedeflere ayrılan/biriken" value={money(summary.yearlyAvailable)} />
        <Line label="Yıllık hedefe kalan" value={money(summary.remaining)} />
        <Line label="Alınacaklar kalan" value={money(summary.shoppingRemaining)} />
        <Line label="Borç kalan" value={money(summary.debtRemaining)} />
        <Line label="Özel hedef kalan" value={money(summary.customGoalRemaining)} />
      </View>
    </View>
  );
}

function Mini({ title, value }) {
  return <View style={{ flex: 1, marginHorizontal: 4, padding: 12, minHeight: 88, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#CFECEE' }}><Text style={{ color: '#315661', fontSize: 11, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 7, color: '#102A35', fontSize: 15, lineHeight: 19, fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>;
}

function Line({ label, value }) {
  return <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#E2F4F5' }}><Text style={{ flex: 1, paddingRight: 10, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{label}</Text><Text style={{ maxWidth: 130, color: '#102A35', fontSize: 12, lineHeight: 17, textAlign: 'right', fontWeight: '900' }} numberOfLines={2}>{value}</Text></View>;
}
