import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { useMyDogs } from '@/api/dogs';
import {
  useFamily,
  useDisbandFamily,
  useLeaveFamily,
  useRespondFamilyInvite,
  useRemoveFamilyMember,
  useRenameFamily,
} from '@/api/family';
import { FamilyCodeSheet, JoinFamilySheet } from './FamilyCodeSheets';
import { FamilyCreateSheet, FamilyInviteSheet } from './FamilySheets';
import { Image } from 'expo-image';
import { BENTO_GAP, BentoAction, BentoCard, Hero } from '@/features/circle/Bento';
import { dogColor } from '@/features/circle/dogColor';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { RingButton } from '@/components/ui/RingButton';

/** The family tab on the friends page: create a family, invite friends, see members, leave. Members share all their dogs. */
export function FamilyPanel() {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { userId } = useAuth();
  const fam = useFamily();
  const dogs = useMyDogs();
  const rename = useRenameFamily();
  const remove = useRemoveFamilyMember();
  const leave = useLeaveFamily();
  const disband = useDisbandFamily();
  const respond = useRespondFamilyInvite();
  const params = useLocalSearchParams<{ invite?: string; create?: string }>(); // the circle's "+" opens these
  const [creating, setCreating] = useState(params.create === '1');
  const [joining, setJoining] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [inviting, setInviting] = useState(params.invite === '1');
  // pencil edit mode (admin): rename, remove members, disband
  const [editName, setEditName] = useState<string | null>(null);
  const [askLeave, setAskLeave] = useState(false);
  const [askRemove, setAskRemove] = useState<{ id: string; name: string } | null>(null);

  async function run(fn: () => Promise<unknown>, done?: string) {
    try {
      await fn();
      if (done) toast(done);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  if (fam.isPending) return <PageSkeleton cards={2} />;
  const state = fam.data;
  if (!state?.family) {
    return (
      <View style={{ gap: 12, marginTop: 8 }}>
        <EmptyState icon="nav-family" title={t('family.empty')} />
        {(state?.invites ?? []).map((i) => (
          <BentoCard key={i.familyId} index={0}>
            <Text weight={800} size={16}>{t('family.invitesYou', { who: i.inviterName, name: i.familyName })}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Button label={t('family.accept')} small loading={respond.isPending} onPress={() => run(() => respond.mutateAsync({ familyId: i.familyId, accept: true }), t('family.joined', { name: i.familyName }))} />
              <Button label={t('bd.decline')} small variant="ghost" onPress={() => run(() => respond.mutateAsync({ familyId: i.familyId, accept: false }), t('bd.declined'))} />
            </View>
          </BentoCard>
        ))}
        <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
          <BentoAction index={1} icon={<Icon name="nav-family" size={40} />} label={t('family.createTitle')} onPress={() => setCreating(true)} />
          <BentoAction index={2} icon={<Icon name="ui-key" size={40} />} label={t('family.joinCode')} onPress={() => setJoining(true)} />
        </View>
        <JoinFamilySheet visible={joining} onClose={() => setJoining(false)} />
        <FamilyCreateSheet visible={creating} onClose={() => setCreating(false)} />
      </View>
    );
  }

  const editing = editName !== null && state.isAdmin;

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      {editing ? (
        <BentoCard index={0} tone="gold" right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <RingButton kind="save" label={t('nav.save')} disabled={!editName?.trim()} loading={rename.isPending} onPress={(done) => run(async () => { const n = (editName ?? '').trim(); if (n && n !== state.family!.name) await rename.mutateAsync(n); await done; setEditName(null); })} />
            <RingButton kind="discard" label={t('pf.discardSection', { section: state.family.name })} onPress={async (done) => { await done; setEditName(null); }} />
          </View>}>
          <Field accessibilityLabel={t('family.namePh')} value={editName ?? ''} onChangeText={setEditName} placeholder={t('family.namePh')} maxLength={40} containerStyle={{ marginTop: 0 }} />
          <View style={{ alignItems: 'center' }}><Button label={t('family.disband')} variant="danger" onPress={() => setAskLeave(true)} /></View>
        </BentoCard>
      ) : (
        <Hero index={0} minHeight={150} color={th.goldBg} title={state.family.name} subtitle={t('family.tab')} />
      )}
      <BentoCard index={1} title={t('family.members')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {state.members.map((m) => (
            <View key={m.userId} style={{ width: 76, alignItems: 'center', gap: 6 }}>
              <View>
                <Avatar id={m.userId} name={m.name} url={m.avatar} size={64} />
                {m.role === 'admin' ? <View accessible accessibilityLabel={t('family.adminBadge')} style={{ position: 'absolute', top: -8, right: -6 }}><Icon name="nav-admin" size={28} /></View> : null}
              </View>
              <Text weight={700} size={13} numberOfLines={1} style={{ maxWidth: 76, textAlign: 'center' }}>{m.name}</Text>
              {m.status === 'pending' ? <Meta weight={700} size={11}>{t('family.pending')}</Meta> : null}
              {editing && m.userId !== userId ? <Button label={t('family.remove')} small variant="danger" onPress={() => setAskRemove({ id: m.userId, name: m.name })} /> : null}
            </View>
          ))}
        </View>
      </BentoCard>
      <BentoCard index={2} tone="tint" title={t('family.dogs')}>
        {(dogs.data ?? []).length === 0 ? <Icon name="nav-dogs" size={56} style={{ alignSelf: 'center' }} /> : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {(dogs.data ?? []).map((d) => (
              <Pressable key={d.id} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: d.id } })} accessibilityRole="button" accessibilityLabel={d.name} style={{ width: 76, alignItems: 'center', gap: 6 }}>
                <View style={{ width: 72, height: 72, borderRadius: 18, overflow: 'hidden', backgroundColor: dogColor(d.id), alignItems: 'center', justifyContent: 'center' }}>
                  {d.photo_url ? <Image source={{ uri: d.photo_url }} transition={300} cachePolicy="memory-disk" contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : <DogAvatar url={null} size={36} border={0} />}
                </View>
                <Text weight={700} size={13} numberOfLines={1} style={{ maxWidth: 76, textAlign: 'center' }}>{d.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </BentoCard>
      {state.isAdmin ? (
        <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
          <BentoAction index={3} icon={<Icon name="tab-members" size={56} />} label={t('family.invite')} onPress={() => setInviting(true)} />
          <BentoAction index={4} icon={<Icon name="ui-key" size={56} />} label={t('family.inviteCode')} onPress={() => setCodeOpen(true)} />
          {editing ? null : <BentoAction index={5} icon={<Icon name="ui-pencil" size={56} />} label={t('family.edit')} onPress={() => setEditName(state.family!.name)} />}
        </View>
      ) : null}
      <FamilyCodeSheet visible={codeOpen} onClose={() => setCodeOpen(false)} familyName={state.family.name} />
      {state.isAdmin ? null : <BentoCard index={3}><Button label={t('family.leave')} variant="danger" block onPress={() => setAskLeave(true)} /></BentoCard>}

      <FamilyInviteSheet visible={inviting} onClose={() => setInviting(false)} />

      <ConfirmSheet
        visible={askLeave}
        title={t(state.isAdmin ? 'family.disbandTitle' : 'family.leaveTitle')}
        body={t(state.isAdmin ? 'family.disbandBody' : 'family.leaveBody')}
        confirmLabel={t(state.isAdmin ? 'family.disband' : 'family.leave')}
        danger
        busy={leave.isPending || disband.isPending}
        onConfirm={() => run(async () => { if (state.isAdmin) await disband.mutateAsync(); else await leave.mutateAsync(); setAskLeave(false); }, t(state.isAdmin ? 'family.disbanded' : 'family.left'))}
        onClose={() => setAskLeave(false)}
      />
      <ConfirmSheet
        visible={askRemove !== null}
        title={t('family.removeTitle', { name: askRemove?.name ?? '' })}
        body={t('family.removeBody', { name: askRemove?.name ?? '' })}
        confirmLabel={t('family.remove')}
        danger
        busy={remove.isPending}
        onConfirm={() => run(async () => { await remove.mutateAsync(askRemove!.id); setAskRemove(null); })}
        onClose={() => setAskRemove(null)}
      />
    </View>
  );
}
