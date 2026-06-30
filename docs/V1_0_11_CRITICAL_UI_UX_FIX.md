# DraBornLife v1.0.11 Kritik UI/UX Düzeltme

## Hedef

Kullanıcı geri bildirimi sonrası ana sayfa, alt menü ve Yaşam ekranı için kritik düzeltmeler yapıldı.

## Yapılanlar

- `backup-v1.0.11` yedek branch'i alındı.
- Alt menüden Test butonu kaldırıldı.
- Menü 9 bölümden 8 bölüme düşürüldü.
- Alt menü daha sade hale getirildi.
- Aynı sekmeye tekrar basınca gereksiz geçiş engellendi.
- Sekme değişimi daha hafif hale getirildi.
- Ana sayfa sadeleştirildi.
- Antalya taşınma geri sayımı ana sayfada büyük öncelik kartı oldu.
- GTA 6 geri sayımı ana sayfada büyük öncelik kartı oldu.
- Karmaşık dashboard azaltıldı.
- Bütçe durumu tek büyük kartta toplandı.
- Hızlı kontrol kartı eklendi.
- Yaşam ekranındaki Türkçe karakterler düzeltildi.
- `Antalya Life` başlığı `Antalya Yaşam` yapıldı.
- `Ev Kurulum`, `esya`, `butce`, `Ozel`, `planli`, `duzenle` benzeri metinler Türkçe karakterli hale getirildi.
- Yaşam ekranı seçili para birimine uygun para formatı kullanmaya başladı.
- Varsayılan yaşam verilerindeki bazı kategori isimleri Türkçe karakterli hale getirildi.

## Güncellenen dosyalar

- `App.js`
- `src/screens/HomeScreen.js`
- `src/screens/AntalyaLifeScreen.js`
- `src/config/appVersion.js`
- `src/data/defaultLifeData.js`
- `package.json`
- `app.config.js`
- `README.md`

## APK kararı

APK alınmadı. Android `versionCode` korunmuştur. Geliştirme Expo Go ile devam eder.

## Expo Go kontrol listesi

- [ ] Uygulama açılıyor.
- [ ] Test butonu alt menüde görünmüyor.
- [ ] Ana sayfada Antalya geri sayımı büyük görünüyor.
- [ ] Ana sayfada GTA 6 geri sayımı büyük görünüyor.
- [ ] Yaşam ekranında Türkçe karakterler düzgün görünüyor.
- [ ] Sekme geçişleri eskisine göre daha hafif hissediliyor.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1.0.11-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1.0.11-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.0.11 için lokal yedek bulunamadı."
```
