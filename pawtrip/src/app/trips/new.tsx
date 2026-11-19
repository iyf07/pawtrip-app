import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useMyDogs } from '@/api/dogs';
import { useBuddies } from '@/api/buddies';
import { useFamily } from '@/api/family';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { useCreateTrip } from '@/api/trips';
import { DestinationField } from '@/components/DestinationField';
import { RangeCalendar } from '@/components/RangeCalendar';
import { Wizard, type WizardStep } from '@/components/Wizard';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
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
  const [dogIds, setDogIds] = useState<string[] | null>(null); // null = all my dogs
  const [buddyIds, setBuddyIds] = useState<string[]>([]);
  const [buddyDogs, setBuddyDogs] = useState(true);
  // everyone who can come: friends and family mates, each person once (family mates first)
  const { userId } = useAuth();
  const family = useFamily();
  const familyMates = (family.data?.members ?? []).filter((m) => m.status === 'accepted' && m.userId !== userId);
  const familyIds = familyMates.map((m) => m.userId);
  const people = [
    ...familyMates.map((m) => ({ userId: m.userId, name: m.name, avatar: m.avatar })),
    ...(buddies.data ?? []).filter((b) => b.status === 'accepted' && !familyIds.includes(b.userId)).map((b) => ({ userId: b.userId, name: b.name, avatar: b.avatar })),
  ];

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
      key: 'dogs',
      title: t('nt.dogs.q'),
      optional: true,
      content: (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {dogs.map((d) => (
            <Chip
              key={d.id}
              label={d.name}
              icon={<DogAvatar url={d.photo_url} size={26} border={2} />}
              on={chosenDogs.includes(d.id)}
              onPress={() => setDogIds(chosenDogs.includes(d.id) ? chosenDogs.filter((x) => x !== d.id) : [...chosenDogs, d.id])}
            />
          ))}
          <Chip icon={<Icon name="nav-dogs" size={24} />} label={t('group.newDog')} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: 'new' } })} />
        </View>
      ),
    },
    ...(people.length
      ? [
          {
            key: 'buddies',
            title: t('nt.people.q'),
            optional: true,
            content: (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {familyIds.length > 0 ? <Chip icon={<Icon name="nav-family" size={24} />} label={t('family.tab')} on={familyIds.every((id) => buddyIds.includes(id))} onPress={() => setBuddyIds((cur) => (familyIds.every((id) => cur.includes(id)) ? cur.filter((x) => !familyIds.includes(x)) : [...new Set([...cur, ...familyIds])]))} /> : null}
                {people.map((p) => (
                  <Chip key={p.userId} icon={<Avatar id={p.userId} name={p.name} url={p.avatar} size={26} border={2} />} label={p.name} on={buddyIds.includes(p.userId)} onPress={() => setBuddyIds((cur) => (cur.includes(p.userId) ? cur.filter((x) => x !== p.userId) : [...cur, p.userId]))} />
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
        interests: [], // the group's interests are worked out from each person's own profile
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
