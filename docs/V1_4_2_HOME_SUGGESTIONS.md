# DraBornLife v1.4.2 Ana Sayfa Öneri Motoru

## Hedef

Ana sayfanın sadece tek karar göstermesi yerine, kullanıcının bugün bakması gereken alanları kısa öneriler halinde göstermesi.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b142
```

## Yapılanlar

- `HomeTips` bileşeni eklendi.
- Ana sayfaya `Akıllı Öneriler` paneli bağlandı.
- Bütçe temposu önerisi eklendi.
- Borç azaltma önerisi eklendi.
- Ev kurulumu önerisi eklendi.
- Alınacaklar önerisi eklendi.
- Gerçek veri uyarısı eklendi.
- Özel hedef önerisi eklendi.
- Sürüm dosyaları v1.4.2 olarak senkronlandı.
- Android versionCode 58 olarak korundu.
- APK build başlatılmadı.

## Güncellenen dosyalar

- `src/components/HomeTips.js`
- `src/screens/HomeScreen.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `docs/V1_4_2_HOME_SUGGESTIONS.md`

## Expo Go kontrol listesi

- [ ] Ana sayfa açılıyor.
- [ ] Akıllı Öneriler paneli görünüyor.
- [ ] Bütçe önerisi görünüyor.
- [ ] Borç önerisi duruma göre görünüyor.
- [ ] Ev kurulum önerisi duruma göre görünüyor.
- [ ] Alınacaklar önerisi duruma göre görünüyor.
- [ ] Ana sayfa eski Bugünün Önceliği kartını koruyor.
- [ ] APK build denenmedi.

## Sonraki adım

```text
v1.4.3 - Para ekranı kategori raporları
```

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-4-2-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-4-2-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.4.2 için lokal yedek bulunamadı."
```
