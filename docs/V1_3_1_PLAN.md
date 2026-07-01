# DraBornLife v1.3.1 Plan ve Yapılacaklar Listesi

## Hedef

v1.3.1 ile v1.3 geliştirme dönemi açıldı. v1.3, uygulamayı gerçek veri girişi, Expo Go kontrolü, karar sistemi ve veri sağlığı açısından güçlendirecek sürümdür.

## Yedek

Branch adı `backup-131` güvenlik filtresine takıldığı için kısa yedek branch alındı:

```text
b131
```

## Yapılanlar

- v1.3 ana hedefi belirlendi.
- v1.3 sürüm akışı yazıldı.
- v1.3.1 Done olarak işaretlendi.
- v1.3.2 Next olarak işaretlendi.
- README güncellendi.
- Sürüm etiketleri v1.3.1 olarak senkronlandı.
- Android versionCode 58 olarak korundu.
- APK build başlatılmadı.

## v1.3 sürüm akışı

- v1.3.1 Plan ve checklist
- v1.3.2 Gerçek kullanıcı verisi ile Expo Go kontrolü
- v1.3.3 Ana sayfa karar sistemi
- v1.3.4 Gelir gider akışı
- v1.3.5 Alınacaklar ve ev kurulum bağlantısı
- v1.3.6 Yıllık hedefler ve özel hedefler bağlantısı
- v1.3.7 Veri sağlık kontrolü ve yedek doğrulama
- v1.3.8 Tasarım mikro düzeltmeleri
- v1.3.9 Genel test ve hata düzeltmeleri
- v1.3.10 v1.3 kapanışı

## Güncellenen dosyalar

- `docs/V1_3_NEXT_VERSION_PLAN.md`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `README.md`
- `docs/V1_3_1_PLAN.md`

## APK kararı

APK build yapılmadı.
Android versionCode artırılmadı.
Geliştirme Expo Go ile devam eder.

## Expo Go kontrol listesi

- [ ] Ana ekranda v1.3.1 etiketi görünüyor.
- [ ] Alt menü çalışıyor.
- [ ] Ayarlar ekranı çalışıyor.
- [ ] Yedek merkezi açılıyor.
- [ ] Borç ödeme planı açılıyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-1-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-1-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.1 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.2 - Gerçek kullanıcı verisi ile Expo Go kontrolü
```
