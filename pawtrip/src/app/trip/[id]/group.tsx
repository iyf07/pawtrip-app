import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Share, View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import {
  useAddDogToTrip,
  useDeleteTrip,
  useLeaveTrip,
  useRemoveDogFromTrip,
  useRotateInviteCode,
  useUpdateTrip,
} from '@/api/trips';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { SectionTitle } from '@/components/ui/Screen';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { TRIP_INTERESTS } from '@/constants/options';
import { TabBody, useTripCtx } from '@/features/trip/TripContext';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { datesLabel, todayIso } from '@/lib/dates';

export default function Group() {
  const { t, locale } = useT();
  const th = useTheme();
  const toast = useToast();
  const { trip, userId, isLeader } = useTripCtx();
  const myDogs = useMyDogs();

  const rotate = useRotateInviteCode();
  const addDog = useAddDogToTrip();
  const removeDog = useRemoveDogFromTrip();
  const leave = useLeaveTrip();
  const del = useDeleteTrip();
  const update = useUpdateTrip();

  const [confirm, setConfirm] = useState<null | 'leave' | 'delete'>(null);
  // the leader's unsaved edit; null = show what is saved
  const [draft, setDraft] = useState<string[] | null>(null);
  const interests = draft ?? trip.interests;

  const expired = trip.invite_expires < todayIso();
  const inviteLink =
    Platform.OS === 'web' ? `${window.location.origin}/join?code=${trip.invite_code}` : Linking.createURL('/join', { queryParams: { code: trip.invite_code } });

  const inTrip = new Set(trip.trip_dogs.map((d) => d.dog_id));
  const mineToAdd = (myDogs.data ?? []).filter((d) => !inTrip.has(d.id));

  async function copyCode() {
    await Clipboard.setStringAsync(trip.invite_code);
    toast(t('group.copied'));
  }

  async function shareInvite() {
    const message = t('group.shareText', { name: trip.name, link: inviteLink, code: trip.invite_code });
    try {
      if (Platform.OS === 'web' && !navigator.share) {
        await Clipboard.setStringAsync(message);
        toast(t('group.copied'));
      } else {
        await Share.share({ message });
      }
    } catch {
      /* dismissed */
    }
  }

  async function run(p: Promise<unknown>, ok?: string) {
    try {
      await p;
      if (ok) toast(ok);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function doConfirm() {
    const which = confirm;
    try {
      if (which === 'leave') await leave.mutateAsync(trip.id);
      else await del.mutateAsync(trip.id);
      setConfirm(null);
      toast(which === 'leave' ? t('toast.left') : t('toast.deleted'));
      router.replace('/');
    } catch {
      setConfirm(null);
      toast(t('common.saveFailed'));
    }
  }

  const interestsChanged = interests.slice().sort().join() !== trip.interests.slice().sort().join();

  return (
    <TabBody>
      <SectionTitle>{t('group.members')}</SectionTitle>
      <Card style={{ paddingVertical: 4 }}>
        {trip.trip_members.map((m, i) => {
          const name = m.profiles?.display_name || '?';
          return (
            <View
              key={m.user_id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, borderTopWidth: i === 0 ? 0 : 1.5, borderStyle: 'dashed', borderColor: th.line }}>
              <Avatar id={m.user_id} name={name} url={m.profiles?.avatar_url} size={36} />
              <View style={{ flex: 1 }}>
                <Text weight={700} numberOfLines={1}>
                  {m.user_id === userId ? t('group.meTag', { name }) : name}
                </Text>
                {m.profiles?.handle ? (
                  <Meta numberOfLines={1}>@{m.profiles.handle}</Meta>
                ) : null}
              </View>
              {m.user_id === trip.creator_id ? (
                <View style={{ backgroundColor: th.blueBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                  <Text weight={800} size={11}>
                    {t('group.organizer')}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </Card>

      <SectionTitle>{t('group.dogs')}</SectionTitle>
      <View style={{ gap: 10 }}>
        {trip.trip_dogs.length === 0 ? <Meta>{t('group.noDogs')}</Meta> : null}
        {trip.trip_dogs.map((td) => {
          const dog = td.dogs;
          if (!dog) return null;
          const mine = dog.owner_id === userId;
          const owner = dog.profiles?.display_name || '?';
          return (
            <Card
              key={td.dog_id}
              onPress={mine ? () => router.push({ pathname: '/dog/[id]', params: { id: dog.id } }) : undefined}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={dog.photo_url} />
              <View style={{ flex: 1 }}>
                <Text weight={800}>{dog.name}</Text>
                <Meta>{mine ? t('group.yourDog') : t('group.theirDog', { name: owner })}</Meta>
              </View>
              {mine || isLeader ? (
                <Pressable
                  onPress={() => run(removeDog.mutateAsync({ tripId: trip.id, dogId: dog.id }))}
                  accessibilityLabel={t('group.removeDog')}
                  hitSlop={8}
                  style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                  <Text weight={800} color="muted">
                    ✕
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          );
        })}
        {mineToAdd.map((d) => (
          <Card key={d.id} dashed onPress={() => run(addDog.mutateAsync({ tripId: trip.id, dogId: d.id }))} style={{ alignItems: 'center' }}>
            <Text weight={800} color="link">
              {t('group.addMyDog', { name: d.name })}
            </Text>
          </Card>
        ))}
        <Card dashed onPress={() => router.push({ pathname: '/dog/[id]', params: { id: 'new' } })} style={{ alignItems: 'center' }}>
          <Text weight={800} color="link">
            {t('group.newDog')}
          </Text>
        </Card>
      </View>

      <SectionTitle>{t('group.invite')}</SectionTitle>
      <Card>
        <Meta>{t('group.code')}</Meta>
        <Text weight={800} size={22} selectable style={{ marginTop: 4, marginBottom: 10, letterSpacing: 0.5 }}>
          {trip.invite_code}
        </Text>
        <Meta color={expired ? 'danger' : 'muted'}>
          {expired ? t('group.expired') : t('group.expires', { date: datesLabel(trip.invite_expires, trip.invite_expires, locale) })}
        </Meta>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <Button label={t('group.share')} small onPress={shareInvite} />
          <Button label={t('group.copy')} small variant="ghost" onPress={copyCode} />
          {isLeader ? <Button label={t('group.newCode')} small variant="ghost" loading={rotate.isPending} onPress={() => run(rotate.mutateAsync(trip.id), t('toast.newCode'))} /> : null}
        </View>
      </Card>

      {isLeader ? (
        <>
          <SectionTitle>{t('group.settings')}</SectionTitle>
          <Text weight={800} size={13}>
            {t('group.interests')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {TRIP_INTERESTS.map((i) => (
              <Chip
                key={i}
                label={t(`int.${i}` as Key)}
                on={interests.includes(i)}
                onPress={() => setDraft(interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i])}
              />
            ))}
          </View>
          <Button
            label={t('group.save')}
            block
            disabled={!interestsChanged}
            loading={update.isPending}
            onPress={async () => {
              await run(update.mutateAsync({ tripId: trip.id, patch: { interests } }), t('toast.saved'));
              setDraft(null);
            }}
            style={{ marginTop: 14 }}
          />
          {trip.status !== 'completed' ? (
            <Button
              label={t('group.archive')}
              variant="ghost"
              block
              onPress={async () => {
                await run(update.mutateAsync({ tripId: trip.id, patch: { status: 'completed' } }));
                router.replace('/');
                toast(t('toast.archived'));
              }}
              style={{ marginTop: 10 }}
            />
          ) : null}
        </>
      ) : null}

      <View style={{ marginTop: 28 }}>
        {isLeader ? (
          <Button label={`🗑️ ${t('group.delete')}`} variant="danger" block onPress={() => setConfirm('delete')} />
        ) : (
          <Button label={t('group.leave')} variant="danger" block onPress={() => setConfirm('leave')} />
        )}
      </View>

      <ConfirmSheet
        visible={confirm !== null}
        title={confirm === 'delete' ? t('delete.title') : t('leave.title')}
        body={confirm === 'delete' ? t('delete.body', { name: trip.name }) : t('leave.body')}
        confirmLabel={confirm === 'delete' ? t('group.delete') : t('leave.yes')}
        danger
        busy={leave.isPending || del.isPending}
        onConfirm={doConfirm}
        onClose={() => setConfirm(null)}
      />
    </TabBody>
  );
}
