# DraBornLife v1.3.4 Gelir Gider Akışı

## Hedef

Para ekranını günlük kullanımda daha hızlı veri girilebilir hale getirmek. Kullanıcı gelir, gider ve birikim kaydını daha az düşünerek daha hızlı ekleyebilmeli.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b134
```

## Yapılanlar

- Para ekranına hızlı işlem şablonları eklendi.
- Gelir kategorileri ve gider kategorileri ayrıldı.
- Gelir seçildiğinde gelir odaklı kategoriler gösteriliyor.
- Gider seçildiğinde gider odaklı kategoriler gösteriliyor.
- Günlük kazanç, ek gelir, market, ulaşım ve borç ödemesi şablonları eklendi.
- Gelir için otomatik birikim hesaplama eklendi.
- Birikim seçenekleri: %25, %35, %50.
- Finans özeti genişletildi.
- Bugün net kartı eklendi.
- Birikim oranı kartı eklendi.
- Son 7 gün net ve son 30 gün net nakit akışı kartları eklendi.
- `src/config/appVersion.js` v1.3.4 yapıldı.
- `package.json` 1.3.4 yapıldı.

## Not

`app.config.js` güncellemesi araç güvenlik filtresine takıldı. Bu dosya geçici olarak eski değer gösterebilir. Android versionCode değişmedi. APK build başlatılmadı.

## Güncellenen dosyalar

- `src/screens/MoneyScreenSafe.js`
- `src/config/appVersion.js`
- `package.json`
- `docs/V1_3_4_MONEY_FLOW.md`

## Expo Go kontrol listesi

- [ ] Para ekranı açılıyor.
- [ ] Hızlı işlem şablonları görünüyor.
- [ ] Günlük kazanç şablonu formu dolduruyor.
- [ ] Market şablonu formu dolduruyor.
- [ ] Gelir kategorileri doğru görünüyor.
- [ ] Gider kategorileri doğru görünüüyor.
- [ ] %25 birikim hesaplıyor.
- [ ] %35 birikim hesaplıyor.
- [ ] %50 birikim hesaplıyor.
- [ ] Bugün net kartı görünüyor.
- [ ] 7 gün net kartı görünüyor.
- [ ] 30 gün net kartı görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-4-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-4-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.4 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.5 - Alınacaklar ve ev kurulum bağlantısı
```
