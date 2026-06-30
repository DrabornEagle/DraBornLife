# Expo Go start -c Kullanımı

`start -c`, Expo/Metro cache temizleyerek projeyi başlatır. Tasarım veya dosya değişikliklerinden sonra eski ekran takılı kalırsa kullanılır.

## Normal başlatma

```bash
cd DraBornLife
npm install
npx expo start
```

## Cache temizleyerek başlatma

```bash
cd DraBornLife
npx expo start -c
```

Aynı komutu package script ile de çalıştırabilirsin:

```bash
cd DraBornLife
npm run start:clear
```

## Expo Go ile açma

1. Telefonda Expo Go uygulamasını aç.
2. Terminalde çıkan QR kodu okut.
3. Telefon ve bilgisayar aynı Wi-Fi üzerinde olmalı.

## QR bağlanmazsa

Aynı Wi-Fi çalışmazsa tunnel ile dene:

```bash
cd DraBornLife
npx expo start -c --tunnel
```

## Not

Termux tarafında yine sadece zip indirme / dosya kontrolü öneriliyor. Expo Go canlı test için Node.js çalışan bir geliştirme ortamı gerekir.
