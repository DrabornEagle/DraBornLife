export const theme = {
  colors: {
    oceanDeep: '#06202A',
    ocean: '#073B4C',
    aqua: '#2DE2E6',
    aquaSoft: '#C8FBFF',
    miamiPink: '#FF5E7E',
    sunset: '#FFB347',
    coral: '#FF7A59',
    sand: '#FFF1D6',
    palm: '#2ECC71',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.18)',
    glassStrong: 'rgba(255, 255, 255, 0.28)',
    slate: '#52616B',
    textDark: '#102A35',
    textSoft: '#315661',
    muted: '#EAF9FA',
    page: '#F4FBF9',
    card: '#FFFFFF',
    cardSoft: '#E9FAFA',
    field: '#F8FFFF',
    border: '#BEEDEF',
    borderSoft: '#E4F2F1',
    line: '#D9F1F2',
    danger: '#FFD0D8',
    dangerText: '#7A1E2B',
    success: '#128C7E',
    warning: '#FFF1D6',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 34,
  },
  radius: {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 30,
    xxl: 34,
  },
  fontSize: {
    tiny: 10,
    label: 12,
    body: 13,
    bodyLarge: 15,
    cardTitle: 18,
    section: 21,
    title: 31,
    hero: 34,
  },
  fontWeight: {
    regular: '700',
    strong: '800',
    black: '900',
  },
  shadow: {
    card: { elevation: 3 },
    hero: { elevation: 6 },
  },
  cardStyle: {
    base: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E4F2F1',
      borderRadius: 24,
    },
    soft: {
      backgroundColor: '#E9FAFA',
      borderWidth: 1,
      borderColor: '#BEEDEF',
      borderRadius: 22,
    },
  },
};

export const screenPresets = {
  page: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  content: {
    padding: 18,
    paddingBottom: 170,
    backgroundColor: theme.colors.page,
  },
};

export const textPresets = {
  eyebrow: {
    color: theme.colors.coral,
    fontSize: theme.fontSize.label,
    fontWeight: theme.fontWeight.black,
    letterSpacing: 0.7,
  },
  title: {
    color: theme.colors.textDark,
    fontSize: theme.fontSize.title,
    lineHeight: 37,
    fontWeight: theme.fontWeight.black,
  },
  sectionTitle: {
    color: theme.colors.textDark,
    fontSize: theme.fontSize.section,
    lineHeight: 27,
    fontWeight: theme.fontWeight.black,
  },
  body: {
    color: theme.colors.textSoft,
    fontSize: theme.fontSize.body,
    lineHeight: 19,
    fontWeight: theme.fontWeight.strong,
  },
  label: {
    color: theme.colors.textSoft,
    fontSize: theme.fontSize.label,
    fontWeight: theme.fontWeight.black,
  },
};

export const mockSummary = {
  targetCity: 'Antalya',
  targetAreas: 'Muratpaşa • Lara • Konyaaltı',
  targetDateText: 'Ekim / Kasım 2026',
  remainingDaysText: 'Yeni hayat için geri sayım',
  targetBudget: '0 TL',
  savedAmount: '0 TL',
  debtLeft: '0 TL',
  shoppingReady: 0,
  shoppingBought: 0,
  motorcyclePrice: '130.000 TL',
};
