import { addDaysIso, daysBetween, isoOf } from '@/lib/dates';

export type CalTrip = { id: string; name: string; start_date: string; end_date: string };

export type Seg = { tripId: string; row: number; sc: number; ec: number; lane: number; startsHere: boolean; endsHere: boolean };

/** The weeks (rows of 7 days, Sunday first) that cover a month. */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const count = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((first.getDay() + count) / 7);
  const gridStart = isoOf(new Date(year, month, 1 - first.getDay()));
  return { gridStart, rows, dayAt: (row: number, col: number) => addDaysIso(gridStart, row * 7 + col) };
}

/** Cut each trip into one segment per week row and stack overlapping ones into lanes. */
export function layoutSegments(trips: CalTrip[], gridStart: string, rows: number): Seg[][] {
  const out: Seg[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowStart = addDaysIso(gridStart, r * 7);
    const segs: Omit<Seg, 'lane'>[] = [];
    for (const t of trips) {
      const a = daysBetween(rowStart, t.start_date);
      const b = daysBetween(rowStart, t.end_date);
      if (b < 0 || a > 6) continue;
      segs.push({ tripId: t.id, row: r, sc: Math.max(0, a), ec: Math.min(6, b), startsHere: a >= 0, endsHere: b <= 6 });
    }
    segs.sort((x, y) => x.sc - y.sc || y.ec - y.sc - (x.ec - x.sc));
    const laneEnd: number[] = [];
    out.push(
      segs.map((s) => {
        let lane = laneEnd.findIndex((e) => e < s.sc);
        if (lane < 0) lane = laneEnd.length;
        laneEnd[lane] = s.ec;
        return { ...s, lane };
      }),
    );
  }
  return out;
}
