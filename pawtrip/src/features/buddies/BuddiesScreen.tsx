import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import {
  useBuddyGroups,
  useCreateBuddyGroup,
  useDeleteBuddyGroup,
  useInviteBuddy,
  useRemoveBuddy,
  useRespondBuddy,
  type BuddyGroup,
} from '@/api/buddies';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Header, Screen } from '@/components/ui/Screen';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { isCode } from '@/api/types';

/** 伙伴: named groups of people you travel with. Joining needs the other person's yes. */
export function BuddiesScreen() {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { userId } = useAuth();
  const groups = useBuddyGroups();
  const respond = useRespondBuddy();
  const [creating, setCreating] = useState(false);

  const all = groups.data ?? [];
  const invites = all.filter((g) => g.buddy_members.some((m) => m.user_id === userId && m.status === 'invited'));
  const mine = all.filter((g) => !invites.includes(g));

  async function answer(g: BuddyGroup, accept: boolean) {
    try {
      await respond.mutateAsync({ group: g.id, accept });
      toast(accept ? t('bd.joined', { name: g.name }) : t('bd.declined'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  const plus = (
    <Pressable
      onPress={() => setCreating(true)}
      accessibilityLabel={t('bd.new')}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: th.gold, borderWidth: 3, borderColor: th.sticker, alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 8px -2px ${th.shadow}` }}>
      <Text plain size={24} weight={800} color="onGold" style={{ lineHeight: 28 }}>
        +
      </Text>
    </Pressable>
  );

  return (
    <Screen nav top={<Header title={t('bd.title')} right={plus} />} size="wide">
      {groups.isPending ? (
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <ActivityIndicator color={th.muted} />
        </View>
      ) : (
        <View style={{ gap: 14, marginTop: 8 }}>
          {invites.map((g) => {
            const owner = g.buddy_members.find((m) => m.user_id === g.owner_id)?.profiles;
            return (
              <Card key={g.id}>
                <Text weight={800} size={16}>
                  {t('bd.inviteFrom', { who: owner?.display_name ?? '?', name: g.name })}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <Button label={t('bd.accept')} small onPress={() => answer(g, true)} loading={respond.isPending} />
                  <Button label={t('bd.decline')} small variant="ghost" onPress={() => answer(g, false)} />
                </View>
              </Card>
            );
          })}
          {mine.length === 0 && invites.length === 0 ? (
            <Card dashed onPress={() => setCreating(true)} style={{ alignItems: 'center' }}>
              <Text weight={800} color="muted">
                + {t('bd.new')}
              </Text>
            </Card>
          ) : null}
          {mine.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </View>
      )}
      <NewGroupSheet visible={creating} onClose={() => setCreating(false)} />
    </Screen>
  );
}

function GroupCard({ group }: { group: BuddyGroup }) {
  const { t } = useT();
  const toast = useToast();
  const { userId } = useAuth();
  const invite = useInviteBuddy();
  const remove = useRemoveBuddy();
  const del = useDeleteBuddyGroup();
  const [handle, setHandle] = useState('');
  const [confirm, setConfirm] = useState<null | 'delete' | 'leave'>(null);
  const isOwner = group.owner_id === userId;
  const members = [...group.buddy_members].sort((a, b) => Number(b.status === 'accepted') - Number(a.status === 'accepted'));

  async function add() {
    if (!handle.trim()) return;
    try {
      await invite.mutateAsync({ group: group.id, handle });
      setHandle('');
      toast(t('bd.invited'));
    } catch (e) {
      toast(isCode(e, 'unknown_handle') ? t('bd.unknown') : isCode(e, 'self') ? t('bd.self') : isCode(e, 'group_full') ? t('bd.full') : t('common.saveFailed'));
    }
  }

  async function confirmed() {
    try {
      if (confirm === 'delete') await del.mutateAsync(group.id);
      else await remove.mutateAsync({ group: group.id, user: userId! });
    } catch {
      toast(t('common.saveFailed'));
    }
    setConfirm(null);
  }

  return (
    <Card>
      <Text weight={800} size={18}>
        {group.name}
      </Text>
      <View style={{ marginTop: 8 }}>
        {members.map((m) => (
          <View key={m.user_id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
            <Avatar id={m.user_id} name={m.profiles?.display_name} url={m.profiles?.avatar_url} size={34} />
            <View style={{ flex: 1 }}>
              <Text weight={800} size={14} numberOfLines={1}>
                {m.profiles?.display_name ?? '?'}
              </Text>
              {m.profiles ? <Meta numberOfLines={1}>@{m.profiles.handle}</Meta> : null}
            </View>
            {m.status === 'invited' ? <Meta weight={700}>{t('bd.pending')}</Meta> : m.user_id === group.owner_id ? <Meta weight={700}>{t('bd.owner')}</Meta> : null}
            {isOwner && m.user_id !== userId ? (
              <Pressable onPress={() => remove.mutate({ group: group.id, user: m.user_id })} accessibilityRole="button" accessibilityLabel={t('bd.remove')} hitSlop={8}>
                <Text plain weight={800} size={18} color="muted">
                  ×
                </Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
      {isOwner ? (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Field value={handle} onChangeText={(v) => setHandle(v.toLowerCase())} placeholder={t('bd.idPh')} autoCapitalize="none" autoCorrect={false} onSubmitEditing={add} returnKeyType="send" />
          </View>
          <Button label={t('bd.invite')} small onPress={add} loading={invite.isPending} disabled={!handle.trim()} />
        </View>
      ) : null}
      <View style={{ marginTop: 12 }}>
        <Button label={isOwner ? t('bd.delete') : t('bd.leave')} variant="danger" small onPress={() => setConfirm(isOwner ? 'delete' : 'leave')} />
      </View>
      <ConfirmSheet
        visible={confirm !== null}
        title={confirm === 'delete' ? t('bd.delete.title') : t('bd.leave.title')}
        body={confirm === 'delete' ? t('bd.delete.body', { name: group.name }) : t('bd.leave.body', { name: group.name })}
        confirmLabel={confirm === 'delete' ? t('bd.delete') : t('bd.leave')}
        danger
        onConfirm={confirmed}
        onClose={() => setConfirm(null)}
      />
    </Card>
  );
}

function NewGroupSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const create = useCreateBuddyGroup();
  const [name, setName] = useState('');
  async function save() {
    if (!name.trim()) return;
    try {
      await create.mutateAsync(name);
      setName('');
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={20}>
        {t('bd.new')}
      </Text>
      <View style={{ marginTop: 12 }}>
        <Field value={name} onChangeText={setName} placeholder={t('bd.namePh')} maxLength={40} autoFocus onSubmitEditing={save} returnKeyType="done" />
      </View>
      <View style={{ marginTop: 16, gap: 8 }}>
        <Button label={t('bd.create')} block loading={create.isPending} disabled={!name.trim()} onPress={save} />
        <Button label={t('common.cancel')} variant="text" block onPress={onClose} />
      </View>
    </Sheet>
  );
}
