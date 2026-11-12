import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_WIDTH } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type ScreenProps = {
  children: ReactNode;
  /** fixed content above the scroll area (headers, date strips) */
  top?: ReactNode;
  /** scroll the body (default). Use false for full-height layouts. */
  scroll?: boolean;
  /** extra bottom padding, e.g. to clear a tab bar */
  bottomPad?: number;
  /** skip the top safe-area inset (when a parent already applied it) */
  noTopInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Page shell: themed background, centred phone-width column on wide screens, safe areas. */
export function Screen({ children, top, scroll = true, bottomPad = 40, noTopInset, contentStyle }: ScreenProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingTop: noTopInset ? 0 : insets.top }}>
        {top}
        {scroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: bottomPad + insets.bottom }, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1, paddingHorizontal: 16 }, contentStyle]}>{children}</View>
        )}
      </View>
    </View>
  );
}

type HeaderProps = {
  title?: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
};

/** 3-column header: left action, centred title, right action. */
export function Header({ title, subtitle, left, right }: HeaderProps) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingHorizontal: 16,
        backgroundColor: t.bg,
      }}>
      <View style={{ width: 80, alignItems: 'flex-start' }}>{left}</View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <Text weight={800} size={18} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text size={13} color="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ minWidth: 80, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/** Section title with the dashed rule (the prototype's `.sec-title`). */
export function SectionTitle({ children }: { children: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 12 }}>
      <Text weight={800} size={20}>
        {children}
      </Text>
      <View style={{ flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: t.line }} />
    </View>
  );
}
