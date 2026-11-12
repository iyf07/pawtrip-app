import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useMyFeedback } from '@/api/feedback';
import { useSettings, useUpdateSettings } from '@/api/profile';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Chip';
import { Header, Screen, SectionTitle } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key, type Lang } from '@/i18n';

/** App settings: display preferences and the account (its ID and sign-in methods). */
export default function Settings() {
  const { t, setLang } = useT();
  const toast = useToast();
  const { userId, email, signOut } = useAuth();
  const settings = useSettings();
  const update = useUpdateSettings();
  const s = settings.data;
  const th = useTheme();
  const feedback = useMyFeedback();

  const row = (label: string, control: React.ReactNode) => (
    <View style={{ marginTop: 16 }}>
      <Text weight={800} size={13} style={{ marginBottom: 8 }}>
        {label}
      </Text>
      {control}
    </View>
  );

  return (
    <Screen top={<Header title={t('set.title')} left={<Button label={t('nav.back')} variant="text" onPress={() => router.back()} />} />}>
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

      <SectionTitle>{t('set.account')}</SectionTitle>
      <Card>
        <Meta>{t('set.accountId')}</Meta>
        <Text selectable weight={700} size={14} style={{ marginTop: 4 }}>
          {userId}
        </Text>
        <Meta style={{ marginTop: 6 }}>{t('set.accountIdHint')}</Meta>
        <View style={{ marginTop: 8 }}>
          <Button
            label={t('set.copyId')}
            small
            variant="ghost"
            onPress={async () => {
              await Clipboard.setStringAsync(userId ?? '');
              toast(t('group.copied'));
            }}
          />
        </View>
      </Card>

      <Text weight={800} size={13} style={{ marginTop: 20, marginBottom: 8 }}>
        {t('set.methods')}
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text size={20}>✉️</Text>
          <View style={{ flex: 1 }}>
            <Text weight={800}>{t('set.methodEmail')}</Text>
            <Meta numberOfLines={1}>{email}</Meta>
          </View>
        </View>
      </Card>
      <Meta style={{ marginTop: 8 }}>{t('set.methodsMore')}</Meta>

      <SectionTitle>{t('fdbk.mine')}</SectionTitle>
      {(feedback.data ?? []).length === 0 ? (
        <Meta>{t('fdbk.empty')}</Meta>
      ) : (
        <View style={{ gap: 10 }}>
          {(feedback.data ?? []).map((f) => {
            const tone = f.status === 'fixed' ? { bg: th.okBg, fg: th.ok } : f.status === 'wontfix' ? { bg: th.line, fg: th.muted } : f.status === 'triaged' ? { bg: th.blueBg, fg: th.text } : { bg: th.goldBg, fg: th.link };
            return (
              <Card key={f.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Text size={16}>{f.kind === 'bug' ? '🐞' : f.kind === 'idea' ? '💡' : '💬'}</Text>
                  <View style={{ backgroundColor: tone.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                    <Text weight={800} size={11} style={{ color: tone.fg }}>
                      {t(`fdbk.st.${f.status}` as Key)}
                    </Text>
                  </View>
                </View>
                <Text numberOfLines={3} style={{ marginTop: 6 }}>
                  {f.message}
                </Text>
                {f.resolution ? (
                  <Meta style={{ marginTop: 6 }} weight={700}>
                    ↳ {f.resolution}
                  </Meta>
                ) : null}
              </Card>
            );
          })}
        </View>
      )}

      <Button label={t('profile.signout')} variant="danger" block onPress={() => signOut()} style={{ marginTop: 24 }} />
    </Screen>
  );
}
