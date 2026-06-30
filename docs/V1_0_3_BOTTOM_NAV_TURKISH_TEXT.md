# DraBornLife v1.0.3 Alt Menü ve Türkçe Karakter Düzeltmesi

## Sürüm hedefi

v1.0.3 ile alt menü / navigasyon tasarımı yenilendi ve ana ekranda görünen metinlerde Türkçe karakter düzeltmesi yapıldı.

Bu sürüm APK build süreci değildir. Geliştirme ve kontrol akışı Expo Go üzerinden devam eder.

## Yapılan değişiklikler

- Alt menü daha kompakt ve modern hale getirildi.
- Eski büyük sekme yapısı yerine daha sade ikon balonları kullanıldı.
- Alt menü üstüne aktif bölüm bilgisi eklendi.
- `Life` sekmesi Türkçe karşılıkla `Yaşam` yapıldı.
- Menü başlığı `DraBornLife Menü` olarak düzenlendi.
- Ana sayfadaki eksik Türkçe karakterli metinler düzeltildi.
- Home summary kartı v1.0.3 durumuna göre güncellendi.
- Yıllık finans panelindeki metinler Türkçe karakterli hale getirildi.
- Ana sayfanın sıradaki adımı v1.0.4 yıl ekranı olarak güncellendi.

## Türkçe karakter düzeltme örnekleri

- `Tasinma` -> `Taşınma`
- `butce` -> `bütçe`
- `gun` -> `gün`
- `icin` -> `için`
- `bolge` -> `bölge`
- `tasarim` -> `tasarım`
- `borc` -> `borç`
- `alinacaklar` -> `alınacaklar`
- `ozet` -> `özet`
- `Yillik` -> `Yıllık`

## Güncellenen dosyalar

- `App.js`
- `src/screens/HomeScreen.js`
- `src/components/HomeFinalSummaryCard.js`
- `src/components/YearFinancePanel.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `README.md`
- `docs/V1_0_3_BOTTOM_NAV_TURKISH_TEXT.md`

## APK kararı

- APK alınmadı.
- APK build başlatılmadı.
- `android.versionCode` korunmuştur.
- `apkBuildMode: 'manual-only'` korunmuştur.
- `apkBuildAllowed: false` korunmuştur.

## Expo Go kontrol listesi

- [ ] Uygulama Expo Go ile açılıyor.
- [ ] Alt menü daha kompakt görünüyor.
- [ ] Aktif sekme net anlaşılıyor.
- [ ] `Yaşam`, `Yıl`, `Borç`, `Ayar` gibi sekme yazıları düzgün görünüyor.
- [ ] Ana sayfada `Taşınma`, `bütçe`, `gün`, `için`, `özet` gibi Türkçe karakterler doğru görünüyor.
- [ ] Ana sayfa scroll akışı bozulmadı.
- [ ] Büyük ilerleme kartları okunuyor.
- [ ] Yıllık finans panelinde Türkçe karakterler doğru görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.3-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.3-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.3 için lokal yedek bulunamadı."
```

## v1.0.3 kapanış kriteri

- [x] v1.0.3 öncesi yedek branch alındı.
- [x] Alt menü tasarımı yenilendi.
- [x] Alt menü yazıları Türkçeleştirildi.
- [x] Ana sayfa görünen metinlerinde Türkçe karakter düzeltmesi yapıldı.
- [x] Yıllık finans panelinde Türkçe karakter düzeltmesi yapıldı.
- [x] Uygulama durum kodu v1.0.3 olarak güncellendi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```bash
v1.0.4 - Yıl ekranı yeni tasarım
```

v1.0.4 ile yıl ekranı daha sade, okunur ve hedef odaklı hale getirilecek. APK build süreci yine başlatılmayacak.
