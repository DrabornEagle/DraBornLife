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
  return {
    ...defaultLifeData,
    ...data,
    settings: {
      ...defaultLifeData.settings,
      ...(data?.settings || {}),
      currentVersionCode: STORAGE_VERSION,
    },
    goals: {
      ...defaultLifeData.goals,
      ...(data?.goals || {}),
      motorcycle: {
        ...defaultLifeData.goals.motorcycle,
        ...(data?.goals?.motorcycle || {}),
      },
    },
    moneyEntries: Array.isArray(data?.moneyEntries) ? data.moneyEntries : [],
    shoppingItems: Array.isArray(data?.shoppingItems) ? data.shoppingItems : defaultLifeData.shoppingItems,
    debtEntries: Array.isArray(data?.debtEntries) ? data.debtEntries : [],
  };
}
