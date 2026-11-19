import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { DOG_SCALES, useDeleteDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { DogInterests } from '@/components/DogInterests';
import { normalizeDogInterests } from '@/constants/dog-interests';
import { DogTraits } from '@/components/DogTraits';
import { AvatarEditor } from '@/components/AvatarEditor';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { DogAvatar } from '@/components/ui/Avatar';
import { Segmented } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT, type Key } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';
import { dogScales } from '@/constants/options';
import { BENTO_GAP, BentoAction, BentoCard, BentoColumns, Hero } from '@/features/circle/Bento';
import { dogColor } from '@/features/circle/dogColor';
import { dogWeightLabel } from '@/lib/dog-weight';

const LB_PER_KG = 2.20462;
const round1 = (x: number) => Math.round(x * 10) / 10;

/**
 * A dog's page: read-only bento cards. Everything is edited in one sheet ("编辑狗狗"), like the family page; the caller
 * chooses the frame (a page or a popup).
 */
export function DogForm({ dog, onClose, children }: { dog: Dog; onClose: () => void; children: (parts: { body: ReactNode; footer: ReactNode }) => ReactNode }) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const scales = dogScales(dog);
  const weight = dogWeightLabel(dog);

  const body = (
    <View style={{ gap: BENTO_GAP, marginTop: 8 }}>
      <Hero index={0} minHeight={260} color={dogColor(dog.id)} photoUrl={dog.photo_url} avatar={<DogAvatar url={null} size={92} />} title={dog.name} subtitle={weight ?? undefined}>
        <DogTraits dog={scales} />
      </Hero>
      <BentoColumns
        left={
          <BentoCard index={1} title={t('dog.preferences', { name: dog.name })}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {DOG_SCALES.map((f, n) => (
                <ScaleInput key={f} index={n} compact inset readOnly iconSize={28} field={f} value={scales[f]}
                  description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} onChange={() => {}} />
              ))}
            </View>
          </BentoCard>
        }
        right={
          <BentoCard index={2} tone="tint" title={t('dog.interests', { name: dog.name })}>
            <DogInterests values={dog.interests} />
          </BentoCard>
        }
      />
      <View style={{ flexDirection: 'row', gap: BENTO_GAP }}>
        <BentoAction index={3} icon={<Icon name="ui-pencil" size={56} />} label={t('dog.edit')} onPress={() => setEditing(true)} />
      </View>
      <Sheet visible={editing} tall onClose={() => setEditing(false)}>
        <EditForm dog={dog} onClose={() => setEditing(false)} onRemoved={onClose} />
      </Sheet>
    </View>
  );
  return <>{children({ body, footer: null })}</>;
}

// mounted fresh each time the sheet opens, so the drafts always start from the saved dog
function EditForm({ dog, onClose, onRemoved }: { dog: Dog; onClose: () => void; onRemoved: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const save = useSaveDog();
  const del = useDeleteDog();
  const { userId } = useAuth();
  const [photo, setPhoto] = useState<string | null>(dog.photo_url ?? null);
  const [name, setName] = useState(dog.name ?? '');
  const [unit, setUnit] = useState<'lb' | 'kg'>((dog.weight_unit as 'lb' | 'kg') ?? 'lb');
  const [weight, setWeight] = useState(dog.weight_lb != null ? String(dog.weight_unit === 'kg' ? round1(Number(dog.weight_lb) / LB_PER_KG) : Number(dog.weight_lb)) : '');
  const [scales, setScales] = useState<Record<DogScale, number | null>>(() => dogScales(dog));
  const [interests, setInterests] = useState<string[]>(() => normalizeDogInterests(dog.interests));
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);

  async function submit() {
    const w = Number(weight);
    const e: typeof errs = {};
    if (!name.trim()) e.name = t('dog.errName');
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) e.weight = t('dog.errWeight');
    setErrs(e);
    if (e.name || e.weight) return;
    try {
      await save.mutateAsync({ id: dog.id, name: name.trim(), photo_url: photo, weight_unit: unit, weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w), ...scales, interests });
      if (dog.photo_url && dog.photo_url !== photo) await deletePhotoByUrl(dog.photo_url);
      toast(t('toast.saved'));
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  async function remove() {
    try {
      await del.mutateAsync(dog.id);
      setAskDelete(false);
      onClose();
      onRemoved();
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  const label = (text: string) => <Text weight={800} size={12} color="muted" style={{ letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 20, marginBottom: 6 }}>{text}</Text>;

  return (
    <View>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('dog.edit')}</Text>
      <View style={{ alignItems: 'center', marginTop: 14 }}><AvatarEditor kind="dog" name={name} url={photo} size={96} onChange={setPhoto} /></View>
      <Field label={t('dog.name')} value={name} onChangeText={setName} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} />
      <Field label={t('dog.weight')} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0" error={errs.weight} />
      <View style={{ marginTop: 8 }}><Segmented value={unit} onChange={setUnit} options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} /></View>
      {label(t('dog.preferences', { name: dog.name }))}
      {DOG_SCALES.map((f) => (
        <ScaleInput key={f} iconSize={28} field={f} value={scales[f]} description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} onChange={(v) => setScales((cur) => ({ ...cur, [f]: v }))} />
      ))}
      {label(t('dog.interests', { name: dog.name }))}
      <DogInterests values={interests} onChange={setInterests} />
      <Button label={t('nav.save')} block loading={save.isPending} onPress={submit} style={{ marginTop: 22 }} />
      {!dog.owner_id || dog.owner_id === userId ? <Button label={t('dog.remove')} variant="danger" block onPress={() => setAskDelete(true)} style={{ marginTop: 8 }} /> : null}
      <ConfirmSheet visible={askDelete} title={t('dog.removeTitle')} body={t('dog.removeBody', { name: dog.name })} confirmLabel={t('dog.remove')} danger busy={del.isPending} onConfirm={remove} onClose={() => setAskDelete(false)} />
    </View>
  );
}
