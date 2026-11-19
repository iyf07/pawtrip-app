import { Image } from 'expo-image';
import { useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import type { Dog } from '@/api/types';
import { dogTraitKeys } from '@/constants/options';
import { DogAvatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { useT, type Key } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { dogWeightLabel } from '@/lib/dog-weight';
import { dogColor } from './dogColor';

const OPEN = 5; // flex of the open strip; the others are 1
const GAP = 4;
const WIDEN_MS = 500; // the strips change width first …
const FADE_MS = 260; // … and only then does the content fade in

const REVEAL_MS = 1100; // the photo spreads out from the middle, slowly

/** A dog photo that appears as a rounded window opening from the centre outward once the image has loaded. */
function CenterReveal({ uri, w, h }: { uri: string; w: number; h: number }) {
  const [p] = useState(() => new Animated.Value(0));
  const start = () => Animated.timing(p, { toValue: 1, duration: REVEAL_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  const lerp = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: lerp(w / 2, 0), top: lerp(h / 2, 0), width: lerp(0, w), height: lerp(0, h), borderRadius: lerp(Math.min(w, h) / 2, 0), overflow: 'hidden' }}>
      <Animated.View style={{ position: 'absolute', left: lerp(-w / 2, 0), top: lerp(-h / 2, 0), width: w, height: h }}>
        <Image source={{ uri }} onLoad={start} style={{ width: w, height: h }} contentFit="cover" cachePolicy="memory-disk" />
      </Animated.View>
    </Animated.View>
  );
}

function Strip({ dog, open, openWidth, onPress, onOpenDog }: { dog: Dog; open: boolean; openWidth: number; onPress: () => void; onOpenDog: () => void }) {
  const th = useTheme();
  const { t } = useT();
  const [p] = useState(() => new Animated.Value(open ? 1 : 0)); // width / narrow-name progress
  const [c] = useState(() => new Animated.Value(open ? 1 : 0)); // content opacity, runs after the widening
  const [prev, setPrev] = useState(open);
  const [size, setSize] = useState({ w: 0, h: 0 });
  if (prev !== open) {
    setPrev(open);
    c.stopAnimation();
    if (open) {
      Animated.parallel([
        Animated.timing(p, { toValue: 1, duration: WIDEN_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.sequence([Animated.delay(WIDEN_MS), Animated.timing(c, { toValue: 1, duration: FADE_MS, useNativeDriver: false })]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(c, { toValue: 0, duration: 120, useNativeDriver: false }),
        Animated.timing(p, { toValue: 0, duration: WIDEN_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start();
    }
  }
  const bgColor = dogColor(dog.id);
  const photo = !!dog.photo_url;
  const ink = photo ? '#FFFFFF' : th.text;
  const shadow = photo ? { textShadowColor: 'rgba(0,0,0,0.65)', textShadowRadius: 4 } : null;
  const weight = dogWeightLabel(dog);
  const tags = dogTraitKeys(dog).map((k) => t(k as Key)).join(' · ');
  return (
    <Animated.View style={{ flex: p.interpolate({ inputRange: [0, 1], outputRange: [1, OPEN] }), minWidth: 0 }}>
      <Pressable onPress={() => (open ? onOpenDog() : onPress())} accessibilityRole="button" accessibilityLabel={dog.name} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        style={{ flex: 1, overflow: 'hidden', backgroundColor: bgColor }}>
        {photo && size.w > 0 ? <CenterReveal key={dog.photo_url} uri={dog.photo_url!} w={size.w} h={size.h} /> : null}
        {/* no photo: the sticker sits at the top and never squeezes */}
        {photo ? null : <View style={{ position: 'absolute', top: 56, left: 0, right: 0, alignItems: 'center' }}><DogAvatar url={null} size={36} border={0} /></View>}
        {/* narrow: the name runs up the strip at a fixed size; it fades out right as the strip starts to open */}
        {size.h > 0 ? (
          <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size.h, height: 30, top: (size.h - 30) / 2, left: (size.w - size.h) / 2, transform: [{ rotate: '-90deg' }], opacity: p.interpolate({ inputRange: [0, 0.2], outputRange: [1, 0], extrapolate: 'clamp' }), alignItems: 'center', justifyContent: 'center' }}>
            <Text weight={800} size={16} numberOfLines={1} style={{ color: ink, ...shadow }}>{dog.name}</Text>
          </Animated.View>
        ) : null}
        {/* open: name, weight and tags at the bottom, laid out at the final width, fading in only once the strip is wide */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 16, bottom: 16, width: Math.max(0, openWidth - 32), opacity: c }}>
          {photo ? <View style={{ position: 'absolute', left: -16, right: -16, top: -48, bottom: -16, backgroundColor: 'rgba(40,28,20,0.4)' }} /> : null}
          <Text weight={800} size={26} numberOfLines={1} style={{ color: ink, ...shadow }}>{dog.name}</Text>
          {weight ? <Text size={13} weight={700} numberOfLines={1} style={{ color: ink, ...shadow }}>{weight}</Text> : null}
          {tags ? <Text size={12} weight={600} numberOfLines={2} style={{ color: ink, ...shadow }}>{tags}</Text> : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Every dog as a vertical strip, name running up the strip. Tap a narrow one: the strips change width first (that one
 * grows, the others narrow), and only then its name, weight and tags fade in. Tap the open one to go to that dog's page.
 */
export function DogAccordion({ dogs, onOpenDog }: { dogs: Dog[]; onOpenDog: (id: string) => void }) {
  const [sel, setSel] = useState(0);
  const [width, setWidth] = useState(0);
  const chosen = Math.min(sel, dogs.length - 1);
  const n = dogs.length;
  const openWidth = width > 0 ? ((width - GAP * (n - 1)) * OPEN) / (OPEN + n - 1) : 0;
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ flex: 1, flexDirection: 'row', gap: GAP }}>
      {dogs.map((d, i) => <Strip key={d.id} dog={d} open={i === chosen} openWidth={openWidth} onPress={() => setSel(i)} onOpenDog={() => onOpenDog(d.id)} />)}
    </View>
  );
}
