# DraBornLife v0.1 Veri Modeli Taslağı

v0.1 için veri cihaz içinde lokal saklanacak. Supabase veya cloud database kullanılmayacak.

## AppSettings

Uygulama genel ayarları.

- `appName`: DraBornLife
- `currentVersionCode`: örnek `v0.0.1`
- `targetCity`: Antalya
- `targetDistricts`: Muratpaşa / Lara / Konyaaltı
- `targetMoveMonth`: Ekim / Kasım 2026 plan aralığı
- `preferredMoveDeadline`: GTA 6 çıkışından önce taşınma hedefi
- `currency`: TRY

## LifeGoal

Ana yaşam hedefi.

- `id`
- `title`
- `description`
- `targetDate`
- `targetAmount`
- `savedAmount`
- `status`: aktif / tamamlandı / ertelendi

Örnek hedefler:

- Antalya’ya taşınma
- Yeni ev kurma
- Yeni motosiklet alma
- GTA 6 seti hazırlığı

## MoneyEntry

Gelir-gider hareketleri.

- `id`
- `type`: gelir / gider
- `title`
- `amount`
- `category`
- `date`
- `note`
- `savingPartAmount`

## ShoppingItem

Alınacaklar listesi.

- `id`
- `category`
- `title`
- `estimatedPrice`
- `quantity`
- `savedAmount`
- `isMoneyReady`: Parası Birikti
- `isPurchasedOrInstalled`: Satın Alındı / Kuruldu
- `note`

Kategoriler:

- Kira / Depozito
- Beyaz eşya
- Mobilya
- Mutfak / ev temel
- Çocuk odası
- İlk ay yaşam
- Antalya eğlence
- GTA 6 seti
- Motosiklet

## DebtEntry

Borç takibi.

- `id`
- `title`
- `totalDebt`
- `paidAmount`
- `remainingDebt`
- `targetFinishDate`
- `note`

## MotorcycleGoal

Motosiklet yenileme hedefi.

- `id`
- `title`: Yeni motosiklet
- `estimatedPrice`: varsayılan 130000
- `savedAmount`
- `oldMotorcycleSaleAmount`
- `isPriceEditable`: true
- `status`: planlandı / parası birikti / satın alındı

## BackupFile

Manuel dışa aktar / içe aktar için tek paket veri mantığı.

- `backupVersion`
- `createdAt`
- `settings`
- `lifeGoals`
- `moneyEntries`
- `shoppingItems`
- `debtEntries`
- `motorcycleGoal`

## v0.1 veri saklama kuralı

- İnternet gerekmez.
- Hesap girişi gerekmez.
- Veriler cihazda saklanır.
- Kullanıcı manuel yedek alabilir.
- Kullanıcı yeni telefonda yedek dosyasını içe aktarabilir.
