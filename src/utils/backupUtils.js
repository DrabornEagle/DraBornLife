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
  'customGoals',
  'moneyEntries',
  'shoppingItems',
  'debtEntries',
];

export function createBackupText(lifeData) {
  const backup = {
    backupApp: 'DraBornLife',
    backupTitle: `DraBornLife Manuel Yedek - ${BACKUP_VERSION}`,
    backupVersion: BACKUP_VERSION,
    backupScope: BACKUP_SCOPE,
    createdAt: new Date().toISOString(),
    warning: 'Bu metni sakla. Yeni telefonda Ayarlar > İçe aktar alanına yapıştırarak geri yükleyebilirsin.',
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
    const isCompatible = versionText.startsWith('v0.1') || versionText.startsWith('v0.2') || versionText.startsWith('v0.3') || versionText.startsWith('v0.4') || versionText.startsWith('v0.5') || versionText.startsWith('v1.0');
    const versionWarning = isCompatible ? '' : `Yedek sürümü farklı görünüyor: ${backupVersion}. Veri yapısı uygunsa yine de yüklenebilir.`;
    const scope = Array.isArray(parsed.backupScope) ? parsed.backupScope : [];

    return { ok: true, data: parsed.data, backupVersion, versionWarning, scope };
  } catch (error) {
    return { ok: false, error: 'Yedek metni okunamadı. Metnin tamamını kopyaladığından ve JSON formatının bozulmadığından emin ol.' };
  }
}
