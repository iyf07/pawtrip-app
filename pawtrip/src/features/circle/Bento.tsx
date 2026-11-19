import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from '@/components/ui/PressScale';
import { Text } from '@/components/ui/Text';
import { Reveal } from '@/components/ui/Reveal';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';

export const BENTO_GAP = 12; // the seam between cards
export const BENTO_RADIUS = 24; // every card's corner

/** Width of one column and the height of one row of a 2-column bento that fills `width` edge to edge. */
export function bentoUnits(width: number) {
  const col = Math.max(0, (width - BENTO_GAP) / 2);
  return { col, row: Math.round(col * 0.85) };
}

export type Tone = 'card' | 'gold' | 'tint' | 'mint' | 'butter' | 'lavender';

/**
 * One bento card: 24 px corners, no outline, a soft shadow; sits flush in the grid (the grid supplies the 12 px
 * seams), enters with the list stagger and springs on press. `tone` gives the grid its rhythm: white, a warm cream or a pale blue tint. One card says one thing.
 */
export function Tile({ index, width, height, onPress, dashed, tone = 'card', accessibilityLabel, children, style }: { index: number; width: number; height: number; onPress?: () => void; dashed?: boolean; tone?: Tone; accessibilityLabel?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  const bg = tone === 'gold' ? th.goldBg : tone === 'tint' ? th.softBlue : tone === 'mint' ? th.softMint : tone === 'butter' ? th.softButter : tone === 'lavender' ? th.softLavender : th.card; // calm tints, never a loud fill
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
 * A bento card of any height (cards that hold a list or a form): 24 px corners, no outline, soft shadow, a small spaced
 * caps label with the card's actions at its right end. `tone` follows the circle's rhythm: white, warm cream, pale blue.
 * Stack them with a 12 px gap; the card enters with the list stagger.
 */
export function BentoCard({ index = 0, title, right, tone = 'card', children, style }: { index?: number; title?: string; right?: ReactNode; tone?: Tone; children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  const bg = tone === 'gold' ? th.goldBg : tone === 'tint' ? th.softBlue : tone === 'mint' ? th.softMint : tone === 'butter' ? th.softButter : tone === 'lavender' ? th.softLavender : th.card;
  return (
    <Reveal index={index} style={{ width: '100%' }}>
      <View style={[{ borderRadius: BENTO_RADIUS, backgroundColor: bg, padding: 16, gap: 10, boxShadow: `0 10px 24px -14px ${th.shadow}` }, style]}>
        {title || right ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 36 }}>
            {title ? <Text weight={800} size={12} numberOfLines={1} style={{ flex: 1, color: th.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>{title}</Text> : <View style={{ flex: 1 }} />}
            {right}
          </View>
        ) : null}
        {children}
      </View>
    </Reveal>
  );
}

/**
 * The hero of a page: a tall card with the page's subject. A photo fills it (white text on a soft scrim), otherwise a
 * soft colour with the avatar. Big serif name at the bottom left, small caps line under it, actions at the top right.
 */
export function Hero({ index = 0, color, photoUrl, avatar, title, subtitle, right, children, minHeight = 220 }: { index?: number; color: string; photoUrl?: string | null; avatar?: ReactNode; title: string; subtitle?: string; right?: ReactNode; children?: ReactNode; minHeight?: number }) {
  const th = useTheme();
  const ink = photoUrl ? '#FFFFFF' : th.onGold;
  const shadow = photoUrl ? { textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 6 } : null;
  return (
    <Reveal index={index} style={{ width: '100%' }}>
      <View style={{ borderRadius: BENTO_RADIUS, backgroundColor: color, minHeight, overflow: 'hidden', justifyContent: 'flex-end', padding: 18, boxShadow: `0 10px 24px -14px ${th.shadow}` }}>
        {photoUrl ? <Image source={{ uri: photoUrl }} transition={600} cachePolicy="memory-disk" contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : null}
        {right ? <View style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>{right}</View> : null}
        {!photoUrl && avatar ? <View style={{ position: 'absolute', top: 18, left: 18 }}>{avatar}</View> : null}
        <Text weight={800} size={32} numberOfLines={1} style={{ color: ink, ...shadow }}>{title}</Text>
        {subtitle ? <Text weight={800} size={12} numberOfLines={1} style={{ color: ink, opacity: 0.85, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 2, ...shadow }}>{subtitle}</Text> : null}
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
export function BentoAction({ index = 0, icon, label, onPress, danger }: { index?: number; icon?: ReactNode; label: string; onPress: () => void; danger?: boolean }) {
  const th = useTheme();
  return (
    <Reveal index={index} style={{ flex: 1 }}>
      <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={{ borderRadius: BENTO_RADIUS, backgroundColor: th.card, paddingVertical: 18, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', gap: 8, flexGrow: 1, boxShadow: `0 10px 24px -14px ${th.shadow}` }}>
        {icon}
        <Text weight={700} size={14} numberOfLines={1} color={danger ? 'danger' : 'text'}>{label}</Text>
      </PressScale>
    </Reveal>
  );
}

/** Two columns of cards on wide screens (each column stacks with the 12 px gap); a single stack on a phone. */
export function BentoColumns({ left, right }: { left: ReactNode; right: ReactNode }) {
  const { wide } = useLayout();
  if (!wide) return <View style={{ gap: BENTO_GAP }}>{left}{right}</View>;
  return (
    <View style={{ flexDirection: 'row', gap: BENTO_GAP, alignItems: 'flex-start' }}>
      <View style={{ flex: 1, minWidth: 0, gap: BENTO_GAP }}>{left}</View>
      <View style={{ flex: 1, minWidth: 0, gap: BENTO_GAP }}>{right}</View>
    </View>
  );
}

/** A compact page header for a person: avatar on the left, name / ID / tags / small actions to its right. */
export function PersonHeader({ index = 0, color, avatar, title, subtitle, children }: { index?: number; color: string; avatar: ReactNode; title: string; subtitle?: string; children?: ReactNode }) {
  const th = useTheme();
  return (
    <Reveal index={index} style={{ width: '100%' }}>
      <View style={{ borderRadius: BENTO_RADIUS, backgroundColor: color, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, boxShadow: `0 10px 24px -14px ${th.shadow}` }}>
        {avatar}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text weight={800} size={28} numberOfLines={1} style={{ color: th.onGold }}>{title}</Text>
          {subtitle ? <Text weight={800} size={12} numberOfLines={1} style={{ color: th.onGold, opacity: 0.8, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 2 }}>{subtitle}</Text> : null}
          {children}
        </View>
      </View>
    </Reveal>
  );
}
