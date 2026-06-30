# DraBornLife v1.0.5 Para Birimi ve Kartlı Ekran Düzeni

## Sürüm hedefi

v1.0.5 ile para birimi sistemi eklendi, kullanıcıya görünen para birimi `TRY` yerine `TL` yapıldı ve para / borç / alınacaklar ekranları daha anlaşılır kart yapısına alındı.

Bu sürüm APK build süreci değildir. Geliştirme ve kontrol akışı Expo Go üzerinden devam eder.

## Para birimi kararı

Kullanıcıya görünen ana para birimi artık `TRY` değil `TL` olarak gösterilir.

Seçilebilir para birimleri:

- TL
- DOLAR
- EURO
- AED

Not: Bu sürümde para birimi seçimi ekrandaki gösterim etiketini değiştirir. Otomatik kur çevirisi yapılmaz. Tutarların kendisi aynı kalır.

## Yapılan değişiklikler

- Ortak para birimi yardımcıları eklendi.
- `TRY` eski kayıtları otomatik `TL` olarak normalize edilir.
- Ortak `CurrencySelector` bileşeni eklendi.
- Para ekranına para birimi seçici eklendi.
- Borç ekranına para birimi seçici eklendi.
- Alınacaklar / Liste ekranına para birimi seçici eklendi.
- Ayarlar ekranında para birimi seçici eklendi ve hedef kaydederken para biriminin `TRY` olarak sıfırlanması engellendi.
- Ana sayfa ve özet kartlarında seçili para birimine göre gösterim başlatıldı.
- Özel hedeflerde seçili para birimine göre gösterim başlatıldı.
- Yıl finans panelinde seçili para birimine göre gösterim başlatıldı.
- Para ekranı: Finans özeti, yeni kayıt, filtreler ve son işlemler kartlara ayrıldı.
- Borç ekranı: Borç özeti, yeni borç formu ve borç kartları ayrıldı.
- Alınacaklar ekranı: Liste özeti, yeni kalem formu, filtreler ve liste kartları ayrıldı.
- Yedek mesajlarında Türkçe karakter düzeltmesi yapıldı.
- Varsayılan demo veride Türkçe karakter düzeltmeleri yapıldı.

## Güncellenen dosyalar

- `src/utils/lifeSummary.js`
- `src/data/defaultLifeData.js`
- `src/storage/lifeStorage.js`
- `src/components/CurrencySelector.js`
- `src/screens/MoneyScreenSafe.js`
- `src/screens/DebtScreenSafe.js`
- `src/screens/ShoppingScreenSafe.js`
- `src/screens/HomeScreen.js`
- `src/components/HomeFinalSummaryCard.js`
- `src/components/YearFinancePanel.js`
- `src/screens/CustomGoalsScreen.js`
- `src/components/CustomGoalsPanel.js`
- `src/screens/SettingsScreenFixed.js`
- `src/utils/backupUtils.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `README.md`

## APK kararı

- APK alınmadı.
- APK build başlatılmadı.
- `android.versionCode` korunmuştur.
- `apkBuildMode: 'manual-only'` korunmuştur.
- `apkBuildAllowed: false` korunmuştur.

## Expo Go kontrol listesi

- [ ] Uygulama Expo Go ile açılıyor.
- [ ] Para ekranı açılıyor.
- [ ] Para birimi TL / DOLAR / EURO / AED olarak seçilebiliyor.
- [ ] Para ekranında özet kartları okunuyor.
- [ ] Para ekranında yeni kayıt ekleme çalışıyor.
- [ ] Borç ekranı açılıyor.
- [ ] Borç ekranında ödeme ekleme çalışıyor.
- [ ] Alınacaklar ekranı açılıyor.
- [ ] Liste kategorileri seçilebiliyor.
- [ ] Ana sayfa seçili para birimini gösteriyor.
- [ ] Ayarlar ekranında para birimi değişince hedef kaydetmek seçimi bozmuyor.
- [ ] Yedek dışa/ice aktar mesajları okunuyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.5-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.5-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.5 için lokal yedek bulunamadı."
```

## v1.0.5 kapanış kriteri

- [x] v1.0.5 öncesi yedek branch alındı.
- [x] TL / DOLAR / EURO / AED para birimi seçimi eklendi.
- [x] TRY yerine TL gösterimi yapıldı.
- [x] Para ekranı kartlara ayrıldı.
- [x] Borç ekranı kartlara ayrıldı.
- [x] Alınacaklar ekranı kartlara ayrıldı.
- [x] Ayarlar ekranında para birimi korunacak şekilde düzeltme yapıldı.
- [x] Türkçe karakter düzeltmeleri genişletildi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```bash
v1.0.6 - Ayarlar / Yedek / Test Merkezi yeni tasarım
```

v1.0.6 ile Ayarlar, Yedek ve Test Merkezi ekranları daha detaylı sadeleştirilecek. APK build süreci yine başlatılmayacak.
