// Domain model for plan items: turns database rows into what the screens use, plus the rules
// (conflicts, dogs alone too long, "is it ready to go in the plan") ported from the prototype.

import type { CatKey } from '@/constants/theme';

export type ItemType = 'activity' | 'food' | 'stay' | 'transit' | 'note';
export type DogMode = 'with' | 'sitter' | 'alone' | 'tbd';
export type Rsvp = 'going' | 'maybe' | 'no';
export type Mood = 'yay' | 'ok' | 'meh';

/** [category, emoji]. The category decides colour; stay / transit also decide the item type. */
export const ITEM_CATS: [CatKey, string][] = [
  ['outdoors', '🌲'],
  ['food', '🍽️'],
  ['coffee', '☕'],
  ['sights', '📸'],
  ['shopping', '🛍️'],
  ['drinks', '🍷'],
  ['fun', '🎉'],
  ['stay', '🏨'],
  ['transit', '🚗'],
];
export const catEmoji = (c: string) => ITEM_CATS.find((x) => x[0] === c)?.[1] ?? '📍';
export const typeOfCat = (c: CatKey): ItemType => (c === 'stay' ? 'stay' : c === 'transit' ? 'transit' : c === 'food' || c === 'coffee' ? 'food' : 'activity');

export const DOG_MODES: DogMode[] = ['with', 'sitter', 'alone', 'tbd'];
export const DOG_MODE_ICON: Record<DogMode, string> = { with: '🐾', sitter: '🤝', alone: '🏠', tbd: '?' };
export const MOODS: [Mood, string][] = [
  ['yay', '😄'],
  ['ok', '😐'],
  ['meh', '😟'],
];

/** Max minutes a dog can be alone for each "alone" level (1-5). */
export const ALONE_CAP_MIN: Record<number, number> = { 1: 0, 2: 60, 3: 240, 4: 360, 5: 480 };

export type ItemRow = {
  id: string;
  trip_id: string;
  type: string;
  cat: string | null;
  title: string;
  emoji: string | null;
  confirmed: boolean;
  date: string | null;
  start_min: number | null;
  end_min: number | null;
  stay_from: string | null;
  stay_to: string | null;
  place: string;
  addr: string;
  notes: string;
  travel_min: number | null;
  lat: number | null;
  lon: number | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  edited_by: string | null;
  edited_at: string;
  item_dogs: { dog_id: string; mode: string; mood: string | null }[];
  reactions: { user_id: string; vote: string | null; rsvp: string | null }[];
  comments: { id: string; user_id: string; text: string; created_at: string }[];
};

export type ItemView = {
  id: string;
  type: ItemType;
  cat: CatKey;
  title: string;
  emoji: string;
  /** the leader has put it in the plan */
  confirmed: boolean;
  day: number | null;
  start: number | null;
  end: number | null;
  stayFrom: number | null;
  stayTo: number | null;
  addr: string;
  notes: string;
  travel: number | null;
  lat: number | null;
  lon: number | null;
  dogs: Record<string, DogMode>;
  mood: Record<string, Mood>;
  rsvp: Record<string, Rsvp>;
  comments: { id: string; userId: string; text: string; at: number }[];
  deletedAt: number | null;
  editedBy: string | null;
  editedAt: number;
  createdAt: number;
};

export function buildItems(rows: ItemRow[], days: string[]): ItemView[] {
  const idx = (iso: string | null) => {
    if (!iso) return null;
    const i = days.indexOf(iso);
    return i < 0 ? null : i;
  };
  return rows
    .map((r): ItemView => {
      const type = r.type as ItemType;
      const day = idx(r.date);
      const timed = day != null && r.start_min != null && r.end_min != null;
      const stayFrom = type === 'stay' ? idx(r.stay_from) : null;
      const cat = (r.cat ?? (type === 'stay' ? 'stay' : type === 'transit' ? 'transit' : type === 'food' ? 'food' : 'outdoors')) as CatKey;
      return {
        id: r.id,
        type,
        cat,
        title: r.title,
        emoji: r.emoji || catEmoji(cat),
        confirmed: r.confirmed,
        day: timed ? day : null,
        start: timed ? r.start_min : null,
        end: timed ? r.end_min : null,
        stayFrom,
        stayTo: stayFrom == null ? null : (idx(r.stay_to) ?? days.length - 1),
        addr: r.addr,
        notes: r.notes,
        travel: r.travel_min,
        lat: r.lat,
        lon: r.lon,
        dogs: Object.fromEntries(r.item_dogs.map((d) => [d.dog_id, d.mode as DogMode])),
        mood: Object.fromEntries(r.item_dogs.filter((d) => d.mood).map((d) => [d.dog_id, d.mood as Mood])),
        rsvp: Object.fromEntries(r.reactions.filter((x) => x.rsvp).map((x) => [x.user_id, x.rsvp as Rsvp])),
        comments: r.comments.map((c) => ({ id: c.id, userId: c.user_id, text: c.text, at: Date.parse(c.created_at) })).sort((a, b) => a.at - b.at),
        deletedAt: r.deleted_at ? Date.parse(r.deleted_at) : null,
        editedBy: r.edited_by,
        editedAt: Date.parse(r.edited_at),
        createdAt: Date.parse(r.created_at),
      };
    })
    .sort((a, b) => a.createdAt - b.createdAt);
}

