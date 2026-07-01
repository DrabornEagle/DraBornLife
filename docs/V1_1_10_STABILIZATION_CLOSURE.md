# DraBornLife v1.1.10 Stabilizasyon Kapanışı

## Sürüm hedefi

v1.1 ile v1.0 sonrası uygulama için stabilizasyon, test planı, Türkçe metin, para birimi, yedek, navigasyon ve ekran kullanım kontrol listeleri tek pakette tamamlandı.

## Kapanış durumu

v1.1.1 - v1.1.10 arasındaki tüm stabilizasyon adımları repo/dokümantasyon düzeyinde tamamlandı.

## Yapılanlar

- v1.1 master checklist oluşturuldu.
- Expo Go açılış ve navigasyon kontrol listesi oluşturuldu.
- Premium ana sayfa kullanım kontrol listesi oluşturuldu.
- Para ekranı test kontrol listesi oluşturuldu.
- Borç ekranı test kontrol listesi oluşturuldu.
- Alınacaklar / Liste ekranı test kontrol listesi oluşturuldu.
- Yıl ekranı ve özel hedefler test kontrol listesi oluşturuldu.
- Ayarlar / yedek / geri yükleme kontrol listesi oluşturuldu.
- Türkçe karakter ve para birimi final tarama listesi oluşturuldu.
- README v1.1 kapanış durumuna alındı.
- Sıradaki sürüm v1.2 olarak işaretlendi.

## Dürüst test notu

Bu kapanış repo ve dokümantasyon düzeyindedir.

Expo Go uygulaması fiziksel cihazda bu oturumda canlı çalıştırılmadı. Bu yüzden gerçek cihaz testinde çıkabilecek görsel taşma, telefon boyutu farkı, klavye davranışı veya veri giriş hataları ayrıca kontrol edilmelidir.

## APK kararı

APK alınmadı.

APK build süreci başlatılmadı.

APK build süreci sadece kullanıcı açıkça şu komutu verdiğinde başlar:

```text
APK almaya başlayalım
```

Bu komut gelmeden:

- EAS build başlatılmayacak.
- APK üretimi yapılmayacak.
- Android versionCode artırılmayacak.
- Build ayarı açılmayacak.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-1-10-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-1-10-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.1 için lokal yedek bulunamadı."
```

## v1.1 kapanış kriteri

- [x] v1.1 master checklist oluşturuldu.
- [x] v1.1.1 - v1.1.10 adımları tek pakette kapatıldı.
- [x] README güncellendi.
- [x] v1.1 kapanış dokümanı eklendi.
- [x] APK build süreci başlatılmadı.
- [x] Sıradaki sürüm v1.2 olarak işaretlendi.
