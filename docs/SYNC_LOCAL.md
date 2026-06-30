# Lokal Sync

Her GitHub guncellemesinden sonra Termux icin:

```bash
cd ~
rm -rf DraBornLife_old
mv DraBornLife DraBornLife_old
curl -L -o DraBornLife.zip https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip
unzip -o DraBornLife.zip
rm -rf DraBornLife
mv DraBornLife-main DraBornLife
cd DraBornLife
npm install
npx expo start -c
```

Eski klasor `DraBornLife_old` olarak kalir.
