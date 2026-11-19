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

export type Tone = 'card' | 'gold' | 'tint';

/**
 * One bento card: 24 px corners, no outline, a soft shadow; sits flush in the grid (the grid supplies the 12 px
 * seams), enters with the list stagger and springs on press. `tone` gives the grid its rhythm: white, a warm cream or a pale blue tint. One card says one thing.
 */
export function Tile({ index, width, height, onPress, dashed, tone = 'card', accessibilityLabel, children, style }: { index: number; width: number; height: number; onPress?: () => void; dashed?: boolean; tone?: Tone; accessibilityLabel?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  const bg = tone === 'gold' ? th.goldBg : tone === 'tint' ? th.softBlue : th.card; // calm tints, never a loud fill
  const body = (
    <View style={[{ flex: 1, borderRadius: BENTO_RADIUS, overflow: 'hidden', backgroundColor: dashed ? 'transparent' : bg, borderWidth: dashed ? 2.5 : 0, borderStyle: dashed ? 'dashed' : 'solid', borderColor: th.line, boxShadow: dashed ? undefined : `0 10px 24px -14px ${th.shadow}` }, style]}>{children}</View>
  );
  return (
    <Reveal index={index} style={{ width, height }}>
      {onPress ? <PressScale onPress={onPress} accessibilityLabel={accessibilityLabel} style={{ flex: 1 }}>{body}</PressScale> : body}
    </Reveal>
  );
}

/**
 * The small label of a card (small, spaced, caps-like) and the one "+" at its right end: a small translucent circle,
 * not a coloured button, so only one thing per page shouts. `ink` is the text colour on coloured cards.
 */
export function TileHeader({ title, onAdd, addLabel, ink }: { title: string; onAdd?: () => void; addLabel?: string; ink?: string }) {
  const th = useTheme();
  const color = ink ?? th.muted;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30 }}>
      <Text weight={800} size={12} numberOfLines={1} style={{ flex: 1, color, letterSpacing: 1.4, textTransform: 'uppercase' }}>{title}</Text>
      {onAdd ? (
        <PressScale onPress={onAdd} accessibilityRole="button" accessibilityLabel={addLabel ?? title} hitSlop={6} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' }}>
          <Text plain size={20} weight={800} style={{ color: th.onGold, lineHeight: 22 }}>+</Text>
        </PressScale>
      ) : null}
    </View>
  );
}

/**
 * A bento card of any height (cards that hold a list or a form): 24 px corners, a title row in the display font with the
 * card's actions at its right end. Stack them with a 12 px gap; the card enters with the list stagger.
 */
export function BentoCard({ index = 0, title, right, children, style }: { index?: number; title?: string; right?: ReactNode; children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  return (
    <Reveal index={index} style={{ width: '100%' }}>
      <View style={[{ borderRadius: BENTO_RADIUS, backgroundColor: th.card, padding: 16, gap: 10, boxShadow: `0 10px 24px -14px ${th.shadow}` }, style]}>
        {title || right ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 40 }}>
            {title ? <Text weight={800} size={18} numberOfLines={1} style={{ flex: 1 }}>{title}</Text> : <View style={{ flex: 1 }} />}
            {right}
          </View>
        ) : null}
        {children}
      </View>
    </Reveal>
  );
}

/** The "+" for a white card's title row: a small cream circle (the Tile "+" is translucent white, for coloured cards). */
export function AddButton({ onPress, label }: { onPress: () => void; label: string }) {
  const th = useTheme();
  return (
    <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: th.goldBg, alignItems: 'center', justifyContent: 'center' }}>
      <Text plain size={22} weight={800} style={{ color: th.onGold, lineHeight: 24 }}>+</Text>
    </PressScale>
  );
}

/** A tappable bento card for one action: icon over a short label. Put two side by side in a row (`flex: 1` each). */
export function BentoAction({ index = 0, icon, label, onPress }: { index?: number; icon: ReactNode; label: string; onPress: () => void }) {
  const th = useTheme();
  return (
    <Reveal index={index} style={{ flex: 1 }}>
      <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={{ borderRadius: BENTO_RADIUS, backgroundColor: th.card, paddingVertical: 18, paddingHorizontal: 12, alignItems: 'center', gap: 8, boxShadow: `0 10px 24px -14px ${th.shadow}` }}>
        {icon}
        <Text weight={700} size={14} numberOfLines={1}>{label}</Text>
      </PressScale>
    </Reveal>
  );
}
