import { useLocalSearchParams } from 'expo-router';

import { useDog } from '@/api/dogs';
import { DogForm } from '@/features/dog/DogForm';
import { DogWizard } from '@/features/dog/DogWizard';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';
import { useLayout } from '@/hooks/use-layout';
import { goBack } from '@/lib/nav';

export default function DogEditorRoute() {
  const { t } = useT();
  const { wide } = useLayout();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dog = useDog(id);
  // A new dog is created through the one-question-at-a-time wizard; an existing dog is edited in a popup
  // (this page only serves direct links).
  if (id === 'new') return <DogWizard />;
  // Mount the form only once the dog is loaded, so its fields start from the saved values.
  if (!dog.data) return <Screen nav size="narrow"><PageSkeleton cards={4} /></Screen>;
  return (
    <DogForm key={dog.data.id} dog={dog.data} onClose={goBack}>
      {({ body, footer }) => (
        <Screen nav size={wide ? "wide" : "narrow"} bottom={footer} top={<Header title={t('dog.home', { name: dog.data.name })} left={<BackButton label={t('nav.back')} onPress={goBack} />} />}>
          {body}
        </Screen>
      )}
    </DogForm>
  );
}
