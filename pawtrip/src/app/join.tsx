import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { peekTrip, useJoinTrip, type TripPreview } from '@/api/trips';
import { Wizard, type WizardStep } from '@/components/Wizard';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { cityState } from '@/lib/place';
import { goBack } from '@/lib/nav';

/** Join a trip, one question at a time: invite code, is this the trip, which dogs. Also opened from an invite link (/join?code=...). */
export default function Join() {
  const { t, locale } = useT();
  const toast = useToast();
  const params = useLocalSearchParams<{ code?: string }>();
  const join = useJoinTrip();
  const myDogs = useMyDogs();

  const [code, setCode] = useState(params.code ?? '');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<TripPreview | null>(null);
  const [dogIds, setDogIds] = useState<string[] | null>(null); // null = all my dogs

  const dogs = myDogs.data ?? [];
  const chosen = dogIds ?? dogs.map((d) => d.id);
  const clean = code.trim().toLowerCase();

  async function find() {
    if (!clean) {
      setError(t('join.errEmpty'));
      throw new Error('empty');
    }
    setError(null);
    let p: TripPreview | null;
    try {
      p = await peekTrip(clean);
    } catch (e) {
      setError(t('join.errNet')); // only the request itself failing is a network problem
      throw e;
    }
    if (!p) {
      setError(t('join.errNone'));
      throw new Error('not found');
    }
    if (p.expired) {
      setError(t('join.errExpired'));
      throw new Error('expired');
    }
    setPreview(p);
  }

  const steps: WizardStep[] = [
    {
      key: 'code',
      title: t('jn.code.q'),
      hint: t('jn.code.hint'),
      canContinue: clean.length > 0,
      onNext: find,
      content: ({ next }) => (
        <View style={{ marginTop: -14 }}>
          <Field
            value={code}
            onChangeText={(v) => {
              setCode(v);
              setError(null);
              setPreview(null);
            }}
            placeholder={t('join.ph')}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => clean && next()}
            error={error}
            style={{ fontSize: 20 }}
          />
        </View>
      ),
    },
    {
      key: 'confirm',
      title: t('jn.confirm.q'),
      content: preview ? (
        <View>
          <Card>
            <Text weight={800} size={20}>
              {preview.name}
            </Text>
            <Meta style={{ marginTop: 6 }}>
              {datesLabel(preview.start_date, preview.end_date, locale)}
              {cityState(preview.place) ? ` · ${cityState(preview.place)}` : ''}
            </Meta>
            <Meta weight={700} style={{ marginTop: 6 }}>
              {t('people', { n: preview.members })} · {t('dogs', { n: preview.dogs })}
            </Meta>
          </Card>
          {preview.already_member ? <Meta style={{ marginTop: 12 }}>{t('join.already')}</Meta> : null}
        </View>
      ) : null,
    },
    {
      key: 'dogs',
      title: t('jn.dogs.q'),
      hint: preview?.already_member ? undefined : t('jn.dogs.hint'),
      optional: true,
      content: preview?.already_member ? (
        <Meta>{t('join.already')}</Meta>
      ) : dogs.length === 0 ? (
        <Meta>{t('jn.noDogs')}</Meta>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {dogs.map((d) => (
            <Chip
              key={d.id}
              label={`🐕 ${d.name}`}
              on={chosen.includes(d.id)}
              onPress={() => setDogIds(chosen.includes(d.id) ? chosen.filter((x) => x !== d.id) : [...chosen, d.id])}
            />
          ))}
        </View>
      ),
    },
  ];

  async function finish() {
    if (!preview) return;
    try {
      const id = await join.mutateAsync({ code: clean, dogIds: preview.already_member ? [] : chosen });
      toast(t('toast.joined', { name: preview.name }));
      router.replace({ pathname: '/trip/[id]/plan', params: { id } });
    } catch {
      toast(t('join.errNet'));
    }
  }

  return <Wizard steps={steps} onFinish={finish} finishLabel={t('join.join')} onClose={goBack} />;
}
