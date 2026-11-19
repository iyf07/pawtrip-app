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
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
import { Reveal } from '@/components/ui/Reveal';
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
  const actionStyle = { width: 40, height: 40, borderRadius: 20, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center' as const, justifyContent: 'center' as const };
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
          <Card key={i.familyId}>
            <Text weight={800} size={16}>{t('family.invitesYou', { who: i.inviterName, name: i.familyName })}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Button label={t('family.accept')} small loading={respond.isPending} onPress={() => run(() => respond.mutateAsync({ familyId: i.familyId, accept: true }), t('family.joined', { name: i.familyName }))} />
              <Button label={t('bd.decline')} small variant="ghost" onPress={() => run(() => respond.mutateAsync({ familyId: i.familyId, accept: false }), t('bd.declined'))} />
            </View>
          </Card>
        ))}
        <Card dashed onPress={() => setCreating(true)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="nav-family" size={28} /><Text weight={800} color="link">{t('family.createTitle')}</Text></View>
        </Card>
        <Card dashed onPress={() => setJoining(true)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="ui-key" size={28} /><Text weight={800} color="muted">{t('family.joinCode')}</Text></View>
        </Card>
        <JoinFamilySheet visible={joining} onClose={() => setJoining(false)} />
        <FamilyCreateSheet visible={creating} onClose={() => setCreating(false)} />
      </View>
    );
  }

  const editing = editName !== null && state.isAdmin;

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {editing ? <View style={{ flex: 1, minWidth: 0 }}><Field value={editName ?? ''} onChangeText={setEditName} placeholder={t('family.namePh')} maxLength={40} containerStyle={{ marginTop: 0 }} /></View> : <Text weight={800} size={20} style={{ flex: 1 }} numberOfLines={1}>{state.family.name}</Text>}
          {state.isAdmin ? (editing ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <RingButton kind="save" label={t('nav.save')} disabled={!editName?.trim()} loading={rename.isPending} onPress={(done) => run(async () => { const n = (editName ?? '').trim(); if (n && n !== state.family!.name) await rename.mutateAsync(n); await done; setEditName(null); })} />
              <RingButton kind="discard" label={t('pf.discardSection', { section: state.family.name })} onPress={async (done) => { await done; setEditName(null); }} />
            </View>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel={t('family.rename')} onPress={() => setEditName(state.family!.name)} style={actionStyle}>
              <Icon name="ui-pencil" size={24} />
            </Pressable>
          )) : null}
        </View>
        <Meta weight={700} style={{ marginTop: 4 }}>{t('family.members')}</Meta>
        <View style={{ marginTop: 6 }}>
          {state.members.map((m, i) => (
            <Reveal key={m.userId} index={i}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
              <Avatar id={m.userId} name={m.name} url={m.avatar} size={40} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text weight={800} numberOfLines={1}>{m.name}</Text>
                <Meta size={12} numberOfLines={1}>@{m.handle}</Meta>
              </View>
              {m.status === 'pending' ? <Meta weight={700}>{t('family.pending')}</Meta> : m.role === 'admin' ? <View accessible accessibilityLabel={t('family.adminBadge')}><Icon name="nav-admin" size={28} /></View> : null}
              {editing && m.userId !== userId ? (
                <Button label={t('family.remove')} small variant="danger" onPress={() => setAskRemove({ id: m.userId, name: m.name })} />
              ) : null}
            </View></Reveal>
          ))}
        </View>
        <Meta weight={700} style={{ marginTop: 14 }}>{t('family.dogs')}</Meta>
        {(dogs.data ?? []).length === 0 ? <Text color="muted" weight={700} style={{ marginTop: 8 }}>{t('family.noDogs')}</Text> : (
          <View style={{ marginTop: 6 }}>
            {(dogs.data ?? []).map((d, i) => (
              <Reveal key={d.id} index={state.members.length + i}><Pressable onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: d.id } })} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
                <DogAvatar url={d.photo_url} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text weight={800} numberOfLines={1}>{d.name}</Text>
                  <Meta size={12} numberOfLines={1}>{state.members.find((m) => m.userId === d.owner_id)?.name ?? ''}</Meta>
                </View>
                <Text plain size={22} color="muted" weight={800}>›</Text>
              </Pressable></Reveal>
            ))}
          </View>
        )}
        {editing ? <View style={{ alignItems: 'center', marginTop: 14 }}><Button label={t('family.disband')} variant="danger" onPress={() => setAskLeave(true)} /></View> : null}
      </Card>
      {state.isAdmin ? (
        <Card dashed onPress={() => setInviting(true)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="tab-members" size={28} /><Text weight={800} color="link">{t('family.invite')}</Text></View>
        </Card>
      ) : null}
      {state.isAdmin ? (
        <Card dashed onPress={() => setCodeOpen(true)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="ui-key" size={28} /><Text weight={800} color="muted">{t('family.inviteCode')}</Text></View>
        </Card>
      ) : null}
      <FamilyCodeSheet visible={codeOpen} onClose={() => setCodeOpen(false)} familyName={state.family.name} />
      {state.isAdmin ? null : <Button label={t('family.leave')} variant="danger" onPress={() => setAskLeave(true)} style={{ alignSelf: 'center' }} />}

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
