import { APP_STATUS_CODE } from '../config/appVersion';

export const BACKUP_VERSION = APP_STATUS_CODE;

export function createBackupText(lifeData) {
  const backup = {
    backupApp: 'DraBornLife',
    backupVersion: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    data: lifeData,
  };

  return JSON.stringify(backup, null, 2);
}

export function parseBackupText(text) {
  if (!text || !text.trim()) {
    return { ok: false, error: 'Yedek metni boş.' };
  }

  try {
    const parsed = JSON.parse(text);

    if (parsed?.backupApp !== 'DraBornLife') {
      return { ok: false, error: 'Bu dosya/metin DraBornLife yedeği gibi görünmüyor.' };
    }

    if (!parsed?.data || typeof parsed.data !== 'object') {
      return { ok: false, error: 'Yedek içinde veri bulunamadı.' };
    }

    return { ok: true, data: parsed.data };
  } catch (error) {
    return { ok: false, error: 'Yedek metni okunamadı. JSON formatı bozuk olabilir.' };
  }
}
