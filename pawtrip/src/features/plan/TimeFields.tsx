import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { parseIso, weekdayShort } from '@/lib/dates';
import { HALF_HOURS, fmtMin } from '@/lib/time';

/** One time of day; tap to pick from half-hour steps. */
export function TimeField({ label, value, onChange, disabled }: { label: string; value: number; onChange: (min: number) => void; disabled?: boolean }) {
  const th = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Text weight={800} size={13} style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={{ minHeight: 46, borderRadius: 10, borderWidth: 2, borderColor: th.line, backgroundColor: th.card, paddingHorizontal: 12, justifyContent: 'center', opacity: disabled ? 0.6 : 1 }}>
        <Text>{fmtMin(value)}</Text>
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text weight={800} size={18} style={{ marginBottom: 8 }}>
          {label}
        </Text>
        <ScrollView style={{ maxHeight: 420 }}>
          {HALF_HOURS.map((m) => (
            <Pressable
              key={m}
              onPress={() => {
                onChange(m);
                setOpen(false);
              }}
              style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 10, backgroundColor: m === value ? th.gold : 'transparent' }}>
              <Text weight={m === value ? 800 : 600} color={m === value ? 'onGold' : 'text'}>
                {fmtMin(m)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

/** Horizontal day chips (Fri 20, Sat 21 ...). */
export function DayChips({ days, value, onChange, disabled }: { days: string[]; value: number | null; onChange: (i: number) => void; disabled?: boolean }) {
  const { locale } = useT();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {days.map((iso, i) => (
        <Chip key={iso} label={`${weekdayShort(iso, locale)} ${parseIso(iso).getDate()}`} on={value === i} onPress={disabled ? undefined : () => onChange(i)} />
      ))}
    </View>
  );
}

export type When = { day: number | null; start: number; end: number; stayTo: number | null };

/** Day + start/end for a normal item, or check-in / check-out days for a stay. */
export function WhenFields({ days, when, stay, onChange, disabled }: { days: string[]; when: When; stay: boolean; onChange: (w: When) => void; disabled?: boolean }) {
  const { t } = useT();
  if (stay) {
    const from = when.day ?? 0;
    return (
      <View style={{ gap: 10 }}>
        <Text weight={800} size={13}>
          {t('add.setNights')}
        </Text>
        <DayChips days={days} value={when.day} disabled={disabled} onChange={(i) => onChange({ ...when, day: i, stayTo: Math.max(when.stayTo ?? i, i) })} />
        <Text weight={800} size={13}>
          →
        </Text>
        <DayChips days={days} value={when.stayTo} disabled={disabled} onChange={(i) => onChange({ ...when, stayTo: Math.max(i, from) })} />
        <Text size={13} color="muted">
          {t('add.stayHint')}
        </Text>
      </View>
    );
  }
  return (
    <View>
      <Text weight={800} size={13} style={{ marginBottom: 6 }}>
        {t('add.day')}
      </Text>
      <DayChips days={days} value={when.day} disabled={disabled} onChange={(i) => onChange({ ...when, day: i })} />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <TimeField
          label={t('add.start')}
          value={when.start}
          disabled={disabled}
          onChange={(m) => onChange({ ...when, start: m, end: when.end <= m ? Math.min(m + 60, 1440) : when.end })}
        />
        <TimeField label={t('add.end')} value={when.end} disabled={disabled} onChange={(m) => onChange({ ...when, end: m })} />
      </View>
    </View>
  );
}
