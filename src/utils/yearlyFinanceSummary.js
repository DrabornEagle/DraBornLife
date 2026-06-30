export function getYearlyFinanceSummary(lifeData, selectedYear) {
  const year = Number(selectedYear || lifeData?.settings?.selectedYear || 2026);
  const moneyEntries = Array.isArray(lifeData?.moneyEntries) ? lifeData.moneyEntries : [];
  const yearlyPlans = Array.isArray(lifeData?.yearlyPlans) ? lifeData.yearlyPlans : [];
  const shoppingItems = Array.isArray(lifeData?.shoppingItems) ? lifeData.shoppingItems : [];
  const debtEntries = Array.isArray(lifeData?.debtEntries) ? lifeData.debtEntries : [];
  const customGoals = Array.isArray(lifeData?.customGoals) ? lifeData.customGoals : [];

  const yearEntries = moneyEntries.filter((item) => entryYear(item.date) === year);
  const income = yearEntries.filter((item) => item.type === 'income').reduce((sum, item) => sum + n(item.amount), 0);
  const expense = yearEntries.filter((item) => item.type === 'expense').reduce((sum, item) => sum + n(item.amount), 0);
  const savingPart = yearEntries.reduce((sum, item) => sum + n(item.savingPartAmount), 0);
  const net = income - expense;

  const plans = yearlyPlans.filter((plan) => Number(plan.year) === year);
  const targetBudget = plans.reduce((sum, plan) => sum + n(plan.estimatedBudget), 0);
  const targetSaved = plans.reduce((sum, plan) => sum + n(plan.savedAmount), 0);
  const yearlyAvailable = Math.max(0, net + targetSaved + savingPart);
  const remaining = Math.max(0, targetBudget - yearlyAvailable);
  const progress = percent(yearlyAvailable, targetBudget);

  const shoppingTotal = shoppingItems.reduce((sum, item) => sum + n(item.estimatedPrice) * Math.max(1, n(item.quantity) || 1), 0);
  const shoppingSaved = shoppingItems.reduce((sum, item) => sum + n(item.savedAmount), 0);
  const debtTotal = debtEntries.reduce((sum, item) => sum + n(item.totalDebt), 0);
  const debtPaid = debtEntries.reduce((sum, item) => sum + n(item.paidAmount), 0);
  const customGoalTotal = customGoals.reduce((sum, item) => sum + n(item.estimatedBudget), 0);
  const customGoalSaved = customGoals.reduce((sum, item) => sum + n(item.savedAmount), 0);

  return {
    year,
    income,
    expense,
    net,
    savingPart,
    targetBudget,
    targetSaved,
    yearlyAvailable,
    remaining,
    progress,
    planCount: plans.length,
    completedPlanCount: plans.filter((plan) => plan.status === 'done' || plan.status === 'completed').length,
    shoppingTotal,
    shoppingSaved,
    shoppingRemaining: Math.max(0, shoppingTotal - shoppingSaved),
    debtTotal,
    debtPaid,
    debtRemaining: Math.max(0, debtTotal - debtPaid),
    customGoalTotal,
    customGoalSaved,
    customGoalRemaining: Math.max(0, customGoalTotal - customGoalSaved),
  };
}

function entryYear(dateText) {
  const parsed = new Date(dateText || '');
  if (Number.isNaN(parsed.getTime())) return 0;
  return parsed.getFullYear();
}

function percent(current, target) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function n(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