export const isIdea = (i: ItemView) => !i.confirmed;
export const hasTime = (i: ItemView) => i.start != null || (i.type === 'stay' && i.stayFrom != null);
export const isLive = (i: ItemView) => i.deletedAt == null;
/** A dog with no explicit arrangement goes along once the item is confirmed, otherwise it is undecided. */
export const dogMode = (i: ItemView, dogId: string): DogMode => i.dogs[dogId] ?? (i.confirmed ? 'with' : 'tbd');

/** Timed, non-stay items of a day (stays render as a banner). */
export const dayItems = (items: ItemView[], day: number) => items.filter((i) => isLive(i) && i.day === day && i.start != null && i.type !== 'stay');

/** Only confirmed plans can clash; ideas in the same slot are alternatives. */
export function conflictsOf(item: ItemView, items: ItemView[]) {
  if (!item.confirmed || item.start == null || item.end == null || item.type === 'stay' || item.day == null) return [];
  return dayItems(items, item.day).filter((o) => o.confirmed && o.id !== item.id && o.start! < item.end! && item.start! < o.end!);
}
export const overlapMin = (a: ItemView, b: ItemView) => Math.min(a.end!, b.end!) - Math.max(a.start!, b.start!);

/** Dogs set to "alone" for longer than they can manage. `aloneLevel` is the dog's 1-5 "alone" scale. */
export function aloneIssues(item: ItemView, dogs: { id: string; name: string; alone: number | null }[]) {
  if (!item.confirmed || item.start == null || item.end == null) return [];
  const mins = item.end - item.start;
  return dogs.filter((d) => item.dogs[d.id] === 'alone' && mins > ALONE_CAP_MIN[d.alone ?? 3]).map((d) => ({ dog: d, mins }));
}

/** What is still missing before the leader can put an idea in the plan. */
export function readiness(item: ItemView, memberIds: string[], dogIds: string[]) {
  const peoplePending = memberIds.filter((m) => item.rsvp[m] !== 'going' && item.rsvp[m] !== 'no').length;
  const dogsPending = dogIds.filter((d) => dogMode(item, d) === 'tbd').length;
  return { time: !hasTime(item), addr: !item.addr.trim(), peoplePending, dogsPending, ok: hasTime(item) && !!item.addr.trim() && peoplePending === 0 && dogsPending === 0 };
}

/** Overlapping blocks share the row: greedy column assignment inside each overlap cluster. */
export function layoutDay(items: ItemView[]) {
  const sorted = [...items].sort((a, b) => a.start! - b.start! || b.end! - a.end!);
  const out: Record<string, { col: number; n: number }> = {};
  let cluster: ItemView[] = [];
  let end = -1;
  const flush = () => {
    const cols: number[] = [];
    cluster.forEach((it) => {
      let c = cols.findIndex((e) => e <= it.start!);
      if (c < 0) {
        c = cols.length;
        cols.push(0);
      }
      cols[c] = it.end!;
      out[it.id] = { col: c, n: 0 };
    });
    cluster.forEach((it) => (out[it.id].n = cols.length));
    cluster = [];
  };
  sorted.forEach((it) => {
    if (cluster.length && it.start! >= end) flush();
    cluster.push(it);
    end = cluster.length === 1 ? it.end! : Math.max(end, it.end!);
  });
  if (cluster.length) flush();
  return out;
}

/** Database fields for a day index + times. */
export const timeFields = (days: string[], day: number | null, start: number | null, end: number | null) => ({
  date: day == null ? null : days[day],
  start_min: day == null ? null : start,
  end_min: day == null ? null : end,
});
