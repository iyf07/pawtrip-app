import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { saveLangSetting, useMyProfile, useUpdateProfile } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { HandleField } from '@/components/HandleField';
import { PhotoField } from '@/components/PhotoField';
import { ScaleInput } from '@/components/ScaleInput';
import { Wizard, type WizardStep } from '@/components/Wizard';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DogIllo } from '@/components/ui/DogIllo';
import { InterestPicker } from '@/components/InterestPicker';
import { Field } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { DIETS, PERSON_SCALES, type PersonScale } from '@/constants/options';
import { useT, type Key } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';
import type { Profile } from '@/api/types';

/** First run after signing in: one question at a time. Everything stays editable later on the profile page. */
export default function OnboardingRoute() {
  const me = useMyProfile();
  if (!me.data) return null;
  return <Onboarding key={me.data.id} profile={me.data} />;
}

function Onboarding({ profile }: { profile: Profile }) {
  const { t, lang } = useT();
  const toast = useToast();
  const { userId, email } = useAuth();
  const update = useUpdateProfile();

  const [name, setName] = useState(profile.display_name || (email?.split('@')[0] ?? ''));
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [photo, setPhoto] = useState<string | null>(profile.avatar_url);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>({ walking: profile.walking ?? 3, noise: profile.noise ?? 3, morning: profile.morning ?? 3 });

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const save = async (patch: Parameters<typeof update.mutateAsync>[0]) => {
    try {
      await update.mutateAsync(patch);
    } catch {
      toast(t('common.saveFailed'));
      throw new Error('save failed');
    }
  };

  const steps: WizardStep[] = [
    {
      key: 'name',
      title: t('ob.name.q'),
      hint: t('ob.name.hint'),
      canContinue: name.trim().length > 0,
      onNext: () => save({ display_name: name.trim() }),
      content: ({ next }) => (
        <Field value={name} onChangeText={setName} maxLength={60} autoFocus returnKeyType="next" onSubmitEditing={() => name.trim() && next()} style={{ fontSize: 22 }} />
      ),
    },
    {
      key: 'handle',
      title: t('ob.handle.q'),
      hint: t('ob.handle.hint'),
      canContinue: handleOk && handle.length >= 3,
      onNext: () => (handle === profile.handle ? undefined : save({ handle })),
      content: ({ next }) => (
        <HandleField value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} autoFocus onSubmit={() => handleOk && next()} />
      ),
    },
    {
      key: 'photo',
      title: t('ob.photo.q'),
      hint: t('ob.photo.hint'),
      optional: true,
      content: (
        <PhotoField
          kind="avatar"
          name={name}
          url={photo}
          onChange={async (url) => {
            const old = photo;
            setPhoto(url);
            try {
              await update.mutateAsync({ avatar_url: url });
              await deletePhotoByUrl(old);
            } catch {
              toast(t('common.saveFailed'));
            }
          }}
        />
      ),
    },
    {
      key: 'interests',
      title: t('ob.interests.q'),
      hint: t('ob.interests.hint'),
      optional: true,
      onNext: () => save({ interests }),
      content: (
        <InterestPicker value={interests} onToggle={(i) => setInterests((c) => toggle(c, i))} />
      ),
    },
    {
      key: 'diet',
      title: t('ob.diet.q'),
      hint: t('ob.diet.hint'),
      optional: true,
      onNext: () => save({ diet }),
      content: (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {DIETS.map((d) => (
            <Chip key={d} label={t(`diet.${d}` as Key)} on={diet.includes(d)} onPress={() => setDiet((c) => toggle(c, d))} />
          ))}
        </View>
      ),
    },
    ...PERSON_SCALES.map(
      (f): WizardStep => ({
        key: f,
        title: t(`scale.${f}` as Key),
        optional: true,
        onNext: () => save({ [f]: scales[f] }),
        content: <ScaleInput field={f} hideTitle value={scales[f]} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />,
      }),
    ),
    {
      key: 'done',
      title: t('ob.done.title'),
      hint: t('ob.done.body'),
      content: (
        <View style={{ alignItems: 'center', gap: 16, marginTop: 8 }}>
          <DogIllo size={140} />
          <Button label={t('ob.done.addDog')} variant="ghost" block onPress={() => finish('/dog/new')} />
        </View>
      ),
    },
  ];

  async function finish(then: '/' | '/dog/new' = '/') {
    try {
      await update.mutateAsync({ onboarded_at: new Date().toISOString() });
      // the language chosen on the sign-in screen becomes the account's language
      if (userId) saveLangSetting(userId, lang).catch(() => {});
      router.replace('/');
      if (then !== '/') router.push({ pathname: '/dog/[id]', params: { id: 'new' } });
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return <Wizard steps={steps} onFinish={() => finish('/')} finishLabel={t('ob.done.start')} />;
}
