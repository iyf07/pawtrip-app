import { Icon } from '@/components/ui/Icon';
import type { WxIcon } from '@/lib/weather';

/** The sticker icon of a weather condition. */
export function WeatherIcon({ icon, size = 20 }: { icon: WxIcon; size?: number }) {
  return <Icon name={`wx-${icon}` as 'wx-sun'} size={size} />;
}
