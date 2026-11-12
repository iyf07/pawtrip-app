import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { peekTrip, useJoinTrip, type TripPreview } from '@/api/trips';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';

/** Join a trip with an invite code (also reached from an invite link: /join?code=xxxxx-xxxxx). */
export default function Join() {
  const { t, locale } = useT();
  const toast = useToast();
  const params = useLocalSearchParams<{ code?: string }>();
  const [code, setCode] = useState(params.code ?? '');
  const [preview, setPreview] = useState<TripPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);
  const [dogIds, setDogIds] = useState<string[] | null>(null);
  const dogs = useMyDogs();
  const join = useJoinTrip();

  async function find(c = code) {
    const trimmed = c.trim().toLowerCase();
    if (!trimmed) return setError(t('join.errEmpty'));
    setLooking(true);
    setError(null);
    try {
      const p = await peekTrip(trimmed);
      if (!p) setError(t('join.errNone'));
      else if (p.expired) setError(t('join.errExpired'));
      else setPreview(p);
    } catch {
      setError(t('join.errNet'));
    } finally {
      setLooking(false);
    }
  }

  // opened from an invite link: look the trip up right away
  useEffect(() => {
    const c = params.code;
    if (!c) return;
    const id = setTimeout(() => find(c), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code]);

  const chosen = dogIds ?? (dogs.data ?? []).map((d) => d.id);

  async function doJoin() {
    if (!preview) return;
    try {
      const id = await join.mutateAsync({ code: code.trim().toLowerCase(), dogIds: preview.already_member ? [] : chosen });
      toast(t('toast.joined', { name: preview.name }));
      router.replace({ pathname: '/trip/[id]/plan', params: { id } });
    } catch {
      setError(t('join.errNet'));
    }
  }

  return (
    <Screen top={<Header title={t('join.title')} left={<Button label={t('nav.cancel')} variant="text" onPress={() => router.back()} />} />}>
      <Field
        label={t('join.code')}
        value={code}
        onChangeText={(v) => {
          setCode(v);
          setPreview(null);
          setError(null);
        }}
        placeholder={t('join.ph')}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        onSubmitEditing={() => find()}
        error={error}
      />
      {!preview ? <Button label={looking ? t('join.looking') : t('join.find')} block loading={looking} onPress={() => find()} style={{ marginTop: 16 }} /> : null}

      {preview ? (
        <>
          <Card style={{ marginTop: 18 }}>
            <Text weight={800} size={18}>
              {preview.name}
            </Text>
            <Meta style={{ marginTop: 6 }}>
              {datesLabel(preview.start_date, preview.end_date, locale)}
              {preview.place ? ` · ${preview.place}` : ''}
            </Meta>
            <Meta weight={700} style={{ marginTop: 6 }}>
              {t('people', { n: preview.members })} · {t('dogs', { n: preview.dogs })}
            </Meta>
          </Card>

          {preview.already_member ? (
            <>
              <Meta style={{ marginTop: 14 }}>{t('join.already')}</Meta>
              <Button label={t('join.open')} block onPress={doJoin} style={{ marginTop: 12 }} />
            </>
          ) : (
            <>
              {(dogs.data ?? []).length > 0 ? (
                <>
                  <Text weight={800} size={13} style={{ marginTop: 18 }}>
                    {t('group.dogs')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {(dogs.data ?? []).map((d) => (
                      <Chip
                        key={d.id}
                        label={`🐕 ${d.name}`}
                        on={chosen.includes(d.id)}
                        onPress={() => setDogIds(chosen.includes(d.id) ? chosen.filter((x) => x !== d.id) : [...chosen, d.id])}
                      />
                    ))}
                  </View>
                </>
              ) : null}
              <Button label={t('join.join')} block loading={join.isPending} onPress={doJoin} style={{ marginTop: 20 }} />
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
}
