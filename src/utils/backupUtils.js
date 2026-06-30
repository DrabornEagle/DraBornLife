import { APP_STATUS_CODE } from '../config/appVersion';

export const BACKUP_VERSION = APP_STATUS_CODE;

export const BACKUP_SCOPE = [
  'settings',
  'goals',
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
    warning: 'Bu metni sakla. Yeni telefonda Ayarlar > Ice aktar alanina yapistirarak geri yukleyebilirsin.',
    data: lifeData,
  };

  return JSON.stringify(backup, null, 2);
}

export function parseBackupText(text) {
  if (!text || !text.trim()) {
    return { ok: false, error: 'Yedek alani bos. Daha once olusturdugun DraBornLife yedek metnini buraya yapistirmalisin.' };
  }

  try {
    const parsed = JSON.parse(text);

    if (parsed?.backupApp !== 'DraBornLife') {
      return { ok: false, error: 'Bu metin DraBornLife yedegi gibi gorunmuyor. backupApp alani bulunamadi veya farkli.' };
    }

    if (!parsed?.data || typeof parsed.data !== 'object') {
      return { ok: false, error: 'Yedek icinde geri yuklenecek veri bulunamadi.' };
    }

    const backupVersion = parsed.backupVersion || 'bilinmiyor';
    const versionText = String(backupVersion);
    const isCompatible = versionText.startsWith('v0.1') || versionText.startsWith('v0.2') || versionText.startsWith('v0.3');
    const versionWarning = isCompatible ? '' : `Yedek surumu farkli gorunuyor: ${backupVersion}. Veri yapisi uygunsa yine de yuklenebilir.`;
    const scope = Array.isArray(parsed.backupScope) ? parsed.backupScope : [];

    return { ok: true, data: parsed.data, backupVersion, versionWarning, scope };
  } catch (error) {
    return { ok: false, error: 'Yedek metni okunamadi. Metnin tamamini kopyaladigindan ve JSON formatinin bozulmadigindan emin ol.' };
  }
}
