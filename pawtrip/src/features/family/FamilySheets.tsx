import { useState } from 'react';
import { View } from 'react-native';

import { useBuddies } from '@/api/buddies';
import { useCreateFamily, useFamily, useInviteToFamily } from '@/api/family';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';
import { FamilyCodeSheet } from './FamilyCodeSheets';

/** Pick friends and invite them to my family. Used on the family page and straight from the circle. */
export function FamilyInviteSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const fam = useFamily();
  const buddies = useBuddies();
  const invite = useInviteToFamily();
  const [picked, setPicked] = useState<string[]>([]);
  const [codeOpen, setCodeOpen] = useState(false);
  const memberIds = new Set((fam.data?.members ?? []).map((m) => m.userId));
  const invitable = (buddies.data ?? []).filter((b) => b.status === 'accepted' && !memberIds.has(b.userId));

  async function send() {
    const failed: string[] = [];
    let sent = 0;
    for (const id of picked) {
      const name = (buddies.data ?? []).find((b) => b.userId === id)?.name ?? '';
      try {
        await invite.mutateAsync(id);
        sent += 1;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? '');
        failed.push(msg.includes('already_in_family') ? t('family.errInOther', { name }) : msg.includes('not_a_friend') ? t('family.errNotFriend', { name }) : msg.includes('only the family admin') ? t('family.errOnlyAdmin') : t('common.saveFailed'));
      }
    }
    setPicked([]);
    if (failed.length) toast(failed[0]);
    else toast(t('family.invited'));
    if (sent > 0 || !failed.length) onClose();
  }

  return (
    <>
      <Sheet visible={visible} onClose={() => { onClose(); setPicked([]); }}>
        <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.inviteTitle')}</Text>
        {invitable.length > 0 ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              {invitable.map((b) => (
                <Chip
                  key={b.userId}
                  icon={<Avatar id={b.userId} name={b.name} url={b.avatar} size={26} border={2} />}
                  label={b.name}
                  on={picked.includes(b.userId)}
                  onPress={() => setPicked((cur) => (cur.includes(b.userId) ? cur.filter((x) => x !== b.userId) : [...cur, b.userId]))}
                />
              ))}
            </View>
            <Button label={t('family.inviteBtn')} block disabled={picked.length === 0} loading={invite.isPending} onPress={send} style={{ marginTop: 12 }} />
          </>
        ) : null}
        {/* the second way in: a one-hour code anyone can type; whoever joins with it becomes the admin's friend */}
        <Button label={t('family.inviteCode')} icon="ui-key" variant="ghost" block onPress={() => { onClose(); setPicked([]); setCodeOpen(true); }} style={{ marginTop: invitable.length > 0 ? 8 : 16 }} />
      </Sheet>
      <FamilyCodeSheet visible={codeOpen} onClose={() => setCodeOpen(false)} familyName={fam.data?.family?.name ?? ''} />
    </>
  );
}

/** Name a new family and create it. */
export function FamilyCreateSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const create = useCreateFamily();
  const [name, setName] = useState('');
  async function submit() {
    try {
      await create.mutateAsync(name.trim());
      setName('');
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('family.createTitle')}</Text>
      <Field value={name} onChangeText={setName} placeholder={t('family.namePh')} maxLength={40} autoFocus />
      <Button label={t('family.create')} block disabled={name.trim().length === 0} loading={create.isPending} onPress={submit} style={{ marginTop: 12 }} />
    </Sheet>
  );
}
