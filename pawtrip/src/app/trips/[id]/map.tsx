import { Pressable, ScrollView, View } from 'react-native';

import { TripMap } from '@/components/TripMap';
import { Text } from '@/components/ui/Text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useDayMap } from '@/features/plan/useDayMap';
import { useTripCtx } from '@/features/trip/TripContext';
import { useT } from '@/i18n';
import { parseIso, weekdayShort } from '@/lib/dates';

/** Phone map tab: the selected day's stops on a full-height map, with the day strip above. */
export default function MapTab() {
  const { locale } = useT();
  const th = useTheme();
  const dark = useColorScheme() === 'dark';
  const { days, day, setDay, openItem } = useTripCtx();
  const { pins, line, center } = useDayMap();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        {days.map((iso, i) => {
          const on = i === day;
          const d = parseIso(iso);
          return (
            <Pressable
              key={iso}
              onPress={() => setDay(i)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={{ minWidth: 64, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 18, alignItems: 'center', backgroundColor: on ? th.gold : th.card, borderWidth: on ? 4 : 2, borderColor: on ? th.sticker : th.line }}>
              <Text size={11} weight={800} color={on ? 'onGold' : 'muted'}>{weekdayShort(iso, locale)}</Text>
              <Text plain size={16} weight={800} color={on ? 'onGold' : 'text'}>{`${d.getMonth() + 1}/${d.getDate()}`}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ flex: 1, marginHorizontal: 16, marginBottom: 12, borderRadius: 18, overflow: 'hidden' }}>
        <TripMap pins={pins} line={line} center={center} dark={dark} onPin={openItem} height="100%" />
      </View>
    </View>
  );
}
