import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { APP_STATUS_CODE, APP_VERSION_LABEL } from '../config/appVersion';
import { BACKUP_SCOPE } from '../utils/backupUtils';
import { getDataHealthReport } from '../utils/dataHealthCheck';

export function TestCenterScreen({ lifeData }) {
  const report = useMemo(() => getDataHealthReport(lifeData, BACKUP_SCOPE), [lifeData]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F4FBF9' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 170 }}>
      <View style={hero}>
        <Text style={heroMini}>{APP_VERSION_LABEL} • Expo Go</Text>
        <Text style={heroTitle}>Test Merkezi</Text>
        <Text style={heroText}>Veri sağlığını, yedek kapsamını ve düzeltilebilir uyarıları kontrol et. APK süreci hâlâ kapalıdır.</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <Mini title="Skor" value={`%${report.score}`} text="Genel sağlık" />
        <Mini title="Kontrol" value={`${report.checks.length}`} text="Toplam test" />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Mini title="Tamam" value={`${report.okCount}`} text="Sorunsuz" />
        <Mini title="Uyarı" value={`${report.warnCount + report.failCount}`} text="Bakılacak" />
      </View>

      <Panel title="Özet" note="Hata varsa v1.0 kapanmadan önce düzeltilmeli. Uyarılar kontrol edilmelidir.">
        <Line label="Uygulama sürümü" value={APP_STATUS_CODE} status="ok" />
        <Line label="Yedek kapsam alanı" value={`${BACKUP_SCOPE.length} alan`} status="ok" />
        <Line label="Sağlık skoru" value={`%${report.score}`} status={report.failCount ? 'fail' : report.warnCount ? 'warn' : 'ok'} />
      </Panel>

      <Panel title="Veri sağlık kontrolü" note="Eksik alan, hatalı tarih, negatif tutar, boş başlık ve bağlantı kontrolleri.">
        {report.checks.map((item) => <Line key={item.key} label={item.label} value={item.value} status={item.status} />)}
      </Panel>

      <Panel title="Düzeltilebilir uyarılar" note="Bu liste v1.0 öncesi bakılacak maddeleri gösterir.">
        {report.fixes.length === 0 ? <Text style={okText}>Kritik veri uyarısı yok. Temiz görünüyor.</Text> : unique(report.fixes).map((item) => <Text key={item} style={warnText}>• {item}</Text>)}
      </Panel>
    </ScrollView>
  );
}

function unique(list) { return Array.from(new Set(list)); }
function Panel({ title, note, children }) { return <View style={panel}><Text style={panelTitle}>{title}</Text><Text style={panelNote}>{note}</Text>{children}</View>; }
function Mini({ title, value, text }) { return <View style={mini}><Text style={miniT}>{title}</Text><Text style={miniV}>{value}</Text><Text style={miniD}>{text}</Text></View>; }
function Line({ label, value, status }) { const color = status === 'ok' ? '#128C7E' : status === 'fail' ? '#C6283C' : '#FF7A59'; const mark = status === 'ok' ? 'Tamam' : status === 'fail' ? 'Hata' : 'Uyarı'; return <View style={line}><Text style={lineLeft}>{mark}: {label}</Text><Text style={[lineRight, { color }]} numberOfLines={2}>{value}</Text></View>; }

const hero = { padding: 20, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BEEDEF', elevation: 6 };
const heroMini = { color: '#FF7A59', fontSize: 12, fontWeight: '900' };
const heroTitle = { marginTop: 8, color: '#102A35', fontSize: 31, fontWeight: '900' };
const heroText = { marginTop: 10, color: '#315661', fontSize: 15, lineHeight: 22, fontWeight: '700' };
const panel = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const panelTitle = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const panelNote = { marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const mini = { flex: 1, marginHorizontal: 4, padding: 14, minHeight: 108, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' };
const miniT = { color: '#315661', fontSize: 12, fontWeight: '900' };
const miniV = { marginTop: 8, color: '#102A35', fontSize: 23, fontWeight: '900' };
const miniD = { marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const line = { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#D9F1F2' };
const lineLeft = { flex: 1, paddingRight: 12, color: '#102A35', fontSize: 13, lineHeight: 18, fontWeight: '900' };
const lineRight = { maxWidth: 130, textAlign: 'right', fontSize: 12, lineHeight: 17, fontWeight: '900' };
const okText = { color: '#128C7E', fontSize: 14, lineHeight: 20, fontWeight: '900' };
const warnText = { marginTop: 7, color: '#7A1E2B', fontSize: 13, lineHeight: 19, fontWeight: '800' };
