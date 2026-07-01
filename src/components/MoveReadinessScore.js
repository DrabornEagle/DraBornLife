import React from 'react';
import { Text, View } from 'react-native';
import { getBackupStats, getDataHealthReport } from '../utils/backupUtils';

export function MoveReadinessScore({ summary, lifeData, money }) {
  const health = getDataHealthReport(lifeData);
  const stats = getBackupStats(lifeData);
  const score = calc(summary, health, stats);
  const level = getLevel(score.total);
  return (
    <View style={box}>
      <Text style={head}>Taşınma hazır olma skoru</Text>
      <Text style={sub}>Antalya planının genel hazırlık durumunu tek puanda gösterir.</Text>
      <View style={hero}>
        <Text style={heroTop}>Genel skor</Text>
        <Text style={heroScore}>{score.total}</Text>
        <Text style={heroText}>{level}</Text>
      </View>
      <Line title="Bütçe" value={score.budget} text={`${money(summary.savedAmount)} / ${money(summary.targetBudget)}`} />
      <Line title="Borç" value={score.debt} text={summary.debtLeft > 0 ? `Kalan: ${money(summary.debtLeft)}` : 'Borç yükü görünmüyor'} />
      <Line title="Ev kurulumu" value={score.home} text={`%${summary.homeSetupPercent} kurulum`} />
      <Line title="Liste" value={score.shopping} text={`${summary.shoppingBought}/${summary.shoppingCount} kalem`} />
      <Line title="Yedek" value={score.backup} text={health.errorCount > 0 ? 'Kontrol gerekli' : `${stats.totalRecords} kayıt hazır`} />
    </View>
  );
}

function calc(summary, health, stats) {
  const budget = clamp(summary.savingPercent);
  const debt = summary.totalDebt > 0 ? clamp(summary.debtPercent) : 70;
  const home = clamp(summary.homeSetupPercent);
  const shopping = summary.shoppingCount > 0 ? clamp(Math.round((summary.shoppingBought / summary.shoppingCount) * 100)) : 0;
  const backup = health.errorCount > 0 ? 20 : stats.totalRecords > 0 ? 85 : 40;
  const time = summary.daysLeft > 120 ? 80 : summary.daysLeft > 60 ? 60 : 40;
  const total = Math.round((budget * 0.28) + (debt * 0.17) + (home * 0.22) + (shopping * 0.13) + (backup * 0.10) + (time * 0.10));
  return { total: clamp(total), budget, debt, home, shopping, backup };
}
function getLevel(score) { if (score >= 80) return 'Güçlü hazırlık'; if (score >= 60) return 'İyi ama eksikler var'; if (score >= 40) return 'Orta seviye hazırlık'; return 'Hazırlığı hızlandır'; }
function Line({ title, value, text }) { return <View style={line}><View style={{ flex: 1, paddingRight: 8 }}><Text style={lineTitle} numberOfLines={1}>{title}</Text><Text style={lineText} numberOfLines={2}>{text}</Text></View><Text style={scoreText}>{value}</Text></View>; }
function clamp(value) { const n = Number(value); if (!Number.isFinite(n)) return 0; return Math.max(0, Math.min(100, Math.round(n))); }

const box = { marginHorizontal: 18, marginTop: 12, padding: 14, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EA' };
const head = { color: '#102A35', fontSize: 20, lineHeight: 25, fontWeight: '900' };
const sub = { marginTop: 5, color: '#52616B', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const hero = { marginTop: 10, padding: 15, borderRadius: 22, backgroundColor: '#102A35' };
const heroTop = { color: '#FFB347', fontSize: 11, fontWeight: '900' };
const heroScore = { marginTop: 4, color: '#FFFFFF', fontSize: 42, lineHeight: 48, fontWeight: '900' };
const heroText = { color: '#DDF8FA', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const line = { marginTop: 8, padding: 11, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#DDE8EA', flexDirection: 'row', alignItems: 'center' };
const lineTitle = { color: '#102A35', fontSize: 14, lineHeight: 18, fontWeight: '900' };
const lineText = { marginTop: 3, color: '#52616B', fontSize: 12, lineHeight: 16, fontWeight: '800' };
const scoreText = { width: 36, textAlign: 'right', color: '#FF7A59', fontSize: 18, lineHeight: 22, fontWeight: '900' };
