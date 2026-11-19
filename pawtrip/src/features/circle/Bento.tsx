import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from '@/components/ui/PressScale';
import { Text } from '@/components/ui/Text';
import { Reveal } from '@/components/ui/Reveal';
import { useTheme } from '@/hooks/use-theme';

export const BENTO_GAP = 12; // the seam between cards
export const BENTO_RADIUS = 24; // every card's corner

/** Width of one column and the height of one row of a 2-column bento that fills `width` edge to edge. */
export function bentoUnits(width: number) {
  const col = Math.max(0, (width - BENTO_GAP) / 2);
  return { col, row: Math.round(col * 0.85) };
}

/**
 * One bento card: 24 px corners, sits flush in the grid (the grid supplies the 12 px seams), enters with the list
 * stagger and springs on press. One card says one thing.
 */
export function Tile({ index, width, height, onPress, dashed, accessibilityLabel, children, style }: { index: number; width: number; height: number; onPress?: () => void; dashed?: boolean; accessibilityLabel?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  const body = (
    <View style={[{ flex: 1, borderRadius: BENTO_RADIUS, overflow: 'hidden', backgroundColor: dashed ? 'transparent' : th.card, borderWidth: dashed ? 2.5 : 2, borderStyle: dashed ? 'dashed' : 'solid', borderColor: th.line }, style]}>{children}</View>
  );
  return (
    <Reveal index={index} style={{ width, height }}>
      {onPress ? <PressScale onPress={onPress} accessibilityLabel={accessibilityLabel} style={{ flex: 1 }}>{body}</PressScale> : body}
    </Reveal>
  );
}

/** Small title of a card, with the one "+" action at its right end (the same plus on every card). */
export function TileHeader({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
      <Text weight={800} size={16} numberOfLines={1} style={{ flex: 1 }}>{title}</Text>
      {onAdd ? (
        <PressScale onPress={onAdd} accessibilityRole="button" accessibilityLabel={addLabel ?? title} hitSlop={6} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: th.gold, borderWidth: 2.5, borderColor: th.sticker, alignItems: 'center', justifyContent: 'center' }}>
          <Text plain size={20} weight={800} color="onGold" style={{ lineHeight: 22 }}>+</Text>
        </PressScale>
      ) : null}
    </View>
  );
}
