import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { DOG_SCALES, useDeleteDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { AvatarEditor } from '@/components/AvatarEditor';
import { ScaleInput } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { Chip, Segmented } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { SaveBar } from '@/components/ui/SaveBar';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';

const LB_PER_KG = 2.20462;
const round1 = (x: number) => Math.round(x * 10) / 10;

/** Everything needed to edit a dog; the caller chooses the frame (a page or a popup). */
function IdentitySheet({ visible, name, weight, unit, errs, onClose, onApply }: { visible: boolean; name: string; weight: string; unit: 'lb' | 'kg'; errs: { name?: string; weight?: string }; onClose: () => void; onApply: (name: string, weight: string, unit: 'lb' | 'kg') => void }) {
  const { t } = useT();
  const [n, setN] = useState(name);
  const [w, setW] = useState(weight);
  const [u, setU] = useState(unit);
  const [seen, setSeen] = useState(visible);
  if (visible !== seen) {
    // start from the current values each time it opens (adjusting state while rendering)
    setSeen(visible);
    if (visible) {
      setN(name);
      setW(weight);
      setU(unit);
    }
  }
  const bad = !n.trim() || !(Number(w) > 0);
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={20}>
        {t('dog.editName')}
      </Text>
      <Field label={t('dog.name')} value={n} onChangeText={setN} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} autoFocus />
      <Text weight={800} size={13} style={{ marginTop: 14, marginBottom: 6 }}>
        {t('dog.weight')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginTop: -14 }}>
          <Field value={w} onChangeText={setW} keyboardType="decimal-pad" placeholder="0" error={errs.weight} />
        </View>
        <Segmented
          value={u}
          onChange={setU}
          options={[
            { value: 'lb', label: 'lb' },
            { value: 'kg', label: 'kg' },
          ]}
        />
      </View>
      <View style={{ marginTop: 16, gap: 8 }}>
        <Button label={t('dog.done')} block disabled={bad} onPress={() => onApply(n.trim(), w.trim(), u)} />
        <Button label={t('common.cancel')} variant="text" block onPress={onClose} />
      </View>
    </Sheet>
  );
}

export function DogForm({ dog, onClose, children }: { dog: Dog; onClose: () => void; children: (parts: { body: ReactNode; footer: ReactNode }) => ReactNode }) {
  const id = dog.id;
  const { t } = useT();
  const toast = useToast();
  const save = useSaveDog();
  const th = useTheme();
  const { wide } = useLayout();
  const del = useDeleteDog();

  const [photo, setPhoto] = useState<string | null>(dog.photo_url ?? null);
  const [name, setName] = useState(dog.name ?? '');
  const [unit, setUnit] = useState<'lb' | 'kg'>((dog.weight_unit as 'lb' | 'kg') ?? 'lb');
  const [weight, setWeight] = useState(
    dog.weight_lb != null ? String(dog.weight_unit === 'kg' ? round1(Number(dog.weight_lb) / LB_PER_KG) : Number(dog.weight_lb)) : '',
  );
  const [scales, setScales] = useState<Record<DogScale, number | null>>({
    energy: dog.energy ?? 3,
    temp: dog.temp ?? 3,
    with_dogs: dog.with_dogs ?? 3,
    with_people: dog.with_people ?? 3,
    alone: dog.alone ?? 3,
    car: dog.car ?? 3,
  });
  const [recall, setRecall] = useState<'runner' | 'comes' | null>((dog.recall as 'runner' | 'comes' | null) ?? null);
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);

  // what the form started with, to know whether there is anything to save
  const [init] = useState(() => ({ name, photo, unit, weight, scales, recall }));
  const dirty =
    name !== init.name ||
    photo !== init.photo ||
    unit !== init.unit ||
    weight !== init.weight ||
    recall !== init.recall ||
    DOG_SCALES.some((f) => scales[f] !== init.scales[f]);
  function discard() {
    const i = init;
    setName(i.name);
    setPhoto(i.photo);
    setUnit(i.unit);
    setWeight(i.weight);
    setScales(i.scales);
    setRecall(i.recall);
    setErrs({});
  }

  async function submit() {
    const e: typeof errs = {};
    if (!name.trim()) e.name = t('dog.errName');
    const w = Number(weight);
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) e.weight = t('dog.errWeight');
    setErrs(e);
    if (e.name || e.weight) return void setEditId(true);
    try {
      await save.mutateAsync({
        id,
        name: name.trim(),
        photo_url: photo,
        weight_unit: unit,
        weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w),
        ...scales,
        recall,
      });
      if (dog.photo_url && dog.photo_url !== photo) await deletePhotoByUrl(dog.photo_url);
      toast(t('toast.saved'));
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function remove() {
    try {
      await del.mutateAsync(id);
      setAskDelete(false);
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  // name and weight are edited in a small popup, opened by the pencil next to the name
  const [editId, setEditId] = useState(false);
  const identity = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 }}>
      <AvatarEditor kind="dog" name={name} url={photo} size={wide ? 128 : 84} onChange={setPhoto} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flexShrink: 1 }}>
            {name || t('dog.namePh')}
          </Text>
          <Pressable
            onPress={() => setEditId(true)}
            accessibilityRole="button"
            accessibilityLabel={t('dog.editName')}
            hitSlop={8}
            style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ui-pencil" size={20} />
          </Pressable>
        </View>
        <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>
          {weight ? `${weight} ${unit}` : t('dog.weight')}
        </Text>
      </View>
    </View>
  );

  const body = (
    <>
      {identity}
      <IdentitySheet
        visible={editId}
        name={name}
        weight={weight}
        unit={unit}
        errs={errs}
        onClose={() => setEditId(false)}
        onApply={(n, w, u) => {
          setName(n);
          setWeight(w);
          setUnit(u);
          setErrs({});
          setEditId(false);
        }}
      />

      <View style={{ height: 18 }} />
      {DOG_SCALES.map((f) => (
        <ScaleInput key={f} field={f} value={scales[f]} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />
      ))}

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('recall.q')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        {(['runner', 'comes'] as const).map((r) => (
          <View key={r} style={{ flex: 1 }}>
            <Chip icon={<Icon name={r === 'runner' ? 'trait-runner' : 'trait-recall'} size={30} />} label={t(`recall.${r}`)} on={recall === r} onPress={() => setRecall(recall === r ? null : r)} style={{ minHeight: 52, borderRadius: 16 }} />
          </View>
        ))}
      </View>

      <Button label={t('dog.remove')} variant="danger" block onPress={() => setAskDelete(true)} style={{ marginTop: 12 }} />

      <ConfirmSheet
        visible={askDelete}
        title={t('dog.removeTitle')}
        body={t('dog.removeBody', { name })}
        confirmLabel={t('dog.remove')}
        danger
        busy={del.isPending}
        onConfirm={remove}
        onClose={() => setAskDelete(false)}
      />
    </>
  );
  const footer = dirty ? <SaveBar saving={save.isPending} onSave={submit} onDiscard={discard} /> : null;
  return <>{children({ body, footer })}</>;
}
