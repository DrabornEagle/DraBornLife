# DraBornLife v1.4.1 Plan

## Hedef

v1.4 geliştirme dönemi başladı. Bu sürümün ana amacı, v1.3 ile eklenen gerçek kullanım altyapısının üstüne daha akıllı öneriler, daha net raporlar ve daha pratik günlük takip eklemektir.

## Yedek

Bu adım öncesinde yedek branch alındı:

```text
b141
```

## v1.4 akışı

- v1.4.1 Plan ve checklist
- v1.4.2 Ana sayfa öneri motoru
- v1.4.3 Para ekranı kategori raporları
- v1.4.4 Alınacaklar öncelik puanı
- v1.4.5 Ev kurulum tamamlanma takvimi
- v1.4.6 Antalya yaşam karar raporu
- v1.4.7 Yedek test merkezi
- v1.4.8 Genel UX düzeltmeleri
- v1.4.9 Genel testler
- v1.4.10 v1.4 kapanışı

## Yapılanlar

- v1.4 planı açıldı.
- v1.4.1 tamamlandı.
- v1.4.2 sıradaki adım yapıldı.
- APK kapalı kararı korundu.

## APK kararı

APK build yapılmadı.
Android versionCode artırılmadı.
Geliştirme Expo Go ile devam eder.

## Sonraki adım

```text
v1.4.2 - Ana sayfa öneri motoru geliştirme
```

## Termux tek seferlik kurulum + lokal yedek komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-4-1-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Termux geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-4-1-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.4.1 için lokal yedek bulunamadı."
```
