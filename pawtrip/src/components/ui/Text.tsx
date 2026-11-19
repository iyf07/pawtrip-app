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

/** App text: Nunito (Latin) with system fallback for CJK, themed colour. */
export function Text({ weight = 600, size = 16, color = 'text', plain, style, ...rest }: AppTextProps) {
  const t = useTheme();
  return (
    <RNText
      {...rest}
      style={[{ ...fontStyle(weight), fontSize: size, lineHeight: Math.round(size * 1.4), color: t[color], letterSpacing: weight === 800 && size >= 22 && !plain ? -0.3 : undefined }, style]}
    />
  );
}

/** Small grey helper text (the prototype's `.meta`). */
export function Meta({ style, ...rest }: AppTextProps) {
  return <Text size={13} color="muted" {...rest} style={style} />;
}
