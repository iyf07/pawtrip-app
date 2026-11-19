import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Animated, View } from 'react-native';

import { BentoCard } from '@/features/circle/Bento';
import type { Tone } from '@/features/circle/Bento';
import { PressScale } from '@/components/ui/PressScale';
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

/** Put several ExpandBlocks in one group and only one is open at a time: opening another folds the first. */
const GroupCtx = createContext<{ open: string | null; set: (id: string | null) => void } | null>(null);
export function ExpandGroup({ children }: { children: ReactNode }) {
  const [open, set] = useState<string | null>(null);
  return <GroupCtx.Provider value={{ open, set }}>{children}</GroupCtx.Provider>;
}

/**
 * Icons only until tapped. A tap grows the card on a spring: the icons fade out, then the rows (label, answer,
 * description) fade in one after another and drift up a few pixels; a tap again plays it backwards. With nothing to show
 * it just renders `empty`. `max` keeps the folded view short ("+3" for the rest).
 */
export function ExpandBlock({ id, icons, rows, max, empty }: { id: string; icons: IconItem[]; rows: ReactNode[]; max?: number; empty?: ReactNode }) {
  const th = useTheme();
  const group = useContext(GroupCtx);
  const [local, setLocal] = useState(false);
  const open = group ? group.open === id : local;
  const [hC, setHC] = useState(0);
  const [hE, setHE] = useState(0);
  const [p] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.spring(p, { toValue: open ? 1 : 0, stiffness: 170, damping: 22, mass: 1, useNativeDriver: false }).start();
  }, [open, p]);
  if (icons.length === 0 && empty) return <>{empty}</>;

  const shown = max && icons.length > max ? icons.slice(0, max) : icons;
  const more = icons.length - shown.length;
  const items: IconItem[] = more > 0 ? [...shown, { key: '+more', node: <Text plain weight={800} size={20} style={{ color: th.muted }}>{`+${more}`}</Text>, label: `+${more}` }] : shown;
  const ready = hC > 0 && hE > 0;
  const fade = (from: number, to: number) => p.interpolate({ inputRange: [from, to], outputRange: [0, 1], extrapolate: 'clamp' });
  const layer = { position: 'absolute', top: 0, left: 0, right: 0 } as const;

  return (
    <PressScale accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={icons.map((i) => i.label).join(', ')} onPress={() => (group ? group.set(open ? null : id) : setLocal((o) => !o))} style={{ gap: 6 }}>
      <Animated.View style={{ overflow: 'hidden', height: ready ? p.interpolate({ inputRange: [0, 1], outputRange: [hC, hE] }) : undefined, minHeight: ready ? undefined : 68 }}>
        <Animated.View pointerEvents="none" onLayout={(e) => setHC(Math.ceil(e.nativeEvent.layout.height))} style={[layer, { opacity: p.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0], extrapolate: 'clamp' }) }]}>
          <IconGrid items={items} />
        </Animated.View>
        <Animated.View pointerEvents="none" onLayout={(e) => setHE(Math.ceil(e.nativeEvent.layout.height))} style={[layer, { gap: 12 }]}>
          {rows.map((r, i) => {
            const start = Math.min(0.3 + 0.07 * i, 0.55);
            return (
              <Animated.View key={i} style={{ opacity: fade(start, start + 0.4), transform: [{ translateY: p.interpolate({ inputRange: [start, start + 0.4], outputRange: [10, 0], extrapolate: 'clamp' }) }] }}>{r}</Animated.View>
            );
          })}
        </Animated.View>
      </Animated.View>
      <Animated.View style={{ alignSelf: 'flex-end', transform: [{ rotate: p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
        <Text plain size={16} weight={800} style={{ color: th.muted, lineHeight: 16 }}>⌄</Text>
      </Animated.View>
    </PressScale>
  );
}

/** A bento card whose body is an ExpandBlock. */
export function ExpandCard({ index, title, tone, children }: { index?: number; title: string; tone?: Tone; children: ReactNode }) {
  return <BentoCard index={index} title={title} tone={tone}>{children}</BentoCard>;
}
