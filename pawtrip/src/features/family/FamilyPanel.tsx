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
  type FamilyMember,
} from '@/api/family';
import { JoinFamilySheet } from './FamilyCodeSheets';
import { FamilyCreateSheet, FamilyInviteSheet } from './FamilySheets';
import { Image } from 'expo-image';
import { InterestIcon } from '@/components/InterestIcon';
import { Chip } from '@/components/ui/Chip';
import { normalizeInterests } from '@/constants/options';
import { BENTO_GAP, BentoAction, BentoCard, BentoColumns, Hero } from '@/features/circle/Bento';
import { dogColor } from '@/features/circle/dogColor';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

/** The members' interests added together: the ones several people share come first, with how many share them. */
function FamilyInterests({ index, members }: { index: number; members: FamilyMember[] }) {
  const { t } = useT();
  const counts = new Map<string, number>();
  for (const m of members.filter((x) => x.status === 'accepted')) for (const i of normalizeInterests(m.interests)) counts.set(i, (counts.get(i) ?? 0) + 1);
  const list = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <BentoCard index={index} tone="tint" title={t('family.interests')}>
      {list.length === 0 ? <Icon name="empty-discover" size={56} style={{ alignSelf: 'center' }} /> : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {list.map(([i, n]) => <Chip key={i} icon={<InterestIcon interest={i} size={28} />} label={n > 1 ? `${t(`interest.${i}` as Key)} ×${n}` : t(`interest.${i}` as Key)} on={n > 1} />)}
        </View>
      )}
    </BentoCard>
  );
}

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
  const [inviting, setInviting] = useState(params.invite === '1');
  // pencil edit mode (admin): rename, remove members, disband
  const [editName, setEditName] = useState<string | null>(null); // the rename sheet
  const [editMode, setEditMode] = useState(false); // edit mode: members can be removed, the name can be changed
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

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      {state.isAdmin && editMode ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('family.rename')} onPress={() => setEditName(state.family!.name)}>
          <Hero index={0} minHeight={96} color={th.softMint} title={state.family.name} right={<Icon name="ui-pencil" size={28} />} />
        </Pressable>
      ) : <Hero index={0} minHeight={96} color={th.softMint} title={state.family.name} />}
      <BentoColumns
        left={
          <BentoCard index={1} style={{ minHeight: 360, gap: 22 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
              {state.members.map((m) => (
                <View key={m.userId} style={{ width: 88, alignItems: 'center', gap: 6 }}>
                  <View>
                    <Avatar id={m.userId} name={m.name} url={m.avatar} size={76} />
                    {m.role === 'admin' ? <View accessible accessibilityLabel={t('family.adminBadge')} style={{ position: 'absolute', top: -8, right: -6 }}><Icon name="nav-admin" size={30} /></View> : null}
                    {state.isAdmin && editMode && m.userId !== userId ? (
                      <Pressable accessibilityRole="button" accessibilityLabel={t('family.remove')} hitSlop={8} onPress={() => setAskRemove({ id: m.userId, name: m.name })} style={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: 13, backgroundColor: th.danger, borderWidth: 2, borderColor: th.card, alignItems: 'center', justifyContent: 'center' }}>
                        <Text plain weight={800} size={14} style={{ color: '#FFFFFF', lineHeight: 16 }}>✕</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <Text weight={700} size={14} numberOfLines={1} style={{ maxWidth: 88, textAlign: 'center' }}>{m.name}</Text>
                  {m.status === 'pending' ? <Meta weight={700} size={11}>{t('family.pending')}</Meta> : null}
                </View>
              ))}
            </View>
            {(dogs.data ?? []).length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, paddingTop: 22, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: th.line }}>
                {(dogs.data ?? []).map((d) => (
                  <Pressable key={d.id} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: d.id } })} accessibilityRole="button" accessibilityLabel={d.name} style={{ width: 88, alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 76, height: 76, borderRadius: 38, overflow: 'hidden', backgroundColor: dogColor(d.id), alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: th.blue }}>
                      {d.photo_url ? <Image source={{ uri: d.photo_url }} transition={300} cachePolicy="memory-disk" contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : <DogAvatar url={null} size={40} border={0} />}
                    </View>
                    <Text weight={700} size={14} numberOfLines={1} style={{ maxWidth: 88, textAlign: 'center' }}>{d.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </BentoCard>
        }
        right={<>
          <FamilyInterests index={2} members={state.members} />
          {state.isAdmin ? (
            <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
              <BentoAction index={3} icon={<Icon name="tab-members" size={56} />} label={t('family.invite')} onPress={() => setInviting(true)} />
              <BentoAction index={4} icon={<Icon name={editMode ? 'ui-save' : 'ui-pencil'} size={56} />} label={editMode ? t('family.done') : t('family.edit')} onPress={() => setEditMode((v) => !v)} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <BentoAction index={3} danger label={t('family.leave')} onPress={() => setAskLeave(true)} />
            </View>
          )}
        </>}
      />

      <FamilyInviteSheet visible={inviting} onClose={() => setInviting(false)} />

      <Sheet visible={editName !== null} onClose={() => setEditName(null)}>
        <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.edit')}</Text>
        <Field accessibilityLabel={t('family.namePh')} value={editName ?? ''} onChangeText={setEditName} placeholder={t('family.namePh')} maxLength={40} autoFocus />
        <Button label={t('nav.save')} block disabled={!editName?.trim()} loading={rename.isPending} style={{ marginTop: 12 }}
          onPress={() => run(async () => { const n = (editName ?? '').trim(); if (n && n !== state.family!.name) await rename.mutateAsync(n); setEditName(null); }, t('toast.saved'))} />
        <Button label={t('family.disband')} variant="danger" block style={{ marginTop: 8 }} onPress={() => { setEditName(null); setAskLeave(true); }} />
      </Sheet>
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
