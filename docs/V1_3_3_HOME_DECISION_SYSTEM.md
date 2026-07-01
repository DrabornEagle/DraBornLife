# DraBornLife v1.3.3 Ana Sayfa Karar Sistemi

## Hedef

Ana sayfanın yalnızca bilgi gösteren bir panel değil, kullanıcıya bugün hangi aksiyona odaklanması gerektiğini söyleyen bir karar ekranı olması hedeflendi.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b133
```

## Yapılanlar

- Ana sayfaya `Bugünün Önceliği` kartı eklendi.
- Kalan gün, kalan bütçe, borç, ev kurulumu ve alışveriş durumuna göre öneri metni üretildi.
- Ana sayfaya `Eksik veri / kontrol` uyarı kartı eklendi.
- Eksik birikim, boş alışveriş listesi, boş ev kurulumu ve borç verisi için kısa uyarılar eklendi.
- Karar kartı koyu premium tasarımla öne çıkarıldı.
- Uyarı kartı sade sarı bilgi kutusu olarak eklendi.
- `src/config/appVersion.js` sürümü v1.3.3 olarak güncellendi.
- `package.json` sürümü 1.3.3 olarak güncellendi.
- APK build başlatılmadı.

## Not

`app.config.js` güncellemesi araç güvenlik filtresine takıldı. Bu dosya geçici olarak v1.3.2 görünebilir. Android versionCode değişmedi ve APK süreci başlatılmadı.

## Güncellenen dosyalar

- `src/screens/HomeScreen.js`
- `src/config/appVersion.js`
- `package.json`
- `docs/V1_3_3_HOME_DECISION_SYSTEM.md`

## Expo Go kontrol listesi

- [ ] Ana sayfa açılıyor.
- [ ] Bugünün Önceliği kartı görünüyor.
- [ ] Karar metni duruma göre değişiyor.
- [ ] Eksik veri kartı görünüyor.
- [ ] Kalan bütçe kartı bozulmuyor.
- [ ] Kritik tarih kartları bozulmuyor.
- [ ] Alt menü ikonları düzgün duruyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-3-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-3-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.3 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.4 - Gelir gider akışı geliştirme
```
