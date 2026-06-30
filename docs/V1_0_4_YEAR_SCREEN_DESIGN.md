# DraBornLife v1.0.4 Yıl Ekranı Yeni Tasarım

## Sürüm hedefi

v1.0.4 ile yıl ekranı daha sade, okunur, hedef odaklı ve v1.0 sahil temasına uyumlu hale getirildi.

Bu sürüm APK build süreci değildir. Geliştirme ve kontrol akışı Expo Go üzerinden devam eder.

## Yapılan değişiklikler

- Yıl ekranı arka planı v1.0 ferah sahil temasına alındı.
- Üst hero alanı yenilendi.
- Seçili yıl için ayrı yıl rozeti eklendi.
- Hedef sayısı ve ilerleme oranı hero alanında daha okunur hale getirildi.
- Yıl seçme paneli daha açıklayıcı yapıldı.
- Özet kartları daha sade ve okunur hale getirildi.
- Hedef formundaki yazılar Türkçe karakterli hale getirildi.
- Hedef tipi seçenekleri kullanıcıya Türkçe gösteriliyor.
- Hedef durumları Türkçe karakterli hale getirildi.
- Boş hedef durumu için daha sıcak bir boş ekran mesajı eklendi.
- Ana sayfadaki sıradaki adım notu v1.0.5 olarak güncellendi.

## Güncellenen dosyalar

- `src/screens/YearPlanScreen.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `src/screens/HomeScreen.js`
- `src/components/HomeFinalSummaryCard.js`
- `README.md`
- `docs/V1_0_4_YEAR_SCREEN_DESIGN.md`

## APK kararı

- APK alınmadı.
- APK build başlatılmadı.
- `android.versionCode` korunmuştur.
- `apkBuildMode: 'manual-only'` korunmuştur.
- `apkBuildAllowed: false` korunmuştur.

## Expo Go kontrol listesi

- [ ] Uygulama Expo Go ile açılıyor.
- [ ] Yıl ekranı açılıyor.
- [ ] Üst hero alanı okunur görünüyor.
- [ ] Yıl rozeti düzgün görünüyor.
- [ ] Yıl seçme chipleri rahat tıklanıyor.
- [ ] Hedef formu düzgün çalışıyor.
- [ ] Hedef ekleme çalışıyor.
- [ ] Hedef düzenleme çalışıyor.
- [ ] Hedef silme çalışıyor.
- [ ] Durum değiştirme chipleri çalışıyor.
- [ ] Türkçe karakterler doğru görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.4-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.4-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.4 için lokal yedek bulunamadı."
```

## v1.0.4 kapanış kriteri

- [x] v1.0.4 öncesi yedek branch alındı.
- [x] Yıl ekranı tasarımı yenilendi.
- [x] Yıl ekranı metinleri Türkçe karakterli hale getirildi.
- [x] Boş hedef durumu eklendi.
- [x] Uygulama durum kodu v1.0.4 olarak güncellendi.
- [x] README v1.0.5 sıradaki adım olacak şekilde güncellendi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```bash
v1.0.5 - Para / Borç / Liste ekranları yeni tasarım
```

v1.0.5 ile para, borç ve liste ekranları daha sade, okunur ve aynı sahil temasına uyumlu hale getirilecek. APK build süreci yine başlatılmayacak.
