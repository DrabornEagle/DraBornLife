# DraBornLife v1.2.4 Ev Kurulum Odaları ve Eşya Grupları

## Sürüm hedefi

v1.2.4 ile Antalya Yaşam ekranındaki ev kurulum bölümü daha kullanışlı hale getirildi. Odalar, oda içi eşya grupları, oda bazlı bütçe ve tamamlanma durumları daha net takip edilir.

## Yapılan değişiklikler

- `backup-v1-2-4` yedek branch'i alındı.
- Yaşam ekranında ev kurulum odaları geliştirildi.
- Eşyalara grup seçimi eklendi.
- Eşya grupları: Temel mobilya, Beyaz eşya, Elektronik, Mutfak, Çocuk, Dekorasyon, Diğer.
- Seçili oda için toplam bütçe, tamamlanan eşya sayısı ve kalan bütçe kartları eklendi.
- Oda içi grup filtresi eklendi.
- Oda listesinde her oda için tamamlanma yüzdesi ve toplam oda bütçesi gösterilmeye başlandı.
- Ana sayfaya Ev kurulumu hızlı karar satırı eklendi.
- Ana sayfaya Ev kurulum bütçesi ilerleme kartı eklendi.
- Genel özet sistemine ev kurulum toplamları eklendi.
- Sürüm etiketi v1.2.4 olarak güncellendi.

## Güncellenen dosyalar

- `src/screens/AntalyaLifeScreen.js`
- `src/screens/HomeScreen.js`
- `src/utils/lifeSummary.js`
- `src/config/appVersion.js`
- `package.json`
- `docs/V1_2_4_HOME_SETUP_ROOMS.md`

## Not

`app.config.js` güncellemesi araç güvenlik kontrolüne takıldı. Android versionCode zaten değişmedi. APK süreci başlatılmadı.

## Expo Go kontrol listesi

- [ ] Yaşam ekranı açılıyor.
- [ ] Ev kurulum odaları görünüyor.
- [ ] Oda seçimi çalışıyor.
- [ ] Eşya grubu seçimi çalışıyor.
- [ ] Eşya ekleniyor.
- [ ] Eşya düzenleniyor.
- [ ] Eşya kaldırılıyor.
- [ ] Tamamlandı durumu çalışıyor.
- [ ] Grup filtresi çalışıyor.
- [ ] Oda bazlı bütçe kartları görünüyor.
- [ ] Ana sayfada ev kurulum özeti görünüyor.
- [ ] Ana sayfada ev kurulum progress kartı görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-4-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-4-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.4 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.2.5 - Antalya yaşam rotası ve bölge karşılaştırma notları
```
