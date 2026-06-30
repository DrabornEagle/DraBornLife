import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { APP_VERSION_LABEL } from '../config/appVersion';
import { formatTRY } from '../utils/lifeSummary';

export function YearPlanScreen({ lifeData, onSave }) {
  const yearlyPlans = Array.isArray(lifeData?.yearlyPlans) ? lifeData.yearlyPlans : [];
  const selectedYear = lifeData?.settings?.selectedYear || yearlyPlans[0]?.year || 2026;
  const years = useMemo(() => Array.from(new Set(yearlyPlans.map((plan) => plan.year))).sort((a, b) => a - b), [yearlyPlans]);
  const selectedPlans = yearlyPlans.filter((plan) => plan.year === selectedYear);
  const totalBudget = selectedPlans.reduce((sum, plan) => sum + n(plan.estimatedBudget), 0);
  const savedTotal = selectedPlans.reduce((sum, plan) => sum + n(plan.savedAmount), 0);
  const doneCount = selectedPlans.filter((plan) => plan.status === 'done' || plan.status === 'completed').length;
  const progress = totalBudget > 0 ? Math.min(100, Math.round((savedTotal / totalBudget) * 100)) : 0;

  function selectYear(year) {
    onSave({
      ...lifeData,
      settings: {
        ...(lifeData?.settings || {}),
        selectedYear: year,
      },
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#DFF5F6' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 160 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: '#06202A' }}>
        <Text style={{ color: '#C8FBFF', fontSize: 12, fontWeight: '900' }}>{APP_VERSION_LABEL}</Text>
        <Text style={{ marginTop: 8, color: 'white', fontSize: 31, fontWeight: '900' }}>Yil Plani</Text>
        <Text style={{ marginTop: 10, color: '#DDF8FA', fontSize: 15, lineHeight: 22, fontWeight: '700' }}>Secilen yila gore tasinma, seyahat ve buyuk hayat hedeflerini takip et.</Text>
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Yil sec</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {years.map((year) => <YearChip key={year} year={year} active={selectedYear === year} onPress={() => selectYear(year)} />)}
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <MiniCard title="Secili yil" value={String(selectedYear)} text={`${selectedPlans.length} hedef`} />
        <MiniCard title="Butce" value={formatTRY(totalBudget)} text={`${formatTRY(savedTotal)} birikti`} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <MiniCard title="Ilerleme" value={`%${progress}`} text="Yillik birikim" />
        <MiniCard title="Tamam" value={`${doneCount}/${selectedPlans.length}`} text="Hedef durumu" />
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{selectedYear} hedefleri</Text>
        <Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>v0.4.4 adiminda bu ekrandan yeni hedef ekleme, duzenleme ve silme aktif olacak.</Text>
        {selectedPlans.length === 0 ? <Text style={{ color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>Bu yil icin henuz hedef yok. Sonraki adimda yeni yil hedefi ekleyebileceksin.</Text> : selectedPlans.map((plan) => <YearPlanCard key={plan.id} plan={plan} />)}
      </View>
    </ScrollView>
  );
}

function YearChip({ year, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={{ marginRight: 9, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{year}</Text></TouchableOpacity>;
}

function MiniCard({ title, value, text }) {
  return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 21, fontWeight: '900' }}>{value}</Text><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{text}</Text></View>;
}

function YearPlanCard({ plan }) {
  const left = Math.max(0, n(plan.estimatedBudget) - n(plan.savedAmount));
  return <View style={{ marginTop: 10, padding: 14, borderRadius: 20, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 16, fontWeight: '900' }}>{plan.title}</Text><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{statusLabel(plan.status)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{plan.goalType} - {plan.city || plan.country || 'hedef'} - {plan.targetMonth || plan.targetDate || 'tarih yok'}</Text><Text style={{ marginTop: 5, color: '#102A35', fontSize: 13, fontWeight: '900' }}>Kalan: {formatTRY(left)}</Text>{!!plan.note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, lineHeight: 18, fontWeight: '700' }}>{plan.note}</Text>}</View>;
}

function statusLabel(status) {
  if (status === 'active') return 'Aktif';
  if (status === 'done' || status === 'completed') return 'Tamam';
  if (status === 'postponed') return 'Ertelendi';
  if (status === 'cancelled') return 'Iptal';
  return 'Planli';
}

function n(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
