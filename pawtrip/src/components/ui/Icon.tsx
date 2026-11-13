import { Image, type ImageStyle, type StyleProp } from 'react-native';

/** The custom sticker icon set (assets/icons). Names match the file names. */
const SOURCES = {
  'logo-paw': require('../../../assets/icons/logo-paw.png'),
  'nav-trips': require('../../../assets/icons/nav-trips.png'),
  'nav-dogs': require('../../../assets/icons/nav-dogs.png'),
  'nav-settings': require('../../../assets/icons/nav-settings.png'),
  'nav-profile': require('../../../assets/icons/nav-profile.png'),
  'tab-plan': require('../../../assets/icons/tab-plan.png'),
  'tab-ideas': require('../../../assets/icons/tab-ideas.png'),
  'tab-members': require('../../../assets/icons/tab-members.png'),
  'cat-outdoors': require('../../../assets/icons/cat-outdoors.png'),
  'cat-coffee': require('../../../assets/icons/cat-coffee.png'),
  'cat-shopping': require('../../../assets/icons/cat-shopping.png'),
  'cat-drinks': require('../../../assets/icons/cat-drinks.png'),
  'cat-fun': require('../../../assets/icons/cat-fun.png'),
  'cat-stay': require('../../../assets/icons/cat-stay.png'),
  'cat-transit': require('../../../assets/icons/cat-transit.png'),
} as const;

export type IconName = keyof typeof SOURCES;

export function Icon({ name, size = 32, style }: { name: IconName; size?: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={SOURCES[name]} accessibilityElementsHidden style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}
