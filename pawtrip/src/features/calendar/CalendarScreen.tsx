import { Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';

import { MonthCalendar } from './MonthCalendar';

/** The calendar page: the month of today, every trip as a bar. */
export function CalendarScreen() {
  const { t } = useT();
  return (
    <Screen nav scroll={false} size="full" top={<Header title={t('cal.title')} />} contentStyle={{ paddingHorizontal: 0 }}>
      <MonthCalendar />
    </Screen>
  );
}
