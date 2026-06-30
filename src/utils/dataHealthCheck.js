export function getDataHealthReport(lifeData, backupScope = []) {
  const checks = [];
  const fixes = [];
  const settings = lifeData?.settings || {};
  const goals = lifeData?.goals || {};
  const yearlyPlans = arr(lifeData?.yearlyPlans);
  const moneyEntries = arr(lifeData?.moneyEntries);
  const shoppingItems = arr(lifeData?.shoppingItems);
  const debtEntries = arr(lifeData?.debtEntries);
  const customGoals = arr(lifeData?.customGoals);
  const homeSetupRooms = arr(lifeData?.homeSetupRooms);
  const activities = arr(lifeData?.activities);
  const beaches = arr(lifeData?.beaches);

  add(checks, 'settings.appName', 'Uygulama adi', !!settings.appName, settings.appName || 'eksik', 'Eksikse DraBornLife olarak tamamlanabilir.', fixes);
  add(checks, 'settings.selectedYear', 'Secili yil', validYear(settings.selectedYear), String(settings.selectedYear || 'eksik'), 'Eksikse 2026 olarak tamamlanabilir.', fixes);
  add(checks, 'settings.currency', 'Para birimi', !!settings.currency, settings.currency || 'eksik', 'Eksikse TRY olarak tamamlanabilir.', fixes);
  add(checks, 'goals.antalyaMove', 'Antalya ana hedefi', !!goals.antalyaMove, goals.antalyaMove ? 'var' : 'eksik', 'Eksikse varsayilan Antalya hedefi eklenebilir.', fixes);
  add(checks, 'goals.motorcycle', 'Motosiklet hedefi', !!goals.motorcycle, goals.motorcycle ? 'var' : 'eksik', 'Eksikse varsayilan motosiklet hedefi eklenebilir.', fixes);
  add(checks, 'yearlyPlans', 'Yillik hedef listesi', yearlyPlans.length > 0, `${yearlyPlans.length} hedef`, 'Eksikse 2026 Antalya ve 2027 bos hedef eklenebilir.', fixes);
  add(checks, 'yearlyPlans.2026', '2026 yillik hedef', yearlyPlans.some((p) => Number(p.year) === 2026), yearlyPlans.some((p) => Number(p.year) === 2026) ? 'var' : 'eksik', 'Eksikse 2026 Antalya hedefi eklenebilir.', fixes);
  add(checks, 'backup.yearlyPlans', 'Yedek yearlyPlans', backupScope.includes('yearlyPlans'), backupScope.includes('yearlyPlans') ? 'var' : 'eksik', 'Yedek kapsamina yearlyPlans eklenmeli.', fixes);
  add(checks, 'backup.settings', 'Yedek settings', backupScope.includes('settings'), backupScope.includes('settings') ? 'var' : 'eksik', 'Yedek kapsamina settings eklenmeli.', fixes);

  yearlyPlans.forEach((plan, index) => {
    add(checks, `yearlyPlans.${index}.title`, `Yillik hedef basligi ${index + 1}`, !!String(plan.title || '').trim(), plan.title || 'bos', 'Bos baslik elle duzeltilmeli.', fixes);
    add(checks, `yearlyPlans.${index}.year`, `Yillik hedef yili ${index + 1}`, validYear(plan.year), String(plan.year || 'eksik'), 'Yil 2020 veya sonrasi olmali.', fixes);
    add(checks, `yearlyPlans.${index}.date`, `Yillik hedef tarihi ${index + 1}`, !plan.targetDate || validDate(plan.targetDate), plan.targetDate || 'tarih yok', 'Tarih YYYY-MM-DD formatinda olmali.', fixes);
    add(checks, `yearlyPlans.${index}.budget`, `Yillik hedef butcesi ${index + 1}`, n(plan.estimatedBudget) >= 0 && n(plan.savedAmount) >= 0, `${n(plan.savedAmount)} / ${n(plan.estimatedBudget)}`, 'Negatif tutarlar sifirlanmali veya duzeltilmeli.', fixes);
  });

  moneyEntries.forEach((item, index) => {
    add(checks, `money.${index}.amount`, `Para kaydi tutari ${index + 1}`, n(item.amount) >= 0, String(item.amount || 0), 'Negatif para kaydi duzeltilmeli.', fixes);
    add(checks, `money.${index}.date`, `Para kaydi tarihi ${index + 1}`, !item.date || validDate(item.date), item.date || 'tarih yok', 'Tarih YYYY-MM-DD formatinda olmali.', fixes);
  });

  shoppingItems.forEach((item, index) => {
    add(checks, `shopping.${index}.title`, `Liste kalemi ${index + 1}`, !!String(item.title || '').trim(), item.title || 'bos', 'Bos baslik elle duzeltilmeli.', fixes);
    add(checks, `shopping.${index}.price`, `Liste fiyati ${index + 1}`, n(item.estimatedPrice) >= 0 && n(item.savedAmount) >= 0, `${n(item.savedAmount)} / ${n(item.estimatedPrice)}`, 'Negatif fiyat/tutar duzeltilmeli.', fixes);
  });

  debtEntries.forEach((item, index) => {
    add(checks, `debt.${index}.amount`, `Borc tutari ${index + 1}`, n(item.totalDebt) >= 0 && n(item.paidAmount) >= 0, `${n(item.paidAmount)} / ${n(item.totalDebt)}`, 'Negatif borc tutari duzeltilmeli.', fixes);
  });

  customGoals.forEach((item, index) => {
    add(checks, `custom.${index}.title`, `Ozel hedef ${index + 1}`, !!String(item.title || '').trim(), item.title || 'bos', 'Bos baslik elle duzeltilmeli.', fixes);
    add(checks, `custom.${index}.budget`, `Ozel hedef butcesi ${index + 1}`, n(item.estimatedBudget) >= 0 && n(item.savedAmount) >= 0, `${n(item.savedAmount)} / ${n(item.estimatedBudget)}`, 'Negatif hedef tutari duzeltilmeli.', fixes);
  });

  add(checks, 'homeSetupRooms', 'Ev kurulum odalari', homeSetupRooms.length > 0, `${homeSetupRooms.length} oda`, 'Eksikse varsayilan odalar eklenebilir.', fixes);
  add(checks, 'activities', 'Aktivite listesi', Array.isArray(lifeData?.activities), `${activities.length} aktivite`, 'Eksikse bos liste olarak tamamlanabilir.', fixes);
  add(checks, 'beaches', 'Sahil/aqua listesi', Array.isArray(lifeData?.beaches), `${beaches.length} yer`, 'Eksikse bos liste olarak tamamlanabilir.', fixes);

  const motorcycleItem = shoppingItems.find((item) => item.id === 'motorcycle');
  const motorcycleGoal = goals.motorcycle;
  const motorcycleLinked = motorcycleItem && motorcycleGoal && n(motorcycleItem.estimatedPrice) === n(motorcycleGoal.estimatedPrice);
  add(checks, 'motorcycle.link', 'Motosiklet baglantisi', !!motorcycleLinked, motorcycleLinked ? 'uyumlu' : 'kontrol gerekli', 'Ayar ekranindan motosiklet fiyatini kaydedince Liste ve Yil hedefi senkronlanir.', fixes);

  const okCount = checks.filter((item) => item.status === 'ok').length;
  const warnCount = checks.filter((item) => item.status === 'warn').length;
  const failCount = checks.filter((item) => item.status === 'fail').length;
  const score = checks.length ? Math.round((okCount / checks.length) * 100) : 0;

  return { checks, fixes, okCount, warnCount, failCount, score };
}

function add(checks, key, label, pass, value, fixText, fixes) {
  const status = pass ? 'ok' : key.includes('backup') || key.includes('settings') || key.includes('yearlyPlans') ? 'fail' : 'warn';
  checks.push({ key, label, value, status });
  if (!pass) fixes.push(fixText);
}
function arr(value) { return Array.isArray(value) ? value : []; }
function n(value) { const parsed = Number(String(value).replace(',', '.')); return Number.isFinite(parsed) ? parsed : 0; }
function validYear(value) { const year = Number(value); return Number.isFinite(year) && year >= 2020 && year <= 2100; }
function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')); }
