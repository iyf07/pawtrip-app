// PawTrip design tokens, ported from the prototype ("sticker" look: warm paper, gold accent).
// Every colour used in the UI comes from here so dark mode is a single switch.

const light = {
  gold: '#FFC72C',
  onGold: '#4A3628',
  link: '#8A5D00',
  blue: '#3D7590',
  blueBg: '#CDE7F0',
  bg: '#F6EBD9',
  card: '#FFFDF7',
  line: '#E2C9A0',
  text: '#5B4636',
  muted: '#7A6047',
  ok: '#1F7A4A',
  okBg: '#DCEFE2',
  warn: '#B33A08',
  warnBg: '#FCE4D4',
  danger: '#B42318',
  dangerBg: '#FBE1DE',
  goldBg: '#FFF0C4',
  sticker: '#FFFFFF',
  shadow: 'rgba(139,107,69,0.35)',
  skel: '#EADBC2',
  scrim: 'rgba(74,54,40,0.38)',
  toastBg: '#5B4636',
  toastText: '#FFFDF7',
  night: 'rgba(70,80,140,0.07)',
  sun: '#D9962B',
  sunset: '#C96A3A',
};

const dark: typeof light = {
  gold: '#FFC72C',
  onGold: '#4A3628',
  link: '#FFD15C',
  blue: '#8EC5DD',
  blueBg: '#1F3E4B',
  bg: '#231B15',
  card: '#2F251D',
  line: '#5A4633',
  text: '#F1E2CC',
  muted: '#C8AF90',
  ok: '#6CCB92',
  okBg: '#1D3A29',
  warn: '#FF9C66',
  warnBg: '#47291A',
  danger: '#FF8A7E',
  dangerBg: '#4A2220',
  goldBg: '#433514',
  sticker: '#46382B',
  shadow: 'rgba(0,0,0,0.5)',
  skel: '#3B2F25',
  scrim: 'rgba(0,0,0,0.55)',
  toastBg: '#F1E2CC',
  toastText: '#231B15',
  night: 'rgba(0,0,0,0.22)',
  sun: '#E8B65A',
  sunset: '#E8915F',
};

export const Colors = { light, dark } as const;
export type Theme = typeof light;
export type ThemeColor = keyof Theme;

/** Max width of the app column on wide screens (the prototype is a phone-sized column). */
export const MAX_WIDTH = 480;

/** Avatar background colours, picked by hashing the user id. */
export const AVATAR_COLORS = ['#F2A65A', '#8CC7B2', '#C3A6E0', '#F29C9C', '#A9C5F2', '#E8D27A'];

/** Calendar / card colours per item category: [accent, tint]. */
export type CatKey = 'outdoors' | 'food' | 'coffee' | 'sights' | 'shopping' | 'drinks' | 'fun' | 'stay' | 'transit';
export const CAT_COLORS: Record<'light' | 'dark', Record<CatKey, { c: string; tint: string }>> = {
  light: {
    outdoors: { c: '#3E8E57', tint: '#DCEEDF' },
    food: { c: '#D9702E', tint: '#FBE5D3' },
    coffee: { c: '#8B5A3C', tint: '#EFDFD2' },
    sights: { c: '#7B5EA7', tint: '#E9E1F4' },
    shopping: { c: '#C2477F', tint: '#F7DCE8' },
    fun: { c: '#B8860B', tint: '#FBF0CF' },
    drinks: { c: '#9B2C4A', tint: '#F5DCE3' },
    stay: { c: '#3D7590', tint: '#CDE7F0' },
    transit: { c: '#8F806F', tint: '#ECE3D6' },
  },
  dark: {
    outdoors: { c: '#6CC48A', tint: '#1F3A28' },
    food: { c: '#F0904E', tint: '#4A2E1C' },
    coffee: { c: '#C99A78', tint: '#3D2C21' },
    sights: { c: '#B39BDB', tint: '#33284A' },
    shopping: { c: '#E68AB3', tint: '#4A2234' },
    fun: { c: '#E6BE4F', tint: '#433514' },
    drinks: { c: '#E07A95', tint: '#45202B' },
    stay: { c: '#7DB6D0', tint: '#1F3E4B' },
    transit: { c: '#B3A391', tint: '#3A322A' },
  },
};
