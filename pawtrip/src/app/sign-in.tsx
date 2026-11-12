import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { DogIllo } from '@/components/ui/DogIllo';
import { Segmented } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useT, type Lang } from '@/i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN = 60;

export default function SignIn() {
  const { t, lang, setLang } = useT();
  const { sendCode, verifyCode } = useAuth();
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  async function send() {
    if (!EMAIL_RE.test(email.trim())) return setError(t('auth.errEmail'));
    setBusy(true);
    setError(null);
    try {
      await sendCode(email);
      setStage('code');
      setWait(COOLDOWN);
    } catch (e) {
      const msg = e instanceof Error ? e.message.toLowerCase() : '';
      setError(msg.includes('rate') || msg.includes('seconds') ? t('auth.errRate') : t('auth.errSend'));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (code.trim().length < 6) return setError(t('auth.errCode'));
    setBusy(true);
    setError(null);
    try {
      await verifyCode(email, code);
      // the auth gate swaps routes once the session arrives
    } catch {
      setError(t('auth.errCode'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen contentStyle={{ paddingTop: 16, flexGrow: 1 }}>
      <View style={{ alignItems: 'flex-end' }}>
        <Segmented<Lang>
          value={lang}
          onChange={setLang}
          options={[
            { value: 'zh', label: '中文' },
            { value: 'en', label: 'English' },
          ]}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text weight={800} size={38}>
          PawTrip
        </Text>
        <Text color="muted" style={{ marginTop: 6, textAlign: 'center' }}>
          {t('signin.tagline')}
        </Text>
        <View style={{ marginTop: 28 }}>
          <DogIllo size={150} />
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        {stage === 'email' ? (
          <>
            <Field
              label={t('auth.emailLabel')}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="go"
              onSubmitEditing={send}
              error={error}
            />
            <Button label={t('auth.sendCode')} block loading={busy} onPress={send} style={{ marginTop: 16 }} />
          </>
        ) : (
          <>
            <Text weight={800} size={20}>
              {t('auth.sentTitle')}
            </Text>
            <Text color="muted" style={{ marginTop: 6 }}>
              {t('auth.sentBody', { email: email.trim() })}
            </Text>
            <Field
              label={t('auth.codeLabel')}
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 8))}
              placeholder="123456"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              returnKeyType="go"
              onSubmitEditing={verify}
              error={error}
              style={{ letterSpacing: 4, fontSize: 20 }}
            />
            <Button label={t('auth.verify')} block loading={busy} onPress={verify} style={{ marginTop: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Button label={t('auth.changeEmail')} variant="text" onPress={() => { setStage('email'); setCode(''); setError(null); }} />
              <Button label={wait > 0 ? t('auth.resendIn', { n: wait }) : t('auth.resend')} variant="text" disabled={wait > 0} onPress={send} />
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
