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
    healthReport: getDataHealthReport(lifeData),
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
    const isCompatible = versionText.startsWith('v0.1') || versionText.startsWith('v0.2') || versionText.startsWith('v0.3') || versionText.startsWith('v0.4') || versionText.startsWith('v0.5') || versionText.startsWith('v1.0') || versionText.startsWith('v1.1') || versionText.startsWith('v1.2') || versionText.startsWith('v1.3');
    const versionWarning = isCompatible ? '' : `Yedek sürümü farklı görünüyor: ${backupVersion}. Veri yapısı uygunsa yine de yüklenebilir.`;
    const scope = Array.isArray(parsed.backupScope) ? parsed.backupScope : [];
    const stats = parsed.backupSummary || getBackupStats(parsed.data);
    const createdAt = parsed.createdAt || 'bilinmiyor';
    const health = parsed.healthReport || getDataHealthReport(parsed.data);

    if (health.errorCount > 0) {
      return { ok: false, error: `Yedek doğrulaması başarısız. ${health.errorCount} kritik sorun bulundu: ${health.errors.slice(0, 3).join(' | ')}` };
    }

    return { ok: true, data: parsed.data, backupVersion, versionWarning, scope, stats, createdAt, health };
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

export function getDataHealthReport(data) {
  const errors = [];
  const warnings = [];
  const arrays = ['yearlyPlans', 'lifePlans', 'homeSetupRooms', 'activities', 'beaches', 'regionNotes', 'customGoals', 'moneyEntries', 'shoppingItems', 'debtEntries'];
  arrays.forEach((key) => { if (data?.[key] && !Array.isArray(data[key])) errors.push(`${key} liste formatında değil.`); });

  checkList(data?.yearlyPlans, 'Yıllık hedef', errors, warnings, ['title'], ['estimatedBudget', 'savedAmount']);
  checkList(data?.customGoals, 'Özel hedef', errors, warnings, ['title'], ['estimatedBudget', 'savedAmount']);
  checkList(data?.moneyEntries, 'Para kaydı', errors, warnings, ['title', 'type'], ['amount', 'savingPartAmount']);
  checkList(data?.shoppingItems, 'Alınacak kalem', errors, warnings, ['title'], ['estimatedPrice', 'savedAmount', 'quantity']);
  checkList(data?.debtEntries, 'Borç kaydı', errors, warnings, ['title'], ['totalDebt', 'paidAmount']);
  checkList(data?.activities, 'Aktivite', errors, warnings, ['title'], ['estimatedPrice', 'savedAmount']);
  checkHomeRooms(data?.homeSetupRooms, errors, warnings);

  const stats = getBackupStats(data);
  if (stats.totalRecords === 0) warnings.push('Yedek içinde kayıt yok. Bu ilk kurulumsa normal olabilir.');
  if (!data?.settings || typeof data.settings !== 'object') warnings.push('Ayarlar alanı eksik görünüyor. Varsayılan ayarlar kullanılabilir.');
  if (!data?.goals || typeof data.goals !== 'object') warnings.push('Ana hedefler alanı eksik görünüyor. Varsayılan hedefler kullanılabilir.');

  return { ok: errors.length === 0, errorCount: errors.length, warningCount: warnings.length, errors, warnings, stats };
}

function checkList(list, label, errors, warnings, requiredFields, numberFields) {
  if (!Array.isArray(list)) return;
  list.forEach((item, index) => {
    requiredFields.forEach((field) => { if (!String(item?.[field] || '').trim()) warnings.push(`${label} #${index + 1}: ${field} eksik.`); });
    numberFields.forEach((field) => { const value = item?.[field]; if (value !== undefined && value !== '' && n(value) < 0) errors.push(`${label} #${index + 1}: ${field} negatif olamaz.`); });
  });
}

function checkHomeRooms(rooms, errors, warnings) {
  if (!Array.isArray(rooms)) return;
  rooms.forEach((room, roomIndex) => {
    if (!String(room?.title || '').trim()) warnings.push(`Ev odası #${roomIndex + 1}: başlık eksik.`);
    if (room?.items && !Array.isArray(room.items)) errors.push(`Ev odası #${roomIndex + 1}: eşya listesi hatalı.`);
    (room?.items || []).forEach((item, itemIndex) => {
      if (!String(item?.title || '').trim()) warnings.push(`Ev odası #${roomIndex + 1} eşya #${itemIndex + 1}: başlık eksik.`);
      if (item?.estimatedPrice !== undefined && n(item.estimatedPrice) < 0) errors.push(`Ev odası #${roomIndex + 1} eşya #${itemIndex + 1}: fiyat negatif olamaz.`);
    });
  });
}

function n(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
