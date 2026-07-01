# DraBornLife v1.3.6 Yıllık Hedefler ve Özel Hedefler Bağlantısı

## Hedef

Özel hedeflerin seçilen yıla bağlanması ve Yıl ekranındaki yıllık hedeflere otomatik yansıması.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b136
```

## Yapılanlar

- Özel Hedefler ekranına hedef yılı seçimi eklendi.
- Seçili yıl için özel hedef sayısı ve tamamlanan hedef sayısı gösterildi.
- Özel hedef eklenince otomatik yıllık hedef kaydı oluşturuluyor.
- Özel hedef güncellenince bağlı yıllık hedef de güncelleniyor.
- Özel hedef silinince bağlı yıllık hedef bağlantısı temizleniyor.
- Özel hedef tamamlandı yapılınca bağlı yıllık hedef durumu `done` oluyor.
- Kategoriye göre yıllık hedef tipi eşleştirildi.
- Özel hedef kartında yıl planı bağlantısının aktif olduğu gösteriliyor.
- `package.json` sürümü 1.3.6 yapıldı.

## Not

`src/config/appVersion.js` güncellemesi araç güvenlik filtresine takıldı. `app.config.js` de eski değer gösterebilir. Android versionCode değişmedi. APK build başlatılmadı.

## Güncellenen dosyalar

- `src/components/CustomGoalsPanel.js`
- `package.json`
- `docs/V1_3_6_YEAR_CUSTOM_GOALS_LINK.md`

## Expo Go kontrol listesi

- [ ] Özel Hedefler ekranı açılıyor.
- [ ] Hedef yılı seçimi görünüyor.
- [ ] 2026 / 2027 gibi yıllar seçilebiliyor.
- [ ] Özel hedef ekleniyor.
- [ ] Eklenen özel hedef Yıl ekranında görünüyor.
- [ ] Özel hedef güncellenince Yıl ekranındaki kayıt güncelleniyor.
- [ ] Özel hedef tamamlandı yapılınca Yıl ekranında tamam görünüyor.
- [ ] Özel hedef silinince bağlı yıllık hedef temizleniyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-6-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-6-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.6 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.7 - Veri sağlık kontrolü ve yedek doğrulama
```
