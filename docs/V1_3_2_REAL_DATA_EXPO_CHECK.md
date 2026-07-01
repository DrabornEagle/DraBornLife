# DraBornLife v1.3.2 Gerçek Kullanıcı Verisi ile Expo Go Kontrolü

## Hedef

v1.3.2'nin amacı uygulamayı demo veri mantığından çıkarıp gerçek kullanım senaryolarıyla kontrol etmektir. Bu adımda APK alınmaz; tüm test Expo Go üzerinde yapılır.

## Yedek

Bu adım öncesinde kısa isimli yedek branch alındı:

```text
b132
```

## Kontrol yöntemi

Her testte şu 4 bilgi not edilir:

- Ekran açıldı mı?
- Veri kaydedildi mi?
- Ana sayfa / özetler güncellendi mi?
- Taşan yazı, bozuk kart, kaybolan buton var mı?

## Test 1 - Gerçek gelir kaydı

Örnek veri:

```text
Başlık: Günlük kazanç
Tutar: 1500
Tür: Gelir
Birikime ayrılan: 500
Not: Gerçek test geliri
```

Kontrol:

- [ ] Gelir kaydı ekleniyor.
- [ ] Para ekranında görünüyor.
- [ ] Ana sayfada birikim / kalan bütçe değişiyor.
- [ ] Haftalık ve aylık tempo kartları bozulmuyor.

## Test 2 - Gerçek gider kaydı

Örnek veri:

```text
Başlık: Market alışverişi
Tutar: 750
Tür: Gider
Not: Gerçek test gideri
```

Kontrol:

- [ ] Gider kaydı ekleniyor.
- [ ] Para ekranında görünüyor.
- [ ] Ana sayfada net bütçe değişiyor.
- [ ] Büyük para tutarlarında yazı taşmıyor.

## Test 3 - Gerçek borç kaydı

Örnek veri:

```text
Borç adı: Kredi kartı
Toplam borç: 25000
Ödenen: 5000
Hedef bitiş: 2026-10-31
```

Kontrol:

- [ ] Borç ekleniyor.
- [ ] Haftalık ödeme önerisi görünüyor.
- [ ] Aylık ödeme önerisi görünüyor.
- [ ] Ödeme ekleyince kalan tutar değişiyor.
- [ ] Borç kapanınca Kapandı yazıyor.

## Test 4 - Gerçek ev eşyası kaydı

Örnek veri:

```text
Oda: Salon
Eşya: Koltuk takımı
Grup: Temel mobilya
Tahmini fiyat: 35000
```

Kontrol:

- [ ] Oda seçimi çalışıyor.
- [ ] Eşya ekleniyor.
- [ ] Grup filtresi çalışıyor.
- [ ] Oda toplam bütçesi değişiyor.
- [ ] Ana sayfada ev kurulum bütçesi değişiyor.

## Test 5 - Gerçek aile aktivitesi kaydı

Örnek veri:

```text
Aktivite: Aile aquapark günü
Kategori: Aquapark
Tahmini fiyat: 2500
Biriken: 500
Hedef ay: Haziran 2027
```

Kontrol:

- [ ] Aktivite ekleniyor.
- [ ] Kategori filtresi çalışıyor.
- [ ] Durum filtresi çalışıyor.
- [ ] Ana sayfada aile aktivite bütçesi değişiyor.

## Test 6 - Antalya bölge notu

Örnek kontrol:

```text
Bölge: Lara
Kira: 3
Ulaşım: 4
Sahil: 5
Aile: 5
Market: 4
Kişisel not: Sahile yakın ama kira takip edilmeli.
```

Kontrol:

- [ ] Bölge seçimi çalışıyor.
- [ ] Puanlar değişiyor.
- [ ] Ortalama skor değişiyor.
- [ ] Kişisel not kaydediliyor.

## Test 7 - Yedek dışa aktar

Kontrol:

- [ ] Yedek metni oluşturuluyor.
- [ ] backupSummary alanı var.
- [ ] createdAt alanı var.
- [ ] regionNotes alanı var.
- [ ] debtEntries alanı var.
- [ ] homeSetupRooms alanı var.

## Test 8 - Hatalı yedek içe aktar

Örnek hatalı metin:

```text
bu bir yedek değildir
```

Kontrol:

- [ ] Uygulama çökmeden hata veriyor.
- [ ] Hata mesajı anlaşılır görünüyor.
- [ ] Mevcut veri silinmiyor.

## Test 9 - Doğru yedek içe aktar

Kontrol:

- [ ] Önce mevcut veri dışa aktarılıyor.
- [ ] Yedek metni içe aktarılıyor.
- [ ] Geri yükleme sonrası kayıt sayısı mesajda görünüyor.
- [ ] Ana sayfa açılıyor.
- [ ] Ayarlar ekranı açılıyor.

## Küçük ekran kontrolü

- [ ] Alt menü taşmıyor.
- [ ] Ana sayfa kritik kartları okunuyor.
- [ ] Para tutarları kart dışına çıkmıyor.
- [ ] Butonlar ekranın altında kaybolmuyor.
- [ ] Klavye açıkken form alanları kullanılabiliyor.

## v1.3.2 kapanış kriteri

- [x] Test protokolü yazıldı.
- [x] Gerçek veri senaryoları hazırlandı.
- [x] APK kapalı kararı korundu.
- [x] Sıradaki adım v1.3.3 olarak belirlendi.

## Sonraki adım

```text
v1.3.3 - Ana sayfa karar sistemi iyileştirme
```
