import type { CropRect, PickedPhoto } from '@/lib/photos';

export type PhotoCropperProps = {
  /** the picture to frame; null = closed */
  photo: PickedPhoto | null;
  onCancel: () => void;
  onDone: (rect: CropRect) => void;
};
