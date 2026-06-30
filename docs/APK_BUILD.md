# DraBornLife APK Build Notu

v0.0.2 ile temel debug APK build altyapısı eklendi.

## Build yöntemi

APK, telefonda ağır kurulum yapmadan GitHub Actions üzerinden üretilecek.

Workflow dosyası:

```text
.github/workflows/android-debug-apk.yml
```

## APK alma adımları

1. GitHub reposunu aç.
2. `Actions` sekmesine gir.
3. `Build Debug APK` workflow'unu aç.
4. Son başarılı çalışmayı seç.
5. `Artifacts` bölümünden `DraBornLife-v0.0.2-debug-apk` dosyasını indir.
6. Zip içinden `app-debug.apk` dosyasını çıkar.
7. Telefona yükle.

## Not

Bu APK debug sürümüdür. v0.1 finalde release hazırlığı ayrıca yapılacak.
