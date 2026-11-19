import { useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavBar } from '@/components/NavBar';
import { useInShell, useNavProvided } from '@/components/shell/ShellContext';
import { COLUMN, type ColumnSize } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';

import { RefreshScroll } from './RefreshScroll';
import { ScrollTopButton, scrollToTopSmooth } from './ScrollTopButton';
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
  const navProvided = useNavProvided();
  const nav2 = nav && !inShell && !navProvided; // the desktop shell has the rail, phones have the app-level nav bar
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [past, setPast] = useState(false); // scrolled past one screen
  const y = useRef(0);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {nav2 ? <NavBar /> : null}
      <View style={{ flex: 1, width: '100%', maxWidth: COLUMN[size], alignSelf: 'center', paddingTop: noTopInset || nav2 || navProvided ? 0 : insets.top }}>
        {top}
        {scroll ? (
          <View style={{ flex: 1 }}>
          <RefreshScroll
            ref={scrollRef}
            scrollEventThrottle={32}
            onScroll={(e) => {
              const { contentOffset, layoutMeasurement } = e.nativeEvent;
              y.current = contentOffset.y;
              const next = contentOffset.y > layoutMeasurement.height;
              setPast((cur) => (cur === next ? cur : next));
            }}
            style={{ flex: 1 }}
            contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: bottomPad + insets.bottom }, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </RefreshScroll>
          <ScrollTopButton visible={past} bottom={16} onPress={() => scrollToTopSmooth((to) => scrollRef.current?.scrollTo({ y: to, animated: false }), y.current)} />
          </View>
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
  titleSize?: number;
  sideWidth?: number;
  onTitlePress?: () => void;
  titleAccessibilityLabel?: string;
  subtitle?: string;
  /** replaces the subtitle text (e.g. a row of avatars) */
  subtitleNode?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

/** 3-column header: left action, centred title, right action. */
export function Header({ title, titleSize, sideWidth = 64, onTitlePress, titleAccessibilityLabel, subtitle, subtitleNode, left, right }: HeaderProps) {
  const t = useTheme();
  const inShell = useInShell(); // no back links beside the rail
  const { wide } = useLayout();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        paddingHorizontal: 16,
        paddingTop: inShell ? 22 : 4, // breathing room above the title now that there is no top navbar
        paddingBottom: 4,
        backgroundColor: t.bg,
      }}>
      <View style={{ minWidth: sideWidth, alignItems: 'flex-start' }}>{inShell ? null : left}</View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          onTitlePress ? <Pressable onPress={onTitlePress} accessibilityRole="button" accessibilityLabel={titleAccessibilityLabel ?? title} style={{ maxWidth: '100%' }}>
            <Text weight={800} size={titleSize ?? (wide ? 32 : 26)} numberOfLines={1}>{title}</Text>
          </Pressable> : <Text weight={800} size={titleSize ?? (wide ? 32 : 26)} numberOfLines={1}>{title}</Text>
        ) : null}
        {subtitleNode ??
          (subtitle ? (
            <Text size={13} color="muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null)}
      </View>
      <View style={{ minWidth: sideWidth, alignItems: 'flex-end' }}>{right}</View>
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

/** Back button for the left of a Header: the same round control as the other icon buttons (the label is for screen readers). */
export function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.card, borderWidth: 2, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
      <Text plain weight={800} size={24} color="muted" style={{ lineHeight: 28, marginTop: -2 }}>
        ‹
      </Text>
    </Pressable>
  );
}
