# DraBornLife v1.0.6 Ayarlar / Yedek / Test Merkezi Yeni Tasarım

## Sürüm hedefi

v1.0.6 ile Ayarlar, Yedek ve Test Merkezi tarafı daha sade, okunur ve v1.0 sahil temasına uyumlu hale getirildi.

Bu sürüm APK build süreci değildir. Geliştirme ve kontrol akışı Expo Go üzerinden devam eder.

## Yapılan değişiklikler

- `backup-v1.0.6` yedek branch'i alındı.
- Test Merkezi koyu eski görünümden çıkarıldı.
- Test Merkezi arka planı v1.0 açık sahil temasına alındı.
- Test Merkezi metinleri Türkçe karakterli hale getirildi.
- Test Merkezi hero alanı daha okunur hale getirildi.
- Test Merkezi özet kartları sadeleştirildi.
- Test satırlarında emoji yerine daha açık `Tamam`, `Uyarı`, `Hata` işaretleri kullanıldı.
- Ayarlar ekranındaki v1.0.5 kart yapısı korundu.
- Ayarlar ekranındaki para birimi seçimi korunmaya devam ediyor.
- Yedek / dışa aktar / içe aktar kartları mevcut güvenli yapı ile devam ediyor.
- Ana özet kartında v1.0.6 durum metni güncellendi.
- Uygulama sürüm kodu v1.0.6 yapıldı.
- Varsayılan veri sürümü v1.0.6 yapıldı.
- README dosyasında v1.0.6 Done, v1.0.7 Next olarak güncellendi.

## Güncellenen dosyalar

- `src/screens/TestCenterScreen.js`
- `src/components/HomeFinalSummaryCard.js`
- `src/config/appVersion.js`
- `src/data/defaultLifeData.js`
- `package.json`
- `app.config.js`
- `README.md`
- `docs/V1_0_6_SETTINGS_BACKUP_TEST_CENTER.md`

## APK kararı

- APK alınmadı.
- APK build başlatılmadı.
- `android.versionCode` korunmuştur.
- `apkBuildMode: 'manual-only'` korunmuştur.
- `apkBuildAllowed: false` korunmuştur.

## Expo Go kontrol listesi

- [ ] Uygulama Expo Go ile açılıyor.
- [ ] Ayarlar ekranı açılıyor.
- [ ] Para birimi seçici ayarlarda görünüyor.
- [ ] Hedef ayarları kaydedilebiliyor.
- [ ] Dışa aktar kartı görünüyor.
- [ ] Yedek metni oluşturulabiliyor.
- [ ] İçe aktar kartı görünüyor.
- [ ] Test Merkezi açılıyor.
- [ ] Test Merkezi metinleri Türkçe karakterli görünüyor.
- [ ] Test Merkezi kartları açık tema ile okunur görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.6-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.6-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.6 için lokal yedek bulunamadı."
```

## v1.0.6 kapanış kriteri

- [x] v1.0.6 öncesi yedek branch alındı.
- [x] Test Merkezi yeni tema ile düzenlendi.
- [x] Test Merkezi Türkçe karakterli hale getirildi.
- [x] Ayarlar / yedek mevcut kart yapısı korundu.
- [x] Sürüm kodu v1.0.6 olarak güncellendi.
- [x] README v1.0.7 sıradaki adım olacak şekilde güncellendi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```bash
v1.0.7 - Genel tema, boş durumlar, kartlar, yazı boyutları
```

v1.0.7 ile ekranlar arası görsel tutarlılık, boş durum kartları, ortak kart tasarımı ve yazı boyutları toparlanacak. APK build süreci yine başlatılmayacak.
