import { Image } from 'expo-image';
import { useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, View } from 'react-native';

import type { Dog } from '@/api/types';
import { dogTraitKeys } from '@/constants/options';
import { DogAvatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { useT, type Key } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { dogWeightLabel } from '@/lib/dog-weight';
import { dogColor } from './dogColor';

const REVEAL_FIRST_MS = 1100; // the first photo spreads out from the middle, slowly
const REVEAL_SWAP_MS = 520; // switching dogs is quicker
const THUMB = 64; // thumbnail height; every thumbnail is a rounded square (or a little wider when chosen)
const THUMB_WIDE = 96;
const THUMB_GAP = 8;
const THUMB_MS = 420;

/** A dog photo that appears as a rounded window opening from the centre outward once the image has loaded. */
function CenterReveal({ uri, w, h, ms }: { uri: string; w: number; h: number; ms: number }) {
  const [p] = useState(() => new Animated.Value(0));
  const start = () => Animated.timing(p, { toValue: 1, duration: ms, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  const lerp = (a: number, b: number) => p.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', left: lerp(w / 2, 0), top: lerp(h / 2, 0), width: lerp(0, w), height: lerp(0, h), borderRadius: lerp(Math.min(w, h) / 2, 0), overflow: 'hidden' }}>
      <Animated.View style={{ position: 'absolute', left: lerp(-w / 2, 0), top: lerp(-h / 2, 0), width: w, height: h }}>
        <Image source={{ uri }} onLoad={start} style={{ width: w, height: h }} contentFit="cover" cachePolicy="memory-disk" />
      </Animated.View>
    </Animated.View>
  );
}

/** One thumbnail: a whole little photo of the dog; the chosen one grows a bit wider and gets a ring. */
function Thumb({ dog, on, onPress }: { dog: Dog; on: boolean; onPress: () => void }) {
  const th = useTheme();
  const [p] = useState(() => new Animated.Value(on ? 1 : 0));
  const [prev, setPrev] = useState(on);
  if (prev !== on) {
    setPrev(on);
    Animated.timing(p, { toValue: on ? 1 : 0, duration: THUMB_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }
  return (
    <Animated.View style={{ width: p.interpolate({ inputRange: [0, 1], outputRange: [THUMB, THUMB_WIDE] }), height: THUMB }}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={dog.name} accessibilityState={{ selected: on }}
        style={{ flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: dogColor(dog.id), alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: on ? th.gold : 'transparent' }}>
        {dog.photo_url ? <Image source={{ uri: dog.photo_url }} transition={300} cachePolicy="memory-disk" contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : <DogAvatar url={null} size={30} border={0} />}
      </Pressable>
    </Animated.View>
  );
}

/**
 * All dogs: the chosen dog as a big photo with its name, weight and tags, and under it one whole little photo per dog.
 * Tap a thumbnail to choose that dog (it widens, the others stay small but fully visible); tap the big photo to open
 * the dog's page.
 */
export function DogAccordion({ dogs, onOpenDog }: { dogs: Dog[]; onOpenDog: (id: string) => void }) {
  const th = useTheme();
  const { t } = useT();
  const [sel, setSel] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [swapped, setSwapped] = useState(false);
  const dog = dogs[Math.min(sel, dogs.length - 1)];
  const photo = !!dog.photo_url;
  const ink = photo ? '#FFFFFF' : th.text;
  const shadow = photo ? { textShadowColor: 'rgba(0,0,0,0.65)', textShadowRadius: 4 } : null;
  const weight = dogWeightLabel(dog);
  const tags = dogTraitKeys(dog).map((k) => t(k as Key)).join(' · ');
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => onOpenDog(dog.id)} accessibilityRole="button" accessibilityLabel={dog.name} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        style={{ flex: 1, overflow: 'hidden', backgroundColor: dogColor(dog.id) }}>
        {photo && size.w > 0 ? <CenterReveal key={dog.id} uri={dog.photo_url!} w={size.w} h={size.h} ms={swapped ? REVEAL_SWAP_MS : REVEAL_FIRST_MS} /> : null}
        {photo ? null : <View style={{ position: 'absolute', top: 64, left: 0, right: 0, alignItems: 'center' }}><DogAvatar url={null} size={72} border={0} /></View>}
        {photo ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', backgroundColor: 'rgba(40,28,20,0.4)' }} /> : null}
        <View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: 12 }}>
          <Text weight={800} size={28} numberOfLines={1} style={{ color: ink, ...shadow }}>{dog.name}</Text>
          {weight ? <Text size={13} weight={700} numberOfLines={1} style={{ color: ink, ...shadow }}>{weight}</Text> : null}
          {tags ? <Text size={12} weight={600} numberOfLines={1} style={{ color: ink, ...shadow }}>{tags}</Text> : null}
        </View>
      </Pressable>
      {dogs.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: THUMB_GAP, padding: 10, alignItems: 'center' }}>
          {dogs.map((d, i) => <Thumb key={d.id} dog={d} on={d.id === dog.id} onPress={() => { setSwapped(true); setSel(i); }} />)}
        </ScrollView>
      ) : null}
    </View>
  );
}
