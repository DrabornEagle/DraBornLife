export const STORAGE_VERSION = 'v0.2.5';

export const defaultLifeData = {
  settings: {
    appName: 'DraBornLife',
    currentVersionCode: 'v0.2.5',
    targetCity: 'Antalya',
    targetAreas: ['Muratpaşa', 'Lara', 'Konyaaltı'],
    targetMoveMonthText: 'Ekim / Kasım 2026',
    preferredDeadlineText: 'GTA 6 çıkmadan önce taşınma hedefi',
    currency: 'TRY',
  },
  goals: {
    antalyaMove: {
      title: 'Antalya’ya Yeni Hayat',
      targetAmount: 0,
      savedAmount: 0,
      targetDate: '2026-10-31',
      status: 'active',
    },
    motorcycle: {
      title: 'Yeni motosiklet',
      estimatedPrice: 130000,
      savedAmount: 0,
      oldMotorcycleSaleAmount: 0,
      isPriceEditable: true,
      status: 'planned',
    },
  },
  moneyEntries: [],
  shoppingItems: [
    { id: 'rent_deposit', category: 'Kira / Depozito', title: 'Kira ve depozito', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'white_goods', category: 'Beyaz eşya', title: 'Beyaz eşya seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'furniture', category: 'Mobilya', title: 'Mobilya seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'kitchen_home', category: 'Mutfak / ev temel', title: 'Mutfak ve ev temel seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'child_room', category: 'Çocuk odası', title: 'Çocuk odası', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'first_month', category: 'İlk ay yaşam', title: 'İlk ay yaşam bütçesi', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'antalya_fun', category: 'Antalya eğlence', title: 'Antalya aile eğlence bütçesi', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'gta6_setup', category: 'GTA 6 seti', title: 'PS5 Pro + TV', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'motorcycle', category: 'Motosiklet', title: 'Sıfır motosiklet', estimatedPrice: 130000, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: 'Fiyat düzenlenebilir.' },
  ],
  debtEntries: [],
};
