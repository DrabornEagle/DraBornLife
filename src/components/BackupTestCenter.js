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
      <Text style={head}>Yedek test merkezi</Text>
      <Text style={sub}>Dışa aktar veya içe aktar öncesi kısa kontrol.</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Mini label="Durum" value={status} />
        <Mini label="Kayıt" value={String(stats.totalRecords)} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Mini label="Hata" value={String(health.errorCount)} />
        <Mini label="Uyarı" value={String(health.warningCount)} />
      </View>
      <Line title="Dışa aktarım metni" value={exportReady ? 'Hazır' : 'Henüz oluşturulmadı'} />
      <Line title="İçe aktarım metni" value={importReady ? 'Yapıştırıldı' : 'Boş'} />
      {health.errors.slice(0, 2).map((item) => <Text key={item} style={err}>• {item}</Text>)}
      {health.warnings.slice(0, 2).map((item) => <Text key={item} style={warn}>• {item}</Text>)}
    </View>
  );
}

function Mini({ label, value }) { return <View style={mini}><Text style={miniLabel}>{label}</Text><Text style={miniValue} numberOfLines={2}>{value}</Text></View>; }
function Line({ title, value }) { return <View style={line}><Text style={lineTitle}>{title}</Text><Text style={lineValue}>{value}</Text></View>; }

const box = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const head = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const sub = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginRight: 6, padding: 12, minHeight: 78, borderRadius: 18, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniLabel = { color: '#315661', fontSize: 11, fontWeight: '900' };
const miniValue = { marginTop: 5, color: '#102A35', fontSize: 16, lineHeight: 20, fontWeight: '900' };
const line = { marginTop: 8, padding: 11, borderRadius: 16, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF', flexDirection: 'row', justifyContent: 'space-between' };
const lineTitle = { flex: 1, color: '#315661', fontSize: 12, fontWeight: '900' };
const lineValue = { color: '#102A35', fontSize: 12, fontWeight: '900' };
const err = { marginTop: 6, color: '#7A1E2B', fontSize: 12, lineHeight: 17, fontWeight: '900' };
const warn = { marginTop: 6, color: '#7A4D00', fontSize: 12, lineHeight: 17, fontWeight: '800' };
