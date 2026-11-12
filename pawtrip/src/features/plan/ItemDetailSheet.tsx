import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { useAddComment, usePatchItem, useSetDeleted, useSetDogMode, useSetMood, useSetRsvp } from '@/api/items';
import { AddressField } from '@/components/AddressField';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip, Segmented } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { CAT_COLORS, type CatKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { hrsLabel, relTime } from '@/lib/format';
import { nowIn } from '@/lib/time';

import { useTripCtx } from '../trip/TripContext';
import {
  DOG_MODES,
  ITEM_CATS,
  MOODS,
  aloneIssues,
  catEmoji,
  conflictsOf,
  dogMode,
  hasTime,
  overlapMin,
  readiness,
  timeFields,
  typeOfCat,
  type DogMode,
  type ItemView,
  type Mood,
  type Rsvp,
} from './model';
import { WhenFields, type When } from './TimeFields';

/** Item detail: fields save when you leave them; RSVP, dog arrangements, comments; the leader confirms. */
export function ItemDetailSheet() {
  const { t } = useT();
  const { openItemId, openItem, items } = useTripCtx();
  const item = items.find((i) => i.id === openItemId);
  return (
    <Sheet visible={!!openItemId} onClose={() => openItem(null)}>
      {openItemId ? item && !item.deletedAt ? <Detail key={item.id} item={item} /> : <Text>{t('item.removed')}</Text> : null}
    </Sheet>
  );
}

function Detail({ item }: { item: ItemView }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const scheme = useColorScheme();
  const colors = CAT_COLORS[scheme === 'dark' ? 'dark' : 'light'];
  const { trip, days, day, items, members, dogs, userId, isLeader, person, openItem, setDay } = useTripCtx();

  const patch = usePatchItem(trip.id);
  const del = useSetDeleted(trip.id);
  const rsvp = useSetRsvp(trip.id);
  const dogModeM = useSetDogMode(trip.id);
  const moodM = useSetMood(trip.id);
  const comment = useAddComment(trip.id);

  const locked = item.confirmed && !isLeader;
  const [title, setTitle] = useState(item.title);
  const [addr, setAddr] = useState(item.addr);
  const [notes, setNotes] = useState(item.notes);
  const [text, setText] = useState('');

  const save = (p: Parameters<typeof patch.mutate>[0]['patch']) =>
    patch.mutate({ id: item.id, patch: p }, { onError: () => toast(t('common.saveFailed')) });

  const stay = item.type === 'stay';
  const when: When = {
    day: stay ? item.stayFrom : item.day,
    start: item.start ?? 600,
    end: item.end ?? 660,
    stayTo: item.stayTo,
  };
  const timeSet = hasTime(item);

  function changeWhen(w: When) {
    if (w.day == null) return;
    if (stay) save({ stay_from: days[w.day], stay_to: days[w.stayTo ?? w.day], date: null, start_min: null, end_min: null });
    else save({ ...timeFields(days, w.day, w.start, w.end), stay_from: null, stay_to: null });
  }

  function changeCat(c: CatKey) {
    if (c === item.cat) return;
    const type = typeOfCat(c);
    const p: Parameters<typeof save>[0] = { cat: c, type, emoji: catEmoji(c) };
    if (type === 'stay' && item.type !== 'stay' && item.day != null) {
      Object.assign(p, { date: null, start_min: null, end_min: null, stay_from: days[item.day], stay_to: days[Math.min(item.day + 1, days.length - 1)] });
    }
    if (type !== 'stay' && item.type === 'stay' && item.stayFrom != null) {
      Object.assign(p, { stay_from: null, stay_to: null }, timeFields(days, item.stayFrom, 600, 660));
    }
    save(p);
  }

  const conflicts = conflictsOf(item, items);
  const alone = aloneIssues(item, dogs);
  const ready = readiness(item, members.map((m) => m.id), dogs.map((d) => d.id));

  const went = dogs.filter((d) => dogMode(item, d.id) === 'with');
  const now = nowIn(trip.tz);
  const ended = item.day != null && item.end != null && (days[item.day] < now.date || (days[item.day] === now.date && item.end <= now.min));
  const leaderName = person(trip.creator_id)?.name ?? '';

  async function confirmIt(value: boolean) {
    try {
      await patch.mutateAsync({ id: item.id, patch: { confirmed: value } });
      toast(value ? t('toast.confirmed', { name: item.title }) : t('toast.toIdea'));
      if (value) {
        // an idea became a plan item: show it on the plan, on its day
        if (item.day != null) setDay(item.day);
        openItem(null);
        router.navigate({ pathname: '/trip/[id]/plan', params: { id: trip.id } });
      }
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function remove() {
    try {
      await del.mutateAsync({ id: item.id, deleted: true });
      openItem(null);
      toast(t('toast.removed'));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function post() {
    const v = text.trim();
    if (!v) return;
    setText('');
    try {
      await comment.mutateAsync({ itemId: item.id, text: v.slice(0, 2000) });
    } catch {
      setText(v);
      toast(t('common.saveFailed'));
    }
  }

  const row = (icon: string, label: string, body: React.ReactNode) => (
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: 1.5, borderStyle: 'dashed', borderColor: th.line }}>
      <Text size={20} style={{ width: 28, textAlign: 'center' }}>
        {icon}
      </Text>
      <View style={{ flex: 1 }}>
        <Text weight={800}>{label}</Text>
        <View style={{ marginTop: 8 }}>{body}</View>
      </View>
    </View>
  );

  const alert = (bg: string, msg: string, action?: { label: string; onPress: () => void }) => (
    <View key={msg} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: bg, marginTop: 8 }}>
      <Text size={14} weight={700} style={{ flex: 1 }}>
        {msg}
      </Text>
      {action ? <Button label={action.label} small variant="ghost" onPress={action.onPress} /> : null}
    </View>
  );

  return (
    <View>
      <Field
        value={title}
        onChangeText={setTitle}
        editable={!locked}
        maxLength={120}
        onBlur={() => {
          const v = title.trim();
          if (!v) setTitle(item.title);
          else if (v !== item.title) save({ title: v });
        }}
        style={{ fontSize: 22, fontFamily: 'Nunito_800ExtraBold' }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {ITEM_CATS.map(([c, emoji]) => (
          <Chip
            key={c}
            label={`${emoji} ${t(`cat.${c}` as Key)}`}
            on={item.cat === c}
            onPress={locked ? undefined : () => changeCat(c)}
            textColor="text"
            style={item.cat === c ? { backgroundColor: colors[c].tint, borderColor: colors[c].c } : { borderLeftWidth: 5, borderLeftColor: colors[c].c, opacity: locked ? 0.6 : 1 }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <View style={{ backgroundColor: item.confirmed ? th.okBg : th.goldBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
          <Text weight={800} size={12} style={{ color: item.confirmed ? th.ok : th.link }}>
            {t(item.confirmed ? 'st.planned' : 'st.idea')}
          </Text>
        </View>
        <Meta style={{ flex: 1 }}>{t(item.confirmed ? 'item.isPlanned' : 'item.isIdea')}</Meta>
      </View>

      {conflicts.map((o) => alert(th.dangerBg, `⚠️ ${t('item.overlap', { name: o.title, min: overlapMin(item, o) })}`))}
      {alone.map((a) =>
        alert(
          th.warnBg,
          `🐕⚠️ ${t('item.aloneWarn', { dog: a.dog.name, dur: hrsLabel(a.mins, t), max: t(`scale.alone.${a.dog.alone ?? 3}` as Key) })}`,
          { label: t('item.assign'), onPress: () => dogModeM.mutate({ itemId: item.id, dogId: a.dog.id, mode: 'sitter' }) },
        ),
      )}

      {row(
        '⏰',
        t('add.time'),
        timeSet ? (
          <View style={{ gap: 10 }}>
            <WhenFields days={days} when={when} stay={stay} onChange={changeWhen} disabled={locked} />
            {!item.confirmed ? (
              <Button
                label={t('add.noTime')}
                small
                variant="text"
                onPress={() => save({ date: null, start_min: null, end_min: null, stay_from: null, stay_to: null })}
              />
            ) : null}
          </View>
        ) : (
          <View style={{ alignItems: 'flex-start', gap: 6 }}>
            <Meta>{t('item.noTime')}</Meta>
            {!locked ? (
              <Button
                label={t('item.addTime')}
                small
                variant="ghost"
                onPress={() => changeWhen({ day, start: 600, end: 660, stayTo: Math.min(day + 1, days.length - 1) })}
              />
            ) : null}
          </View>
        ),
      )}

      {row(
        '📍',
        t('add.addr'),
        <View>
          <AddressField
            value={addr}
            onChangeText={setAddr}
            editable={!locked}
            near={{ lat: trip.lat, lon: trip.lon }}
            placeholder={t('add.addrPh')}
            flush
            onPick={(h) => save({ addr: h.label, lat: h.lat, lon: h.lon })}
            onBlur={() => addr.trim() !== item.addr && save({ addr: addr.trim(), lat: null, lon: null })}
          />
          {item.addr ? (
            <Button
              label={t('item.openMaps')}
              variant="text"
              small
              onPress={() => Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(`${item.title} ${item.addr}`)}`)}
            />
          ) : null}
        </View>,
      )}

      {row(
        '👥',
        t('item.members'),
        <View style={{ gap: 10 }}>
          {members.map((m) => {
            const r = item.rsvp[m.id];
            return (
              <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Avatar id={m.id} name={m.name} url={m.url} size={28} border={2} />
                <Text weight={700} style={{ flex: 1, minWidth: 80 }} numberOfLines={1}>
                  {m.id === userId ? t('group.meTag', { name: m.name }) : m.name}
                </Text>
                {m.id === userId || isLeader ? (
                  <Segmented<Rsvp | ''>
                    value={r ?? ''}
                    onChange={(v) => rsvp.mutate({ itemId: item.id, rsvp: v === '' || v === r ? null : v, as: m.id })}
                    options={(['going', 'no', 'maybe'] as const).map((v) => ({ value: v, label: t(`rsvp.${v}` as Key) }))}
                  />
                ) : (
                  <View style={{ backgroundColor: r === 'going' ? th.okBg : r === 'no' ? th.dangerBg : r === 'maybe' ? th.goldBg : 'transparent', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                    <Text size={13} weight={800} color={r ? 'text' : 'muted'}>
                      {r ? t(`rsvp.${r}` as Key) : t('item.noReply')}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>,
      )}

      {dogs.length > 0
        ? row(
            '🐕',
            t('group.dogs'),
            <View style={{ gap: 10 }}>
              {dogs.map((d) => (
                <View key={d.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <Text weight={800}>{d.name}</Text>
                  <Segmented<DogMode>
                    value={dogMode(item, d.id)}
                    onChange={(mode) => dogModeM.mutate({ itemId: item.id, dogId: d.id, mode })}
                    options={DOG_MODES.map((m) => ({ value: m, label: t(`mode.${m}` as Key) }))}
                  />
                </View>
              ))}
            </View>,
          )
        : null}

      {item.confirmed && went.length > 0 && ended
        ? row(
            '😄',
            t('fb.title'),
            <View style={{ gap: 10 }}>
              <Meta>{t('fb.why')}</Meta>
              {went.map((d) => (
                <View key={d.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <Text weight={800}>{d.name}</Text>
                  <Segmented<Mood | ''>
                    value={item.mood[d.id] ?? ''}
                    onChange={(v) => moodM.mutate({ itemId: item.id, dogId: d.id, mood: v === '' || v === item.mood[d.id] ? null : v })}
                    options={MOODS.map(([v, e]) => ({ value: v, label: `${e} ${t(`mood.${v}` as Key)}` }))}
                  />
                </View>
              ))}
            </View>,
          )
        : null}

      {row(
        '💬',
        t('item.comments'),
        <View>
          {item.comments.map((c) => {
            const p = person(c.userId);
            return (
              <View key={c.id} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <Avatar id={c.userId} name={p?.name} url={p?.url} size={28} border={2} />
                <View style={{ flex: 1 }}>
                  <Text weight={800} size={14}>
                    {p?.name ?? '?'} <Meta>{relTime(c.at, t)}</Meta>
                  </Text>
                  <Text>{c.text}</Text>
                </View>
              </View>
            );
          })}
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            <View style={{ flex: 1, marginTop: -14 }}>
              <Field value={text} onChangeText={setText} placeholder={t('item.addComment')} maxLength={2000} returnKeyType="send" onSubmitEditing={post} />
            </View>
            <Button label={t('item.post')} small loading={comment.isPending} onPress={post} style={{ marginBottom: 2 }} />
          </View>
        </View>,
      )}

      {row(
        '📝',
        t('item.notes'),
        <Field
          value={notes}
          onChangeText={setNotes}
          editable={!locked}
          multiline
          placeholder={t('add.notesPh')}
          maxLength={2000}
          onBlur={() => notes.trim() !== item.notes && save({ notes: notes.trim() })}
          style={{ marginTop: -14, minHeight: 64, textAlignVertical: 'top' }}
        />,
      )}

      <View style={{ marginTop: 16 }}>
        {!item.confirmed ? (
          isLeader ? (
            <View>
              {!ready.ok ? (
                <View style={{ marginBottom: 10 }}>
                  <Meta weight={700}>{t('item.notReady')}</Meta>
                  {ready.time ? <Meta>• {t('chk.time')}</Meta> : null}
                  {ready.addr ? <Meta>• {t('chk.addr')}</Meta> : null}
                  {ready.peoplePending ? <Meta>• {t('chk.people', { n: ready.peoplePending })}</Meta> : null}
                  {ready.dogsPending ? <Meta>• {t('chk.dogs', { n: ready.dogsPending })}</Meta> : null}
                </View>
              ) : null}
              <Button label={t('item.confirm')} block disabled={!ready.ok} loading={patch.isPending} onPress={() => confirmIt(true)} />
            </View>
          ) : (
            <Meta>{t('item.leaderDecides', { name: leaderName })}</Meta>
          )
        ) : isLeader ? (
          <Button label={t('item.toIdea')} variant="ghost" block onPress={() => confirmIt(false)} />
        ) : null}
      </View>

      <Meta style={{ textAlign: 'center', marginTop: 18 }}>
        {t('item.lastEdited', { name: person(item.editedBy)?.name ?? '?', ago: relTime(item.editedAt, t) })}
      </Meta>
      {!locked ? <Button label={t('item.remove')} variant="danger" block loading={del.isPending} onPress={remove} style={{ marginTop: 12 }} /> : null}
    </View>
  );
}
