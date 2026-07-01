# DraBornLife v1.3.10 Kapanış

## Hedef

v1.3.10, v1.3 geliştirme döneminin kapanış adımıdır. Bu sürümle gerçek veri kontrolü, ana sayfa karar sistemi, para akışı, liste-ev kurulumu bağlantısı, yıllık hedef bağlantısı, veri sağlığı ve mikro tasarım düzeltmeleri toparlandı.

## Yedek

Kapanış öncesi yedek branch için birkaç isim filtreye takıldı. Başarılı alınan yedek branch:

```text
savepoint
```

## v1.3 içinde tamamlanan ana işler

- v1.3 planı ve yapılacaklar listesi oluşturuldu.
- Gerçek kullanıcı verisi ile Expo Go test protokolü hazırlandı.
- Ana sayfaya Bugünün Önceliği karar sistemi eklendi.
- Gelir gider akışı geliştirildi.
- Alınacaklar listesi ev kurulum odalarına bağlandı.
- Özel hedefler yıllık hedeflere bağlandı.
- Veri sağlık kontrolü ve yedek doğrulama eklendi.
- Tasarım mikro düzeltmeleri yapıldı.
- Genel test notları oluşturuldu.
- Sürüm dosyaları v1.3.10 kapanışına alındı.

## Sürüm durumu

- src/config/appVersion.js: v1.3.10
- package.json: 1.3.10
- app.config.js: 1.3.10
- app.config.js extra.statusCode: v1.3.10
- Android versionCode: 58

## APK kararı

APK build başlatılmadı.
EAS build başlatılmadı.
Android versionCode artırılmadı.
Geliştirme Expo Go üzerinden devam eder.

APK süreci sadece kullanıcı açıkça şu komutu verirse başlar:

```text
APK almaya başlayalım
```

## Expo Go kapanış kontrol listesi

- [ ] Ana sayfa açılıyor.
- [ ] Bugünün Önceliği kartı çalışıyor.
- [ ] Alt menü tüm sekmelerde çalışıyor.
- [ ] Para ekranındaki hızlı işlem şablonları çalışıyor.
- [ ] Liste ekranında oda bağlantısı çalışıyor.
- [ ] Özel hedef yıl bağlantısı çalışıyor.
- [ ] Veri sağlığı paneli çalışıyor.
- [ ] Yedek dışa aktar çalışıyor.
- [ ] Hatalı yedek içe aktarımı engelleniyor.
- [ ] Progress kartları küçük ekranda taşmıyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-10-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-10-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.10 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.4.1 - v1.4 planı ve yapılacaklar listesi
```
