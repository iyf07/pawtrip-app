import { useEffect, useRef, useState } from 'react';
import { PanResponder, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

/** DB column name -> i18n key stem (the prototype used camelCase). */
const STEM: Record<string, string> = { with_dogs: 'withDogs', with_people: 'withPeople' };
export const scaleStem = (col: string) => STEM[col] ?? col;

type Props = {
  /** DB column / profile field, e.g. 'energy', 'with_dogs', 'walking' */
  field: string;
  value: number | null;
  onChange: (v: number) => void;
  /** the surrounding screen already shows the question (wizard) */
  hideTitle?: boolean;
};

/** One 1-5 personality scale: question, five steps, and the label of the chosen step. Starts in the middle (3). */
export function ScaleInput({ field, value, onChange, hideTitle }: Props) {
  const { t } = useT();
  const th = useTheme();
  const stem = scaleStem(field);
  const v = value ?? 3;
  return (
    <View
      style={{
        marginTop: 14,
        padding: 14,
        backgroundColor: th.card,
        borderWidth: 2,
        borderColor: th.line,
        borderRadius: 18,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        {hideTitle ? <View style={{ flex: 1 }} /> : (
          <Text weight={800} size={14} style={{ flex: 1 }}>
            {t(`scale.${stem}` as Key)}
          </Text>
        )}
        <Text weight={800} size={14} color="link">
          {t(`scale.${stem}.${v}` as Key)}
        </Text>
      </View>
      <Slider v={v} onChange={onChange} label={t(`scale.${stem}` as Key)} />
    </View>
  );
}

const THUMB = 32;

/** A 1-5 slider: drag the knob (or tap the bar); it snaps to the five steps. */
function Slider({ v, onChange, label }: { v: number; onChange: (v: number) => void; label: string }) {
  const th = useTheme();
  const [w, setW] = useState(0);
  const width = useRef(0);
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });
  const pick = (x: number) => {
    const span = width.current - THUMB;
    if (span <= 0) return;
    const n = Math.min(5, Math.max(1, Math.round(((x - THUMB / 2) / span) * 4) + 1));
    latest.current(n);
  };
  // the handlers only touch refs when the finger moves, never while rendering
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => pick(e.nativeEvent.locationX),
      onPanResponderMove: (e) => pick(e.nativeEvent.locationX),
    }),
  );
  const usable = Math.max(0, w - THUMB);
  const left = ((v - 1) / 4) * usable;
  // the knob's centre travels over the inner width, so measure x against that range
  const touch: ViewStyle & { touchAction?: string } = { height: 44, justifyContent: 'center', marginTop: 6, touchAction: 'none' };
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 1, max: 5, now: v }}
      onLayout={(e) => {
        width.current = e.nativeEvent.layout.width;
        setW(e.nativeEvent.layout.width);
      }}
      style={touch}
      {...pan.panHandlers}>
      <View pointerEvents="none" style={{ height: 12, borderRadius: 6, backgroundColor: th.line, marginHorizontal: THUMB / 2, justifyContent: 'center' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (v - 1) * 0.25 * usable, borderRadius: 6, backgroundColor: th.gold }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={{ position: 'absolute', left: i * 0.25 * usable - 3, width: 6, height: 6, borderRadius: 3, backgroundColor: i < v ? th.sticker : th.muted, opacity: 0.5 }} />
        ))}
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left, width: THUMB, height: THUMB, borderRadius: THUMB / 2, backgroundColor: th.gold, borderWidth: 4, borderColor: th.sticker, boxShadow: `0 2px 6px -1px ${th.shadow}` }}
      />
    </View>
  );
}
