import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavBar } from '@/components/NavBar';
import { useInShell } from '@/components/shell/ShellContext';
import { COLUMN, type ColumnSize } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { RefreshScroll } from './RefreshScroll';
import { Text } from './Text';

type ScreenProps = {
  children: ReactNode;
  /** fixed content above the scroll area (headers, date strips) */
  top?: ReactNode;
  /** fixed content below the scroll area (e.g. a save bar) */
  bottom?: ReactNode;
  /** scroll the body (default). Use false for full-height layouts. */
  scroll?: boolean;
  /** extra bottom padding, e.g. to clear a tab bar */
  bottomPad?: number;
  /** skip the top safe-area inset (when a parent already applied it) */
  noTopInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** column width on large screens: narrow (forms), wide (lists), full (trip view) */
  size?: ColumnSize;
  /** show the app navigation bar (logo + profile) above everything */
  nav?: boolean;
};

/** Page shell: themed background, centred phone-width column on wide screens, safe areas. */
export function Screen({ children, top, bottom, scroll = true, bottomPad = 40, noTopInset, contentStyle, size = 'narrow', nav }: ScreenProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const inShell = useInShell();
  const nav2 = nav && !inShell; // the desktop shell already has the rail
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {nav2 ? <NavBar /> : null}
      <View style={{ flex: 1, width: '100%', maxWidth: COLUMN[size], alignSelf: 'center', paddingTop: noTopInset || nav2 ? 0 : insets.top }}>
        {top}
        {scroll ? (
          <RefreshScroll
            style={{ flex: 1 }}
            contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: bottomPad + insets.bottom }, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </RefreshScroll>
        ) : (
          <View style={[{ flex: 1, paddingHorizontal: 16 }, contentStyle]}>{children}</View>
        )}
        {bottom}
      </View>
    </View>
  );
}

type HeaderProps = {
  title?: string;
  subtitle?: string;
  /** replaces the subtitle text (e.g. a row of avatars) */
  subtitleNode?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

/** 3-column header: left action, centred title, right action. */
export function Header({ title, subtitle, subtitleNode, left, right }: HeaderProps) {
  const t = useTheme();
  const inShell = useInShell(); // no back links beside the rail
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: t.bg,
      }}>
      <View style={{ minWidth: 64, alignItems: 'flex-start' }}>{inShell ? null : left}</View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <Text weight={800} size={18} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitleNode ??
          (subtitle ? (
            <Text size={13} color="muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null)}
      </View>
      <View style={{ minWidth: 64, alignItems: 'flex-end' }}>{right}</View>
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

/** Back / cancel link for the left of a Header: compact, with its text flush to the page's left edge. */
export function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" hitSlop={{ top: 8, bottom: 8, right: 8 }} style={{ minHeight: 40, justifyContent: 'center' }}>
      <Text weight={800} color="link" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
