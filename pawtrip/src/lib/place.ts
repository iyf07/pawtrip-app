/**
 * "Luray, Virginia, United States" / "Luray, VA 22835, USA" -> "Luray, Virginia" / "Luray, VA":
 * only the city and state, without ZIP code or country.
 */
export function cityState(place: string | null | undefined): string {
  if (!place) return '';
  return place
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !/^(united states( of america)?|usa|u\.s\.a?\.?|us)$/i.test(p))
    .map((p) => p.replace(/\s*\b\d{5}(-\d{4})?\b/, '').trim()) // "VA 22835" -> "VA", "22835" -> ""
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}
