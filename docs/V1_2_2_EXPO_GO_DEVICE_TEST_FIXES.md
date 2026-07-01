# DraBornLife v1.2.2 Gerçek Expo Go Cihaz Testi ve Düzeltme Protokolü

## Sürüm hedefi

v1.2.2'nin hedefi, uygulamanın gerçek telefonda Expo Go ile açılıp ekranların canlı kullanımda kontrol edilmesi ve çıkan sorunların patch mantığında düzeltilmesidir.

Bu adım repo tarafında test protokolü ve hata raporlama düzenini oluşturur. Fiziksel cihazda canlı test kullanıcı tarafından yapılmalıdır.

## Dürüst test notu

Bu oturumda uygulama fiziksel telefonda canlı çalıştırılamaz. Bu nedenle bu sürümde yapılan iş:

- Gerçek cihaz test planını yazmak
- Hata raporlama formatını netleştirmek
- Expo Go test kontrol listesini hazırlamak
- Sonraki düzeltmeler için patch akışını oluşturmak

Kullanıcı ekran görüntüsü veya hata mesajı paylaşırsa kod düzeltmesi bir sonraki patch içinde yapılacaktır.

## APK kararı

APK alınmadı.
APK build başlatılmadı.
Android versionCode artırılmayacak.
APK süreci sadece kullanıcı açıkça şu komutu verirse başlar:

```text
APK almaya başlayalım
```

## Test öncesi Termux kurulum komutu

```bash
cd ~ && [ -d DraBornLife ] && cp -a DraBornLife DraBornLife-backup-v1-2-2-$(date +%Y%m%d-%H%M%S) || true && rm -rf DraBornLife DraBornLife-main DraBornLife-main.zip && curl -L https://github.com/DrabornEagle/DraBornLife/archive/refs/heads/main.zip -o DraBornLife-main.zip && unzip -q DraBornLife-main.zip && mv DraBornLife-main DraBornLife && rm -f DraBornLife-main.zip && cd DraBornLife && npm install && npx expo start
```

## Geri alma komutu

```bash
cd ~ && LAST_BACKUP=$(ls -dt DraBornLife-backup-v1-2-2-* 2>/dev/null | head -n 1) && [ -n "$LAST_BACKUP" ] && rm -rf DraBornLife && cp -a "$LAST_BACKUP" DraBornLife && cd DraBornLife && npx expo start || echo "v1.2.2 için lokal yedek bulunamadı."
```

## Gerçek cihaz test listesi

### 1. Açılış

- [ ] `npx expo start` çalışıyor.
- [ ] QR kod Expo Go ile açılıyor.
- [ ] Loading ekranı geliyor.
- [ ] Uygulama ana sayfaya geçiyor.
- [ ] Açılışta kırmızı hata ekranı çıkmıyor.

### 2. Ana sayfa

- [ ] Premium üst panel taşma yapmıyor.
- [ ] DraBornLife başlığı okunuyor.
- [ ] APK YOK rozeti düzgün görünüyor.
- [ ] Hazırlık skoru kartı taşmıyor.
- [ ] Ana hedef kartı okunuyor.
- [ ] Gün rozeti düzgün görünüyor.
- [ ] Finans kartları iki kolon halinde düzgün görünüyor.
- [ ] Büyük tutarlar kart dışına taşmıyor.
- [ ] Alt menü ana sayfa içeriğini kapatmıyor.

### 3. Alt menü ve navigasyon

- [ ] Ana sayfadan Para ekranına geçiliyor.
- [ ] Borç ekranına geçiliyor.
- [ ] Liste ekranına geçiliyor.
- [ ] Yıl ekranına geçiliyor.
- [ ] Ayarlar ekranına geçiliyor.
- [ ] Geri dönüşlerde ekran kararmıyor veya donmuyor.
- [ ] Alt menü butonları okunuyor.

### 4. Para ekranı

- [ ] Gelir ekleniyor.
- [ ] Gider ekleniyor.
- [ ] Kategori seçilebiliyor.
- [ ] Filtreler çalışıyor.
- [ ] Para birimi TL seçilebiliyor.
- [ ] DOLAR seçilebiliyor.
- [ ] EURO seçilebiliyor.
- [ ] AED seçilebiliyor.
- [ ] Büyük tutarlar taşmıyor.
- [ ] Klavye açıldığında form kullanılıyor.

### 5. Borç ekranı

- [ ] Yeni borç ekleniyor.
- [ ] Borç düzenleniyor.
- [ ] Ödeme ekleniyor.
- [ ] Kalan borçtan büyük ödeme engelleniyor.
- [ ] Borç silinebiliyor.
- [ ] Tamamlanan borç doğru görünüyor.

### 6. Alınacaklar / Liste ekranı

- [ ] Yeni kalem ekleniyor.
- [ ] Kategori seçilebiliyor.
- [ ] Kalem düzenleniyor.
- [ ] Parası Birikti durumu çalışıyor.
- [ ] Satın Alındı durumu çalışıyor.
- [ ] Durum filtreleri çalışıyor.
- [ ] Uzun ürün isimleri taşmıyor.

### 7. Yıl ve özel hedefler

- [ ] Yıl ekranı açılıyor.
- [ ] Yıl seçimi çalışıyor.
- [ ] Hedef ekleniyor.
- [ ] Hedef düzenleniyor.
- [ ] Hedef siliniyor.
- [ ] Özel hedefler ekranı açılıyor.
- [ ] Özel hedef ekleme / düzenleme / silme çalışıyor.

### 8. Ayarlar ve yedek

- [ ] Ayarlar ekranı açılıyor.
- [ ] Hedef yıl kaydediliyor.
- [ ] Hedef tarih kaydediliyor.
- [ ] Hedef bölgeler kaydediliyor.
- [ ] Motosiklet fiyatı kaydediliyor.
- [ ] Para birimi ayarı korunuyor.
- [ ] Yedek dışa aktar metni oluşuyor.
- [ ] Yedek içe aktar alanı çalışıyor.
- [ ] Hatalı yedek metni uyarı veriyor.

## Hata raporlama formatı

Hata çıktığında kullanıcı şu formatla paylaşmalı:

```text
Ekran: Ana Sayfa / Para / Borç / Liste / Yıl / Ayarlar
Telefon: cihaz modeli
Sorun: ne oldu?
Beklenen: ne olması gerekiyordu?
Ekran görüntüsü: varsa ekle
Hata mesajı: varsa aynen kopyala
```

## v1.2.2 kapanış kriteri

- [x] Gerçek cihaz test protokolü oluşturuldu.
- [x] Test kontrol listesi yazıldı.
- [x] Hata raporlama formatı eklendi.
- [x] APK kapalı kararı korundu.
- [x] README ve v1.2 planı v1.2.3 sıradaki adım olacak şekilde güncellenecek.

## Sonraki adım

```text
v1.2.3 - Aile aktivite / aquapark / sahil planı ekranı geliştirme
```
