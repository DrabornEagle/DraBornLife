# DraBornLife v1.2.5 Antalya Yaşam Rotası ve Bölge Karşılaştırma Notları

## Sürüm hedefi

v1.2.5 ile Antalya'da yaşam bölgesi seçimini daha bilinçli yapmak için bölge karşılaştırma paneli eklendi.

## Yapılan değişiklikler

- `backup-v1-2-5` yedek branch'i alındı.
- Yeni bileşen eklendi: `src/components/RegionComparisonPanel.js`.
- Yaşam ekranına Antalya bölge karşılaştırması paneli bağlandı.
- Varsayılan bölgeler eklendi: Muratpaşa, Lara, Konyaaltı.
- Her bölge için puanlama alanları eklendi:
  - Kira
  - Ulaşım
  - Sahil yakınlığı
  - Aile yaşamı
  - Market erişimi
- Her bölge için artı notu, eksi notu ve kişisel aile notu alanı eklendi.
- Bölge ortalama yaşam skoru gösterildi.
- Bölge notları `regionNotes` alanıyla cihaz içi veriye kaydedilir hale getirildi.
- `regionNotes` yedek kapsamına eklendi.
- Sürüm etiketi v1.2.5 olarak güncellendi.
- `package.json` ve `app.config.js` sürümleri v1.2.5 olarak güncellendi.
- Android versionCode 58 olarak korundu.
- APK build süreci başlatılmadı.

## Güncellenen dosyalar

- `src/components/RegionComparisonPanel.js`
- `src/screens/AntalyaLifeScreen.js`
- `src/utils/backupUtils.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `docs/V1_2_5_REGION_COMPARISON.md`

## Expo Go kontrol listesi

- [ ] Yaşam ekranı açılıyor.
- [ ] Antalya bölge karşılaştırması paneli görünüyor.
- [ ] Muratpaşa seçilebiliyor.
- [ ] Lara seçilebiliyor.
- [ ] Konyaaltı seçilebiliyor.
- [ ] Kira puanı değiştirilebiliyor.
- [ ] Ulaşım puanı değiştirilebiliyor.
- [ ] Sahil puanı değiştirilebiliyor.
- [ ] Aile puanı değiştirilebiliyor.
- [ ] Market puanı değiştirilebiliyor.
- [ ] Artı notu kaydediliyor.
- [ ] Eksi notu kaydediliyor.
- [ ] Kişisel aile notu kaydediliyor.
- [ ] Ortalama skor değişiyor.
- [ ] Yedek dışa aktar içinde regionNotes alanı bulunuyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-5-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-5-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.5 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.2.6 - Birikim hedefleri için aylık / haftalık öneri sistemi
```
