# Termux Kurulum Notu — Zip Only

Bu projede Termux tarafında istenmeyen kurulumlar yapılmayacak.

## Kullanılmayacaklar

- Python kurulumu yok
- JDK kurulumu yok
- Perl kurulumu yok
- Patch kurulumu yok
- `/tmp` tabanlı karmaşık işlem yok

## Tercih edilen yöntem

Termux gerekiyorsa sadece repo zip indirme / açma / dosya kontrolü gibi basit işlemler kullanılacak.

## Zip ile repo indirme örneği

GitHub zip dosyası normalde klasörü `DraBornLife-main` olarak açar. Biz bunu otomatik olarak `DraBornLife` adına çeviriyoruz.

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

## Not

APK üretimi için Termux içinde Python/JDK/Perl kurulumu yapılmayacak. APK build işlemi GitHub Actions üzerinden alınacak. Böylece telefonda ağır kurulum yapmadan sadece dosyalar takip edilebilir.
