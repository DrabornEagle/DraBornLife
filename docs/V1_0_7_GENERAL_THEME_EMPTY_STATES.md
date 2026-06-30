# DraBornLife v1.0.7 Genel Tema, Boş Durumlar, Kartlar ve Yazı Boyutları

## Sürüm hedefi

v1.0.7 ile uygulamanın genel görsel dili toparlandı. Ortak tema, boş durum kartı, uyarı kutusu, metrik kartları, ilerleme kartları, para birimi seçici ve yüklenme ekranı aynı v1.0 sahil temasına daha uyumlu hale getirildi.

Bu sürüm APK build süreci değildir. Geliştirme ve kontrol akışı Expo Go üzerinden devam eder.

## Yapılan değişiklikler

- `backup-v1.0.7` yedek branch'i alındı.
- Ortak tema dosyası genişletildi.
- Ortak renkler daha detaylı hale getirildi.
- Ortak yazı boyutları eklendi.
- Ortak kart stilleri eklendi.
- Ortak sayfa ve içerik presetleri eklendi.
- `mockSummary` içinde `₺` yerine `TL` kullanıldı.
- Boş durum kartı yeni standart kart görünümüne alındı.
- Uyarı kutusu yazı standardına ve renk standardına bağlandı.
- Metrik kartı daha okunur ve sabit yüksekliğe yakın hale getirildi.
- İlerleme kartı yazı boyutları ve boşlukları düzenlendi.
- Para birimi seçici daha temiz ve ortak tema ile uyumlu hale getirildi.
- Yüklenme ekranı koyu tek ekran yerine açık kartlı yapıya alındı.
- Ana özet kartındaki sürüm durumu v1.0.7 olarak güncellendi.
- Uygulama sürüm kodu v1.0.7 olarak güncellendi.
- README dosyasında v1.0.7 Done, v1.0.8 Next olarak güncellendi.

## Güncellenen dosyalar

- `src/theme.js`
- `src/components/EmptyStateCard.js`
- `src/components/NoticeBox.js`
- `src/components/CleanMetricCard.js`
- `src/components/CleanProgressCard.js`
- `src/components/CurrencySelector.js`
- `src/screens/LoadingScreen.js`
- `src/components/HomeFinalSummaryCard.js`
- `src/config/appVersion.js`
- `src/data/defaultLifeData.js`
- `package.json`
- `app.config.js`
- `README.md`
- `docs/V1_0_7_GENERAL_THEME_EMPTY_STATES.md`

## APK kararı

- APK alınmadı.
- APK build başlatılmadı.
- `android.versionCode` korunmuştur.
- `apkBuildMode: 'manual-only'` korunmuştur.
- `apkBuildAllowed: false` korunmuştur.

## Expo Go kontrol listesi

- [ ] Uygulama Expo Go ile açılıyor.
- [ ] Yüklenme ekranı açık kartlı görünümle geliyor.
- [ ] Ana sayfa metrik kartları taşma yapmıyor.
- [ ] Ana sayfa ilerleme kartları okunuyor.
- [ ] Boş durum kartları daha temiz görünüyor.
- [ ] Uyarı kutuları `Bilgi`, `Hata`, `Tamam` etiketiyle okunuyor.
- [ ] Para birimi seçici tasarımı bozulmadan görünüyor.
- [ ] Kartlar arası boşluklar göz yormuyor.
- [ ] Büyük rakamlar küçük telefon ekranında okunuyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.7-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.7-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.7 için lokal yedek bulunamadı."
```

## v1.0.7 kapanış kriteri

- [x] v1.0.7 öncesi yedek branch alındı.
- [x] Ortak tema genişletildi.
- [x] Boş durum kartı standardize edildi.
- [x] Uyarı kutusu standardize edildi.
- [x] Metrik kartları düzenlendi.
- [x] İlerleme kartları düzenlendi.
- [x] Para birimi seçici düzenlendi.
- [x] Yüklenme ekranı düzenlendi.
- [x] Sürüm kodu v1.0.7 olarak güncellendi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```bash
v1.0.8 - Expo Go tasarım testi
```

v1.0.8 ile Expo Go üzerinde ekranların görünüm testi için kontrol listesi ve gerekiyorsa küçük kod düzeltmeleri yapılacak. APK build süreci yine başlatılmayacak.
