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

```bash
pkg update -y
pkg install -y git unzip curl
mkdir -p ~/DraBornLife
cd ~/DraBornLife
curl -L -o DraBornLife.zip https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip
unzip DraBornLife.zip
cd DraBornLife-main
ls
```

## Not

APK üretimi için Termux içinde Python/JDK/Perl kurulumu yapılmayacak. APK build işlemi mümkünse GitHub Actions üzerinden alınacak. Böylece telefonda ağır kurulum yapmadan sadece dosyalar takip edilebilir.
