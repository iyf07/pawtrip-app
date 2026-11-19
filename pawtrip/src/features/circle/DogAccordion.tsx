import { Image } from 'expo-image';
import { useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import type { Dog } from '@/api/types';
import { DogTraits } from '@/components/DogTraits';
import { DogAvatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { dogWeightLabel } from '@/lib/dog-weight';
import { BENTO_RADIUS } from './Bento';

const OPEN = 5; // flex of the open strip; the others are 1
const MS = 500;

function Strip({ dog, open, onPress }: { dog: Dog; open: boolean; onPress: () => void }) {
  const th = useTheme();
  const [p] = useState(() => new Animated.Value(open ? 1 : 0));
  const [prev, setPrev] = useState(open);
  const [size, setSize] = useState({ w: 0, h: 0 });
  if (prev !== open) {
    setPrev(open);
    Animated.timing(p, { toValue: open ? 1 : 0, duration: MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }
  const weight = dogWeightLabel(dog);
  return (
    <Animated.View style={{ flex: p.interpolate({ inputRange: [0, 1], outputRange: [1, OPEN] }), minWidth: 0 }}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={dog.name} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        style={{ flex: 1, borderRadius: BENTO_RADIUS - 8, overflow: 'hidden', backgroundColor: th.blueBg, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10 }}>
        {dog.photo_url ? <Image source={{ uri: dog.photo_url }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" /> : <DogAvatar url={null} size={30} border={0} />}
        {/* narrow: the name runs up the strip; it fades out as the strip opens */}
        {size.h > 0 ? (
          <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size.h, height: 30, top: (size.h - 30) / 2, left: (size.w - size.h) / 2, transform: [{ rotate: '-90deg' }], opacity: p.interpolate({ inputRange: [0, 0.35], outputRange: [1, 0] }), alignItems: 'center', justifyContent: 'center' }}>
            <Text weight={800} size={16} numberOfLines={1} style={dog.photo_url ? { color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4 } : { color: th.text }}>{dog.name}</Text>
          </Animated.View>
        ) : null}
        {/* open: name and tags fade in after the strip has widened */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 8, right: 8, bottom: 8, padding: 10, borderRadius: 16, backgroundColor: th.card, opacity: p.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] }) }}>
          <Text weight={800} size={18} numberOfLines={1}>{dog.name}</Text>
          {weight ? <Text size={12} color="muted" numberOfLines={1}>{weight}</Text> : null}
          <DogTraits dog={dog} lines={2} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Every dog as a vertical strip side by side, name running up the strip. Tap a narrow one: it widens, the others narrow
 * with it, and its name and tags fade in once it is wide. Tap the open one to go to that dog's page.
 */
export function DogAccordion({ dogs, onOpenDog }: { dogs: Dog[]; onOpenDog: (id: string) => void }) {
  const [sel, setSel] = useState(0);
  const chosen = Math.min(sel, dogs.length - 1);
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
      {dogs.map((d, i) => <Strip key={d.id} dog={d} open={i === chosen} onPress={() => (i === chosen ? onOpenDog(d.id) : setSel(i))} />)}
    </View>
  );
}
