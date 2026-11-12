import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Field } from '@/components/ui/Field';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { searchPlaces, type PlaceHit } from '@/lib/mapbox';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  picked: PlaceHit | null;
  /** a suggestion was chosen; null when the user edits the text again */
  onPick: (hit: PlaceHit | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

/** Destination typeahead (cities, towns, ZIP codes) with the picked place's time zone shown underneath. */
export function DestinationField({ value, onChangeText, picked, onPick, placeholder, autoFocus }: Props) {
  const { t, lang } = useT();
  const th = useTheme();
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [searched, setSearched] = useState(false);

  const searching = !picked && value.trim().length >= 2;
  useEffect(() => {
    if (!searching) return;
    const ctl = new AbortController();
    const id = setTimeout(() => {
      searchPlaces(value, lang, ctl.signal)
        .then((r) => {
          setHits(r);
          setSearched(true);
        })
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(id);
      ctl.abort();
    };
  }, [value, searching, lang]);

  const shown = searching ? hits : [];
  const noCity = searching && searched && hits.length === 0;

  return (
    <View>
      <View style={{ marginTop: -14 }}>
        <Field
          value={value}
          onChangeText={(v) => {
            onChangeText(v);
            onPick(null);
          }}
          placeholder={placeholder}
          autoCorrect={false}
          autoFocus={autoFocus}
          style={{ fontSize: 20 }}
        />
      </View>
      {shown.length > 0 || noCity ? (
        <View style={{ marginTop: 6, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: th.line }}>
          {shown.length === 0 ? (
            <Meta style={{ padding: 12 }}>{t('new.noCity')}</Meta>
          ) : (
            shown.map((h, i) => (
              <Pressable
                key={h.id}
                onPress={() => {
                  onChangeText(h.label);
                  onPick(h);
                  setHits([]);
                }}
                style={{ padding: 12, minHeight: 46, backgroundColor: th.card, borderTopWidth: i === 0 ? 0 : 2, borderColor: th.line }}>
                <Text weight={700}>{h.name}</Text>
                <Meta>{h.label}</Meta>
              </Pressable>
            ))
          )}
        </View>
      ) : null}
      {picked ? <Meta style={{ marginTop: 8 }}>{`${t('new.tz')}: ${picked.tz.replace('_', ' ')} ${t('new.tzHint')}`}</Meta> : null}
    </View>
  );
}
