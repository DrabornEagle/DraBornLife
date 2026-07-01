import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const defaultRegions = [
  { id: 'muratpasa', name: 'Muratpaşa', rentScore: 3, transportScore: 5, beachScore: 4, familyScore: 4, marketScore: 5, plusNote: 'Merkez yaşam, ulaşım ve market erişimi güçlü.', minusNote: 'Kira ve trafik bazı bölgelerde yorabilir.', personalNote: '' },
  { id: 'lara', name: 'Lara', rentScore: 3, transportScore: 4, beachScore: 5, familyScore: 5, marketScore: 4, plusNote: 'Sahil, aile yaşamı ve düzenli site seçenekleri güçlü.', minusNote: 'Popüler noktalarda kira yüksek olabilir.', personalNote: '' },
  { id: 'konyaalti', name: 'Konyaaltı', rentScore: 3, transportScore: 4, beachScore: 5, familyScore: 5, marketScore: 4, plusNote: 'Sahil hattı, aile yaşamı ve modern yapı seçenekleri güçlü.', minusNote: 'Sezon etkisi ve kira baskısı takip edilmeli.', personalNote: '' },
];
const scoreFields = [
  ['rentScore', 'Kira'],
  ['transportScore', 'Ulaşım'],
  ['beachScore', 'Sahil'],
  ['familyScore', 'Aile'],
  ['marketScore', 'Market'],
];

export function RegionComparisonPanel({ lifeData, onSave }) {
  const regions = Array.isArray(lifeData?.regionNotes) && lifeData.regionNotes.length ? lifeData.regionNotes : defaultRegions;
  const [selectedId, setSelectedId] = useState(regions[0]?.id || 'muratpasa');
  const selected = regions.find((item) => item.id === selectedId) || regions[0] || defaultRegions[0];
  const totalScore = scoreFields.reduce((sum, [key]) => sum + Number(selected?.[key] || 0), 0);
  const average = Math.round(totalScore / scoreFields.length);

  function saveRegion(nextRegion) {
    const base = regions.length ? regions : defaultRegions;
    const nextRegions = base.map((item) => item.id === nextRegion.id ? nextRegion : item);
    onSave({ ...lifeData, regionNotes: nextRegions });
  }
  function updateField(key, value) { saveRegion({ ...selected, [key]: value }); }
  function updateScore(key, value) { saveRegion({ ...selected, [key]: Math.max(1, Math.min(5, value)) }); }

  return (
    <View style={panel}>
      <Text style={title}>Antalya bölge karşılaştırması</Text>
      <Text style={subtitle}>Muratpaşa, Lara ve Konyaaltı için kira, ulaşım, sahil, aile yaşamı ve market erişimini notla.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {regions.map((region) => <Chip key={region.id} label={region.name} active={selected.id === region.id} onPress={() => setSelectedId(region.id)} />)}
      </ScrollView>
      <View style={scoreHero}>
        <View style={{ flex: 1 }}>
          <Text style={heroMini}>SEÇİLİ BÖLGE</Text>
          <Text style={heroTitle}>{selected.name}</Text>
          <Text style={heroText}>Ortalama yaşam skoru: {average}/5</Text>
        </View>
        <View style={scoreBubble}><Text style={scoreText}>{average}</Text></View>
      </View>
      {scoreFields.map(([key, label]) => <ScoreLine key={key} label={label} value={Number(selected[key] || 1)} onChange={(value) => updateScore(key, value)} />)}
      <Input label="Artı notu" value={selected.plusNote || ''} onChangeText={(value) => updateField('plusNote', value)} placeholder="Bölgenin güçlü yönü" />
      <Input label="Eksi notu" value={selected.minusNote || ''} onChangeText={(value) => updateField('minusNote', value)} placeholder="Dikkat edilmesi gereken nokta" />
      <Input label="Kişisel aile notu" value={selected.personalNote || ''} onChangeText={(value) => updateField('personalNote', value)} placeholder="Örn: çocuk için park, okul, sahil yakınlığı" />
      <Text style={footer}>Notlar cihaz içinde saklanır ve yedek kapsamına alınması v1.2.8 yedek iyileştirme adımında tekrar kontrol edilir.</Text>
    </View>
  );
}

function ScoreLine({ label, value, onChange }) {
  return <View style={line}><Text style={lineLabel}>{label}</Text><View style={scoreRow}>{[1, 2, 3, 4, 5].map((score) => <TouchableOpacity key={score} onPress={() => onChange(score)} style={[dot, value >= score && dotActive]}><Text style={dotText}>{score}</Text></TouchableOpacity>)}</View></View>;
}
function Chip({ label, active, onPress }) { return <TouchableOpacity onPress={onPress} style={[chip, active && chipActive]}><Text style={chipText}>{label}</Text></TouchableOpacity>; }
function Input(props) { return <View style={{ marginTop: 12 }}><Text style={inputLabel}>{props.label}</Text><TextInput {...props} multiline style={input} placeholderTextColor="#7C969D" /></View>; }

const panel = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF0' };
const title = { color: '#102A35', fontSize: 20, fontWeight: '900' };
const subtitle = { marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const chip = { marginRight: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: '#E8F1F2' };
const chipActive = { backgroundColor: '#2DE2E6' };
const chipText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const scoreHero = { marginTop: 12, padding: 14, borderRadius: 20, backgroundColor: '#071A24', flexDirection: 'row', alignItems: 'center' };
const heroMini = { color: '#2DE2E6', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 };
const heroTitle = { marginTop: 5, color: '#FFFFFF', fontSize: 24, lineHeight: 29, fontWeight: '900' };
const heroText = { marginTop: 3, color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 17, fontWeight: '800' };
const scoreBubble = { width: 54, height: 54, borderRadius: 27, backgroundColor: '#2DE2E6', alignItems: 'center', justifyContent: 'center' };
const scoreText = { color: '#06202A', fontSize: 24, fontWeight: '900' };
const line = { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E3EAF0' };
const lineLabel = { color: '#102A35', fontSize: 13, fontWeight: '900' };
const scoreRow = { flexDirection: 'row', marginTop: 8 };
const dot = { width: 36, height: 34, marginRight: 7, borderRadius: 14, backgroundColor: '#E8F1F2', alignItems: 'center', justifyContent: 'center' };
const dotActive = { backgroundColor: '#FFB347' };
const dotText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const inputLabel = { color: '#315661', fontSize: 12, fontWeight: '900' };
const input = { marginTop: 7, minHeight: 54, padding: 13, borderRadius: 18, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#E3EAF0', color: '#102A35', fontSize: 14, fontWeight: '800', textAlignVertical: 'top' };
const footer = { marginTop: 12, color: '#52616B', fontSize: 11, lineHeight: 16, fontWeight: '800' };
