# DraBornLife Başlatma

## Termux içinde önce klasörü kontrol et

Eğer terminal satırında `~/DraBornLife $` yazıyorsa zaten proje klasörünün içindesin. Bu durumda tekrar `cd DraBornLife` yazma.

Kontrol:

```bash
pwd
ls
```

## Termux üzerinde Expo çalıştırmak için

Expo Go testini Termux üzerinden başlatmak istiyorsan Node.js gerekir. Bu Python, JDK, Perl veya patch değildir.

```bash
pkg update -y
pkg install -y nodejs
```

Sonra proje klasöründeyken:

```bash
npm install
npx expo start -c
```

Telefonunda Expo Go aç ve QR kodu okut.

## Tek satır hızlı başlatma

Eğer zaten `~/DraBornLife $` içindeysen:

```bash
npm install && npx expo start -c
```

## Bağlantı olmazsa

```bash
npx expo start -c --tunnel
```
