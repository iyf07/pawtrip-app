import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
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

const OUT_MS = 150; // the old name and tags pop out
const SLIDE_SPRING = { stiffness: 200, damping: 24, mass: 1 }; // the new photo slides in from the side on a damped spring: it settles with a hint of give
const spring = (v: Animated.Value, to: number) =>
  new Promise<void>((resolve) => Animated.spring(v, { toValue: to, ...SLIDE_SPRING, useNativeDriver: false }).start(() => resolve()));
const anim = (v: Animated.Value, to: number, duration: number, easing = Easing.out(Easing.cubic)) =>
  new Promise<void>((resolve) => Animated.timing(v, { toValue: to, duration, easing, useNativeDriver: false }).start(() => resolve()));

/** One full-size dog layer: soft colour, the photo (reports when it has loaded), or the sticker. */
function HeroLayer({ dog, w, h, first, onLoaded }: { dog: Dog; w: number; h: number; first?: boolean; onLoaded?: () => void }) {
  const photo = !!dog.photo_url;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: w, height: h, backgroundColor: dogColor(dog.id), overflow: 'hidden' }}>
      {photo ? (first ? <CenterReveal uri={dog.photo_url!} w={w} h={h} ms={REVEAL_FIRST_MS} /> : <Image source={{ uri: dog.photo_url! }} onLoad={onLoaded} style={{ width: w, height: h }} contentFit="cover" cachePolicy="memory-disk" />) : <View style={{ position: 'absolute', top: 64, left: 0, right: 0, alignItems: 'center' }}><DogAvatar url={null} size={72} border={0} /></View>}
      {photo ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', backgroundColor: 'rgba(40,28,20,0.4)' }} /> : null}
    </View>
  );
}

/**
 * All dogs: the chosen dog as a big photo, and under it one whole little photo per dog. Switching dogs: the name and
 * tags pop out, the new photo slides in from the side the dog sits on (once it has fully loaded), then the name, weight
 * and tags pop in. Tap the big photo to open the dog's page.
 */
export function DogAccordion({ dogs, onOpenDog }: { dogs: Dog[]; onOpenDog: (id: string) => void }) {
  const th = useTheme();
  const { t } = useT();
  const [cur, setCur] = useState(0);
  const [inc, setInc] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [slide] = useState(() => new Animated.Value(0));
  const [text] = useState(() => new Animated.Value(0));
  const busy = useRef(false);
  const loaded = useRef<(() => void) | null>(null);
  const [first, setFirst] = useState(true); // until the first switch, the photo opens from the middle
  const idx = Math.min(cur, dogs.length - 1);
  const dog = dogs[idx];

  // the first time: the photo opens from the middle, then the text pops in
  useEffect(() => {
    if (size.w === 0) return;
    const id = setTimeout(() => Animated.spring(text, { toValue: 1, stiffness: 260, damping: 18, mass: 1, useNativeDriver: false }).start(), dogs[0]?.photo_url ? REVEAL_FIRST_MS * 0.6 : 200);
    return () => clearTimeout(id);
    // only once, when the first layout is known
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w > 0]);

  const go = async (i: number) => {
    if (busy.current || i === idx || size.w === 0) return;
    busy.current = true;
    setDir(i > idx ? 1 : -1);
    await anim(text, 0, OUT_MS, Easing.in(Easing.quad)); // 1. the old text pops out
    const ready = new Promise<void>((resolve) => { loaded.current = resolve; });
    setInc(i);
    if (!dogs[i].photo_url) loaded.current?.();
    await ready; // 2. the new photo has fully loaded
    await spring(slide, 1); // 3. it slides in from the side, damped
    setFirst(false);
    setCur(i);
    setInc(null);
    slide.setValue(0);
    Animated.spring(text, { toValue: 1, stiffness: 260, damping: 18, mass: 1, useNativeDriver: false }).start(); // 4. the new text pops in
    busy.current = false;
  };

  const photo = !!dog.photo_url;
  const ink = photo ? '#FFFFFF' : th.text;
  const shadow = photo ? { textShadowColor: 'rgba(0,0,0,0.65)', textShadowRadius: 4 } : null;
  const weight = dogWeightLabel(dog);
  const tags = dogTraitKeys(dog).map((k) => t(k as Key)).join(' · ');
  const W = size.w;
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => onOpenDog(dog.id)} accessibilityRole="button" accessibilityLabel={dog.name} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        style={{ flex: 1, overflow: 'hidden', backgroundColor: dogColor(dog.id) }}>
        {W > 0 ? (
          <>
            <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: W, height: size.h, transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, -dir * W] }) }] }}>
              <HeroLayer dog={dog} w={W} h={size.h} first={first} />
            </Animated.View>
            {inc !== null ? (
              <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: W, height: size.h, transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [dir * W, 0] }) }] }}>
                <HeroLayer dog={dogs[inc]} w={W} h={size.h} onLoaded={() => loaded.current?.()} />
              </Animated.View>
            ) : null}
          </>
        ) : null}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: 12, opacity: text, transform: [{ scale: text.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }, { translateY: text.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
          <Text weight={800} size={28} numberOfLines={1} style={{ color: ink, ...shadow }}>{dog.name}</Text>
          {weight ? <Text size={13} weight={700} numberOfLines={1} style={{ color: ink, ...shadow }}>{weight}</Text> : null}
          {tags ? <Text size={12} weight={600} numberOfLines={1} style={{ color: ink, ...shadow }}>{tags}</Text> : null}
        </Animated.View>
      </Pressable>
      {dogs.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: THUMB_GAP, padding: 10, alignItems: 'center' }}>
          {dogs.map((d, i) => <Thumb key={d.id} dog={d} on={d.id === dog.id} onPress={() => go(i)} />)}
        </ScrollView>
      ) : null}
    </View>
  );
}
