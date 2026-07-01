# DraBornLife v1.3.9 Genel Test ve Hata Düzeltmeleri

## Hedef

v1.3 kapanışından önce kalan sürüm tutarsızlıklarını, test notlarını ve küçük genel kontrolleri toparlamak.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b139
```

## Yapılanlar

- Uzun süredir eski kalan `app.config.js` sürümü düzeltildi.
- `app.config.js` version değeri 1.3.9 yapıldı.
- `app.config.js` extra.statusCode değeri v1.3.9 yapıldı.
- Android versionCode 58 olarak korundu.
- `src/config/appVersion.js` v1.3.9 yapıldı.
- `package.json` 1.3.9 yapıldı.
- APK build başlatılmadı.
- v1.3.9 genel test kontrol listesi oluşturuldu.

## Genel Expo Go test listesi

- [ ] Ana sayfa açılıyor.
- [ ] Bugünün Önceliği kartı görünüyor.
- [ ] Alt menü tüm sekmelerde çalışıyor.
- [ ] Para ekranında hızlı işlem şablonları çalışıyor.
- [ ] Liste ekranında oda bağlantısı çalışıyor.
- [ ] Özel hedef eklenince yıl ekranına yansıyor.
- [ ] Ayarlar ekranında veri sağlığı paneli görünüyor.
- [ ] Yedek dışa aktar metni oluşuyor.
- [ ] Hatalı yedek içe aktarımı engelleniyor.
- [ ] Progress kartlarında yazılar taşmıyor.
- [ ] APK build denenmedi.

## Güncellenen dosyalar

- `app.config.js`
- `src/config/appVersion.js`
- `package.json`
- `docs/V1_3_9_GENERAL_TEST_FIXES.md`

## Sonraki adım

```text
v1.3.10 - v1.3 kapanışı
```

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-9-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-9-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.9 için lokal yedek bulunamadı."
```
