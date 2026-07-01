# DraBornLife v1.3.8 Tasarım Mikro Düzeltmeleri

## Hedef

Küçük ekranlarda daha temiz, daha okunur ve daha premium bir görünüm sağlamak.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b138
```

## Yapılanlar

- Alt menü daha kompakt hale getirildi.
- Alt menü kart genişlikleri azaltıldı.
- Alt menü ikon boyutu azaltıldı.
- Alt menü yazı boyutu azaltıldı.
- Alt menü iç boşlukları azaltıldı.
- Progress kartlarının kenar boşlukları azaltıldı.
- Progress kartı iç boşlukları azaltıldı.
- Progress kartı başlığı ve yüzde alanı küçük ekran için sıkılaştırıldı.
- Uzun alt para yazıları için sağ metne sol boşluk verildi.
- Başlık, alt başlık ve footer metinleri için taşma kontrolü iyileştirildi.
- `src/config/appVersion.js` v1.3.8 yapıldı.
- `package.json` 1.3.8 yapıldı.

## Not

`app.config.js` güncellemesi araç güvenlik filtresine takıldı. Bu dosya geçici olarak eski değer gösterebilir. Android versionCode değişmedi. APK build başlatılmadı.

## Güncellenen dosyalar

- `App.js`
- `src/components/CleanProgressCard.js`
- `src/config/appVersion.js`
- `package.json`
- `docs/V1_3_8_DESIGN_MICRO_FIXES.md`

## Expo Go kontrol listesi

- [ ] Alt menü küçük ekranda taşmıyor.
- [ ] Alt menü ikonları düzgün görünüyor.
- [ ] Alt menü yazıları okunuyor.
- [ ] Progress kartlarında başlık taşmıyor.
- [ ] Progress kartlarında yüzde değeri taşmıyor.
- [ ] Para metinleri kart dışına çıkmıyor.
- [ ] Ana sayfa progress kartları daha derli toplu görünüyor.
- [ ] APK build denenmedi.

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-3-8-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-3-8-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.3.8 için lokal yedek bulunamadı."
```

## Sonraki adım

```text
v1.3.9 - Genel test ve hata düzeltmeleri
```
