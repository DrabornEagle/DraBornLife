import React from 'react';
import { Text, View } from 'react-native';
import { BACKUP_SCOPE } from '../utils/backupUtils';
import { getDataHealthReport } from '../utils/dataHealthCheck';
import { formatTRY, getLifeSummary } from '../utils/lifeSummary';

export function HomeFinalSummaryCard({ lifeData }) {
  const summary = getLifeSummary(lifeData);
  const health = getDataHealthReport(lifeData, BACKUP_SCOPE);
  const selectedYear = lifeData?.settings?.selectedYear || 2026;
  const yearlyPlans = Array.isArray(lifeData?.yearlyPlans) ? lifeData.yearlyPlans : [];
  const selectedPlans = yearlyPlans.filter((plan) => Number(plan.year) === Number(selectedYear));
  const backupCount = BACKUP_SCOPE.length;
  const ready = health.failCount === 0;

  return (
    <View style={card}>
      <Text style={mini}>V1.0 ONCESI DURUM</Text>
      <Text style={title}>{ready ? 'APK hazirligina yaklasiyoruz' : 'APK oncesi kontrol gerekli'}</Text>
      <Text style={desc}>Ana hedefler, veri sagligi ve yedek kapsami tek bakista.</Text>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Pill label="Saglik" value={`%${health.score}`} good={ready} />
        <Pill label="Yedek" value={`${backupCount} alan`} good />
      </View>
      <Line label="Antalya hedefi" value={`${summary.daysLeft} gun / ${formatTRY(summary.targetRemaining)} kalan`} status={summary.daysLeft >= 0 ? 'ok' : 'warn'} />
      <Line label="Yillik hedef" value={`${selectedYear} - ${selectedPlans.length} hedef`} status={selectedPlans.length > 0 ? 'ok' : 'warn'} />
      <Line label="Borc durumu" value={`${formatTRY(summary.debtLeft)} kalan`} status={summary.debtLeft <= 0 ? 'ok' : 'warn'} />
      <Line label="Test Merkezi" value={health.failCount ? `${health.failCount} hata` : `${health.warnCount} uyari`} status={health.failCount ? 'fail' : health.warnCount ? 'warn' : 'ok'} />
    </View>
  );
}

function Pill({ label, value, good }) {
  return <View style={{ flex: 1, marginRight: 8, padding: 12, borderRadius: 18, backgroundColor: good ? '#DDF8E8' : '#FFF1D6', borderWidth: 1, borderColor: good ? '#B5E9C8' : '#FFDCA0' }}><Text style={pillLabel}>{label}</Text><Text style={pillValue}>{value}</Text></View>;
}
function Line({ label, value, status }) {
  const color = status === 'ok' ? '#128C7E' : status === 'fail' ? '#C6283C' : '#FF7A59';
  const mark = status === 'ok' ? '✅' : status === 'fail' ? '⛔' : '⚠️';
  return <View style={line}><Text style={lineLeft}>{mark} {label}</Text><Text style={[lineRight, { color }]} numberOfLines={2}>{value}</Text></View>;
}

const card = { marginHorizontal: 18, marginTop: 14, padding: 18, borderRadius: 26, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const mini = { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 };
const title = { marginTop: 6, color: '#102A35', fontSize: 21, lineHeight: 26, fontWeight: '900' };
const desc = { marginTop: 7, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const pillLabel = { color: '#315661', fontSize: 11, fontWeight: '900' };
const pillValue = { marginTop: 5, color: '#102A35', fontSize: 18, fontWeight: '900' };
const line = { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#D9F1F2' };
const lineLeft = { flex: 1, paddingRight: 10, color: '#102A35', fontSize: 13, lineHeight: 18, fontWeight: '900' };
const lineRight = { maxWidth: 150, textAlign: 'right', fontSize: 12, lineHeight: 17, fontWeight: '900' };
