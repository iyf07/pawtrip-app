import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { BentoCard } from '@/features/circle/Bento';
import type { Tone } from '@/features/circle/Bento';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';

export type IconItem = { key: string; node: ReactNode; label: string };

/** Icons only, big and easy to see; each carries its name for screen readers. */
export function IconGrid({ items }: { items: IconItem[] }) {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {items.map((it) => (
        <View key={it.key} accessible accessibilityLabel={it.label} style={{ width: 68, height: 68, borderRadius: 20, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center' }}>{it.node}</View>
      ))}
    </View>
  );
}

function Fade({ children }: { children: ReactNode }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 220, useNativeDriver: process.env.EXPO_OS !== 'web' }).start();
  }, [v]);
  return <Animated.View style={{ opacity: v }}>{children}</Animated.View>;
}

/**
 * Shows only icons until it is tapped; a tap swaps them for the full view (labels, descriptions) and a tap again folds it
 * back. With nothing to show it just renders `empty`.
 */
export function ExpandBlock({ icons, children, empty }: { icons: IconItem[]; children: ReactNode; empty?: ReactNode }) {
  const th = useTheme();
  const [open, setOpen] = useState(false);
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  if (icons.length === 0 && empty) return <>{empty}</>;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={icons.map((i) => i.label).join(', ')} onPress={() => setOpen((o) => !o)} style={{ gap: 6 }}>
      <Fade key={open ? 'open' : 'closed'}>{open ? children : <IconGrid items={icons} />}</Fade>
      <Text plain size={16} weight={800} style={{ color: th.muted, alignSelf: 'flex-end', lineHeight: 16 }}>{open ? '⌃' : '⌄'}</Text>
    </Pressable>
  );
}

/** A bento card whose body is an ExpandBlock. */
export function ExpandCard({ index, title, tone, icons, empty, children }: { index?: number; title: string; tone?: Tone; icons: IconItem[]; empty?: ReactNode; children: ReactNode }) {
  return (
    <BentoCard index={index} title={title} tone={tone}>
      <ExpandBlock icons={icons} empty={empty}>{children}</ExpandBlock>
    </BentoCard>
  );
}
