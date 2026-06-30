# DraBornLife Expo Go Test Notu

v0.0.3 itibarıyla geliştirme yönü Expo / React Native olarak güncellendi.

## Test hedefi

- Şimdilik APK alınmayacak.
- Uygulama Expo Go ile telefonda açılarak test edilecek.
- APK üretimi v0.1 final test aşamasına bırakılacak.

## Bilgisayarda çalıştırma

```bash
npm install
npx expo start
```

Sonra telefondan Expo Go uygulamasıyla QR kod okutulur.

## Termux zip-only indirme

Bu komut sadece repoyu telefona indirir. Python, JDK, Perl, patch veya `/tmp` kullanılmaz.

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

Expo Go ile canlı test için normalde Node.js çalışan bir cihaz veya bilgisayar gerekir. Termux tarafında ağır kurulum istemediğimiz için Termux sadece dosya indirme / kontrol amacıyla kullanılacak.
