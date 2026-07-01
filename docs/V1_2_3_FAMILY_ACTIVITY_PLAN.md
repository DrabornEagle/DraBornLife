# DraBornLife v1.2.3 Aile Aktivite / Aquapark / Sahil Planı

## Sürüm hedefi

v1.2.3 ile Antalya Yaşam ekranındaki aile aktivite alanı daha kullanışlı hale getirildi. Aquapark, sahil, piknik, yemek, gezi, çocuk eğlence ve tatil hedefleri artık daha net kartlarla takip edilir.

## Yapılan değişiklikler

- `backup-v1-2-3` yedek branch'i alındı.
- Yaşam ekranında Aile Aktivite Planı üst bölüme taşındı.
- Aktivite kategorileri genişletildi: Aquapark, Sahil, Piknik, Yemek, Gezi, Çocuk eğlence, Tatil.
- Aktivitelere hedef ay alanı eklendi.
- Aktivite için tahmini fiyat ve biriken tutar alanları korundu.
- Aktivite için aile notu alanı netleştirildi.
- Aktivite kategori filtresi eklendi.
- Aktivite durum filtresi eklendi: Tümü, Aktif, Tamamlandı.
- Aktivite özet kartları eklendi: Toplam, Biriken, Tamam.
- Aile aktivite kalan bütçesi Yaşam ekranındaki üst özet kartına bağlandı.
- Sahil / aquapark / tatil rotası bölümü ayrı rota kartı olarak korundu ve adı netleştirildi.
- Ana sayfa Hızlı Kararlar bölümüne Aile aktivite özeti eklendi.
- Ana sayfa İlerleme bölümüne Aile aktivite bütçesi progress kartı eklendi.
- `lifeSummary` içine aktivite toplamları eklendi.
- Sürüm etiketi v1.2.3 olarak güncellendi.
- APK build süreci başlatılmadı.

## Güncellenen dosyalar

- `src/screens/AntalyaLifeScreen.js`
- `src/screens/HomeScreen.js`
- `src/utils/lifeSummary.js`
- `src/config/appVersion.js`
- `package.json`
- `app.config.js`
- `README.md`
- `docs/V1_2_NEXT_VERSION_PLAN.md`
- `docs/V1_2_3_FAMILY_ACTIVITY_PLAN.md`

## APK kararı

APK alınmadı.
APK build başlatılmadı.
Android versionCode artırılmadı.
APK süreci sadece kullanıcı açıkça şu komutu verirse başlar:

```text
APK almaya başlayalım
```

## Expo Go kontrol listesi

- [ ] Yaşam ekranı açılıyor.
- [ ] Aile Aktivite Planı üst bölümde görünüyor.
- [ ] Aktivite ekleniyor.
- [ ] Aktivite düzenleniyor.
- [ ] Aktivite siliniyor.
- [ ] Hedef ay kaydediliyor.
- [ ] Kategori filtresi çalışıyor.
- [ ] Durum filtresi çalışıyor.
- [ ] Tamamlandı butonu çalışıyor.
- [ ] Ana sayfada Aile aktivite özeti görünüyor.
- [ ] Ana sayfada Aile aktivite progress kartı görünüyor.
- [ ] Büyük tutarlar taşmıyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-3-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-3-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.3 için lokal yedek bulunamadı."
```

## v1.2.3 kapanış kriteri

- [x] v1.2.3 öncesi yedek branch alındı.
- [x] Aile aktivite planı geliştirildi.
- [x] Hedef ay alanı eklendi.
- [x] Kategori ve durum filtreleri eklendi.
- [x] Aktivite bütçesi ana sayfa özetine bağlandı.
- [x] Aktivite progress kartı ana sayfaya eklendi.
- [x] Sürüm kodu v1.2.3 olarak güncellendi.
- [x] APK build süreci başlatılmadı.

## Sonraki adım

```text
v1.2.4 - Ev kurulum odaları ve eşya grupları geliştirme
```
