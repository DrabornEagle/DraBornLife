import React from 'react';
import { Text, View } from 'react-native';
import { getBackupStats, getDataHealthReport } from '../utils/backupUtils';

export function BackupTestCenter({ lifeData, exportText, importText }) {
  const stats = getBackupStats(lifeData);
  const health = getDataHealthReport(lifeData);
  const exportReady = !!String(exportText || '').trim();
  const importReady = !!String(importText || '').trim();
  const status = health.errorCount > 0 ? 'Kontrol gerekli' : 'Hazır';
  return (
    <View style={box}>
      <Text style={head} numberOfLines={2}>Yedek test merkezi</Text>
      <Text style={sub} numberOfLines={3}>Dışa aktar veya içe aktar öncesi kısa kontrol.</Text>
      <View style={miniRow}>
        <Mini label="Durum" value={status} />
        <Mini label="Kayıt" value={String(stats.totalRecords)} />
      </View>
      <View style={miniRow}>
        <Mini label="Hata" value={String(health.errorCount)} />
        <Mini label="Uyarı" value={String(health.warningCount)} />
      </View>
      <Line title="Dışa aktarım metni" value={exportReady ? 'Hazır' : 'Oluşturulmadı'} />
      <Line title="İçe aktarım metni" value={importReady ? 'Yapıştırıldı' : 'Boş'} />
      {health.errors.slice(0, 2).map((item) => <Text key={item} style={err} numberOfLines={3}>• {item}</Text>)}
      {health.warnings.slice(0, 2).map((item) => <Text key={item} style={warn} numberOfLines={3}>• {item}</Text>)}
    </View>
  );
}

function Mini({ label, value }) { return <View style={mini}><Text style={miniLabel} numberOfLines={1}>{label}</Text><Text style={miniValue} numberOfLines={2}>{value}</Text></View>; }
function Line({ title, value }) { return <View style={line}><Text style={lineTitle} numberOfLines={2}>{title}</Text><Text style={lineValue} numberOfLines={2}>{value}</Text></View>; }

const box = { marginTop: 14, padding: 14, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const head = { color: '#102A35', fontSize: 19, lineHeight: 24, fontWeight: '900' };
const sub = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 18, fontWeight: '800' };
const miniRow = { flexDirection: 'row', marginTop: 8 };
const mini = { flex: 1, marginRight: 6, padding: 11, minHeight: 74, borderRadius: 18, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniLabel = { color: '#315661', fontSize: 10, fontWeight: '900' };
const miniValue = { marginTop: 5, color: '#102A35', fontSize: 15, lineHeight: 19, fontWeight: '900' };
const line = { marginTop: 8, padding: 11, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' };
const lineTitle = { flex: 1, paddingRight: 8, color: '#315661', fontSize: 12, lineHeight: 16, fontWeight: '900' };
const lineValue = { maxWidth: 118, color: '#102A35', fontSize: 12, lineHeight: 16, textAlign: 'right', fontWeight: '900' };
const err = { marginTop: 6, color: '#7A1E2B', fontSize: 12, lineHeight: 17, fontWeight: '900' };
const warn = { marginTop: 6, color: '#7A4D00', fontSize: 12, lineHeight: 17, fontWeight: '800' };
