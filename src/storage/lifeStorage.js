import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultLifeData, STORAGE_VERSION } from '../data/defaultLifeData';

const LIFE_DATA_KEY = '@DraBornLife:lifeData';

export async function loadLifeData() {
  try {
    const rawValue = await AsyncStorage.getItem(LIFE_DATA_KEY);
    if (!rawValue) {
      await saveLifeData(defaultLifeData);
      return defaultLifeData;
    }
    const parsedValue = JSON.parse(rawValue);
    return normalizeLifeData(parsedValue);
  } catch (error) {
    console.warn('DraBornLife local data could not be loaded.', error);
    return defaultLifeData;
  }
}

export async function saveLifeData(nextData) {
  const payload = normalizeLifeData(nextData);
  await AsyncStorage.setItem(LIFE_DATA_KEY, JSON.stringify(payload));
  return payload;
}

export async function resetLifeData() {
  await AsyncStorage.setItem(LIFE_DATA_KEY, JSON.stringify(defaultLifeData));
  return defaultLifeData;
}

export function normalizeLifeData(data) {
  const source = data || {};
  const selectedYear = toPositiveYear(source.settings?.selectedYear, defaultLifeData.settings.selectedYear);

  return {
    ...defaultLifeData,
    ...source,
    settings: {
      ...defaultLifeData.settings,
      ...(source.settings || {}),
      selectedYear,
      currentVersionCode: STORAGE_VERSION,
    },
    goals: {
      ...defaultLifeData.goals,
      ...(source.goals || {}),
      antalyaMove: {
        ...defaultLifeData.goals.antalyaMove,
        ...(source.goals?.antalyaMove || {}),
      },
      motorcycle: {
        ...defaultLifeData.goals.motorcycle,
        ...(source.goals?.motorcycle || {}),
      },
    },
    yearlyPlans: normalizeYearlyPlans(source.yearlyPlans),
    lifePlans: {
      ...defaultLifeData.lifePlans,
      ...(source.lifePlans || {}),
      homeSetup: {
        ...defaultLifeData.lifePlans.homeSetup,
        ...(source.lifePlans?.homeSetup || {}),
      },
      familyActivities: {
        ...defaultLifeData.lifePlans.familyActivities,
        ...(source.lifePlans?.familyActivities || {}),
      },
      antalyaFun: {
        ...defaultLifeData.lifePlans.antalyaFun,
        ...(source.lifePlans?.antalyaFun || {}),
      },
    },
    homeSetupRooms: normalizeRooms(source.homeSetupRooms),
    activities: Array.isArray(source.activities) ? source.activities : defaultLifeData.activities,
    beaches: Array.isArray(source.beaches) ? source.beaches : defaultLifeData.beaches,
    customGoals: Array.isArray(source.customGoals) ? source.customGoals : defaultLifeData.customGoals,
    moneyEntries: Array.isArray(source.moneyEntries) ? source.moneyEntries : [],
    shoppingItems: Array.isArray(source.shoppingItems) ? source.shoppingItems : defaultLifeData.shoppingItems,
    debtEntries: Array.isArray(source.debtEntries) ? source.debtEntries : [],
  };
}

function normalizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return defaultLifeData.homeSetupRooms;
  }

  return rooms.map((room) => ({
    id: room.id || `room_${Date.now()}`,
    title: room.title || 'Oda',
    isCore: room.isCore ?? false,
    items: Array.isArray(room.items) ? room.items : [],
  }));
}

function normalizeYearlyPlans(yearlyPlans) {
  if (!Array.isArray(yearlyPlans) || yearlyPlans.length === 0) {
    return defaultLifeData.yearlyPlans;
  }

  return yearlyPlans.map((plan) => {
    const year = toPositiveYear(plan.year, defaultLifeData.settings.selectedYear);
    return {
      id: plan.id || `year_${year}_${Date.now()}`,
      year,
      title: plan.title || `${year} hedefi`,
      goalType: plan.goalType || 'diger',
      country: plan.country || '',
      city: plan.city || '',
      area: plan.area || '',
      targetMonth: plan.targetMonth || '',
      targetDate: plan.targetDate || '',
      estimatedBudget: toNumber(plan.estimatedBudget),
      savedAmount: toNumber(plan.savedAmount),
      status: plan.status || 'planned',
      note: plan.note || '',
    };
  });
}

function toPositiveYear(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 2020) return fallback;
  return Math.round(parsed);
}

function toNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
