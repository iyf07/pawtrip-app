import { Image } from 'expo-image';
import { useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import type { Dog } from '@/api/types';
import { DogAvatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { BENTO_RADIUS } from './Bento';

const OPEN = 5; // flex of the open strip; the others are 1
const MS = 500;

function Strip({ dog, open, onPress }: { dog: Dog; open: boolean; onPress: () => void }) {
  const th = useTheme();
  const [p] = useState(() => new Animated.Value(open ? 1 : 0));
  // animate when `open` flips
  const [prev, setPrev] = useState(open);
  if (prev !== open) {
    setPrev(open);
    Animated.timing(p, { toValue: open ? 1 : 0, duration: MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }
  return (
    <Animated.View style={{ flex: p.interpolate({ inputRange: [0, 1], outputRange: [1, OPEN] }), minWidth: 0 }}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={dog.name} style={{ flex: 1, borderRadius: BENTO_RADIUS - 8, overflow: 'hidden', backgroundColor: th.blueBg, alignItems: 'center', justifyContent: 'center' }}>
        {dog.photo_url ? <Image source={{ uri: dog.photo_url }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" /> : <DogAvatar url={null} size={56} border={0} />}
        <Animated.View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(74,54,40,0.55)', opacity: p }}>
          <Text weight={800} size={18} numberOfLines={1} style={{ color: '#FFFFFF' }}>{dog.name}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Every dog as a vertical strip side by side; the chosen one opens wide (photo + name), the rest narrow down to a
 * slice of their photo. Tap a narrow one to open it, tap the open one to go to that dog's page. A last strip adds a dog.
 */
export function DogAccordion({ dogs, onOpenDog, onAdd }: { dogs: Dog[]; onOpenDog: (id: string) => void; onAdd: () => void }) {
  const th = useTheme();
  const [sel, setSel] = useState(0);
  const chosen = Math.min(sel, dogs.length - 1);
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 6, padding: 8 }}>
      {dogs.map((d, i) => <Strip key={d.id} dog={d} open={i === chosen} onPress={() => (i === chosen ? onOpenDog(d.id) : setSel(i))} />)}
      <Pressable onPress={onAdd} accessibilityRole="button" style={{ width: 44, borderRadius: BENTO_RADIUS - 8, borderWidth: 2.5, borderStyle: 'dashed', borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="nav-dogs" size={28} />
      </Pressable>
    </View>
  );
}
