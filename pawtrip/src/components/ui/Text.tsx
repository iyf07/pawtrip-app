import { Platform, Text as RNText, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Typeface pair: Manrope (Latin) + Noto Sans SC (Chinese). Same neutral, modern geometry, matching weights.
// Web loads both from Google Fonts (unicode-range slices, see the <link> in app/_layout.tsx); native loads Manrope from
// the package and uses the system Chinese face (PingFang SC / Noto Sans CJK).
const FAMILY = {
  400: 'Manrope_400Regular',
  600: 'Manrope_600SemiBold',
  700: 'Manrope_700Bold',
  800: 'Manrope_800ExtraBold',
} as const;

export type TextWeight = keyof typeof FAMILY;

const WEB_STACK = 'Manrope, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif';

// Display face for big titles, names and numerals (22 px and up, extra-bold): Fraunces (Latin) + Noto Serif SC (Chinese),
// a warm editorial serif pair. Everything smaller stays in the sans pair.
const DISPLAY_STACK = 'Fraunces, "Noto Serif SC", "Songti SC", "Source Han Serif SC", serif';
export function displayStyle() {
  return Platform.OS === 'web' ? ({ fontFamily: DISPLAY_STACK, fontWeight: '700' } as { fontFamily: string; fontWeight: '700' }) : { fontFamily: 'Fraunces_700Bold' };
}

/** The font style for a weight; use it for any text that is not drawn by `Text`. */
export function fontStyle(weight: TextWeight) {
  return Platform.OS === 'web' ? ({ fontFamily: WEB_STACK, fontWeight: String(weight) } as { fontFamily: string; fontWeight: '400' | '600' | '700' | '800' }) : { fontFamily: FAMILY[weight] };
}

export type AppTextProps = TextProps & {
  weight?: TextWeight;
  size?: number;
  color?: ThemeColor;
  /** Opt out of the playful title face (dates, symbols, codes): only page and section titles use it. */
  plain?: boolean;
};

/** App text: sans pair for body, serif pair for big titles/names/numerals; themed colour. */
export function Text({ weight = 600, size = 16, color = 'text', plain, style, ...rest }: AppTextProps) {
  const t = useTheme();
  return (
    <RNText
      {...rest}
      style={[{ ...(weight === 800 && size >= 22 && !plain ? displayStyle() : fontStyle(weight === 800 ? 700 : weight)), fontSize: size, lineHeight: Math.round(size * 1.4), color: t[color], letterSpacing: weight === 800 && size >= 22 && !plain ? -0.2 : undefined }, style]}
    />
  );
}

/** Small grey helper text (the prototype's `.meta`). */
export function Meta({ style, ...rest }: AppTextProps) {
  return <Text size={13} color="muted" {...rest} style={style} />;
}
