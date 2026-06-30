export const CURRENCY_OPTIONS = [
  { key: 'TL', label: 'TL', symbol: 'TL' },
  { key: 'DOLAR', label: 'DOLAR', symbol: '$' },
  { key: 'EURO', label: 'EURO', symbol: '€' },
  { key: 'AED', label: 'AED', symbol: 'AED' },
];

export function getLifeSummary(data) {
  const moneyEntries = data?.moneyEntries || [];
  const shoppingItems = data?.shoppingItems || [];
  const debtEntries = data?.debtEntries || [];
  const motorcycle = data?.goals?.motorcycle || {};
  const moveGoal = data?.goals?.antalyaMove || {};

  const incomeTotal = moneyEntries.filter((x) => x.type === 'income').reduce((t, x) => t + toNumber(x.amount), 0);
  const expenseTotal = moneyEntries.filter((x) => x.type === 'expense').reduce((t, x) => t + toNumber(x.amount), 0);
  const savedAmount = Math.max(0, incomeTotal - expenseTotal);
  const savingPartTotal = moneyEntries.reduce((t, x) => t + toNumber(x.savingPartAmount), 0);

  const totalDebt = debtEntries.reduce((t, x) => t + toNumber(x.totalDebt), 0);
  const paidDebt = debtEntries.reduce((t, x) => t + toNumber(x.paidAmount), 0);
  const debtLeft = Math.max(0, totalDebt - paidDebt);

  const shoppingTotal = shoppingItems.reduce((t, x) => t + toNumber(x.estimatedPrice) * Math.max(1, toNumber(x.quantity)), 0);
  const shoppingSaved = shoppingItems.reduce((t, x) => t + toNumber(x.savedAmount), 0);
  const shoppingRemaining = Math.max(0, shoppingTotal - shoppingSaved);
  const manualTargetBudget = toNumber(moveGoal.targetAmount);
  const targetBudget = manualTargetBudget > 0 ? manualTargetBudget : shoppingTotal;
  const targetRemaining = Math.max(0, targetBudget - savedAmount);

  const targetDate = moveGoal.targetDate || '2026-10-31';
  const daysLeft = getDaysLeft(targetDate);
  const gta6Deadline = '2026-11-19';
  const gta6DaysLeft = getDaysLeft(gta6Deadline);

  const weekSummary = getPeriodSummary(moneyEntries, 7);
  const monthSummary = getPeriodSummary(moneyEntries, 30);

  return {
    targetCity: data?.settings?.targetCity || 'Antalya',
    targetAreas: (data?.settings?.targetAreas || []).join(' • '),
    targetDate,
    targetDateText: data?.settings?.targetMoveMonthText || 'Ekim / Kasım 2026',
    preferredDeadlineText: data?.settings?.preferredDeadlineText || 'GTA 6 çıkmadan önce taşınma hedefi',
    daysLeft,
    gta6Deadline,
    gta6DaysLeft,
    targetBudget,
    targetRemaining,
    savedAmount,
    savingPartTotal,
    incomeTotal,
    expenseTotal,
    totalDebt,
    paidDebt,
    debtLeft,
    shoppingTotal,
    shoppingSaved,
    shoppingRemaining,
    shoppingReady: shoppingItems.filter((x) => x.isMoneyReady).length,
    shoppingBought: shoppingItems.filter((x) => x.isPurchasedOrInstalled).length,
    shoppingCount: shoppingItems.length,
    motorcyclePrice: toNumber(motorcycle.estimatedPrice),
    motorcycleSaved: toNumber(motorcycle.savedAmount),
    motorcycleOldSale: toNumber(motorcycle.oldMotorcycleSaleAmount),
    savingPercent: percent(savedAmount, targetBudget),
    debtPercent: percent(paidDebt, totalDebt),
    shoppingPercent: percent(shoppingSaved, shoppingTotal),
    motorcyclePercent: percent(toNumber(motorcycle.savedAmount), toNumber(motorcycle.estimatedPrice)),
    weekSummary,
    monthSummary,
  };
}

export function normalizeCurrency(value) {
  const raw = String(value || '').trim().toUpperCase();
  if (raw === 'TRY' || raw === '₺' || raw === 'TL') return 'TL';
  if (raw === 'USD' || raw === '$' || raw === 'DOLAR') return 'DOLAR';
  if (raw === 'EUR' || raw === '€' || raw === 'EURO') return 'EURO';
  if (raw === 'AED' || raw === 'DIRHAM') return 'AED';
  return 'TL';
}

export function getCurrency(dataOrCurrency) {
  if (typeof dataOrCurrency === 'string') return normalizeCurrency(dataOrCurrency);
  return normalizeCurrency(dataOrCurrency?.settings?.currency);
}

export function formatMoney(value, dataOrCurrency = 'TL') {
  const currency = getCurrency(dataOrCurrency);
  const amount = Math.round(toNumber(value)).toLocaleString('tr-TR');
  if (currency === 'DOLAR') return `${amount} $`;
  if (currency === 'EURO') return `${amount} €`;
  if (currency === 'AED') return `${amount} AED`;
  return `${amount} TL`;
}

export function formatTRY(value) {
  return formatMoney(value, 'TL');
}

function getDaysLeft(dateText) {
  const target = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function getPeriodSummary(entries, dayCount) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayCount + 1);
  const filtered = entries.filter((item) => {
    const date = new Date(item.date || 0);
    return !Number.isNaN(date.getTime()) && date >= start;
  });
  const income = filtered.filter((x) => x.type === 'income').reduce((t, x) => t + toNumber(x.amount), 0);
  const expense = filtered.filter((x) => x.type === 'expense').reduce((t, x) => t + toNumber(x.amount), 0);
  return { income, expense, net: income - expense };
}

function percent(current, target) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
