/** Stored weights are always pounds, even when the dog's preferred display unit is kg. */
export function dogWeightLabel(dog: { weight_lb: number | null; weight_unit: string }): string | null {
  if (dog.weight_lb == null) return null;
  const unit = dog.weight_unit === 'kg' ? 'kg' : 'lb';
  const weight = unit === 'kg' ? dog.weight_lb / 2.20462 : dog.weight_lb;
  return `${Math.round(weight * 10) / 10} ${unit}`;
}
