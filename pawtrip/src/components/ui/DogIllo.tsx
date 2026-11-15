import { Icon } from './Icon';

/** Shared welcome illustration from the site's paw sticker family. */
export function DogIllo({ size = 120, tilt = -3 }: { size?: number; tilt?: number }) {
  return <Icon name="nav-dogs" size={size} style={{ transform: [{ rotate: `${tilt}deg` }] }} />;
}
