# DraBornLife v1.3.7 Veri Sağlık Kontrolü ve Yedek Doğrulama

## Hedef

Lokal verinin temel tutarlılığını kontrol etmek ve yedek içe aktarımından önce kritik veri sorunlarını yakalamak.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b137
```

## Yapılanlar

- `backupUtils.js` içine `getDataHealthReport` eklendi.
- Yedek JSON içine `healthReport` eklendi.
- Yedek içe aktarılırken veri sağlık raporu çalıştırılıyor.
- Kritik hata varsa geri yükleme engelleniyor.
- v1.3 yedekleri uyumlu sürüm olarak kabul ediliyor.
- Liste olması gereken alanlar kontrol ediliyor.
- Negatif sayı alanları kritik hata olarak yakalanıyor.
- Eksik başlıklar uyarı olarak gösteriliyor.
- Ayarlar ekranına `Veri sağlığı` paneli eklendi.
- Veri sağlığı panelinde hata ve uyarı sayıları gösteriliyor.
- İlk hata ve uyarılar kullanıcıya okunur şekilde gösteriliyor.
- `package.json` sürümü 1.3.7 yapıldı.
- `src/config/appVersion.js` sürümü v1.3.7 yapıldı.

## Kontrol edilen alanlar

- yearlyPlans
- lifePlans
- homeSetupRooms
- activities
- beaches
- regionNotes
- customGoals
- moneyEntries
- shoppingItems
- debtEntries

## Not

`app.config.js` eski değer gösterebilir. Android versionCode değişmedi. APK build başlatılmadı.

## Güncellenen dosyalar

- `src/utils/backupUtils.js`
- `src/screens/SettingsScreenFixed.js`
- `package.json`
- `src/config/appVersion.js`
- `docs/V1_3_7_DATA_HEALTH_BACKUP_VALIDATION.md`

## Expo Go kontrol listesi

- [ ] Ayarlar ekranı açılıyor.
- [ ] Veri sağlığı paneli görünüyor.
- [ ] Kritik hata sayısı görünüyor.
- [ ] Uyarı sayısı görünüyor.
- [ ] Yedek metni oluşturuluyor.
- [ ] Yedek içinde healthReport var.
- [ ] Hatalı JSON içe aktarılınca hata veriyor.
- [ ] Negatif sayı içeren yedek engelleniyor.
- [ ] Sağlıklı yedek geri yükleniyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-7-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-7-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.7 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.8 - Tasarım mikro düzeltmeleri
```
