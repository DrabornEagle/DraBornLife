# DraBornLife v1.2.8 Manuel Yedek Deneyimi

## Hedef

Manuel yedek alma ve geri yükleme akışını daha anlaşılır, güvenli ve kontrol edilebilir hale getirmek.

## Yapılanlar

- `backup-v1-2-8` branch adı filtreye takıldığı için güvenli yedek branch adıyla yedek alındı: `backup-128`.
- Yedek JSON içine `backupSummary` eklendi.
- Yedek JSON içine `restoreWarning` eklendi.
- Yedek JSON içine `storageMode: local-only` eklendi.
- `parseBackupText` artık yedek tarihini ve kayıt özetini de döndürüyor.
- Yedek merkezi ekranı daha açıklayıcı hale getirildi.
- Yedek özetine ev odası, aktivite, sahil rota ve bölge notu sayıları eklendi.
- Dışa aktarma açıklaması adım adım yazıldı.
- İçe aktarma uyarısı güçlendirildi.
- Geri yükleme sonrası mesajda sürüm, tarih, kayıt sayısı ve kapsam bilgisi gösteriliyor.
- `package.json` sürümü 1.2.8 olarak güncellendi.

## Güncellenen dosyalar

- `src/utils/backupUtils.js`
- `src/screens/SettingsScreenFixed.js`
- `package.json`
- `docs/V1_2_8_BACKUP_EXPERIENCE.md`

## Not

APK build başlatılmadı. Android versionCode artırılmadı.

## Expo Go kontrol listesi

- [ ] Ayarlar ekranı açılıyor.
- [ ] Yedek merkezi görünüyor.
- [ ] Toplam kayıt sayısı görünüyor.
- [ ] Ev odası sayısı görünüyor.
- [ ] Aktivite sayısı görünüyor.
- [ ] Sahil / rota sayısı görünüyor.
- [ ] Bölge notu sayısı görünüyor.
- [ ] Yedek metni oluşturuluyor.
- [ ] Oluşan yedekte backupSummary var.
- [ ] Oluşan yedekte restoreWarning var.
- [ ] Hatalı yedek metni uyarı veriyor.
- [ ] Doğru yedek geri yükleniyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-8-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-8-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.8 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.2.9 - Genel hata düzeltmeleri ve küçük UX rötuşları
```
