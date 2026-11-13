import { View } from 'react-native';

import { useSettings, useUpdateSettings } from '@/api/profile';
import { Segmented } from '@/components/ui/Chip';
import { BackButton, Header, Screen, SectionTitle } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useT, type Lang } from '@/i18n';
import { goBack } from '@/lib/nav';

/** App settings: units and how things are displayed. The account (ID, sign-in, sign out) lives on the profile page. */
export default function Settings() {
  const { t, setLang } = useT();
  const settings = useSettings();
  const update = useUpdateSettings();
  const s = settings.data;

  const row = (label: string, control: React.ReactNode) => (
    <View style={{ marginTop: 16 }}>
      <Text weight={800} size={13} style={{ marginBottom: 8 }}>
        {label}
      </Text>
      {control}
    </View>
  );

  return (
    <Screen nav top={<Header title={t('set.title')} left={<BackButton label={t('nav.back')} onPress={goBack} />} />}>
      <SectionTitle>{t('set.display')}</SectionTitle>

      {row(
        t('profile.lang'),
        <Segmented<Lang>
          value={(s?.lang as Lang | undefined) ?? 'zh'}
          onChange={(l) => {
            setLang(l);
            update.mutate({ lang: l });
          }}
          options={[
            { value: 'zh', label: '中文' },
            { value: 'en', label: 'English' },
          ]}
        />,
      )}

      {row(
        t('settings.temp'),
        <Segmented<'F' | 'C'>
          value={s?.temp_unit === 'C' ? 'C' : 'F'}
          onChange={(u) => update.mutate({ temp_unit: u })}
          options={[
            { value: 'F', label: '°F' },
            { value: 'C', label: '°C' },
          ]}
        />,
      )}

      {row(
        t('settings.unit'),
        <Segmented<'lb' | 'kg'>
          value={s?.weight_unit === 'kg' ? 'kg' : 'lb'}
          onChange={(u) => update.mutate({ weight_unit: u })}
          options={[
            { value: 'lb', label: 'lb' },
            { value: 'kg', label: 'kg' },
          ]}
        />,
      )}

      {row(
        t('settings.clock'),
        <Segmented<'12' | '24'>
          value={s?.time_format === '24' ? '24' : '12'}
          onChange={(f) => update.mutate({ time_format: f })}
          options={[
            { value: '12', label: t('clock.12') },
            { value: '24', label: t('clock.24') },
          ]}
        />,
      )}

      {row(
        t('settings.theme'),
        <Segmented<'system' | 'light' | 'dark'>
          value={(s?.theme as 'system' | 'light' | 'dark' | undefined) ?? 'system'}
          onChange={(v) => update.mutate({ theme: v })}
          options={[
            { value: 'system', label: t('theme.auto') },
            { value: 'light', label: t('theme.light') },
            { value: 'dark', label: t('theme.dark') },
          ]}
        />,
      )}
    </Screen>
  );
}
