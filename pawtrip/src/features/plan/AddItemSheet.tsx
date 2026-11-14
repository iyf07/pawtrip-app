import { useState } from 'react';
import { View } from 'react-native';

import { useCreateItem } from '@/api/items';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AddressField } from '@/components/AddressField';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { CAT_COLORS, type CatKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT, type Key } from '@/i18n';

import { ITEM_CATS, catEmoji, typeOfCat } from './model';
import { CatIcon } from './CatIcon';
import { WhenFields, type When } from './TimeFields';
import { useTripCtx, type AddRequest } from '../trip/TripContext';

/** Sheet for adding an idea or a timed plan entry. New entries start as ideas; the leader confirms later. */
export function AddItemSheet() {
  const { addRequest, addItem } = useTripCtx();
  // Remount the form for every request so its fields start from the request's defaults.
  return (
    <Sheet visible={!!addRequest} onClose={() => addItem(null)}>
      {addRequest ? <AddForm key={`${addRequest.origin}-${addRequest.day}-${addRequest.start}`} req={addRequest} /> : null}
    </Sheet>
  );
}

function AddForm({ req }: { req: AddRequest }) {
  const { t } = useT();
  const toast = useToast();
  const scheme = useColorScheme();
  const colors = CAT_COLORS[scheme === 'dark' ? 'dark' : 'light'];
  const { trip, days, day, addItem, setDay } = useTripCtx();
  const create = useCreateItem(trip.id);

  const fromPlan = req.origin === 'plan';
  const [cat, setCat] = useState<CatKey | null>(null);
  const [title, setTitle] = useState('');
  const [addr, setAddr] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [notes, setNotes] = useState('');
  const [timed, setTimed] = useState(fromPlan);
  const [when, setWhen] = useState<When>({ day: req.day ?? day, start: Number.isFinite(req.start) ? req.start! : 600, end: Number.isFinite(req.end) ? req.end! : 660, stayTo: Math.min((req.day ?? day) + 1, days.length - 1) });
  const [errs, setErrs] = useState<{ cat?: string; title?: string; time?: string }>({});

  const stay = cat === 'stay';

  async function submit() {
    const e: typeof errs = {};
    if (!cat) e.cat = t('add.errCat');
    if (!title.trim()) e.title = t('add.errTitle');
    if (timed && !stay && when.end <= when.start) e.time = t('add.errTime');
    setErrs(e);
    if (e.cat || e.title || e.time || !cat) return;

    const body = {
      trip_id: trip.id,
      type: typeOfCat(cat),
      cat,
      title: title.trim().slice(0, 120),
      emoji: catEmoji(cat),
      addr: addr.trim().slice(0, 160),
      ...(coords ? { lat: coords.lat, lon: coords.lon } : {}),
      notes: notes.trim().slice(0, 2000),
      ...(timed && when.day != null
        ? stay
          ? { stay_from: days[when.day], stay_to: days[when.stayTo ?? when.day] }
          : { date: days[when.day], start_min: when.start, end_min: when.end }
        : {}),
    };
    try {
      await create.mutateAsync(body);
      if (timed && when.day != null && !stay) setDay(when.day);
      toast(t('toast.ideaSaved'));
      addItem(null);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <View>
      <Text weight={800} size={22}>
        {t(fromPlan ? 'add.title' : 'add.newIdea')}
      </Text>

      <Text weight={800} size={13} style={{ marginTop: 16, marginBottom: 8 }}>
        {t('add.cat')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ITEM_CATS.map(([c]) => (
          <Chip
            key={c}
            icon={<CatIcon cat={c} size={24} />}
            label={t(`cat.${c}` as Key)}
            on={cat === c}
            onPress={() => setCat(c)}
            textColor="text"
            style={cat === c ? { backgroundColor: colors[c].tint, borderColor: colors[c].c } : { borderLeftWidth: 5, borderLeftColor: colors[c].c }}
          />
        ))}
      </View>
      {errs.cat ? (
        <Text size={14} weight={700} color="danger" style={{ marginTop: 6 }}>
          {errs.cat}
        </Text>
      ) : null}

      <Field label={t('add.fTitle')} value={title} onChangeText={setTitle} maxLength={120} error={errs.title} />
      <AddressField
        label={`${t('add.addr')} ${t('add.addrOpt')}`}
        value={addr}
        onChangeText={(v) => {
          setAddr(v);
          setCoords(null);
        }}
        onPick={(h) => setCoords({ lat: h.lat, lon: h.lon })}
        near={{ lat: trip.lat, lon: trip.lon }}
        placeholder={t('add.addrPh')}
      />

      <View style={{ marginTop: 16 }}>
        {!fromPlan ? (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <Chip label={t('add.noTime')} on={!timed} onPress={() => setTimed(false)} />
            <Chip label={t('add.setTime')} on={timed} onPress={() => setTimed(true)} />
          </View>
        ) : null}
        {timed ? <WhenFields days={days} when={when} stay={stay} onChange={setWhen} /> : null}
        {errs.time ? (
          <Text size={14} weight={700} color="danger" style={{ marginTop: 6 }}>
            {errs.time}
          </Text>
        ) : null}
      </View>

      <Field label={`${t('add.notes')} ${t('add.optional')}`} value={notes} onChangeText={setNotes} placeholder={t('add.notesPh')} multiline style={{ minHeight: 72, textAlignVertical: 'top' }} />

      <Text size={13} color="muted" style={{ marginTop: 14 }}>
        {t('add.leaderConfirms')}
      </Text>
      <Button label={t(fromPlan ? 'add.add' : 'add.saveIdea')} block loading={create.isPending} onPress={submit} style={{ marginTop: 14 }} />
    </View>
  );
}
