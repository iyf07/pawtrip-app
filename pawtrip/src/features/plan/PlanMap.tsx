import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TripMap } from '@/components/TripMap';
import type { MapPin } from '@/components/TripMap.types';
import { Button } from '@/components/ui/Button';
import { Meta, Text } from '@/components/ui/Text';
import { MAX_WIDTH } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

type Props = {
  pins: MapPin[];
  line: [number, number][] | null;
  center: { lat: number; lon: number } | null;
  /** number of stops today (for the strip label) */
  stops: number;
  onPin: (id: string) => void;
};

/** "N stops · Map" strip that opens an inline map, plus a full-screen map. */
export function PlanMap({ pins, line, center, stops, onPin }: Props) {
  const { t } = useT();
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);

  return (
    <View style={{ marginTop: 10 }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 42, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderColor: th.line, backgroundColor: th.card }}>
        <Text weight={700} style={{ flex: 1 }}>
          📍 {t('stops', { n: stops })} · <Text weight={800} color="link">{t('plan.map')}</Text>
        </Text>
        <Text weight={800}>{open ? '⌃' : '⌄'}</Text>
      </Pressable>

      {open ? (
        <View style={{ marginTop: 8 }}>
          <TripMap pins={pins} line={line} center={center} dark={dark} onPin={onPin} height={200} />
          <View style={{ alignItems: 'flex-end' }}>
            <Button label={t('plan.openMap')} variant="text" small onPress={() => setFull(true)} />
          </View>
          {pins.length === 0 ? <Meta>{t('map.empty.body')}</Meta> : null}
        </View>
      ) : null}

      <Modal visible={full} animationType="slide" onRequestClose={() => setFull(false)}>
        <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center' }}>
          <View style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8, paddingHorizontal: 8 }}>
            <View style={{ flex: 1 }}>
              {full ? (
                <TripMap
                  pins={pins}
                  line={line}
                  center={center}
                  dark={dark}
                  height="100%"
                  onPin={(id) => {
                    setFull(false);
                    onPin(id);
                  }}
                />
              ) : null}
            </View>
            <Pressable
              onPress={() => setFull(false)}
              accessibilityLabel={t('common.close')}
              style={{ position: 'absolute', top: insets.top + 16, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
              <Text weight={800}>✕</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
