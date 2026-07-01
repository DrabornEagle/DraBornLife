# DraBornLife v1.3.5 Alınacaklar ve Ev Kurulum Bağlantısı

## Hedef

Liste ekranındaki alınacak kalemler ile Yaşam ekranındaki ev kurulum odaları arasında bağlantı kurmak.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b135
```

## Yapılanlar

- Liste ekranına ev kurulum odası seçimi eklendi.
- Yeni kalem eklerken `Odaya bağlama` veya mevcut odalardan biri seçilebiliyor.
- Oda seçilirse kalem Yaşam ekranındaki ev kurulum odasına bağlı eşya olarak ekleniyor.
- Bağlı kalem güncellenirse oda eşyası da güncelleniyor.
- Bağlı kalem silinirse oda bağlantısı da temizleniyor.
- Satın alındı durumu açılırsa bağlı oda eşyası tamamlandı durumuna geçiyor.
- Liste özetine `Odaya bağlı` kalem sayısı eklendi.
- Liste özetine `Oda sayısı` eklendi.
- Liste kartlarında oda bağlantısı görünür hale getirildi.
- `package.json` sürümü 1.3.5 yapıldı.

## Not

`src/config/appVersion.js` güncellemesi araç güvenlik filtresine takıldı. `app.config.js` önceki adımlarda olduğu gibi geçici olarak eski değer gösterebilir. Android versionCode değişmedi. APK build başlatılmadı.

## Güncellenen dosyalar

- `src/screens/ShoppingScreenSafe.js`
- `package.json`
- `docs/V1_3_5_SHOPPING_HOME_LINK.md`

## Expo Go kontrol listesi

- [ ] Liste ekranı açılıyor.
- [ ] Ev kurulum odası seçimi görünüyor.
- [ ] Odaya bağlama seçeneği çalışıyor.
- [ ] Oda seçilerek kalem ekleniyor.
- [ ] Kalem eklenince Yaşam ekranındaki odada eşya görünüyor.
- [ ] Kalem güncellenince oda eşyası güncelleniyor.
- [ ] Satın alındı işaretlenince oda eşyası tamamlandı oluyor.
- [ ] Kalem silinince oda bağlantısı temizleniyor.
- [ ] Odaya bağlı sayısı doğru görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-5-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-5-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.5 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.6 - Yıllık hedefler ve özel hedefler bağlantısı
```
