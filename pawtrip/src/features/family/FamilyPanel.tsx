import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import {
  useCreateFamily,
  useFamily,
  useInviteToFamily,
  useLeaveFamily,
  useRemoveFamilyMember,
  useRenameFamily,
} from '@/api/family';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
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
  const [name, setName] = useState('');
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
      <View style={{ gap: 14, marginTop: 8 }}>
        <View style={{ alignItems: 'center', paddingVertical: 24, gap: 18 }}>
          <Icon name="nav-dogs" size={88} />
          <Text weight={800} size={20}>{t('family.empty')}</Text>
        </View>
        <Card>
          <Text weight={800} size={16}>{t('family.createTitle')}</Text>
          <Field value={name} onChangeText={setName} placeholder={t('family.namePh')} maxLength={40} />
          <Button
            label={t('family.create')}
            block
            disabled={name.trim().length === 0}
            loading={create.isPending}
            onPress={() => run(async () => { await create.mutateAsync(name.trim()); setName(''); })}
            style={{ marginTop: 12 }}
          />
        </Card>
      </View>
    );
  }

  const memberIds = new Set(state.members.map((m) => m.userId));
  const invitable = (buddies.data ?? []).filter((b) => b.status === 'accepted' && !memberIds.has(b.userId));

  return (
    <View style={{ gap: 14, marginTop: 8 }}>
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
      <Button label={t('family.leave')} variant="text" block onPress={() => setAskLeave(true)} />

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
        <Button label={t('common.cancel')} variant="text" block onPress={() => setInviting(false)} style={{ marginTop: 14 }} />
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
        title={t('family.leaveTitle')}
        body={t('family.leaveBody')}
        confirmLabel={t('family.leave')}
        danger
        busy={leave.isPending}
        onConfirm={() => run(async () => { await leave.mutateAsync(); setAskLeave(false); }, t('family.left'))}
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
