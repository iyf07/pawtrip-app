import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useCreateTrip } from '@/api/trips';
import { RangeCalendar } from '@/components/RangeCalendar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Header, Screen } from '@/components/ui/Screen';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { TRIP_INTERESTS } from '@/constants/options';
import { useT, type Key } from '@/i18n';
import { daysBetween, datesLabel } from '@/lib/dates';
import { searchPlaces, type PlaceHit } from '@/lib/mapbox';

export default function NewTrip() {
  const { t, lang, locale } = useT();
  const th = useTheme();
  const toast = useToast();
  const create = useCreateTrip();
  const myDogs = useMyDogs();

  const [name, setName] = useState('');
  const [dest, setDest] = useState('');
  const [picked, setPicked] = useState<PlaceHit | null>(null);
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [searched, setSearched] = useState(false);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const [tooLong, setTooLong] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [dogIds, setDogIds] = useState<string[] | null>(null); // null = all my dogs
  const [errs, setErrs] = useState<{ name?: string; dest?: string; dates?: string }>({});

  // destination typeahead
  const searching = !picked && dest.trim().length >= 2;
  useEffect(() => {
    if (!searching) return;
    const ctl = new AbortController();
    const id = setTimeout(() => {
      searchPlaces(dest, lang, ctl.signal)
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
  }, [dest, searching, lang]);
  const shownHits = searching ? hits : [];
  const noCity = searching && searched && hits.length === 0;

  const chosenDogs = dogIds ?? (myDogs.data ?? []).map((d) => d.id);

  async function submit() {
    const e: typeof errs = {};
    if (!name.trim()) e.name = t('new.errName');
    if (!picked) e.dest = t('new.errDest');
    if (!start || !end) e.dates = t('new.errDates');
    setErrs(e);
    if (e.name || e.dest || e.dates || !picked || !start || !end) return;
    try {
      const id = await create.mutateAsync({
        name: name.trim(),
        place: picked.label,
        lat: picked.lat,
        lon: picked.lon,
        tz: picked.tz,
        start_date: start,
        end_date: end,
        interests,
        dogIds: chosenDogs,
      });
      toast(t('toast.tripCreated'));
      router.replace({ pathname: '/trip/[id]/plan', params: { id } });
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  const rangeText = start && end ? `${datesLabel(start, end, locale)} · ${t('rp.days', { n: daysBetween(start, end) + 1 })}` : start ? datesLabel(start, start, locale) : t('rp.ph');

  return (
    <Screen
      top={<Header title={t('new.title')} left={<Button label={t('nav.cancel')} variant="text" onPress={() => router.back()} />} />}>
      <Field label={t('new.name')} value={name} onChangeText={setName} placeholder={t('new.namePh')} error={errs.name} maxLength={80} />

      <Field
        label={t('new.dest')}
        value={dest}
        onChangeText={(v) => {
          setDest(v);
          setPicked(null);
        }}
        placeholder={t('new.destPh')}
        error={errs.dest}
        autoCorrect={false}
      />
      {shownHits.length > 0 || noCity ? (
        <View style={{ marginTop: 6, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: th.line }}>
          {shownHits.length === 0 ? (
            <Meta style={{ padding: 12 }}>{t('new.noCity')}</Meta>
          ) : (
            shownHits.map((h, i) => (
              <Pressable
                key={h.id}
                onPress={() => {
                  setPicked(h);
                  setDest(h.label);
                }}
                style={{ padding: 12, minHeight: 46, backgroundColor: th.card, borderTopWidth: i === 0 ? 0 : 2, borderColor: th.line }}>
                <Text weight={700}>{h.name}</Text>
                <Meta>{h.label}</Meta>
              </Pressable>
            ))
          )}
        </View>
      ) : null}
      {picked ? <Meta style={{ marginTop: 6 }}>{`${t('new.tz')}: ${picked.tz.replace('_', ' ')} ${t('new.tzHint')}`}</Meta> : null}

      <Text weight={800} size={13} style={{ marginTop: 14, marginBottom: 6 }}>
        {t('rp.label')}
      </Text>
      <Pressable
        onPress={() => setCalOpen(true)}
        accessibilityRole="button"
        style={{ minHeight: 46, borderRadius: 10, borderWidth: 2, borderColor: errs.dates ? th.danger : th.line, backgroundColor: th.card, paddingHorizontal: 12, justifyContent: 'center' }}>
        <Text color={start ? 'text' : 'muted'}>{rangeText}</Text>
      </Pressable>
      {errs.dates ? (
        <Text size={14} weight={700} color="danger" style={{ marginTop: 6 }}>
          {errs.dates}
        </Text>
      ) : null}

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('new.interests')} <Text size={13} color="muted">{t('new.interestsHint')}</Text>
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {TRIP_INTERESTS.map((i) => (
          <Chip
            key={i}
            label={t(`int.${i}` as Key)}
            on={interests.includes(i)}
            onPress={() => setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))}
          />
        ))}
      </View>

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('group.dogs')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {(myDogs.data ?? []).map((d) => (
          <Chip
            key={d.id}
            label={`🐕 ${d.name}`}
            on={chosenDogs.includes(d.id)}
            onPress={() => setDogIds(chosenDogs.includes(d.id) ? chosenDogs.filter((x) => x !== d.id) : [...chosenDogs, d.id])}
          />
        ))}
        <Chip label={t('group.newDog')} onPress={() => router.push({ pathname: '/dog/[id]', params: { id: 'new' } })} />
      </View>

      <Button label={t('new.create')} block loading={create.isPending} onPress={submit} style={{ marginTop: 24 }} />

      <Sheet visible={calOpen} onClose={() => setCalOpen(false)}>
        <RangeCalendar
          start={start}
          end={end}
          onChange={(a, b) => {
            setStart(a);
            setEnd(b);
            setTooLong(false);
          }}
          onTooLong={() => setTooLong(true)}
        />
        <Meta style={{ marginTop: 10 }} color={tooLong ? 'danger' : 'muted'}>
          {tooLong ? t('rp.tooLong') : !start ? t('rp.pickStart') : !end ? t('rp.pickEnd') : ''}
        </Meta>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Button
            label={t('rp.clear')}
            variant="text"
            onPress={() => {
              setStart(null);
              setEnd(null);
            }}
          />
          <Button label={t('rp.done')} disabled={!start || !end} onPress={() => setCalOpen(false)} />
        </View>
      </Sheet>
    </Screen>
  );
}
