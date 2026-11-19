import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useMyDogs } from '@/api/dogs';
import { useBuddies } from '@/api/buddies';
import { useCreateTrip } from '@/api/trips';
import { InterestPicker } from '@/components/InterestPicker';
import { DestinationField } from '@/components/DestinationField';
import { RangeCalendar } from '@/components/RangeCalendar';
import { Wizard, type WizardStep } from '@/components/Wizard';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { FriendChoice } from '@/features/buddies/FriendChoice';
import { DogIllo } from '@/components/ui/DogIllo';
import { Field } from '@/components/ui/Field';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';
import { daysBetween, datesLabel } from '@/lib/dates';
import type { PlaceHit } from '@/lib/mapbox';
import { goBack } from '@/lib/nav';

/** New trip, one question at a time: name, destination, dates, interests, dogs. */
export default function NewTrip() {
  const { t, locale } = useT();
  const toast = useToast();
  const create = useCreateTrip();
  const myDogs = useMyDogs();
  const buddies = useBuddies();

  const [name, setName] = useState('');
  const [dest, setDest] = useState('');
  const [picked, setPicked] = useState<PlaceHit | null>(null);
  // the calendar can hand over the days that were tapped or dragged
  const preset = useLocalSearchParams<{ start?: string; end?: string }>();
  const [start, setStart] = useState<string | null>(preset.start ?? null);
  const [end, setEnd] = useState<string | null>(preset.end ?? preset.start ?? null);
  const [tooLong, setTooLong] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [dogIds, setDogIds] = useState<string[] | null>(null); // null = all my dogs
  const [buddyIds, setBuddyIds] = useState<string[]>([]);
  const [buddyDogs, setBuddyDogs] = useState(true);
  const myBuddies = (buddies.data ?? []).filter((b) => b.status === 'accepted');

  const dogs = myDogs.data ?? [];
  const chosenDogs = dogIds ?? dogs.map((d) => d.id);
  const days = start && end ? daysBetween(start, end) + 1 : 0;

  const steps: WizardStep[] = [
    {
      key: 'name',
      title: t('nt.name.q'),
      canContinue: name.trim().length > 0,
      content: ({ next }) => (
        <View style={{ marginTop: -14 }}>
          <Field value={name} onChangeText={setName} placeholder={t('new.namePh')} maxLength={80} autoFocus returnKeyType="next" onSubmitEditing={() => name.trim() && next()} style={{ fontSize: 22 }} />
        </View>
      ),
    },
    {
      key: 'dest',
      title: t('nt.dest.q'),
      canContinue: !!picked,
      content: <DestinationField value={dest} onChangeText={setDest} picked={picked} onPick={setPicked} placeholder={t('new.destPh')} autoFocus />,
    },
    {
      key: 'dates',
      title: t('nt.dates.q'),
      canContinue: !!start && !!end,
      content: (
        <View>
          <Card>
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
          </Card>
          <Meta style={{ marginTop: 10 }} color={tooLong ? 'danger' : 'muted'}>
            {tooLong ? t('rp.tooLong') : start && end ? `${datesLabel(start, end, locale)} · ${t('rp.days', { n: days })}`   : ''}
          </Meta>
        </View>
      ),
    },
    {
      key: 'interests',
      title: t('nt.interests.q'),
      optional: true,
      content: (
        <InterestPicker value={interests} onToggle={(i) => setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))} />
      ),
    },
    {
      key: 'dogs',
      title: t('nt.dogs.q'),
      optional: true,
      content: (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {dogs.map((d) => (
            <Chip
              key={d.id}
              label={d.name}
              icon={<Icon name="nav-dogs" size={22} />}
              on={chosenDogs.includes(d.id)}
              onPress={() => setDogIds(chosenDogs.includes(d.id) ? chosenDogs.filter((x) => x !== d.id) : [...chosenDogs, d.id])}
            />
          ))}
          <Chip icon={<Icon name="nav-dogs" size={24} />} label={t('group.newDog')} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: 'new' } })} />
        </View>
      ),
    },
    ...(myBuddies.length
      ? [
          {
            key: 'buddies',
            title: t('nt.buddies.q'),
            optional: true,
            content: (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {myBuddies.map((b) => (
                  <FriendChoice
                    key={b.userId}
                    buddy={b}
                    selected={buddyIds.includes(b.userId)}
                    onPress={() => setBuddyIds((cur) => (cur.includes(b.userId) ? cur.filter((x) => x !== b.userId) : [...cur, b.userId]))}
                  />
                ))}
                {buddyIds.length > 0 ? <Chip label={t('nt.buddies.dogs')} on={buddyDogs} onPress={() => setBuddyDogs((v) => !v)} /> : null}
              </View>
            ),
          } satisfies WizardStep,
        ]
      : []),
    {
      key: 'done',
      title: t('nt.done.title'),
      content: (
        <View style={{ alignItems: 'center', gap: 14 }}>
          <DogIllo size={120} />
          <Card style={{ alignSelf: 'stretch' }}>
            <Text weight={800} size={18}>
              {name.trim()}
            </Text>
            <Meta style={{ marginTop: 6 }}>
              {start && end ? datesLabel(start, end, locale) : ''}
              {picked ? ` · ${picked.label}` : ''}
            </Meta>
            {chosenDogs.length > 0 ? (
              <Meta weight={700} style={{ marginTop: 6 }}>
                {dogs
                  .filter((d) => chosenDogs.includes(d.id))
                  .map((d) => d.name)
                  .join('  ')}
              </Meta>
            ) : null}
          </Card>
        </View>
      ),
    },
  ];

  async function finish() {
    if (!picked || !start || !end) return;
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
        buddyIds,
        buddyDogs,
      });
      toast(t('toast.tripCreated'));
      router.replace({ pathname: '/trips/[id]/plan', params: { id } });
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return <Wizard steps={steps} onFinish={finish} finishLabel={t('new.create')} onClose={goBack} />;
}
