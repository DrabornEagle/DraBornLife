export function getLifeSummary(data) {
  const moneyEntries = data?.moneyEntries || [];
  const shoppingItems = data?.shoppingItems || [];
  const debtEntries = data?.debtEntries || [];
  const motorcycle = data?.goals?.motorcycle || {};

  const incomeTotal = moneyEntries.filter((x) => x.type === 'income').reduce((t, x) => t + toNumber(x.amount), 0);
  const expenseTotal = moneyEntries.filter((x) => x.type === 'expense').reduce((t, x) => t + toNumber(x.amount), 0);
  const savedAmount = Math.max(0, incomeTotal - expenseTotal);

  const totalDebt = debtEntries.reduce((t, x) => t + toNumber(x.totalDebt), 0);
  const paidDebt = debtEntries.reduce((t, x) => t + toNumber(x.paidAmount), 0);
  const debtLeft = Math.max(0, totalDebt - paidDebt);

  const shoppingTotal = shoppingItems.reduce((t, x) => t + toNumber(x.estimatedPrice) * Math.max(1, toNumber(x.quantity)), 0);
  const targetBudget = toNumber(data?.goals?.antalyaMove?.targetAmount) + shoppingTotal;

  return {
    targetCity: data?.settings?.targetCity || 'Antalya',
    targetAreas: (data?.settings?.targetAreas || []).join(' • '),
    targetDateText: data?.settings?.targetMoveMonthText || 'Ekim / Kasım 2026',
    targetBudget,
    savedAmount,
    incomeTotal,
    expenseTotal,
    totalDebt,
    paidDebt,
    debtLeft,
    shoppingReady: shoppingItems.filter((x) => x.isMoneyReady).length,
    shoppingBought: shoppingItems.filter((x) => x.isPurchasedOrInstalled).length,
    shoppingCount: shoppingItems.length,
    motorcyclePrice: toNumber(motorcycle.estimatedPrice),
    motorcycleSaved: toNumber(motorcycle.savedAmount),
    savingPercent: percent(savedAmount, targetBudget),
    debtPercent: percent(paidDebt, totalDebt),
    motorcyclePercent: percent(toNumber(motorcycle.savedAmount), toNumber(motorcycle.estimatedPrice)),
  };
}

export function formatTRY(value) {
  return `${Math.round(toNumber(value)).toLocaleString('tr-TR')} TL`;
}

function percent(current, target) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
