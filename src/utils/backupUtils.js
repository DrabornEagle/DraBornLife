import { APP_STATUS_CODE } from '../config/appVersion';

export const BACKUP_VERSION = APP_STATUS_CODE;

export const BACKUP_SCOPE = [
  'settings',
  'goals',
  'yearlyPlans',
  'lifePlans',
  'homeSetupRooms',
  'activities',
  'beaches',
  'regionNotes',
  'customGoals',
  'moneyEntries',
  'shoppingItems',
  'debtEntries',
];

export function createBackupText(lifeData) {
  const createdAt = new Date().toISOString();
  const backup = {
    backupApp: 'DraBornLife',
    backupTitle: `DraBornLife Manuel Yedek - ${BACKUP_VERSION}`,
    backupVersion: BACKUP_VERSION,
    createdAt,
    backupScope: BACKUP_SCOPE,
    backupSummary: getBackupStats(lifeData),
    restoreWarning: 'Geri yükleme mevcut cihazdaki lokal verinin üstüne yazar. Emin değilsen önce mevcut verini dışa aktar.',
    storageMode: 'local-only',
    data: lifeData,
  };

  return JSON.stringify(backup, null, 2);
}

export function parseBackupText(text) {
  if (!text || !text.trim()) {
    return { ok: false, error: 'Yedek alanı boş. Daha önce oluşturduğun DraBornLife yedek metnini buraya yapıştırmalısın.' };
  }

  try {
    const parsed = JSON.parse(text);

    if (parsed?.backupApp !== 'DraBornLife') {
      return { ok: false, error: 'Bu metin DraBornLife yedeği gibi görünmüyor. backupApp alanı bulunamadı veya farklı.' };
    }

    if (!parsed?.data || typeof parsed.data !== 'object') {
      return { ok: false, error: 'Yedek içinde geri yüklenecek veri bulunamadı.' };
    }

    const backupVersion = parsed.backupVersion || 'bilinmiyor';
    const versionText = String(backupVersion);
    const isCompatible = versionText.startsWith('v0.1') || versionText.startsWith('v0.2') || versionText.startsWith('v0.3') || versionText.startsWith('v0.4') || versionText.startsWith('v0.5') || versionText.startsWith('v1.0') || versionText.startsWith('v1.1') || versionText.startsWith('v1.2');
    const versionWarning = isCompatible ? '' : `Yedek sürümü farklı görünüyor: ${backupVersion}. Veri yapısı uygunsa yine de yüklenebilir.`;
    const scope = Array.isArray(parsed.backupScope) ? parsed.backupScope : [];
    const stats = parsed.backupSummary || getBackupStats(parsed.data);
    const createdAt = parsed.createdAt || 'bilinmiyor';

    return { ok: true, data: parsed.data, backupVersion, versionWarning, scope, stats, createdAt };
  } catch (error) {
    return { ok: false, error: 'Yedek metni okunamadı. Metnin tamamını kopyaladığından ve JSON formatının bozulmadığından emin ol.' };
  }
}

export function getBackupStats(data) {
  const count = (x) => Array.isArray(x) ? x.length : 0;
  const stats = {
    yearlyPlans: count(data?.yearlyPlans),
    lifePlans: count(data?.lifePlans),
    homeSetupRooms: count(data?.homeSetupRooms),
    activities: count(data?.activities),
    beaches: count(data?.beaches),
    regionNotes: count(data?.regionNotes),
    customGoals: count(data?.customGoals),
    moneyEntries: count(data?.moneyEntries),
    shoppingItems: count(data?.shoppingItems),
    debtEntries: count(data?.debtEntries),
  };
  return { ...stats, totalRecords: Object.values(stats).reduce((a, b) => a + b, 0) };
}
