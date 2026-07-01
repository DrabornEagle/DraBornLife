# DraBornLife v1.1 Stabilizasyon Master Checklist

## Amaç

v1.1 sürümünün amacı yeni büyük özellik eklemek değil; v1.0 sonrası uygulamayı Expo Go geliştirme akışında daha güvenli, anlaşılır ve test edilebilir hale getirmektir.

Bu doküman v1.1.1 ile v1.1.10 arasındaki tüm stabilizasyon adımlarını tek listede kapatır.

## Kesin APK kararı

APK alınmadı.

APK build süreci başlatılmadı.

APK build süreci sadece kullanıcı açıkça şu komutu verirse başlar:

```text
APK almaya başlayalım
```

Bu komut gelmeden:

- EAS build başlatılmayacak.
- APK üretimi yapılmayacak.
- Android versionCode artırılmayacak.
- Build ayarı açılmayacak.

## v1.1.1 - Stabilizasyon planı ve ana checklist

- [x] v1.1 ana stabilizasyon hedefi belirlendi.
- [x] v1.1.1 - v1.1.10 kapsamı tek master listeye alındı.
- [x] APK kapalı kararı tekrar yazıldı.
- [x] Repo düzeyinde v1.1 kapanışı için dokümantasyon yapısı oluşturuldu.

## v1.1.2 - Expo Go açılış ve navigasyon testi

- [x] Loading ekranı kontrol listesine eklendi.
- [x] Ana sayfa açılış kontrolü listeye eklendi.
- [x] Alt menü sekme geçişleri kontrol listesine eklendi.
- [x] Scroll ve alt menü çakışma kontrolü listeye eklendi.
- [x] APK build denenmemesi şartı eklendi.

## v1.1.3 - Premium ana sayfa kullanım testi

- [x] Boş veri görünümü kontrol listesine eklendi.
- [x] Dolu veri görünümü kontrol listesine eklendi.
- [x] Büyük para tutarı taşma kontrolü eklendi.
- [x] Hazırlık skoru kontrolü eklendi.
- [x] Ana hedef ve dashboard kartları kontrol listesine eklendi.

## v1.1.4 - Para ekranı test ve düzeltme listesi

- [x] Gelir ekleme kontrolü eklendi.
- [x] Gider ekleme kontrolü eklendi.
- [x] Kayıt düzenleme ve silme kontrolü eklendi.
- [x] Kategori ve filtre kontrolü eklendi.
- [x] TL / DOLAR / EURO / AED görünüm kontrolü eklendi.
- [x] Hatalı tutar uyarısı kontrolü eklendi.

## v1.1.5 - Borç ekranı test ve düzeltme listesi

- [x] Borç ekleme kontrolü eklendi.
- [x] Borç düzenleme ve silme kontrolü eklendi.
- [x] Ödeme ekleme kontrolü eklendi.
- [x] Kalan borçtan büyük ödeme engeli kontrolü eklendi.
- [x] Tamamlanan borç görünümü kontrolü eklendi.

## v1.1.6 - Alınacaklar / Liste ekranı test ve düzeltme listesi

- [x] Kalem ekleme kontrolü eklendi.
- [x] Kalem düzenleme ve silme kontrolü eklendi.
- [x] Kategori seçimi kontrolü eklendi.
- [x] Durum filtreleri kontrolü eklendi.
- [x] Parası Birikti ve Satın Alındı butonları kontrol listesine eklendi.
- [x] Motosiklet fiyat senkron kontrolü eklendi.

## v1.1.7 - Yıl ekranı ve özel hedefler testi

- [x] Yıl seçimi kontrolü eklendi.
- [x] Yıllık hedef ekleme kontrolü eklendi.
- [x] Hedef düzenleme, silme ve durum değiştirme kontrolü eklendi.
- [x] Birikim geri sayımı kontrolü eklendi.
- [x] Özel hedef ekleme / tamamlama / düzenleme / silme kontrolü eklendi.

## v1.1.8 - Ayarlar, yedek ve geri yükleme testi

- [x] Hedef yıl kaydetme kontrolü eklendi.
- [x] Antalya hedef tarihi ve bölge kaydetme kontrolü eklendi.
- [x] Motosiklet fiyatı kaydetme kontrolü eklendi.
- [x] Para birimi ayarı korunuyor mu kontrolü eklendi.
- [x] Yedek dışa aktar kontrolü eklendi.
- [x] Yedek içe aktar kontrolü eklendi.
- [x] Hatalı yedek metni uyarısı kontrolü eklendi.

## v1.1.9 - Türkçe karakter, metin ve para birimi final taraması

- [x] Türkçe karakter kontrol listesi eklendi.
- [x] TRY görünen yer kalmış mı kontrolü eklendi.
- [x] TL kullanıcı görünümü kontrolü eklendi.
- [x] DOLAR / EURO / AED gösterim kontrolü eklendi.
- [x] İngilizce kalan kullanıcı metinleri için kontrol maddesi eklendi.

## v1.1.10 - Stabilizasyon kapanışı

- [x] v1.1 master checklist tamamlandı.
- [x] README v1.1 kapanış durumuna alındı.
- [x] v1.1 kapanış dokümanı oluşturuldu.
- [x] Sıradaki sürüm v1.2 olarak işaretlendi.
- [x] APK build süreci başlatılmadı.

## Manuel Expo Go kontrol notu

Bu liste repo tarafında tamamlandı. Fiziksel telefon üzerinde gerçek Expo Go kontrolü ayrıca yapılmalıdır. Telefon kontrolü sırasında görülen taşma, bozulma veya veri kaydı hataları v1.2 veya patch sürümünde düzeltilecektir.
