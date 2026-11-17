import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import {
  useCreateFamily,
  useFamily,
  useInviteToFamily,
  useDisbandFamily,
  useLeaveFamily,
  useRespondFamilyInvite,
  useRemoveFamilyMember,
  useRenameFamily,
} from '@/api/family';
import { FamilyCodeSheet, JoinFamilySheet } from './FamilyCodeSheets';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** The family tab on the friends page: create a family, invite friends, see members, leave. Members share all their dogs. */
export function FamilyPanel() {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { userId } = useAuth();
  const fam = useFamily();
  const buddies = useBuddies();
  const create = useCreateFamily();
  const rename = useRenameFamily();
  const invite = useInviteToFamily();
  const remove = useRemoveFamilyMember();
  const leave = useLeaveFamily();
  const disband = useDisbandFamily();
  const respond = useRespondFamilyInvite();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
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
        <Sheet visible={creating} onClose={() => setCreating(false)}>
          <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.createTitle')}</Text>
          <Field value={name} onChangeText={setName} placeholder={t('family.namePh')} maxLength={40} autoFocus />
          <Button
            label={t('family.create')}
            block
            disabled={name.trim().length === 0}
            loading={create.isPending}
            onPress={() => run(async () => { await create.mutateAsync(name.trim()); setName(''); setCreating(false); })}
            style={{ marginTop: 12 }}
          />
        </Sheet>
      </View>
    );
  }

  const memberIds = new Set(state.members.map((m) => m.userId));
  const invitable = (buddies.data ?? []).filter((b) => b.status === 'accepted' && !memberIds.has(b.userId));

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text weight={800} size={20} style={{ flex: 1 }} numberOfLines={1}>{state.family.name}</Text>
          {state.isAdmin ? <Button label={t('family.rename')} small variant="ghost" onPress={() => { setRenaming(state.family!.name); }} /> : null}
        </View>
        <Meta weight={700} style={{ marginTop: 4 }}>{t('family.members')}</Meta>
        <View style={{ marginTop: 6 }}>
          {state.members.map((m, i) => (
            <View key={m.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? 1.5 : 0, borderStyle: 'dashed', borderColor: th.line }}>
              <Avatar id={m.userId} name={m.name} url={m.avatar} size={40} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text weight={800} numberOfLines={1}>{m.name}</Text>
                <Meta size={12} numberOfLines={1}>@{m.handle}</Meta>
              </View>
              {m.status === 'pending' ? <Meta weight={700}>{t('family.pending')}</Meta> : m.role === 'admin' ? <Meta weight={700}>{t('family.admin')}</Meta> : null}
              {state.isAdmin && m.userId !== userId ? (
                <Button label={t('family.remove')} small variant="text" onPress={() => setAskRemove({ id: m.userId, name: m.name })} />
              ) : null}
            </View>
          ))}
        </View>
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
      <Button label={t(state.isAdmin ? 'family.disband' : 'family.leave')} variant="text" block onPress={() => setAskLeave(true)} />

      <Sheet visible={inviting} onClose={() => setInviting(false)}>
        <Text weight={800} size={20}>{t('family.inviteTitle')}</Text>
        {invitable.length === 0 ? (
          <Text color="muted" weight={700} style={{ marginTop: 14 }}>{t('family.noFriends')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {invitable.map((b) => (
              <Chip
                key={b.userId}
                icon={<Avatar id={b.userId} name={b.name} url={b.avatar} size={26} border={2} />}
                label={b.name}
                onPress={() => run(async () => { await invite.mutateAsync(b.userId); setInviting(false); }, t('family.invited'))}
              />
            ))}
          </View>
        )}
      </Sheet>

      <Sheet visible={renaming !== null} onClose={() => setRenaming(null)}>
        <Text weight={800} size={20}>{t('family.rename')}</Text>
        <Field value={renaming ?? ''} onChangeText={setRenaming} placeholder={t('family.namePh')} maxLength={40} autoFocus />
        <Button
          label={t('nav.save')}
          block
          disabled={!renaming?.trim()}
          loading={rename.isPending}
          onPress={() => run(async () => { await rename.mutateAsync((renaming ?? '').trim()); setRenaming(null); })}
          style={{ marginTop: 12 }}
        />
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
        body={t('family.removeBody')}
        confirmLabel={t('family.remove')}
        danger
        busy={remove.isPending}
        onConfirm={() => run(async () => { await remove.mutateAsync(askRemove!.id); setAskRemove(null); })}
        onClose={() => setAskRemove(null)}
      />
    </View>
  );
}
