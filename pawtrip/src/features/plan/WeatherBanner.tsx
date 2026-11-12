import { View } from 'react-native';

import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { datesLabel } from '@/lib/dates';
import { WX_EMOJI, tempOut, type DayWx } from '@/lib/weather';

import type { TripDog } from '../trip/TripContext';

/** Day weather with dog-aware tips: heat-sensitive dogs on hot days, cold-sensitive dogs on cold days. */
export function WeatherBanner({ wx, dogs, unit }: { wx: DayWx; dogs: TripDog[]; unit: 'F' | 'C' }) {
  const { t, locale } = useT();
  const th = useTheme();
  const tips = dogs.flatMap((d) => {
    const out: string[] = [];
    if ((d.temp ?? 3) >= 4 && wx.hi >= 80) out.push(`${d.name}：${t('dd.hot')}`);
    if ((d.temp ?? 3) <= 2 && wx.lo <= 40) out.push(`${d.name}：${t('dd.cold')}`);
    return out;
  });
  const warn = tips.length > 0;
  return (
    <View style={{ marginTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, paddingHorizontal: 14, borderRadius: 14, backgroundColor: warn ? th.warnBg : th.goldBg }}>
      <Text size={24}>{WX_EMOJI[wx.icon]}</Text>
      <View style={{ flex: 1 }}>
        <Text weight={800}>
          {tempOut(wx.hi, unit)}°/{tempOut(wx.lo, unit)}°
          {wx.rainPct != null && wx.rainPct >= 30 ? `  ·  🌧 ${wx.rainPct}%` : ''}
        </Text>
        {tips.map((tip) => (
          <Text key={tip} size={13} weight={700} color="warn">
            {tip}
          </Text>
        ))}
        {wx.typical && wx.forecastFrom ? <Meta>{t('wx.noteWhen', { date: datesLabel(wx.forecastFrom, wx.forecastFrom, locale) })}</Meta> : null}
      </View>
    </View>
  );
}
