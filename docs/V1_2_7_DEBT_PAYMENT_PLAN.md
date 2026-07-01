# DraBornLife v1.2.7 Borç Kapatma ve Ödeme Planı

## Hedef

Borç ekranı artık sadece borç kayıt listesi değil, hedef tarihe göre ödeme planı da gösteren bir takip paneli oldu.

## Yapılanlar

- Yedek branch alındı: `backup-v1-2-7`.
- Borç ekranı başlığı güncellendi.
- Genel borç özeti korundu.
- Yeni ödeme planı paneli eklendi.
- En yakın aktif borç hedef tarihi otomatik seçiliyor.
- Kalan toplam borç için haftalık ödeme önerisi eklendi.
- Kalan toplam borç için aylık ödeme önerisi eklendi.
- Her borç kartında kendi hedef tarihine göre haftalık ve aylık öneri gösteriliyor.
- Borç kapanınca kart rengi başarı durumuna dönüyor.
- Kapanan borç için `Kapandı` bilgisi gösteriliyor.
- Kalan borçtan büyük ödeme engeli korundu.
- `package.json` sürümü 1.2.7 olarak güncellendi.

## Güncellenen dosyalar

- `src/screens/DebtScreenSafe.js`
- `package.json`
- `docs/V1_2_7_DEBT_PAYMENT_PLAN.md`

## Not

`src/config/appVersion.js` ve `app.config.js` güncelleme denemeleri araç güvenlik filtresine takıldı. Uygulama içi görünen sürüm etiketi geçici olarak eski kalabilir. Kod değişiklikleri main branch'e işlendi.

## Expo Go kontrol listesi

- [ ] Borç ekranı açılıyor.
- [ ] Borç özeti görünüyor.
- [ ] Ödeme planı paneli görünüyor.
- [ ] Haftalık ödeme önerisi görünüyor.
- [ ] Aylık ödeme önerisi görünüyor.
- [ ] Borç ekleniyor.
- [ ] Borç düzenleniyor.
- [ ] Ödeme ekleniyor.
- [ ] Borç kapanınca Kapandı yazıyor.
- [ ] Kalan borçtan büyük ödeme engelleniyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-7-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-7-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.7 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.2.8 - Manuel yedek deneyimi iyileştirme
```
