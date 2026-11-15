import { useEffect, useState } from 'react';
import { Animated, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** A softly pulsing placeholder block, shown instead of a blank page while data loads. */
export function Skeleton({ width = '100%', height = 16, radius = 10, style }: { width?: DimensionValue; height?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  const [v] = useState(() => new Animated.Value(0.55));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: th.line, opacity: v }, style]} />;
}

/** A page-shaped placeholder: a title bar and a few cards. */
export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <View style={{ gap: 12, marginTop: 12 }}>
      {Array.from({ length: cards }, (_, i) => (
        <View key={i} style={{ gap: 10, padding: 16, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' }}>
          <Skeleton width="55%" height={20} />
          <Skeleton width="80%" height={14} />
          <Skeleton width="35%" height={14} />
        </View>
      ))}
    </View>
  );
}
