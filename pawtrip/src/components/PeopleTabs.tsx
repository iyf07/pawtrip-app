import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { BottomTabBar } from '@/components/BottomTabBar';
import { Segmented } from '@/components/ui/Chip';
import { useLayout } from '@/hooks/use-layout';
import { useT } from '@/i18n';

/**
 * Friends and family are two pages (/friends and /family) under one navigation button. On a phone they switch with the
 * bottom tab bar, on a wide screen with a segmented control above the content.
 */
export function usePeopleTabs(current: 'friends' | 'family'): { bottom: ReactNode; top: ReactNode } {
  const { t } = useT();
  const { wide } = useLayout();
  const go = (v: 'friends' | 'family') => router.replace(v === 'family' ? '/family' : '/friends');
  if (wide) {
    return { bottom: undefined, top: <Segmented group="people" value={current} onChange={go} options={[{ value: 'friends', label: t('family.friends') }, { value: 'family', label: t('family.tab') }]} /> };
  }
  return {
    bottom: <BottomTabBar group="people" value={current} onChange={go} tabs={[{ value: 'friends', label: t('family.friends'), icon: 'tab-members' }, { value: 'family', label: t('family.tab'), icon: 'nav-family' }]} />,
    top: undefined,
  };
}
