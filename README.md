# DraBornLife

**DraBornLife**, Antalya’ya sıfırdan yeni hayat kurma sürecini takip etmek için geliştirilen kişisel Android uygulamasıdır.

## Ana kararlar

- Platform: **Android mobil uygulama**
- İlk çıktı: **APK**
- Web sürüm: **yok**
- Supabase / cloud database: **yok**
- Veri saklama: **cihaz içinde lokal veri**
- Yedekleme: **lokal yedek dosyası + manuel dışa aktar / içe aktar**
- Google Drive yedek: **v0.2+ sonrası opsiyonel**
- GitHub durum kodları: `v0.0.1`, `v0.0.2`, `v0.0.3` ... finalde `v0.1`
- Android paket adı: `com.draborneagle.drabornlife`

## v0.1 hedefi

DraBornLife v0.1, Antalya taşınma hedefi için gelir-gider, birikim, borç azaltma, alınacaklar listesi, motosiklet hedefi ve yedekleme akışını çalışan tek cihaz içi Android uygulaması olarak tamamlamayı hedefler.

## Güncel geliştirme durumu

| Durum Kodu | Aşama | Durum |
|---|---|---|
| v0.0.1 | Proje planı, roadmap, v0.1 checklist ve repo başlangıç dokümanları | Tamamlandı |
| v0.0.2 | Android proje iskeleti | Tamamlandı |
| v0.0.3 | Tema, ana ekran ve navigasyon | Sıradaki adım |
| v0.0.4 | Lokal veri modeli ve cihaz içi kayıt sistemi | Bekliyor |
| v0.0.5 | Ana dashboard: kalan gün, birikim, borç, özet kartlar | Bekliyor |
| v0.0.6 | Gelir-gider takip ekranları | Bekliyor |
| v0.0.7 | Alınacaklar listesi ve durum işaretleri | Bekliyor |
| v0.0.8 | Borç takip ekranı | Bekliyor |
| v0.0.9 | Yedekleme, dışa aktar ve içe aktar | Bekliyor |
| v0.0.10 | Test, temizlik, hata düzeltme ve son düzenlemeler | Bekliyor |
| v0.1 | İlk çalışan APK sürümü | Bekliyor |

Detaylı görev listesi için: `docs/V0_1_CHECKLIST.md`

## Termux zip-only indirme

GitHub zip dosyası normalde klasörü `DraBornLife-main` olarak açar. Aşağıdaki komut klasörü otomatik `DraBornLife` adına çevirir.

```bash
pkg update -y
pkg install -y unzip curl
cd ~
rm -rf DraBornLife DraBornLife-main DraBornLife.zip
curl -L -o DraBornLife.zip https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip
unzip DraBornLife.zip
mv DraBornLife-main DraBornLife
cd DraBornLife
ls
```
