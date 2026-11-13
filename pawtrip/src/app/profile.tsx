import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useMyFeedback } from '@/api/feedback';
import { useMyProfile, useUpdateProfile } from '@/api/profile';
import type { Profile as ProfileRow } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { AvatarEditor } from '@/components/AvatarEditor';
import { InterestPicker } from '@/components/InterestPicker';
import { HandleField } from '@/components/HandleField';
import { GearButton } from '@/components/NavBar';
import { ScaleInput } from '@/components/ScaleInput';
import { DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { SaveBar } from '@/components/ui/SaveBar';
import { Field } from '@/components/ui/Field';
import { BackButton, Header, Screen, SectionTitle } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { DIETS, PERSON_SCALES, type PersonScale } from '@/constants/options';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { goBack } from '@/lib/nav';
import { deletePhotoByUrl } from '@/lib/photos';

export default function ProfileRoute() {
  const me = useMyProfile();
  // Mount the form once the profile is loaded so its fields start from the saved values.
  if (!me.data) return <Screen scroll={false}>{null}</Screen>;
  return <ProfileForm key={me.data.id} profile={me.data} />;
}

function ProfileForm({ profile }: { profile: ProfileRow }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { userId, email, signOut } = useAuth();
  const dogs = useMyDogs();
  const feedback = useMyFeedback();
  const update = useUpdateProfile();

  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>({
    walking: profile.walking ?? 3,
    noise: profile.noise ?? 3,
    morning: profile.morning ?? 3,
  });

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const handleChanged = handle !== profile.handle;
  const canSave = name.trim().length > 0 && (!handleChanged || handleOk);
  const same = (a: string[], b: string[]) => a.slice().sort().join() === b.slice().sort().join();
  const dirty =
    name.trim() !== profile.display_name ||
    handleChanged ||
    !same(interests, profile.interests) ||
    !same(diet, profile.diet) ||
    PERSON_SCALES.some((f) => scales[f] !== (profile[f] ?? 3));

  function discard() {
    setName(profile.display_name);
    setHandle(profile.handle);
    setHandleOk(true);
    setInterests(profile.interests);
    setDiet(profile.diet);
    setScales({ walking: profile.walking ?? 3, noise: profile.noise ?? 3, morning: profile.morning ?? 3 });
  }

  async function save() {
    try {
      await update.mutateAsync({ display_name: name.trim(), ...(handleChanged ? { handle } : {}), interests, diet, ...scales });
      toast(t('toast.saved'));
    } catch (e) {
      const code = (e as { code?: string })?.code;
      toast(code === '23505' ? t('pf.handle.taken') : t('common.saveFailed')); // someone took it a moment ago
    }
  }

  async function changeAvatar(url: string | null) {
    const old = profile.avatar_url;
    try {
      await update.mutateAsync({ avatar_url: url });
      await deletePhotoByUrl(old);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <Screen
      nav
      top={<Header title={t('profile.title')} left={<BackButton label={t('nav.back')} onPress={goBack} />} right={<GearButton />} />}
      bottom={dirty ? <SaveBar saving={update.isPending} canSave={canSave} onSave={save} onDiscard={discard} /> : null}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <AvatarEditor name={profile.display_name} url={profile.avatar_url} onChange={changeAvatar} />
        <View style={{ flex: 1 }}>
          <Text weight={800} size={22} numberOfLines={1}>
            {profile.display_name}
          </Text>
          <Text weight={700} size={15} color="muted" numberOfLines={1}>
            @{profile.handle}
          </Text>
        </View>
      </View>

      <Field label={t('pf.name')} value={name} onChangeText={setName} maxLength={60} />
      <View style={{ marginTop: 4 }}>
        <HandleField label={t('pf.handle')} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} />
      </View>

      <SectionTitle>{t('profile.myDogs')}</SectionTitle>
      <View style={{ gap: 10 }}>
        {(dogs.data ?? []).map((d) => (
          <Card key={d.id} onPress={() => router.push({ pathname: '/dog/[id]', params: { id: d.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <DogAvatar url={d.photo_url} />
            <Text weight={800} style={{ flex: 1 }}>
              {d.name}
            </Text>
            <Text size={22} color="muted" weight={800}>
              ›
            </Text>
          </Card>
        ))}
        <Card dashed onPress={() => router.push({ pathname: '/dog/[id]', params: { id: 'new' } })} style={{ alignItems: 'center' }}>
          <Text weight={800} color="link">
            {t('profile.addDog')}
          </Text>
        </Card>
      </View>

      <SectionTitle>{t('profile.travelStyle')}</SectionTitle>
      {PERSON_SCALES.map((f) => (
        <ScaleInput key={f} field={f} value={scales[f]} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />
      ))}

      <Text weight={800} size={13} style={{ marginTop: 20 }}>
        {t('profile.interests')}
      </Text>
      <View style={{ marginTop: 8 }}>
        <InterestPicker value={interests} onToggle={(i) => setInterests((c) => toggle(c, i))} />
      </View>

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('profile.diet')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {DIETS.map((d) => (
          <Chip key={d} label={t(`diet.${d}` as Key)} on={diet.includes(d)} onPress={() => setDiet((c) => toggle(c, d))} />
        ))}
      </View>

      <SectionTitle>{t('pf.account')}</SectionTitle>
      <Card>
        <Meta>{t('set.accountId')}</Meta>
        <Text selectable weight={700} size={14} style={{ marginTop: 4 }}>
          {userId}
        </Text>
        <View style={{ marginTop: 8 }}>
          <Button
            label={t('set.copyId')}
            small
            variant="ghost"
            onPress={async () => {
              await Clipboard.setStringAsync(userId ?? '');
              toast(t('group.copied'));
            }}
          />
        </View>
      </Card>

      <Text weight={800} size={13} style={{ marginTop: 20, marginBottom: 8 }}>
        {t('set.methods')}
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text size={20}>✉️</Text>
          <View style={{ flex: 1 }}>
            <Text weight={800}>{t('set.methodEmail')}</Text>
            <Meta numberOfLines={1}>{email}</Meta>
          </View>
        </View>
      </Card>

      {(feedback.data ?? []).length > 0 ? (
        <>
          <SectionTitle>{t('fdbk.mine')}</SectionTitle>
          <View style={{ gap: 10 }}>
            {(feedback.data ?? []).map((f) => {
              const tone = f.status === 'fixed' ? { bg: th.okBg, fg: th.ok } : f.status === 'wontfix' ? { bg: th.line, fg: th.muted } : f.status === 'triaged' ? { bg: th.blueBg, fg: th.text } : { bg: th.goldBg, fg: th.link };
              return (
                <Card key={f.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <Text size={16}>{f.kind === 'bug' ? '🐞' : f.kind === 'idea' ? '💡' : '💬'}</Text>
                    <View style={{ backgroundColor: tone.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                      <Text weight={800} size={11} style={{ color: tone.fg }}>
                        {t(`fdbk.st.${f.status}` as Key)}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={3} style={{ marginTop: 6 }}>
                    {f.message}
                  </Text>
                  {f.resolution ? (
                    <Meta style={{ marginTop: 6 }} weight={700}>
                      ↳ {f.resolution}
                    </Meta>
                  ) : null}
                </Card>
              );
            })}
          </View>
        </>
      ) : null}

      <Button label={t('profile.signout')} variant="danger" block onPress={() => signOut()} style={{ marginTop: 28 }} />
    </Screen>
  );
}
