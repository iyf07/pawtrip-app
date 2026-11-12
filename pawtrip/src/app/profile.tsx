import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { saveLangSetting, useMyProfile, useUpdateProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { ScaleInput } from '@/components/ScaleInput';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, Segmented } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Header, Screen, SectionTitle } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { DIETS, PERSON_SCALES, PROFILE_INTERESTS, type PersonScale } from '@/constants/options';
import type { Profile as ProfileRow } from '@/api/types';
import { useT, type Key, type Lang } from '@/i18n';

export default function ProfileRoute() {
  const me = useMyProfile();
  // Mount the form once the profile is loaded so its fields start from the saved values.
  if (!me.data) return <Screen scroll={false}>{null}</Screen>;
  return <ProfileForm key={me.data.updated_at} profile={me.data} />;
}

function ProfileForm({ profile }: { profile: ProfileRow }) {
  const { t, lang, setLang } = useT();
  const toast = useToast();
  const { userId, email, signOut } = useAuth();
  const dogs = useMyDogs();
  const update = useUpdateProfile();

  const [name, setName] = useState(profile.display_name);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>({
    walking: profile.walking,
    noise: profile.noise,
    morning: profile.morning,
  });

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function save() {
    try {
      await update.mutateAsync({ display_name: name.trim() || (email?.split('@')[0] ?? ''), interests, diet, ...scales });
      toast(t('toast.saved'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  function pickLang(l: Lang) {
    setLang(l);
    if (userId) saveLangSetting(userId, l).catch(() => {});
  }

  return (
    <Screen top={<Header title={t('profile.title')} left={<Button label={t('nav.back')} variant="text" onPress={() => router.back()} />} />}>
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Avatar id={userId ?? 'me'} name={name} url={profile.avatar_url} size={72} />
        <Meta style={{ marginTop: 8 }}>{t('profile.signedIn', { name: email ?? '' })}</Meta>
      </View>

      <Field label={t('profile.me')} value={name} onChangeText={setName} maxLength={60} />

      <Text weight={800} size={13} style={{ marginTop: 18, marginBottom: 8 }}>
        {t('profile.lang')}
      </Text>
      <Segmented
        value={lang}
        onChange={pickLang}
        options={[
          { value: 'zh', label: '中文' },
          { value: 'en', label: 'English' },
        ]}
      />

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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {PROFILE_INTERESTS.map((i) => (
          <Chip key={i} label={t(`int.${i}` as Key)} on={interests.includes(i)} onPress={() => setInterests((c) => toggle(c, i))} />
        ))}
      </View>

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('profile.diet')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {DIETS.map((d) => (
          <Chip key={d} label={t(`diet.${d}` as Key)} on={diet.includes(d)} onPress={() => setDiet((c) => toggle(c, d))} />
        ))}
      </View>

      <Button label={t('profile.save')} block loading={update.isPending} onPress={save} style={{ marginTop: 24 }} />
      <Button label={t('profile.signout')} variant="danger" block onPress={() => signOut()} style={{ marginTop: 12 }} />
    </Screen>
  );
}
