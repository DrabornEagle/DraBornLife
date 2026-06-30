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
  const remainingTotal = Math.max(0, totalBudget - savedTotal);
  const doneCount = selectedPlans.filter((plan) => plan.status === 'done' || plan.status === 'completed').length;
  const progress = totalBudget > 0 ? Math.min(100, Math.round((savedTotal / totalBudget) * 100)) : 0;
  const nearest = getNearestCountdown(selectedPlans);

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
        <MiniCard title="Ilerleme" value={`%${progress}`} text={formatTRY(remainingTotal) + ' kalan'} />
        <MiniCard title="En yakin" value={nearest.daysLabel} text={nearest.title} />
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>Birikim geri sayimi</Text>
        <Text style={{ marginTop: 5, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Hedef tarihine gore kalan sure ve gerekli birikim hesaplanir.</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <MiniCard title="Kalan butce" value={formatTRY(remainingTotal)} text="Secili yil toplam" />
          <MiniCard title="Aylik lazim" value={formatTRY(nearest.monthlyNeed)} text="En yakin hedef" />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <MiniCard title="Haftalik lazim" value={formatTRY(nearest.weeklyNeed)} text="En yakin hedef" />
          <MiniCard title="Tamam" value={`${doneCount}/${selectedPlans.length}`} text="Hedef durumu" />
        </View>
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}>
        <Text style={{ color: '#102A35', fontSize: 20, fontWeight: '900' }}>{selectedYear} hedefleri</Text>
        <Text style={{ marginTop: 5, marginBottom: 8, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' }}>Her hedef kartinda kalan gun, ay, butce ve gerekli birikim gorunur.</Text>
        {selectedPlans.length === 0 ? <Text style={{ color: '#315661', fontSize: 14, lineHeight: 20, fontWeight: '800' }}>Bu yil icin henuz hedef yok. Sonraki adimlarda yeni yil hedefi ekleyebileceksin.</Text> : selectedPlans.map((plan) => <YearPlanCard key={plan.id} plan={plan} />)}
      </View>
    </ScrollView>
  );
}

function YearChip({ year, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={{ marginRight: 9, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: active ? '#2DE2E6' : '#CFECEE' }}><Text style={{ color: '#06202A', fontSize: 15, fontWeight: '900' }}>{year}</Text></TouchableOpacity>;
}

function MiniCard({ title, value, text }) {
  return <View style={{ flex: 1, marginHorizontal: 4, padding: 14, minHeight: 110, borderRadius: 22, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#BEEDEF' }}><Text style={{ color: '#315661', fontSize: 12, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 8, color: '#102A35', fontSize: 19, fontWeight: '900' }}>{value}</Text><Text style={{ marginTop: 6, color: '#315661', fontSize: 12, lineHeight: 17, fontWeight: '800' }}>{text}</Text></View>;
}

function YearPlanCard({ plan }) {
  const calc = calculatePlan(plan);
  return <View style={{ marginTop: 10, padding: 14, borderRadius: 20, backgroundColor: '#F8FFFF', borderWidth: 1, borderColor: '#BEEDEF' }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ flex: 1, color: '#102A35', fontSize: 16, fontWeight: '900' }}>{plan.title}</Text><Text style={{ color: '#FF7A59', fontSize: 12, fontWeight: '900' }}>{statusLabel(plan.status)}</Text></View><Text style={{ marginTop: 5, color: '#315661', fontSize: 12, fontWeight: '800' }}>{plan.goalType} - {plan.city || plan.country || 'hedef'} - {plan.targetMonth || plan.targetDate || 'tarih yok'}</Text><View style={{ flexDirection: 'row', marginTop: 10 }}><SmallMetric title="Kalan" value={formatTRY(calc.remainingBudget)} /><SmallMetric title="Sure" value={calc.daysLabel} /></View><View style={{ flexDirection: 'row', marginTop: 8 }}><SmallMetric title="Aylik" value={formatTRY(calc.monthlyNeed)} /><SmallMetric title="Haftalik" value={formatTRY(calc.weeklyNeed)} /></View><Text style={{ marginTop: 8, color: calc.warning ? '#7A1E2B' : '#315661', fontSize: 12, lineHeight: 18, fontWeight: '800' }}>{calc.message}</Text>{!!plan.note && <Text style={{ marginTop: 5, color: '#315661', fontSize: 12, lineHeight: 18, fontWeight: '700' }}>{plan.note}</Text>}</View>;
}

function SmallMetric({ title, value }) {
  return <View style={{ flex: 1, marginRight: 6, padding: 10, borderRadius: 16, backgroundColor: '#E9FAFA', borderWidth: 1, borderColor: '#CFECEE' }}><Text style={{ color: '#315661', fontSize: 10, fontWeight: '900' }}>{title}</Text><Text style={{ marginTop: 4, color: '#102A35', fontSize: 13, fontWeight: '900' }}>{value}</Text></View>;
}

function getNearestCountdown(plans) {
  const activePlans = plans.map(calculatePlan).filter((item) => !item.isDone && item.daysLeft >= 0 && item.targetDate);
  if (activePlans.length === 0) return { title: 'Tarih bekliyor', daysLabel: '0 gun', monthlyNeed: 0, weeklyNeed: 0 };
  activePlans.sort((a, b) => a.daysLeft - b.daysLeft);
  return activePlans[0];
}

function calculatePlan(plan) {
  const total = n(plan.estimatedBudget);
  const saved = n(plan.savedAmount);
  const remainingBudget = Math.max(0, total - saved);
  const isDone = plan.status === 'done' || plan.status === 'completed' || remainingBudget === 0 && total > 0;
  const targetDate = parseTargetDate(plan.targetDate, plan.targetMonth, plan.year);
  if (isDone) return { title: plan.title, remainingBudget, daysLeft: 0, daysLabel: 'Tamam', monthlyNeed: 0, weeklyNeed: 0, targetDate, isDone, message: 'Hedef tamamlanmis gorunuyor.', warning: false };
  if (!targetDate) return { title: plan.title, remainingBudget, daysLeft: -1, daysLabel: 'Tarih yok', monthlyNeed: 0, weeklyNeed: 0, targetDate: null, isDone, message: 'Hedef tarihi eksik. Tarih eklenince geri sayim hesaplanacak.', warning: true };
  const today = startOfDay(new Date());
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return { title: plan.title, remainingBudget, daysLeft: diffDays, daysLabel: 'Gecti', monthlyNeed: remainingBudget, weeklyNeed: remainingBudget, targetDate, isDone, message: 'Hedef tarihi gecmis. Tarihi guncellemen veya hedefi tamamlaman iyi olur.', warning: true };
  const monthsLeft = Math.max(1, Math.ceil(diffDays / 30));
  const weeksLeft = Math.max(1, Math.ceil(diffDays / 7));
  return { title: plan.title, remainingBudget, daysLeft: diffDays, daysLabel: `${diffDays} gun`, monthlyNeed: Math.ceil(remainingBudget / monthsLeft), weeklyNeed: Math.ceil(remainingBudget / weeksLeft), targetDate, isDone, message: `${monthsLeft} ay / ${weeksLeft} hafta icinde hedefe ulasmak icin hesaplandi.`, warning: false };
}

function parseTargetDate(targetDate, targetMonth, year) {
  if (targetDate && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    const parsed = new Date(`${targetDate}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return startOfDay(parsed);
  }
  const month = monthNumber(targetMonth);
  if (month && year) return new Date(Number(year), month - 1, 28);
  return null;
}

function monthNumber(text) {
  const value = String(text || '').toLowerCase();
  if (value.includes('ocak')) return 1;
  if (value.includes('subat')) return 2;
  if (value.includes('mart')) return 3;
  if (value.includes('nisan')) return 4;
  if (value.includes('mayis')) return 5;
  if (value.includes('haziran')) return 6;
  if (value.includes('temmuz')) return 7;
  if (value.includes('agustos')) return 8;
  if (value.includes('eylul')) return 9;
  if (value.includes('ekim')) return 10;
  if (value.includes('kasim')) return 11;
  if (value.includes('aralik')) return 12;
  return 0;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
