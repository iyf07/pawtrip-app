import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Field } from '@/components/ui/Field';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { searchAddresses, type AddressHit } from '@/lib/mapbox';

type Props = {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  /** a suggestion was chosen: text is already set to its label; coordinates come with it */
  onPick: (hit: AddressHit) => void;
  /** bias results towards the trip destination */
  near: { lat: number | null; lon: number | null };
  placeholder?: string;
  editable?: boolean;
  onBlur?: () => void;
  /** pull the field up under a row label (detail sheet) */
  flush?: boolean;
};

/** Address input with Mapbox suggestions. Free text is allowed; picking a suggestion also gives coordinates. */
export function AddressField({ label, value, onChangeText, onPick, near, placeholder, editable = true, onBlur, flush }: Props) {
  const th = useTheme();
  const { lang } = useT();
  const [hits, setHits] = useState<AddressHit[]>([]);
  const [typed, setTyped] = useState(false); // only suggest while the user is typing, not for a saved value

  useEffect(() => {
    if (!typed || value.trim().length < 3) return;
    const ctl = new AbortController();
    const id = setTimeout(() => {
      searchAddresses(value, { lat: near.lat, lon: near.lon }, lang, ctl.signal)
        .then(setHits)
        .catch(() => {});
    }, 300);
    return () => {
      clearTimeout(id);
      ctl.abort();
    };
  }, [value, typed, near.lat, near.lon, lang]);

  const shown = typed ? hits : [];

  return (
    <View style={flush ? { marginTop: -14 } : undefined}>
      <Field
        label={label}
        value={value}
        onChangeText={(v) => {
          setTyped(true);
          onChangeText(v);
        }}
        editable={editable}
        placeholder={placeholder}
        maxLength={160}
        autoComplete="street-address"
        onBlur={onBlur}
      />
      {shown.length > 0 ? (
        <View style={{ marginTop: 6, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: th.line }}>
          {shown.map((h, i) => (
            <Pressable
              key={h.id}
              onPress={() => {
                setTyped(false);
                setHits([]);
                onChangeText(h.label);
                onPick(h);
              }}
              style={{ padding: 12, minHeight: 46, backgroundColor: th.card, borderTopWidth: i === 0 ? 0 : 2, borderColor: th.line }}>
              <Text weight={700} numberOfLines={1}>
                {h.name}
              </Text>
              <Meta numberOfLines={1}>{h.label}</Meta>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
