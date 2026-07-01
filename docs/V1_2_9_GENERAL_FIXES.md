# DraBornLife v1.2.9 Genel Hata Düzeltmeleri ve Küçük UX Rötuşları

## Hedef

v1.2.9, v1.2 kapanışından önce sürüm tutarsızlıklarını ve küçük UX kayıtlarını toparlama adımıdır.

## Yapılanlar

- Yedek branch alındı: `backup-129`.
- Uygulama içi sürüm etiketi senkronlandı.
- `package.json` sürümü senkronlandı.
- `app.config.js` sürümü senkronlandı.
- Android `versionCode` 58 olarak korundu.
- APK build süreci başlatılmadı.
- v1.2 roadmap dosyası güncellendi.
- README güncellendi.
- v1.2.8 durum tutarsızlığı giderildi.
- Sıradaki adım v1.2.10 kapanışı olarak işaretlendi.

## Güncellenen dosyalar

- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `docs/V1_2_NEXT_VERSION_PLAN.md`
- `README.md`
- `docs/V1_2_9_GENERAL_FIXES.md`

## Expo Go kontrol listesi

- [ ] Ana ekranda sürüm etiketi v1.2.9 görünüyor.
- [ ] Ayarlar ekranında sürüm etiketi v1.2.9 görünüyor.
- [ ] Alt menü ikonları düzgün görünüyor.
- [ ] Ana sayfadaki kritik tarih kartları düzgün görünüyor.
- [ ] Yedek merkezi açılıyor.
- [ ] Borç ödeme planı açılıyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-9-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-9-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.9 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.2.10 - v1.2 kapanışı
```
