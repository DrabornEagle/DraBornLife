# DraBornLife v1.2.10 Kapanış

## Kapanış hedefi

v1.2.10, v1.2 geliştirme döneminin kapanış adımıdır. Bu sürümle v1.2 içinde eklenen gerçek kullanım, aile yaşamı, ev kurulumu, bölge karşılaştırması, borç planı ve yedek deneyimi işleri toparlanmıştır.

## Yedek

Kapanış öncesi yedek branch alındı:

```text
backup-1210
```

## v1.2 içinde tamamlanan ana işler

- Gerçek Expo Go cihaz test protokolü hazırlandı.
- Aile aktivite / aquapark / sahil planı geliştirildi.
- Ev kurulum odaları ve eşya grupları geliştirildi.
- Antalya bölge karşılaştırma notları eklendi.
- Ana sayfa ve alt menü sorunları düzeltildi.
- Borç kapatma ve ödeme planı önerileri eklendi.
- Manuel yedek deneyimi iyileştirildi.
- Genel sürüm tutarsızlıkları toparlandı.
- v1.2 kapanış sürümü v1.2.10 olarak senkronlandı.

## Sürüm durumu

- `src/config/appVersion.js`: v1.2.10
- `package.json`: 1.2.10
- `app.config.js`: 1.2.10
- `app.config.js > extra.statusCode`: v1.2.10
- Android versionCode: 58

## APK kararı

APK build başlatılmadı.
EAS build başlatılmadı.
Android versionCode artırılmadı.
Geliştirme hâlâ Expo Go üzerinden devam eder.

APK süreci sadece kullanıcı açıkça şu komutu verirse başlar:

```text
APK almaya başlayalım
```

## Expo Go kapanış kontrol listesi

- [ ] Ana ekranda v1.2.10 etiketi görünüyor.
- [ ] Alt menü ikonları düzgün görünüyor.
- [ ] Ana sayfa kritik tarihleri net gösteriyor.
- [ ] Yaşam ekranı açılıyor.
- [ ] Ev kurulum odaları çalışıyor.
- [ ] Aile aktivite planı çalışıyor.
- [ ] Antalya bölge karşılaştırması çalışıyor.
- [ ] Borç ödeme planı çalışıyor.
- [ ] Yedek dışa aktar çalışıyor.
- [ ] Yedek içe aktar hata uyarıları anlaşılır.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-10-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-10-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.10 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.1 - v1.3 planı ve yapılacaklar listesi
```
