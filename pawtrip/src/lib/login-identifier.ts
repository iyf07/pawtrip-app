/** Normalize an email address or a public PawTrip ID without exposing any ID/email mapping. */
export function parseLoginIdentifier(input: string): { kind: 'email' | 'handle'; value: string } | null {
  const value = input.trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { kind: 'email', value };
  const handle = value.replace(/^@/, '');
  return /^[a-z0-9_]{3,20}$/.test(handle) ? { kind: 'handle', value: handle } : null;
}
