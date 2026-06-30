export const STORAGE_VERSION = 'v1.0.5';

export const defaultLifeData = {
  settings: {
    appName: 'DraBornLife',
    currentVersionCode: 'v1.0.5',
    selectedYear: 2026,
    targetCity: 'Antalya',
    targetAreas: ['Muratpaşa', 'Lara', 'Konyaaltı'],
    targetMoveMonthText: 'Ekim / Kasım 2026',
    preferredDeadlineText: 'GTA 6 çıkmadan önce taşınma hedefi',
    currency: 'TL',
  },
  goals: {
    antalyaMove: { title: 'Antalya Yeni Hayat', targetAmount: 0, savedAmount: 0, targetDate: '2026-10-31', status: 'active' },
    motorcycle: { title: 'Yeni motosiklet', estimatedPrice: 130000, savedAmount: 0, oldMotorcycleSaleAmount: 0, isPriceEditable: true, status: 'planned' },
  },
  yearlyPlans: [
    { id: 'year_2026_antalya', year: 2026, title: '2026 Antalya yeni hayat', goalType: 'tasinma', country: 'Türkiye', city: 'Antalya', area: 'Muratpaşa / Lara / Konyaaltı', targetMonth: 'Ekim / Kasım', targetDate: '2026-10-31', estimatedBudget: 0, savedAmount: 0, status: 'active', note: 'GTA 6 çıkmadan önce Antalya düzeni kurma hedefi.' },
    { id: 'year_2027_future', year: 2027, title: '2027 yeni hedef', goalType: 'seyahat', country: '', city: '', area: '', targetMonth: '', targetDate: '', estimatedBudget: 0, savedAmount: 0, status: 'planned', note: 'Antalya sonrası uzun vadeli aile, seyahat veya taşınma hedefi için boş plan.' },
  ],
  lifePlans: {
    homeSetup: { title: 'Ev kurulum planı', targetAmount: 0, savedAmount: 0, status: 'active' },
    familyActivities: { title: 'Aile aktivite bütçesi', monthlyBudget: 0, savedAmount: 0, status: 'active' },
    antalyaFun: { title: 'Antalya yaşam keyfi', targetAmount: 0, savedAmount: 0, status: 'planned' },
  },
  homeSetupRooms: [
    { id: 'living_room', title: 'Salon', isCore: true, items: [] },
    { id: 'kitchen', title: 'Mutfak', isCore: true, items: [] },
    { id: 'bedroom', title: 'Yatak odası', isCore: true, items: [] },
    { id: 'child_room', title: 'Çocuk odası', isCore: true, items: [] },
    { id: 'bath_home', title: 'Banyo ve temel ev', isCore: true, items: [] },
  ],
  activities: [
    { id: 'activity_aquapark', title: 'Aile aquapark günü', category: 'aquapark', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
    { id: 'activity_beach_day', title: 'Sahil pikniği', category: 'sahil', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
    { id: 'activity_family_dinner', title: 'Lara aile yemeği', category: 'yemek', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
  ],
  beaches: [
    { id: 'beach_lara', title: 'Lara Plajı', type: 'sahil', area: 'Lara', estimatedBudget: 0, status: 'planned', familyNote: '' },
    { id: 'beach_konyaalti', title: 'Konyaaltı Sahili', type: 'sahil', area: 'Konyaaltı', estimatedBudget: 0, status: 'planned', familyNote: '' },
    { id: 'aqua_antalya', title: 'Aquapark hedefi', type: 'aquapark', area: 'Antalya', estimatedBudget: 0, status: 'planned', familyNote: '' },
  ],
  customGoals: [],
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
