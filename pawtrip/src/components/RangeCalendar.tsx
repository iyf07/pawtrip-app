import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { MAX_TRIP_DAYS, daysBetween, isoOf, parseIso, todayIso } from '@/lib/dates';

type Props = {
  start: string | null;
  end: string | null;
  onChange: (start: string | null, end: string | null) => void;
  /** called when the second tap would make the trip longer than the limit */
  onTooLong?: () => void;
};

/** One calendar, tap start then end (like booking a flight). */
export function RangeCalendar({ start, end, onChange, onTooLong }: Props) {
  const t = useTheme();
  const { t: tr, locale } = useT();
  const today = todayIso();
  const [month, setMonth] = useState(() => {
    const d = start ? parseIso(start) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const first = month.getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(first).fill(null),
    ...Array.from({ length: count }, (_, i) => isoOf(new Date(month.getFullYear(), month.getMonth(), i + 1))),
  ];
  while (cells.length % 7) cells.push(null);

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 7 + i).toLocaleDateString(locale, { weekday: 'narrow' }),
  );

  function tap(iso: string) {
    if (!start || end) return onChange(iso, null);
    if (iso < start) return onChange(iso, null);
    if (daysBetween(start, iso) + 1 > MAX_TRIP_DAYS) return onTooLong?.();
    onChange(start, iso);
  }

  const title = month.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => shift(-1)} accessibilityLabel={tr('rp.prev')} style={{ width: 44, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, borderWidth: 2, borderColor: t.line, backgroundColor: t.card }}>
          <Text size={20} weight={800}>
            ‹
          </Text>
        </Pressable>
        <Text weight={800} size={17}>
          {title}
        </Text>
        <Pressable onPress={() => shift(1)} accessibilityLabel={tr('rp.next')} style={{ width: 44, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, borderWidth: 2, borderColor: t.line, backgroundColor: t.card }}>
          <Text size={20} weight={800}>
            ›
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {weekdays.map((w, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <Text size={12} weight={800} color="muted">
              {w}
            </Text>
          </View>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {cells.slice(r * 7, r * 7 + 7).map((iso, c) => {
            if (!iso) return <View key={c} style={{ flex: 1, height: 40 }} />;
            const isA = iso === start;
            const isB = iso === end;
            const inside = !!start && !!end && iso > start && iso < end;
            const past = iso < today;
            return (
              <Pressable
                key={c}
                disabled={past}
                onPress={() => tap(iso)}
                accessibilityLabel={iso}
                style={{
                  flex: 1,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isA || isB ? t.gold : inside ? t.goldBg : 'transparent',
                  borderTopLeftRadius: isA || !inside ? 999 : 0,
                  borderBottomLeftRadius: isA || !inside ? 999 : 0,
                  borderTopRightRadius: isB || !inside ? 999 : 0,
                  borderBottomRightRadius: isB || !inside ? 999 : 0,
                  opacity: past ? 0.35 : 1,
                }}>
                <Text
                  weight={700}
                  color={isA || isB ? 'onGold' : 'text'}
                  style={iso === today ? { textDecorationLine: 'underline' } : undefined}>
                  {parseIso(iso).getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
