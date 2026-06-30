export const STORAGE_VERSION = 'v0.4.6';

export const defaultLifeData = {
  settings: {
    appName: 'DraBornLife',
    currentVersionCode: 'v0.4.6',
    selectedYear: 2026,
    targetCity: 'Antalya',
    targetAreas: ['Muratpasa', 'Lara', 'Konyaalti'],
    targetMoveMonthText: 'Ekim / Kasim 2026',
    preferredDeadlineText: 'GTA 6 cikmadan once tasinma hedefi',
    currency: 'TRY',
  },
  goals: {
    antalyaMove: { title: 'Antalya Yeni Hayat', targetAmount: 0, savedAmount: 0, targetDate: '2026-10-31', status: 'active' },
    motorcycle: { title: 'Yeni motosiklet', estimatedPrice: 130000, savedAmount: 0, oldMotorcycleSaleAmount: 0, isPriceEditable: true, status: 'planned' },
  },
  yearlyPlans: [
    { id: 'year_2026_antalya', year: 2026, title: '2026 Antalya yeni hayat', goalType: 'tasinma', country: 'Turkiye', city: 'Antalya', area: 'Muratpasa / Lara / Konyaalti', targetMonth: 'Ekim / Kasim', targetDate: '2026-10-31', estimatedBudget: 0, savedAmount: 0, status: 'active', note: 'GTA 6 cikmadan once Antalya duzeni kurma hedefi.' },
    { id: 'year_2027_future', year: 2027, title: '2027 yeni hedef', goalType: 'seyahat', country: '', city: '', area: '', targetMonth: '', targetDate: '', estimatedBudget: 0, savedAmount: 0, status: 'planned', note: 'Antalya sonrasi uzun vadeli aile, seyahat veya tasinma hedefi icin bos plan.' },
  ],
  lifePlans: {
    homeSetup: { title: 'Ev kurulum plani', targetAmount: 0, savedAmount: 0, status: 'active' },
    familyActivities: { title: 'Aile aktivite butcesi', monthlyBudget: 0, savedAmount: 0, status: 'active' },
    antalyaFun: { title: 'Antalya yasam keyfi', targetAmount: 0, savedAmount: 0, status: 'planned' },
  },
  homeSetupRooms: [
    { id: 'living_room', title: 'Salon', isCore: true, items: [] },
    { id: 'kitchen', title: 'Mutfak', isCore: true, items: [] },
    { id: 'bedroom', title: 'Yatak odasi', isCore: true, items: [] },
    { id: 'child_room', title: 'Cocuk odasi', isCore: true, items: [] },
    { id: 'bath_home', title: 'Banyo ve temel ev', isCore: true, items: [] },
  ],
  activities: [
    { id: 'activity_aquapark', title: 'Aile aquapark gunu', category: 'aquapark', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
    { id: 'activity_beach_day', title: 'Sahil piknigi', category: 'sahil', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
    { id: 'activity_family_dinner', title: 'Lara aile yemegi', category: 'yemek', estimatedPrice: 0, savedAmount: 0, isCompleted: false, note: '' },
  ],
  beaches: [
    { id: 'beach_lara', title: 'Lara Plaji', type: 'sahil', area: 'Lara', estimatedBudget: 0, status: 'planned', familyNote: '' },
    { id: 'beach_konyaalti', title: 'Konyaalti Sahili', type: 'sahil', area: 'Konyaalti', estimatedBudget: 0, status: 'planned', familyNote: '' },
    { id: 'aqua_antalya', title: 'Aquapark hedefi', type: 'aquapark', area: 'Antalya', estimatedBudget: 0, status: 'planned', familyNote: '' },
  ],
  customGoals: [],
  moneyEntries: [],
  shoppingItems: [
    { id: 'rent_deposit', category: 'Kira / Depozito', title: 'Kira ve depozito', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'white_goods', category: 'Beyaz esya', title: 'Beyaz esya seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'furniture', category: 'Mobilya', title: 'Mobilya seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'kitchen_home', category: 'Mutfak / ev temel', title: 'Mutfak ve ev temel seti', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'child_room', category: 'Cocuk odasi', title: 'Cocuk odasi', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'first_month', category: 'Ilk ay yasam', title: 'Ilk ay yasam butcesi', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'antalya_fun', category: 'Antalya eglence', title: 'Antalya aile eglence butcesi', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'gta6_setup', category: 'GTA 6 seti', title: 'PS5 Pro + TV', estimatedPrice: 0, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: '' },
    { id: 'motorcycle', category: 'Motosiklet', title: 'Sifir motosiklet', estimatedPrice: 130000, quantity: 1, savedAmount: 0, isMoneyReady: false, isPurchasedOrInstalled: false, note: 'Fiyat duzenlenebilir.' },
  ],
  debtEntries: [],
};
