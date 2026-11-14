import { Platform, Text as RNText, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FAMILY = {
  400: 'Nunito_400Regular',
  600: 'Nunito_600SemiBold',
  700: 'Nunito_700Bold',
  800: 'Nunito_800ExtraBold',
} as const;

export type TextWeight = keyof typeof FAMILY;

/** Titles (extra-bold text from 18px up) use a playful rounded face; Latin letters from Fredoka, Chinese from ZCOOL KuaiLe. */
const DISPLAY = Platform.OS === 'web' ? 'Fredoka_700Bold, ZCOOLKuaiLe_400Regular, Nunito_800ExtraBold' : 'Fredoka_700Bold';

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
      style={[{ fontFamily: weight === 800 && size >= 18 && !plain ? DISPLAY : FAMILY[weight], fontSize: size, lineHeight: Math.round(size * 1.4), color: t[color] }, style]}
    />
  );
}

/** Small grey helper text (the prototype's `.meta`). */
export function Meta({ style, ...rest }: AppTextProps) {
  return <Text size={13} color="muted" {...rest} style={style} />;
}
